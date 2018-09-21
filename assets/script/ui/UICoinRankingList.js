var soundMngr = require('SoundMngr');
var gameDefine = require('gameDefine');
var configMgr = require('configMgr');
var topHandler = require('topHandler');

cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        item: cc.Node,
        selfRank: cc.Node
    },

    onLoad: function () {
        require('util').registEvent('updateCoinTopList', this, this.onUpdateCoinTopListHandler);
    },
    onDestroy: function () {
        unrequire('util').registEvent('updateCoinTopList', this, this.onUpdateCoinTopListHandler);
    },
    onEnable: function () {
        this.hideScrollViewChildren();

        openView('Loading');
        topHandler.getCoinTopList();
    },

    onUpdateCoinTopListHandler: function(data){
        if(data == undefined){
            return;
        }
        closeView('Loading');
        this.updateUI(data.detail);
    },

    hideScrollViewChildren: function(){
        var content = this.scrollView.content;
        for(var i = 0;i < content.getChildrenCount();i++){
            var child = content.getChildren()[i];
            if(child){
                child.active = false;
            }
        }
    },

    updateUI: function(listData){
        //隐藏所有子节点
        this.hideScrollViewChildren();

        if(listData == undefined){
            return;
        }
        //设置滑动容器高度
        var length = listData.length;

        var height = length * this.item.height;
        height < 450 ? height = 450 : null;

        var content = this.scrollView.content;
        content.height = height;

        var selfRank = undefined;

        //更新添加子节点
        var index = 0;
        for(var key = 0; key < length; key++){
            var data = listData[key];
            if(data == undefined){
                continue;
            }
            var itemNode = content.getChildren()[index];
            if(itemNode == undefined){
                itemNode = cc.instantiate(this.item);
                itemNode.parent = content;
            }
            itemNode.active = true;

            itemNode.x = this.item.x;
            itemNode.y = this.item.y - this.item.height*index;

            this.updateScrollViewItem(index, data, itemNode);

            //检查排名中是否有自己
            if(data.uid == GameData.player.uid){
                selfRank = index;
            }
            index++;

            this.updateSelfRank(selfRank);
        }
    },
    updateScrollViewItem: function(index, data, node){
        if(index == undefined || data == undefined || node == undefined){
            return;
        }
        var rankImg = cc.find('rankImg', node);
        var rankLabel = cc.find('rankLabel', node);
        var icon = cc.find('icon', node);
        var name = cc.find('name', node);
        var gold = cc.find('golds/golds_num', node);

        if(index < 3){
            rankImg.active = true;
            rankLabel.active = false;

            this.loadUIImg(rankImg, this.getRankingImg(index))
        } else {
            rankImg.active = false;
            rankLabel.active = true;

            rankLabel.getComponent(cc.Label).string = (index +1);
        }
        this.LoadHeadIcon(icon, data.headimgurl);

        name.getComponent(cc.Label).string = data.name;
        gold.getComponent(cc.Label).string = data.coin;
    },

    updateSelfRank: function(index){
        if(index == undefined){
            this.selfRank.getComponent(cc.Label).string = '未上榜';
        } else {
            this.selfRank.getComponent(cc.Label).string = index;
        }
    },

    loadUIImg: function(node, imgurl){
        if(node == undefined || imgurl == undefined || imgurl.length <= 0){
            return;
        }
        var texture = cc.textureCache.addImage(cc.url.raw(imgurl));
        if(texture){
            node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        }
    },

    LoadHeadIcon: function (node, imgurl) {
        if(node == undefined || imgurl == undefined || imgurl.length <= 0){
            return;
        }
        cc.loader.load({url: imgurl, type: 'png'}, function (error, texture) {
            if (!error && texture) {
                node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            }
        });
    },

    getRankingImg: function(rank){
        var url;
        switch (rank){
            case 0:{
                url = 'resources/rankingList/coin/rank_1.png';
            }break;
            case 1:{
                url = 'resources/rankingList/coin/rank_2.png';
            }break;
            case 2:{
                url = 'resources/rankingList/coin/rank_3.png';
            }break;
        }
        return url;
    },

    onClose: function () {
        soundMngr.instance.playAudioOther('button');
        closeView(this.node.name);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // }
});