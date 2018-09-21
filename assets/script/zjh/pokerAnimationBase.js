/**
 * Created by RY-5 on 2018/2/28.
 */
var pokerAnimBase = cc.Class({
    extends: cc.Component,
    properties:{},
    /**
     *
     * @param node poker数组
     * @param startPos 开始移动位置pos
     * @param endPos 最终位置arryPos
     * @param startScale 开始的缩放
     */
    dealAction:function (node,startPos,endPos,startScale,cb) {
        if (!node) {
            return
        }
        //参数
        var nodeScaleArr = [];
        var _startScale = startScale;


        for (var j = 0; j<node.length; j++) {
            nodeScaleArr.push(node[j].scale);
            node[j].setScale(_startScale);
            node[j].setPosition(startPos);
        }
        for (var i = 0; i<node.length; i++) {
            //show pokerNode
            if (!node[i].active) {
                node[i].active = true;
            }
            if (node[i].parent && !node[i].parent.active) {
                node[i].parent.active = true;
            }
            if (node[i].parent.parent && !node[i].parent.parent.active) {
                node[i].parent.parent.active = true;
            }

            node[i].runAction(cc.sequence(
                cc.delayTime(0.1*(i+1)),
                cc.spawn(
                    cc.rotateBy(0.1,360),
                    cc.moveTo(0.1,endPos[i]),
                    cc.scaleTo(0.1,nodeScaleArr[i])
            )));
        }
        //active finish cb
        var delyTime = 0;
        delyTime = 0.1 * node.length;
        if (cb){
            cb(delyTime);
        }

    },

    /**
     *
     * @param node :运动节点
     * @param time :运动时长 （s）
     * @param offsetX :X轴偏移量
     */
    flyToMidAction: function(node,time,offsetX,cb) {
        if (!node) {return}
        var endPosX = node.getPosition().x;
        var startPosX = endPosX + offsetX;
        node.x = startPosX;
        node.runAction(cc.moveTo(time,cc.v2(endPosX,node.y)));//.easing(cc.easeIn(3));
        if (cb) {
            cb(time)
        }
    },
    //翻牌动画
    playFlopAnimation: function (node,cb) {
        if (!node) {
            return;
        }
        var scale = node.scale;
        //cc.log('scale:'+scale);
        var action1 = cc.scaleTo(0.25, 0, scale);
        var action2 = cc.scaleTo(0.25, scale, scale);
        node.runAction(cc.sequence(action1,action2));
    },
    //play dragonBonesAnimation
    /**
     *
     * @param node 节点
     * @param url  动画路径
     * @param actionName 动画名称
     * @param cb  动画完成回调
     */
    playDragAnimation : function (node,url,actionName,cb){
        //var  url = 'zjh/animation/' +animate ;
        cc.loader.loadResDir(url, function(err, assets)
        {
            //cc.log('loadResArray ',url);
            if (err)
            {
                cc.log(err);
                return;
            }
            if (assets.length <= 0)
            {
                cc.log('assets length: ',assets.length);
                return;
            }

            var armatureDisplay;
            if (!node.getComponent(dragonBones.ArmatureDisplay))
            {
                cc.log('dragonBones add');
                armatureDisplay = node.addComponent(dragonBones.ArmatureDisplay);
            }
            else
            {
                cc.log('dragonBones get');
                armatureDisplay = node.getComponent(dragonBones.ArmatureDisplay);
            }
            for (var elem in assets)
            {
                if (assets[elem] instanceof dragonBones.DragonBonesAsset)
                {
                    if (armatureDisplay.dragonAsset != assets[elem])
                    {
                        armatureDisplay.dragonAsset = assets[elem];
                    }
                }
                if (assets[elem] instanceof dragonBones.DragonBonesAtlasAsset)
                {
                    if (armatureDisplay.dragonAtlasAsset != assets[elem])
                    {
                        armatureDisplay.dragonAtlasAsset = assets[elem];
                    }
                }
            }
            //newAnimation
            armatureDisplay.armatureName  = 'armature';
            armatureDisplay.playAnimation(actionName, 1);
            if (cb) {
                armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, cb, this);
            }
        })
    },

    playScaleAnim: function (node,scale) {
        if (!node.active){
            node.active = true;
        }
        //var scale = node.scale;
        node.scale = scale + 1;
        var action1 = cc.scaleTo(0.2,scale);
        node.runAction(action1);
    },

    //node: 动画节点
    //name: 播放动画名字
    //time: 播放次数（0：循环；>0：次数）
    //fromPos: 移动起始位置
    //toPos: 移动结束位置
    //fun: 播放完毕后执行回调
    playDragonBonesAnimation: function(node, name, time, fromPos, toPos, fun){
        if(node == undefined || name == undefined || name.length <= 0){
            cc.log('..node or animation name is undefined');
            return;
        }
        var nodeAnimation = node.getComponent(dragonBones.ArmatureDisplay);
        if(nodeAnimation == undefined){
            cc.log('..animation dragonBones node is undefined');
            return;
        }
        nodeAnimation.playAnimation(name, time);

        if(fromPos && toPos){
            node.position = fromPos;
            var move = cc.moveTo(0.6, toPos);
            node.runAction(cc.sequence(move.easing(cc.easeIn(1.5)), cc.callFunc(function(){
                if (fun) {
                    fun(node);
                }
            })));
        } else {
            if (fun) {
                nodeAnimation.addEventListener(dragonBones.EventObject.COMPLETE, function(){
                    fun(node);
                }, this);
            }
        }
    }
});
module.exports = pokerAnimBase;