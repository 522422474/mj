var ChatHandler=function(){var t=null;return{getInstance:function(){return null==t&&(t={requestChat:function(t,n,e){GameNet.getInstance().request("room.chatHandler.chatInRoom",{type:t,data:n},function(t){cc.log("room.chatHandler.chatInRoom response:%d",t.result),e(t)})},dynChat:function(t,n,e,o){GameNet.getInstance().request("room.chatHandler.dynChatInRoom",{fromUid:t,toUid:n,chatId:e},function(t){o(t)})},sendRecord:function(t){WriteLog("ChatHandler --\x3e sendRecord, url : "+t),GameNet.getInstance().request("room.chatHandler.chatInRoom",{type:"yuyin",data:t},function(t){WriteLog("room.chatHandler.chatInRoom response:%d",t.result)})}}),t}}}();