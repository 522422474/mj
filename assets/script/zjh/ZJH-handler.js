var ZJHHandler = (function() {
  var _instance = null;

  function constructor() {
    return {
      requestReady: function(callback) {
        GameNet.getInstance().request("room.roomHandler.ready", {}, function (rtn) {});
      },

      /*
      **牌局中指令
      */
      //加注
      requestPlayerAddChips: function(chipNum){
        GameNet.getInstance().request("room.zhaJinHuaHandler.playerAddChips", {chips:chipNum}, function(rtn) {
        });
      },

      //跟注
      requestPlayerFollowChips: function(){
        GameNet.getInstance().request("room.zhaJinHuaHandler.playerFollowChips",{},function(rtn) {
        });
      },

      //弃牌
      requestPlayerGiveUp: function(){
        GameNet.getInstance().request("room.zhaJinHuaHandler.playerGiveUp",{},function(rtn) {
        });
      },

      //看牌
      requestPlayerCheck: function(){
        GameNet.getInstance().request("room.zhaJinHuaHandler.playerCheck",{}, function(rtn) {
        });
      },

      //比牌
      requestPlayerCompare: function(uid){
        GameNet.getInstance().request("room.zhaJinHuaHandler.playerCompare",{otherUid:uid},function(rtn) {
        });
      },
      //自动跟注
      requestAutoFollow: function (isFollow) {
        GameNet.getInstance().request("room.zhaJinHuaHandler.autoFollow",{isFollow:isFollow},function(rtn) {
        });
      },
      //亮牌
      requestPlayerMingPai: function () {
        GameNet.getInstance().request("room.zhaJinHuaHandler.playerMingPai",{},function(rtn) {
        });
      } 
    };
  }
  return {
    getInstance: function() {
      if(_instance == null) {
        _instance = constructor();
      }
      return _instance;
    }
  }
})();
