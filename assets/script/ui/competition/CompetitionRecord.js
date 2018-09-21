cc.Class({
    extends: cc.Component,

    properties: {
        scrollView:     cc.ScrollView,
        scrollViewItem: cc.Node,
        content:        cc.Node
    },

    // use this for initialization
    onLoad: function () {

    },
    close: function () {
        closeView(this.node.name);
    },
    initUI: function () {

    }
});
