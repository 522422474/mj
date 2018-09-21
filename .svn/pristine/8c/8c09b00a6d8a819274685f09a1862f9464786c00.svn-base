var RoomHandler = (function() {
  var _instance = null;

  function constructor() {
    return {
      createRoom: function(createData) {
        console.log("createData "+JSON.stringify(createData));
        var self = this;
        openView('Loading');
        GameNet.getInstance().request("room.roomHandler_new.createRoom", createData, function(rtn) {
          if (rtn.result == ZJHCode.Success){
            //代理开房
            if (rtn.isAgentRoom) {
              var roomId = rtn.roomid;
              createMessageBox("代开房:"+roomId+"已经成功创建，请在代开房界面中进行查看",function(){});
              openView("agentPanel");
              self.reqAgentRoom(createData.playeruid,createData.clubId);
              self.reqAgentResultRoom(createData.playeruid,createData.clubId);
              closeView('Loading');
              return;
            }
            else{
              GameData.saveCreateRoomOpts();
              self.enterRoom(rtn.roomid);
            }
          }
          else{
            if (rtn.result == ZJHCode.LessCard) {
              createMessageBox('房卡不足', function(){});
            }else if (rtn.result == ZJHCode.LessClubMoney) {
              createMessageBox('俱乐部钻石不足', function(){});
            }else if(rtn.result == ZJHCode.NoJoinThisClub){
              createMessageBox("抱歉!您不在该俱乐部.",function(){});
            }
            else{
              createMessageBox('create room error', function(){});
            }
            closeView('Loading');
          }
        });
      },

      enterRoom: function(roomid) {
        var num = Number(roomid);
        if (num < 100000 || num > 999999) {
          createMessageBox('房间号无效 ' + num, function(){});
          closeView('Loading');
          return;
        }
        var joinData = {roomid: num, posInfo:getPosInfo()};
        openView('Loading');
        GameNet.getInstance().request("room.roomHandler_new.enterRoom", joinData, function(rtn) {
          if (rtn.result == ZJHCode.Success) {
            switch(rtn.gameType) {
              case GameType.Game_Mj_Tianjin:
              if(Object.keys(GameData.room).length != 0) {
                cc.director.loadScene('table');
              }
              else{
                setTimeout(function(){cc.director.loadScene('table')},100);
                //closeView('Loading');
              }
              break;
              case GameType.Game_Poker_DDZ:
              if(Object.keys(GameData.room).length != 0) {
                cc.director.loadScene('table-DDZ');
              }
              else{
                setTimeout(function(){cc.director.loadScene('table-DDZ')},100);
                //closeView('Loading');
              }
              break;
            }
          } else if (rtn.result == ZJHCode.roomNotFound) {
            closeView('Loading');
            createMessageBox('房间不存在', function(){});
          } else if (rtn.result == ZJHCode.roomFull) {
            closeView('Loading');
            createMessageBox('房间已满', function(){});
          } else if (rtn.result == ZJHCode.LessCard) {
            closeView('Loading');
            createMessageBox('房卡不足', function(){});
          }else if (rtn.result == ZJHCode.LessClubMoney) {
            closeView('Loading');
            createMessageBox('俱乐部钻石不足', function(){});
          }
          else if(rtn.result == ZJHCode.NoJoinThisClub){
              createMessageBox("抱歉!您不在该俱乐部.",function(){});
              closeView('Loading');
            }else{
            closeView('Loading');
            createMessageBox('create room error', function(){});
          }
        });
      },

      quitRoom: function(roomid) {
        GameNet.getInstance().request("room.roomHandler_new.quitRoom", {roomid: roomid}, function(rtn) {
          if (rtn.result == ZJHCode.Success) {
            GameData.player.roomid = undefined;
            cc.director.loadScene('home');
          }
        });
      },

      deleteRoom: function(roomid, action) {
        var data = {roomid: roomid, action: action};
        GameNet.getInstance().request("room.roomHandler_new.disbandRoom", data, function(rtn) {
        });
      },
      //请求代理房间信息
      reqAgentRoom: function(uid, clubId) {
        var data = {uid: uid, clubId: clubId};
        GameNet.getInstance().request("game.playerHandler.reqAgentRoom", data, function(rtn) {
          console.log('rtn  '+JSON.stringify(rtn));
          GameData.AgentRoomsData = rtn;
          sendEvent('refreshAgentRoomUI');
          //console.log('GameData.player.AgentRoomsData'+GameData.player.AgentRoomsData);
        });
      },
        //请求代理房间结算信息
      reqAgentResultRoom: function(uid, clubId) {
        var data = {uid: uid, clubId: clubId};
        GameNet.getInstance().request("game.playerHandler.AgentResultRoom", data, function(rtn) {
          console.log('rtn11  '+JSON.stringify(rtn));
          GameData.AgentResultRoom = rtn;
          //sendEvent('refreshAgentRoomUI');
          //console.log('GameData.player.AgentRoomsData'+GameData.player.AgentRoomsData);
        });
      },
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
