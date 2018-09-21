var MjHandler = (function() {
  var _instance = null;

  function constructor() {
    return {
      requestReady: function(callback) {
        GameNet.getInstance().request("room.tjmjHandler.ready", {}, function(rtn) {});
      },

      requestZhuang: function(num, callback) {
        GameNet.getInstance().request("room.tjmjHandler.zhuang", {num: num}, function(rtn) {});
      },

      requestDisCard: function(card, callback) {
        var self = this;
        GameNet.getInstance().request("room.tjmjHandler.discard", {card: card}, function(rtn) {
          cc.log('room.tjmjHandler.discard response:%d', rtn.result);
          callback(rtn);
        });
      },

      requestPass: function(callback) {
        var self = this;
        GameNet.getInstance().request("room.tjmjHandler.pass", {}, function(rtn) {
          cc.log('room.tjmjHandler.pass response:%d', rtn.result);
          //if (rtn.result == ZJHCode.Fail) createMoveMessage('请等待其他玩家选择');
          callback(rtn);
        });
      },

      requestChiCard: function(card, myCards, callback) {
        var self = this;
        GameNet.getInstance().request("room.tjmjHandler.chi", {card: card, myCards: myCards}, function(rtn) {
          cc.log('room.tjmjHandler.chi response:%d', rtn.result);
          if (rtn.result == ZJHCode.waitOthers) createMoveMessage('请等待其他玩家选择');
          callback(rtn);
        });
      },

      requestPengCard: function(card, callback) {
        var self = this;
        GameNet.getInstance().request("room.tjmjHandler.peng", {card: card}, function(rtn) {
          cc.log('room.tjmjHandler.peng response:%d', rtn.result);
          if (rtn.result == ZJHCode.waitOthers) createMoveMessage('请等待其他玩家选择');
          callback(rtn);
        });
      },

      requestGangAnCard: function(myCard, callback) {
        var self = this;
        GameNet.getInstance().request("room.tjmjHandler.gangAn", {card: myCard}, function(rtn) {
          cc.log('room.tjmjHandler.gangAn response:%d', rtn.result);
          callback(rtn);
        });
      },

      requestGangMingCard: function(card, callback) {
        var self = this;
        GameNet.getInstance().request("room.tjmjHandler.gangMing", {card: card}, function(rtn) {
          cc.log('room.tjmjHandler.gangMing response:%d', rtn.result);
          if (rtn.result == ZJHCode.waitOthers) createMoveMessage('请等待其他玩家选择');
          callback(rtn);
        });
      },

      requestGangMingSelfCard: function(card, callback) {
        var self = this;
        GameNet.getInstance().request("room.tjmjHandler.gangMingSelf", {card: card}, function(rtn) {
          cc.log('room.tjmjHandler.gangMing response:%d', rtn.result);
          callback(rtn);
        });
      },

      requestHu: function(types, deck, obtain, callback) {
        var self = this;
        GameNet.getInstance().request("room.tjmjHandler.hu", {type: types, deck: deck, obtain: obtain}, function(rtn) {
          cc.log('room.tjmjHandler.hu response:%d', rtn.result);
          callback(rtn);
        });
      },

      requestDianPao: function(types, deck, obtain, callback) {
        var self = this;
        GameNet.getInstance().request("room.tjmjHandler.dianPao", {type: types, deck: deck, obtain: obtain}, function(rtn) {
          cc.log('room.tjmjHandler.dianPao response:%d', rtn.result);
          callback(rtn);
        });
      },

      // requestYoujin: function(deck, zimo, callback) {
      //   var self = this;
      //   GameNet.getInstance().request("room.tjmjHandler.youJin", {deck: deck, zimo: zimo}, function(rtn) {
      //     cc.log('room.tjmjHandler.youJin response:%d', rtn.result);
      //     callback(rtn);
      //   });
      // },

      // requestCancelYoujin: function(callback) {
      //   var self = this;
      //   GameNet.getInstance().request("room.tjmjHandler.cancelYouJin", {}, function(rtn) {
      //     cc.log('room.tjmjHandler.cancelYouJin response:%d', rtn.result);
      //     callback(rtn);
      //   });
      // },
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
