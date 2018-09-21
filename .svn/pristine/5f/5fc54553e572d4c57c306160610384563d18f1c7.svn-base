var gameDefine = require('gameDefine');
var errorCode = require('errorCode');
var missionConfig = require('mission');

var missionHandler = {
    missionTable: missionConfig.missionTable
};

module.exports = missionHandler;

missionHandler.onShareSucess = function() {
  for (var key in GameData.player.mission) {
    if (this.missionTable[key] && this.missionTable[key].event == 'share' && GameData.player.mission[key].count < this.missionTable[key].count){
      GameNet.getInstance().request("game.playerHandler.onCompleteShareMission", {id:key}, function (rtn) {
        if(rtn.result == errorCode.Success){}
      });
    }
  }
};

missionHandler.getReward = function(missionId) {
  if (!this.missionTable[missionId]) return;
  if (!GameData.player.mission) return;
  if (!GameData.player.mission[missionId]) return;
  if (GameData.player.mission[missionId].isGet) return;
  GameNet.getInstance().request("game.playerHandler.getMissionReward", {missionId:missionId}, function (rtn) {
      if (rtn.result == errorCode.Success) {
        sendEvent('taskGetReward', missionId);
      }
  });
};

missionHandler.checkAllComplete = function(data){
  if(data == undefined){
    return false;
  }
  for(var key in data){
      var data = data[key];
      if(data == undefined){
          continue;
      }
      if(data.isGet != 0){
          continue;
      }
      return false;
  }
  return true;
};