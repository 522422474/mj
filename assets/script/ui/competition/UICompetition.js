var gameDefine = require('gameDefine');
var configMgr = require('configMgr');
var competitionHandler = require('competitionHandler');
cc.Class({
    extends: cc.Component,

    properties: {
        posterNode:     cc.Node,
        posterPrefab:   cc.Prefab,
        scrollView:     cc.ScrollView,
        scrollViewItem: cc.Node,
        content:        cc.Node
    },

    // use this for initialization
    onLoad: function () {
        //海报
        this.initPosterNode();
        //比赛游戏类型
        this.initGameTypeNode();
        this.refreshTimeCD = 0;
    },

    onEnable: function(){
        this.scrollView.scrollToTopLeft(0.1);
    },
    update: function (dt) {
        this.refreshTimeCD += dt;
        if (this.refreshTimeCD >= 10) {
            this.refreshTimeCD = 0;
            //competitionHandler.getActivityList();
        }
    },

    initPosterNode: function () {
        var poster = this.posterNode.getChildByName('posterPrefab');
        if (poster == null) {
            poster = cc.instantiate(this.posterPrefab);
            poster.getComponent('PosterPrefab').initUI();
            poster.name = 'posterPrefab';
            poster.parent = this.posterNode;
            poster.scale = 0.7;
        }
    },

    initGameTypeNode: function () {
        var gameList = this.getOpenGameList();
        for (var i = 0; i<gameList.length; i++) {
              var item = cc.find('item'+i,this.content);
              if (item == null) {
                  item = cc.instantiate(this.scrollViewItem);
                  item.parent = this.content;
                  item.x = this.scrollViewItem.x  + (this.scrollViewItem.width-20) * i;
              }
              item.getComponent('selectGameItem').initUI(gameList[i],i+1);
              var gameDetailBtn = cc.find('gameDetailBtn',item);
              gameDetailBtn.tag = i;
              gameDetailBtn.on(cc.Node.EventType.TOUCH_END, this.gameDetailClick, this);
        }
        this.content.width = (gameList.length + 0.2)  * this.scrollViewItem.width ;
    },

    getOpenGameList: function(){
        var gameList = configMgr.getFightGameType();
        if(gameList == undefined){
            return [];
        }
        cc.log('..gameList:'+JSON.stringify(gameList));
        return gameList;
    },
    gameDetailClick: function (eve) {
        var gameType = eve.target.tag +1;
        cc.log('点击-->'+gameType);
        openView('CompetitionDetail',null,function (detail) {
                detail.getComponent('CompetitionDetail').initUI(gameType);
        });
    },
    //显示我的战绩界面
    showRecordLayer: function () {
        openView('CompetitionRecord');
    }


});
