var configMgr = require('configMgr');
cc.Class({
    extends: cc.Component,

    properties: {
        pageView: cc.PageView,
        pageItem: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.scrollCd = 0;
        this.allPageLength = 0;
        this.currIndex = 0;
    },

    initUI: function () {
        var posterData = configMgr.CompetitionPoster();
        if (!posterData) {
            return;
        }
        for (var i = 0; i<posterData.length; i++) {
            var posterItem = this.pageItem.parent.getChildByName('page_'+i);
            if(posterItem == null){
                posterItem = cc.instantiate(this.pageItem);
                posterItem.parent = this.pageItem.parent;
                posterItem.name = 'page_' + i;
            }
            this.setImg(posterItem,posterData[i]);
        }
    },

    setImg: function (node,url) {
        if (node) {
            node.getComponent(cc.Sprite).spriteFrame = null;
            var texture = cc.textureCache.addImage(cc.url.raw(url));
            node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.scrollCd += dt;
        this.allPageLength = this.pageView.getPages().length;
        this.currIndex = this.pageView.getCurrentPageIndex();
        if (this.scrollCd >= 3){
            this.scrollCd = 0;
            var nextIndex = this.currIndex + 1 > this.allPageLength ? 0 : this.currIndex + 1;
            this.pageView.scrollToPage(nextIndex,0.2);
        }
    }
});
