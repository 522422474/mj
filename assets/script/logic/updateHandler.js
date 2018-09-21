var md5Encode = require('md5');

var exp = module.exports;

var _instance = null;
var _isNeedUpdate = true;
var _isUpdateError = false;
var _assetsManager = null;
var _updateListener = null;

exp.checkUpdate = function (manifestUrl) {
  if (!cc.sys.isNative) {
    sendEvent('updateFinish');
    return false;
  }
  if (!_isNeedUpdate) {
    WriteLog('updateHandler noNeedUpdate');
    sendEvent('updateFinish');
    return false;
  }
  _init(manifestUrl);
  return _check();
}

exp.retry = function () {
  WriteLog('updateHandler Retry failed Assets...');
  if (_isUpdateError) {
    _isUpdateError = false;
    _assetsManager.downloadFailedAssets();
  } else {
    _check();
  }
}

exp.getVersion = function () {
  if (_assetsManager && _assetsManager.getLocalManifest().isLoaded()) {
    var project = _assetsManager.getLocalManifest();
    WriteLog('updateHandler version: ' + project.getVersion());
    return project.getVersion();
  }
  return '0.0.1';
}

function _init(manifestUrl) {
  WriteLog('updateHandler init ...');
  if (!_assetsManager) {
    var storagePath = jsb.fileUtils.getWritablePath() + "com.mahjong.tianjin/";
    _assetsManager = new jsb.AssetsManager(manifestUrl, storagePath);
    _assetsManager.setVersionCompareHandle(_compareCb);
    _assetsManager.setVerifyCallback(_verifyCb);

    var manifest = _assetsManager.getLocalManifest();
    WriteLog('updateHandler manifestUrl:' + JSON.stringify(manifest.getManifestFileUrl()));

    if (cc.sys.os === cc.sys.OS_ANDROID) {
      // Some Android device may slow down the download process when concurrent tasks is too much.
      // The value may not be accurate, please do more test and find what's most suitable for your game.
      _assetsManager.setMaxConcurrentTask(2);
      WriteLog("updateHandler Max concurrent tasks count have been limited to 2");
    }
  }
}

function _check() {
  WriteLog('updateHandler checkUpdate ...');
  if (!_assetsManager.getLocalManifest().isLoaded()) {
    WriteLog('updateHandler Failed to load local manifest ...');
    sendEvent('updateError', '加载更新列表失败');
    return false;
  }

  if (_updateListener == null) {
    _updateListener = new jsb.EventListenerAssetsManager(_assetsManager, _updateCb.bind(this));
    cc.eventManager.addListener(_updateListener, 1);
  }
  _assetsManager.checkUpdate();
  return true;
}

function _updateCb(event) {
  var needRestart = false;
  //WriteLog('updateHandler update event: ' + event.getEventCode());
  switch (event.getEventCode()) {
    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
      sendEvent('updateError', '未找到本地文件列表');
      break;
    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
      sendEvent('updateError', '下载更新列表失败');
      break;
    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
      sendEvent('updateError', '解析更新列表失败');
      break;
    case jsb.EventAssetsManager.NEW_VERSION_FOUND:
      sendEvent('updateStart');
      _assetsManager.update();
      break;
    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
      _isNeedUpdate = false;
      sendEvent('updateFinish');
      break;
    case jsb.EventAssetsManager.UPDATE_PROGRESSION:
      var bytePer = event.getPercent();
      //var filePer = event.getPercentByFile() / 100;
      if (bytePer > 0) sendEvent('updateProgress', bytePer);
      break;
    case jsb.EventAssetsManager.ASSET_UPDATED:
      break;
    case jsb.EventAssetsManager.ERROR_UPDATING:
      WriteLog('updateHandler update error:'+event.getMessage()+' asset:'+event.getAssetId());
      break;
    case jsb.EventAssetsManager.UPDATE_FINISHED:
      needRestart = true;
      break;
    case jsb.EventAssetsManager.UPDATE_FAILED:
      sendEvent('updateError', '更新失败');
      _isUpdateError = true;
      break;
    case jsb.EventAssetsManager.ERROR_DECOMPRESS:
      sendEvent('updateError', '解压文件失败:' + event.getAssetId());
      _isUpdateError = true;
      break;
    default:
      return;
  }

  if (needRestart) {
    cc.eventManager.removeListener(_updateListener);
    _updateListener = null;
    // Prepend the manifest's search path
    var searchPaths = jsb.fileUtils.getSearchPaths();
    var newPaths = _assetsManager.getLocalManifest().getSearchPaths();
    console.log(JSON.stringify(newPaths));
    Array.prototype.unshift(searchPaths, newPaths);
    // This value will be retrieved and appended to the default search path during game startup,
    // please refer to samples/js-tests/main.js for detailed usage.
    // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
    cc.sys.localStorage.setItem('UpdateSearchPaths', JSON.stringify(searchPaths));

    jsb.fileUtils.setSearchPaths(searchPaths);
    cc.game.restart();
  }
}

function _compareCb(versionA, versionB) {
  WriteLog("updateHandler Version Compare: local version is " + versionA + ', remote version is ' + versionB);
  var vA = versionA.split('.');
  var vB = versionB.split('.');
  for (var i = 0; i < vA.length; ++i) {
    var a = parseInt(vA[i]);
    var b = parseInt(vB[i] || 0);
    if (a === b) continue;
    else return a - b;
  }

  if (vB.length > vA.length) return -1;
  else return 0;
}

function _verifyCb(path, asset) {
  var filename = _getFileName(path);
  if (filename == 'project.manifest' || filename == 'version.manifest') {
    return true;
  }

  // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
  if (asset.compressed) {
    return true;
  } else {
    var data = jsb.fileUtils.getDataFromFile(path);
    if (data == null) {
      WriteLog('updateHandler verify get file failed:'+data);
      return false;
    }
    var md5 = md5Encode(data).toLowerCase();
    if (md5 == asset.md5) {
      return true;
    } else {
      WriteLog('updateHandler verify failed:'+path);
      WriteLog('updateHandler md5:'+md5+' asset.md5:'+asset.md5);
      return false;
    }
  }
}

function _getFileName(path) {
  var pos1 = path.lastIndexOf('/');
  var pos2 = path.lastIndexOf('\\');
  var pos  = Math.max(pos1, pos2)
  if (pos < 0)
    return path;
  else
    return path.substring(pos+1);
}
