var soundMngr = require('SoundMngr');
var RoomHandler = require('roomHandler');
var matchHandler = require('matchHandler');
var gameDefine = require('gameDefine');
var configMgr = require('configMgr');
var errorCode = require('errorCode');

cc.Class({
    extends: cc.Component,

    properties: {

        pushToggle: cc.Toggle,
        withDrawToggle: cc.Toggle,

        pushPanel: cc.Node,
        withDrawPanel: cc.Node,
        logPanel: cc.Node,
        moneyPanel: cc.Node,
        QRPanel: cc.Node,

        QRNode: cc.Node,
        QRCutNode: cc.Node,
        LinkNode: cc.Node,

        sliderNode: cc.Slider,
        progressBar: cc.ProgressBar,
        withdrawMoney: cc.EditBox,

        scrollView: cc.ScrollView,
        scrollItem: cc.Node,

        nameEditBox: cc.EditBox,
        cardEditBox: cc.EditBox
    },

    onLoad: function () {

        require('util').registEvent('onPlayerUpdate', this, this.refreshUIWithDrawPanel);

        this.logList = undefined;

        this.refreshUIPushPanel();
        this.refreshUIWithDrawPanel();
        this.refreshUILogPanel();
        this.refreshUIMoneyPanel();
    },
    onEnable: function () {
        this.initUIShow();
    },
    onDestroy: function () {
        unrequire('util').registEvent('onPlayerUpdate', this, this.refreshUIWithDrawPanel);
    },

    initUIShow: function(){
        this.pushToggle.isChecked = true;
        this.withDrawToggle.isChecked = false;

        this.pushPanel.active = true;
        this.withDrawPanel.active = false;
        this.logPanel.active = false;
        this.moneyPanel.active = false;
    },
    refreshUIPushPanel: function () {
        if(GameData.player.qrcodeUrl == undefined){
            cc.log('QRCode is undefined');
            return;
        }
        this.LinkNode.getComponent(cc.Label).string = getShortStr(GameData.player.qrcodeUrl, 16);


        ////////绘制二维码
        var qrcode = new QRCode(-1, QRErrorCorrectLevel.H);
        qrcode.addData(GameData.player.qrcodeUrl);
        qrcode.make();

        var ctx = this.QRNode.getComponent(cc.Graphics);
        ctx.fillColor = cc.Color.BLACK;

        var tileW = this.QRNode.width / qrcode.getModuleCount();
        var tileH = this.QRNode.height / qrcode.getModuleCount();

        // draw in the Graphics
        for (var row = 0; row < qrcode.getModuleCount(); row++) {
            for (var col = 0; col < qrcode.getModuleCount(); col++) {
                if (qrcode.isDark(row, col)) {
                     ctx.fillColor = cc.Color.BLACK;
                    var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
                    var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
                    ctx.rect(Math.round(col * tileW), Math.round(row * tileH), w, h);
                    ctx.fill();
                } else {
                     ctx.fillColor = cc.Color.WHITE;
                }
                //var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
                // var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
                // ctx.rect(Math.round(col * tileW), Math.round(row * tileH), w, h);
                // ctx.fill();
            }
        }
        this.QRNode.rotation = 90;

        //////绘制截图所需要的二维码（截图以屏幕左下角为锚点，添加一个位置在左下角的二维码，用以截图）
        var qrcodeCut = new QRCode(-1, QRErrorCorrectLevel.H);
        qrcodeCut.addData(GameData.player.qrcodeUrl);
        qrcodeCut.make();

        var ctxCut = this.QRCutNode.getComponent(cc.Graphics);
        ctxCut.fillColor = cc.Color.BLACK;

        var tileWCut = this.QRNode.width / qrcode.getModuleCount();
        var tileHCut = this.QRNode.height / qrcode.getModuleCount();

        for (var rowCut = 0; rowCut < qrcode.getModuleCount(); rowCut++) {
            for (var colCut = 0; colCut < qrcode.getModuleCount(); colCut++) {
                if (qrcode.isDark(rowCut, colCut)) {
                    ctxCut.fillColor = cc.Color.BLACK;
                    var wCut = (Math.ceil((colCut + 1) * tileWCut) - Math.floor(colCut * tileWCut));
                    var hCut = (Math.ceil((rowCut + 1) * tileWCut) - Math.floor(rowCut * tileWCut));
                    ctxCut.rect(Math.round(colCut * tileWCut), Math.round(rowCut * tileHCut), wCut, hCut);
                    ctxCut.fill();
                } else {
                    ctxCut.fillColor = cc.Color.WHITE;
                }
            }
        }
        this.QRCutNode.rotation = 90;
    },
    refreshUIWithDrawPanel: function () {
        var myMoney = cc.find('money', this.withDrawPanel);
        var havePushNumber = cc.find('havePushNumber', this.withDrawPanel);

        myMoney.getComponent(cc.Label).string = GameData.player.income || 0;
        havePushNumber.getComponent(cc.Label).string = GameData.player.lower || 0;

        this.sliderHandlerClick();
    },
    refreshUILogPanel: function () {
        var list = this.logList;

        var content = this.scrollView.content;
        for(var ii = 0;ii < content.getChildrenCount();ii++){
            var child = content.getChildren()[ii];
            if(child){
                child.active = false;
            }
        }
        if(list == undefined){
            return;
        }

        var height = list.length * this.scrollItem.height;
        height < 265 ? height = 265 : null;

        content.height = height;

        var index = 0;
        for(var key in list){
            var data = list[key];
            if(data == undefined){
                return;
            }
            var node = content.getChildren()[index];
            if(node == undefined){
                node = cc.instantiate(this.scrollItem);
                node.parent = content;
            }
            node.active = true;

            node.x = this.scrollItem.x;
            node.y = this.scrollItem.y - this.scrollItem.height *index;

            var timeLabel = cc.find('time', node);
            var moneyLabel = cc.find('money', node);
            var stateLabel = cc.find('state', node);

            timeLabel.getComponent(cc.Label).string = data.time;
            moneyLabel.getComponent(cc.Label).string = data.money.toFixed(1);

            switch (data.state){
                case gameDefine.withdrawState.wait:{
                    stateLabel.getComponent(cc.Label).string = '待审核';
                    stateLabel.color = cc.color(65, 92, 94);
                }break;
                case gameDefine.withdrawState.succeed:{
                    stateLabel.getComponent(cc.Label).string = '已完成';
                    stateLabel.color = cc.color(65, 92, 94);
                }break;
                case gameDefine.withdrawState.fail:{
                    stateLabel.getComponent(cc.Label).string = '驳回';
                    stateLabel.color = cc.color(255, 0, 0);
                }break;
            }
            index++;
        }
    },
    refreshUIMoneyPanel: function () {
        var moneyLabel = cc.find('money', this.moneyPanel);
        moneyLabel.getComponent(cc.Label).string = '提现金额：'+this.withdrawMoney.string;

        var withdrawLogData = JSON.parse(cc.sys.localStorage.getItem('withdrawLog'));
        cc.log("..withdrawLogData:"+JSON.stringify(withdrawLogData));
        if(withdrawLogData){
            this.nameEditBox.string = withdrawLogData.name;
            this.cardEditBox.string = withdrawLogData.card;
        }
    },

    loadSpriteImg: function(sprite, imgUrl){
        if (sprite == undefined || imgUrl == undefined || imgUrl.length <= 0) {
            return;
        }
        var texture = cc.textureCache.addImage(cc.url.raw(imgUrl));
        if(texture){
            sprite.spriteFrame = new cc.SpriteFrame(texture);
        }
    },

    sliderHandlerClick: function(){
        this.progressBar.progress = this.sliderNode.progress;

        var myMoney = GameData.player.income || 0;
        if(myMoney < 100){
            this.withdrawMoney.string = 0;
            return;
        }
        var money = parseInt(this.sliderNode.progress * myMoney);
        money < 100 ? money = 100 : null;
        this.withdrawMoney.string = money;
    },
    QRShareBtnClick: function(){
        cc.log('..QRShareBtnClick');
        if (inCD(1000) == false) {
            soundMngr.instance.playAudioOther('button');
            screenPartShoot(this.QRPanel, wxShareTexture);
        }
    },
    linkShareBtnClick: function(){
        cc.log('..linkShareBtnClick');
        if (inCD(3000) == false) {
            soundMngr.instance.playAudioOther('button');
            wxShareWeb("推广", GameData.player.qrcodeUrl);
        }
    },
    submitAppBtnClick: function(){
        cc.log('..submitAppBtnClick');
        soundMngr.instance.playAudioOther('button');

        var name = this.nameEditBox.string;
        var card = this.cardEditBox.string;
        var money = parseInt(this.withdrawMoney.string);

        if(name == undefined || name.length <= 0 || card == undefined || card.length <= 0 || money <= 0){
            createMessageBox('请正确输入信息。', function(){});
            return;
        }

        var data = {name: name, card: card, money: money};
        cc.log('..data:'+JSON.stringify(data));
        GameNet.getInstance().request("game.playerHandler.reqDrawApply", data, function(rtn) {
            if(rtn.result == errorCode.Success){
                createMessageBox('已提交。', function(){});
                if (name == undefined || card == undefined) {
                    return;
                }
                var data1 = {};
                data1.name = name;
                data1.card = card;
                cc.sys.localStorage.setItem('withdrawLog', JSON.stringify(data1));
            } else {
                createMessageBox('提交失败！', function(){});
            }
        });
        this.moneyPanel.active = false;
    },
    showUIPanel: function(evt, data){
        soundMngr.instance.playAudioOther('button');
        if(data == undefined){
            return;
        }
        switch (parseInt(data)){
            case 1:{
                this.pushPanel.active = true;
                this.withDrawPanel.active = false;
            }break;
            case 2:{
                this.pushPanel.active = false;
                this.withDrawPanel.active = true;
            }break;
        }
    },
    showUILog: function(){
        this.logPanel.active = true;
        var self = this;
        GameNet.getInstance().request("game.playerHandler.reqDrawList", null, function(rtn) {
            cc.log('..rtn:'+JSON.stringify(rtn));
            self.logList = rtn;
            self.refreshUILogPanel();
        });
    },
    showUIMoney: function(){
        var myMoney = GameData.player.income || 0;
        var withdrawMoney = parseInt(this.withdrawMoney.string);
        if(myMoney < withdrawMoney){
            createMessageBox('提现金额超出推广金！', function(){});
            return;
        }
        if(withdrawMoney < 100){
            createMessageBox('提现金额不能小于100！', function(){});
            return;
        }
        this.moneyPanel.active = true;
        this.refreshUIMoneyPanel();
    },
    closeUILog: function(){
        soundMngr.instance.playAudioOther('button');
        this.logPanel.active = false;
    },
    closeUIMoney: function(){
        soundMngr.instance.playAudioOther('button');
        this.moneyPanel.active = false;
    },
    closeUIPushGame: function(){
        soundMngr.instance.playAudioOther('button');
        closeView(this.node.name);
    }
});