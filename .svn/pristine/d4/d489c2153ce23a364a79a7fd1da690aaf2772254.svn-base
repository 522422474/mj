var gameDefine = require('gameDefine');
var matchHandler = require('matchHandler');
var configMgr = require('configMgr');
var soundMngr = require('SoundMngr');

cc.Class({
    extends: cc.Component,

    properties: {
        pageView: cc.PageView,
        content: cc.Node,
        pageItem: cc.Node,
        btnItem: cc.Node,
        flag: cc.Node,
        flagItem: cc.Node,
        detail: cc.Node,
        leftBtnNode: cc.Node,
        rightBtnNode: cc.Node,

        ////scrollView
        scrollView: cc.ScrollView,
        scrollItem: cc.Node
    },

    onLoad: function () {
        //this.initUIDetail();
        //this.initPageContent();

        this.initScrollContent();
    },
    onEnable: function(){
        this.scrollView.scrollToTopLeft(0.1);
    },

    initUIDetail: function(){
        this.detail.getComponent(cc.Label).string = "参与匹配获取积分";
    },
    initPageContent: function () {
        //移除所有子页面
        this.pageView.removeAllPages();
        this.content.removeAllChildren();

        var gameList = this.getOpenGameList();
        this.content.width = gameList.length * this.pageItem.width;

        var pageNumber = parseInt(gameList.length / 4);
        gameList.length % 4 > 0 ? pageNumber++ : null;

        for (var index = 0; index < pageNumber; index++) {
            var webNode = cc.instantiate(this.pageItem);
            this.pageView.addPage(webNode);

            webNode.active = true;
            webNode.position = cc.p(this.pageItem.x + index * this.pageItem.width, this.pageItem.y);

            this.initPageItem(webNode,gameList,index);
        }
        this.initPageFlag();
    },
    initPageItem: function(parent,list,index){
        if(parent == undefined){
            return;
        }
        for(var kk = 0;kk < parent.getChildrenCount();kk++){
            var child = parent.getChildren()[kk];
            if(child){
                child.active = false;
            }
        }

        var ii = index *4;
        var max = index *4 +4;

        var sur = list.length - max;
        sur < 0 ? max += sur : null;

        var interval = 0;
        var init_x = 0;
        var check = max - ii;
        if ( check % 2 > 0) {  //奇数
            init_x = 0- (parseInt(check / 2) * this.btnItem.width + parseInt(check / 2) * interval + this.btnItem.width / 2);
        } else {                   //偶数
            init_x = 0- (parseInt(check / 2) * this.btnItem.width + (parseInt(check / 2) - 1) * interval + interval / 2);
        }
        //节点锚点为0.5，所以设置位置时往右加半个节点宽度
        init_x += this.btnItem.width / 2;

        var name;
        var nodeIdx = 0;
        for(; ii < max; ii++ ){
            var gameType = list[ii];
            if(gameType == undefined){
                continue;
            }
            name = 'item'+nodeIdx;
            var ItemNode = parent.getChildByName(name);
            if(ItemNode == undefined){
                ItemNode = cc.instantiate(this.btnItem);
                ItemNode.parent = parent;
                ItemNode.name = name;
            }
            ItemNode.active = true;

            ItemNode.x = init_x + nodeIdx * (this.btnItem.width + interval);
            ItemNode.y = this.btnItem.y;

            var label = cc.find('label',ItemNode);
            label.getComponent(cc.Label).string = getGameTypeNameString(gameType);

            var limit = cc.find('limit',ItemNode);
            limit.getComponent(cc.Label).string = "进入条件："+ this.getGameLimitByType(gameType);

            var sprite = ItemNode.getComponent(cc.Sprite);
            this.loadItemSprite(sprite, gameType);

            ItemNode.tag = gameType;
            ItemNode.on(cc.Node.EventType.TOUCH_END, this.onSelectGameClick, this);

            nodeIdx++;
        }
    },
    loadItemSprite: function(sprite, gameType){

        var url = undefined;
        switch (gameType){
            case 'addBtn': {
                url = 'resources/home/match/btn-home-add.png';
            }break;
            case gameDefine.GameType.Game_Mj_Tianjin:{
                url = 'resources/home/match/btn-home-tjmj.png';
            }break;
            case gameDefine.GameType.Game_Mj_Shishi:{
                url = 'resources/home/match/btn-home-ssmj.png';
            }break;
            case gameDefine.GameType.Game_MJ_HuaDian:{
                url = 'resources/home/match/btn-home-hdmj.png';
            }break;
            case gameDefine.GameType.Game_Mj_HZ:{
                url = 'resources/home/match/btn-home-hzmj.png';
            }break;
            case gameDefine.GameType.Game_Mj_CC:{
                url = 'resources/home/match/btn-home-ccmj.png';
            }break;
            case gameDefine.GameType.Game_Mj_Heb:{
                url = 'resources/home/match/btn-home-hebmj.png';
            } break;
            case gameDefine.GameType.Game_Poker_TianjinDDZ: {
                url = 'resources/home/match/doudizhu01.png';
            } break;
            case gameDefine.GameType.Game_Poker_DDZ: {
                url = 'resources/home/match/doudizhu01.png';
            } break;
            case gameDefine.GameType.Game_niu_niu: {
                url = 'resources/home/match/niuniu01.png';
            } break;
            case gameDefine.GameType.Game_Niu_Hundred: {
                url = 'resources/home/match/home_btn_2.png';
            } break;
            case gameDefine.GameType.Game_TDK: {
                url = 'resources/home/match/tiandaken01.png';
            } break;
            case gameDefine.GameType.Game_Poker_13shui: {
                url = 'resources/home/match/shisanshui01.png';
            } break;
            case gameDefine.GameType.Game_Poker_paodekuai: {
                url = 'resources/home/match/paodekuaianniu01.png';
            } break;
            case gameDefine.GameType.Game_Poker_ZJH: {
                url = 'resources/home/match/btn-home-szp.png';
            } break;
            case gameDefine.GameType.Game_Poker_HHDZ: {
                url = 'resources/home/match/btn-home-hhdz.png';
            } break;
        }
        if(url == undefined || sprite == undefined){
            return;
        }
        var texture = cc.textureCache.addImage(cc.url.raw(url));
        sprite.spriteFrame = new cc.SpriteFrame(texture);
    },
    initPageFlag: function () {
        //移除所有 flag 节点
        this.flag.removeAllChildren();

        var sum = this.pageView.getPages().length;
        var interval = 30;

        //计算出第一个 flag 的 x 轴位置
        var init_x = 0;
        if (sum % 2 > 0) {
            //奇数
            init_x = -(parseInt(sum / 2) * this.flagItem.width + parseInt(sum / 2) * interval + this.flagItem.width / 2);
        } else {
            //偶数
            init_x = -(parseInt(sum / 2) * this.flagItem.width + (parseInt(sum / 2) - 1) * interval + interval / 2);
        }
        for (var key = 0; key < sum; key++) {
            var flagItem;
            if (key == 0) {
                flagItem = this.flagItem;
            } else {
                flagItem = cc.instantiate(this.flagItem);
            }
            flagItem.name = "flag_" + key;
            this.flag.addChild(flagItem);

            flagItem.position = cc.p(init_x + key * (this.flagItem.width + interval), this.flagItem.y);
        }
        this.updatePageFlag();
    },
    updatePageFlag: function () {

        for (var key = 0; key < this.flag.getChildrenCount(); key++) {
            var node = this.flag.getChildren()[key];
            var click = node.getChildByName('click');
            click.active = false;
        }
        var index = this.pageView.getCurrentPageIndex();
        var name = "flag_" +index;
        var flagNode = this.flag.getChildByName(name);
        flagNode.getChildByName('click').active = true;
    },
    pageViewEvent: function () {
        this.updatePageFlag();
    },

    initScrollContent: function(){
        var content = this.scrollView.content;

        var gameList = this.getOpenGameList();
        var width = (gameList.length +1) * (this.scrollItem.width -25);
        width < 1280 ? width = 1280 : null;
        content.width = width;

        var index = 0,
            isShowAdd = false;

        for(var key = 0;key < gameList.length +1; key++)
        {
            var data;
            if(key == gameList.length){
                //第四个显示为加号按钮
                isShowAdd = true;
            } else {
                data = gameList[index];
                if(data == undefined){
                    continue;
                }
                isShowAdd = false;
                index++;
            }

            var name = 'item'+key;
            var itemNode = content.getChildByName(name);
            if(!itemNode){
                itemNode = cc.instantiate(this.scrollItem);
                itemNode.parent = content;
                itemNode.name = name;
                itemNode.y = this.scrollItem.y;
                itemNode.x = this.scrollItem.x + key * (this.scrollItem.width -30);
            }
            itemNode.active = true;

            if(isShowAdd){
                this.initAddBtnItem(itemNode);
            } else {
                var label = cc.find('label',itemNode);
                label.getComponent(cc.Label).string = getGameTypeNameString(data);

                var limit = cc.find('limit',itemNode);
                limit.getComponent(cc.Label).string = "进入条件："+ this.getGameLimitByType(data);

                var sprite = itemNode.getComponent(cc.Sprite);
                this.loadItemSprite(sprite, data);

                itemNode.tag = data;
                itemNode.on(cc.Node.EventType.TOUCH_END, this.onSelectGameClick, this);
            }
        }
        if(gameList.length <= 3){
            this.leftBtnNode.active = false;
            this.rightBtnNode.active = false;

            this.scrollView.enabled = false;
        }
    },
    initAddBtnItem: function(ItemNode){
        if(ItemNode == undefined){
            return;
        }
        ItemNode.active = true;

        var label = cc.find('label',ItemNode);
        var dikuang = cc.find('dikuang',ItemNode);

        label.active = false;
        dikuang.active = false;

        var sprite = ItemNode.getComponent(cc.Sprite);
        this.loadItemSprite(sprite, 'addBtn');

        ItemNode.on(cc.Node.EventType.TOUCH_END, this.onAddGameClick, this);
    },

    getOpenGameList: function(){
        var gameList = configMgr.getMatchGameType();
        if(gameList == undefined){
            return [];
        }
        cc.log('..gameList:'+JSON.stringify(gameList));
        return gameList;
    },
    getGameLimitByType: function(type){
        var limit = '';

        var serverConfig = configMgr.getServerConfig();
        if(serverConfig == undefined || serverConfig.matchCoin == undefined){
            return limit;
        }

        var data = serverConfig.matchCoin[type];
        if(data == undefined || data.enter == undefined){
            return limit;
        }
        //限制条件暂取第一个
        limit = data.enter[0];
        return limit;
    },

    onSelectGameClick: function(event){
        if (inCD(1000)) {
            return;
        }
        soundMngr.instance.playAudioOther('button');
        var gameType = event.target.tag;
        cc.log("..gameType:"+gameType);
        matchHandler.selectGameType = gameType;

        var sumLv = getMatchSumLv(gameType);
        if(sumLv == undefined){
            return;
        }
        if(sumLv == 1){
            matchHandler.selectGameLv = 0;
            if(checkOpenUISuccour(matchHandler.selectGameType, matchHandler.selectGameLv)){
                return;
            }
            var enter = getMatchCoinEnterLimit(matchHandler.selectGameType, matchHandler.selectGameLv) || 0;
            if(enter > GameData.player.coin){
                createMoveMessage('', errorCode.LessCoin);
                return;
            }
            openView('Loading');
            matchHandler.signup();
        } else {
            openView('SelectGameLvPanel');
        }
    },
    onAddGameClick: function(){
        cc.log("..onAddGameClick");
        soundMngr.instance.playAudioOther('button');
    },
    onLeftBtnClick: function(){
        cc.log("..onLeftBtnClick");
        soundMngr.instance.playAudioOther('button');
    },
    onRightBtnClick: function(){
        cc.log("..onRightBtnClick");
        soundMngr.instance.playAudioOther('button');
    },

    onClose: function () {
        soundMngr.instance.playAudioOther('button');
        closeView(this.node.name);
    }
});