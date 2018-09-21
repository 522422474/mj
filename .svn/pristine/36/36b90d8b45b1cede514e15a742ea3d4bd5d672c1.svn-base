var errorCode = require('errorCode');
var codeString = require('codeString');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    onLoad: function () {
        var actionTo = cc.moveBy(2, cc.p(0, 40));
        this.node.runAction(actionTo);

        var self = this;
        var timeCallback = function (dt) {
            self.node.destroy();
        };
        this.scheduleOnce(timeCallback, 2);
    },

    setContent: function(content, code){
        var str = content;
        var label = cc.find('Label', this.node);
        if(code && codeString){
            str = codeString[code];
        }
        if(label){
            label.getComponent(cc.Label).string = str;
        }
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});