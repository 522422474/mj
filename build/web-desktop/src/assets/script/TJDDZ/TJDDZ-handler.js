var TJDDZHandler=function(){var e=null;return{getInstance:function(){return null==e&&(e={quitRoom:function(e){RoomHandler.quitRoom(e)},deleteRoom:function(e,r){RoomHandler.deleteRoom(e,r)},requestReady:function(e){GameNet.getInstance().request("room.roomHandler.ready",{},function(e){})},requestSelectScore:function(e,r){GameNet.getInstance().request("room.pokerTJDdzHandler.jiaofen",{num:e},function(e){r(e)})},requestTiChuai:function(e,r){GameNet.getInstance().request("room.pokerTJDdzHandler.tichuai",{num:e},function(e){r(e)})},requestOnPassCard:function(r){GameNet.getInstance().request("room.pokerTJDdzHandler.pass",{},function(e){r(e)})},requestOnHintCard:function(n){GameNet.getInstance().request("room.pokerTJDdzHandler.hint",{},function(e){var r=require("errorCode");e.result!=r.NotHavePokerDis?n(e):createMoveMessage("没有大过上家的牌")})},requestOnDisCard:function(e,n){GameNet.getInstance().request("room.pokerTJDdzHandler.discard",{cards:e},function(e){var r=require("errorCode");e.result==r.NotPokerDis?createMoveMessage("大不过上家的牌"):e.result==r.HandPatternsError&&createMoveMessage("出牌牌形错误"),n(e)})}}),e}}}();