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
        scoreLabel: cc.Label,
        fonts: [cc.Font],
    },

    // use this for initialization
    onLoad: function () {

    },

    getScoreColor: function(score){
        this.scoreLabel.string = score;
        if (score > 0) {
            this.scoreLabel.string = '+'+score;
            this.scoreLabel.font = this.fonts[0];
        }else if (score < 0) {
            this.scoreLabel.string = score;
            this.scoreLabel.font = this.fonts[1];
        }else if (score == 0) {
            this.scoreLabel.string = score;
            this.scoreLabel.font = this.fonts[2];
        }
    },
    setAnchor: function (anchor) {
        this.scoreLabel.node.anchorX = anchor;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
