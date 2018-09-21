cc.Class({
    extends: cc.Component,

    properties: {
        contentNode: cc.Node,
        playerInfo: cc.Node,
    },
    onLoad: function () {

    },
    showUI: function (data) {
        this.initUI();
        if ( !data) return;
        this.showList(data);
    },
    initUI: function () {
        this.contentNode.removeAllChildren();
    },
    showList: function (data) {
        for (var i = (data.length - 1); i >= 0; i--) {
            var index = data.length - (i + 1);
            var list = this.contentNode.getChildByName('list'+index);
            if(list == undefined){
                list = cc.instantiate(this.playerInfo);
                list.y = -22 - index*this.playerInfo.height;
                this.contentNode.height = (index+1)*this.playerInfo.height;
                list.parent = this.contentNode;
                list.name = 'list'+index;
            }
            var listData = data[i];
            for (var j = 0; j < list.childrenCount; j++) {
                var child = list.children[j];
                var childResult = listData[j];
                this.setResultIcon(child, childResult);
            }
        }
    },
    setResultIcon: function(headNode,sign) {
        var texture;
        if (sign) {
            texture = cc.textureCache.addImage(cc.url.raw('resources/hundredNiuNiu/uiResources/panelUI/zoushi/bai.png'))
        }else {
            texture = cc.textureCache.addImage(cc.url.raw('resources/hundredNiuNiu/uiResources/panelUI/zoushi/sheng.png'))
        }
        headNode.getComponent('cc.Sprite').spriteFrame = new cc.SpriteFrame(texture);
    },
    close: function () {
        closeView(this.node.name);
    },
});
