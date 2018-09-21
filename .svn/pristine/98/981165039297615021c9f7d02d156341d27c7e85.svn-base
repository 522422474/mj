var soundMngr = require('SoundMngr');
var gameDefine = require('gameDefine');
var pokerAnimBase = require('pokerAnimationBase');

cc.Class({
    extends: cc.Component,

    properties: {
        layer: cc.Node,
        animationList: {
            default: [],
            type: cc.Node
        }
    },

    onLoad: function () {
        this.AnimBase = new pokerAnimBase();
    },
    onDestroy: function () {
    },
    onEnable: function () {
    },

    playAnimation: function(index, scale, fromPos, toPos){
        var animationNode = this.animationList[index];
        if(animationNode == undefined){
            return;
        }

        //根据需求，将动画往上调
        if(toPos && toPos.y){
            toPos.y += 10;
        }

        var node = cc.instantiate(animationNode);
        node.parent = this.layer;
        node.active = true;
        node.scale = scale;

        var self = this;
        var fun1 = function(node){
            var fun2 = function(node){
                node.destroy();
            };
            self.AnimBase.playDragonBonesAnimation(node, 'touxiangxiaoguo', 1, null, null, fun2);
            soundMngr.instance.playTableDynAudio(index, 1);
        };
        this.AnimBase.playDragonBonesAnimation(node, 'feixing', 0, fromPos, toPos, fun1);
        soundMngr.instance.playTableDynAudio(index, 0);
    }
});