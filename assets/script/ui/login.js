var configMgr = require('configMgr');
var soundMngr = require('SoundMngr');
var RuleHandler = require('ruleHandler');
var RoomHandler = require('roomHandler');
var matchHandler = require('matchHandler');
var loginHandler = require('loginHandler');
var updateHandler = require('updateHandler');

var mahjongProtocol = require('TuiDaoHu-Protocol');
var tdk_roomData = require('tdkRoomData');
var ZJH_roomData = require('ZJH-RoomData');
var niuNiuHandler = require('niuNiuHandler');
var hundredNiuHandler = require('hundredNiuHandler');
var competitionHandler = require('competitionHandler');
cc.Class({
  extends: cc.Component,
  properties: {
    manifestUrl: cc.RawAsset,
    versionfile: cc.RawAsset,
    toggle_agree: cc.Toggle,
    label_version: cc.Label,
    login_panel: cc.Node,
    update_panel: cc.Node,
    update_progress: cc.ProgressBar,
    uidInputBox: cc.EditBox,
    updateText: cc.Label,
    gengxinStr: cc.Label,
    huaNode: cc.Node,
    loginImage: cc.Node,
    wenAn: cc.Node
  },

  // use this for initialization
  onLoad: function () {
    configMgr.init(); //配置文件初始化
    require('util').registEvent('updateStart', this, this.showUpdatePanel);
    require('util').registEvent('updateProgress', this, this.showUpdateProgress);
    require('util').registEvent('updateFinish', this, this.showLoginPanel);
    require('util').registEvent('updateError', this, this.showUpdateError);

    this.uidInputBox.node.active = cc.sys.isNative ? false : true;
    if (cc.sys.os == cc.sys.OS_WINDOWS) {
      this.uidInputBox.node.active = true;
    }
    this.login_panel.active = false;

    tdk_roomData.unregistAllMessage();
    RoomHandler.registMessage();
    matchHandler.registMessage();
    tdk_roomData.registMessage();
    ZJH_roomData.registMessage();
    competitionHandler.registMessage();
    niuNiuHandler.registMessage();
    hundredNiuHandler.registMessage();
    GameData.init();
    GameData13.init();
    GameDataPDK.init();
    GameDataTJDDZ.init();
    profileNiuNiu.init();  // 牛牛初始化
    mahjongProtocol.registMessage();
    
    updateHandler.checkUpdate(this.manifestUrl);
    competitionHandler.getActivityList();

    this.label_version.string = '版本号:' + updateHandler.getVersion();
    this.flag_init_x = this.huaNode.x;
    this.setLoginWenAn();
    this.setLoginImage();
  },

  onEnable: function () {
    soundMngr.instance.stopAll();
    soundMngr.instance.playMusic('sound/wait');
  },

  onDestroy: function () {
    unrequire('util').registEvent('updateStart', this, this.showUpdatePanel);
    unrequire('util').registEvent('updateProgress', this, this.showUpdateProgress);
    unrequire('util').registEvent('updateFinish', this, this.showLoginPanel);
    unrequire('util').registEvent('updateError', this, this.showUpdateError);
  },

  showLoginPanel: function () {
    this.login_panel.active = true;
    this.update_panel.active = false;
    loginHandler.loginByLocalData(); //静默登录
  },

  showUpdatePanel: function () {
    this.login_panel.active = false;
    this.update_panel.active = true;
    this.showUpdateProgress({detail:0});
  },

  showUpdateProgress: function (data) {
    if (data == null) return;
    //if (data.detail) {
      this.gengxinStr.node.active = true;
      this.update_progress.node.active = true;
      this.huaNode.active = true;
      var nowPrg = data.detail * 100;
      nowPrg = parseInt(nowPrg);
      if (nowPrg > 100) return;
      this.updateText.string = '正在更新资源';
      this.gengxinStr.string = nowPrg + '%';
      this.update_progress.progress = data.detail;
      this.huaNode.x = this.flag_init_x + this.update_progress.totalLength * this.update_progress.progress;
    /*} else {
      this.gengxinStr.node.active = false;
      // this.update_progress.node.active = false;
      this.huaNode.active = false;
    }*/
  },

  showUpdateError: function (data) {
    var self = this;
    createMessageBox(data.detail, function () {
      updateHandler.retry();
    });
  },

  loginBtnCliecked: function (evt) {
    soundMngr.instance.playAudioOther('button');
    var inputUid = this.uidInputBox.string;
    loginHandler.loginBtn(inputUid);
  },

  setLoginImage: function(){
    var textureUrl = configMgr.getLogo();
    var texture = cc.textureCache.addImage(cc.url.raw(textureUrl));
    if(texture && this.loginImage){
      this.loginImage.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
    }
  },
  setLoginWenAn: function(){   
    var label1 = cc.find('label1',this.wenAn);
    var label2 = cc.find('label2',this.wenAn);
    label1.getComponent(cc.Label).string = configMgr.getNotice();
    label2.getComponent(cc.Label).string = configMgr.getVersionText();
  },
  showAgreePanel: function () {
    soundMngr.instance.playAudioOther('button');
    openView('AgreePanel');
  }
});