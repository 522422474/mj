var MahjongData = require('TuiDaoHu-Data');
var MahjongRules = require('TuiDaoHu-Rules');
var MahjongProtocol = require('TuiDaoHu-Protocol');

var exp = {

	name: '推到胡麻将',

    language: {
        name: '中国话',
    },

    prefabs: {
        'wifiView': 'views/room/common/WifiView',
        'powerView': 'views/room/common/PowerView',
        'timeView': 'views/room/common/TimeView',
        'roomNumView': 'views/room/common/RoomNumView',
        'ruleView': 'views/room/common/RuleView',
        'ruleTipsView': 'views/room/common/RuleTipsView',
        'chatView': 'views/common/ChatView',
        'talkView': 'views/common/TalkView',
        'settingView': 'views/common/SettingView',
        'dissolveView': 'views/room/common/DissolveView',
        'headView': 'views/room/mahjong/HeadView',
        'waitView': 'views/room/mahjong/WaitView',
        'prepareView': 'views/room/mahjong/PrepareView',
        'cardsView': 'views/room/mahjong/CardsView',
        'wildCard1View': 'views/room/mahjong/WildCard1View',
        'directionView': 'views/room/mahjong/DirectionView',
        'cardActionView': 'views/room/mahjong/CardActionView',
        'debugView': 'views/room/mahjong/DebugView',
        'resultView': 'views/room/mahjong/ResultView',
        'summaryView': 'views/room/mahjong/SummaryView',
    },

    views: {
        base: ['talkView', 'wifiView', 'powerView', 'timeView', 'roomNumView', 'ruleView'],
        wait: ['waitView', 'headView', 'prepareView', 'ruleTipsView'],
        game: ['wildCard1View', 'directionView', 'cardsView', 'headView', 'ruleTipsView', 'cardActionView'],
        ready: ['headView', 'directionView', 'prepareView', 'ruleTipsView'],
    },

    chat: {
    	talks: ['嘛钱不钱的，乐呵乐呵得了。','哎呀，出错牌了。','怒了啊，怒了啊。','今儿运气不错啊，没少赢。','楞嘛神儿！快点吧，花都谢了。','我要加油了啊。','这牌打的没谁了，谢了啊。','还让不让人活了，我要发威了','今儿输的太多了，太点背了。','土豪，咱们做朋友吧。','等下哈，我考虑考虑出嘛。','不好意思啊。'],
        soundKeys: ['card_K_1','card_K_2','card_K_3','card_K_4','card_K_5','card_K_6','card_K_7','card_K_8','card_K_9','card_K_10','card_K_11','card_K_12'],
    },

    actions: {
        chi:    {type:'chi', icon:'resources/table/action/chi.png', spine:'spine/table/chi', animate:'a', request_fn:'requestChiCard'},
        peng:   {type:'peng', icon:'resources/table/action/peng.png', spine:'spine/table/peng', animate:'animation', request_fn:'requestPengCard'},
        minggang:{type:'gang', icon:'resources/table/action/gang.png', spine:'spine/table/gang', animate:'a', request_fn:'requestMingGangCard'},
        angang: {type:'gang', icon:'resources/table/action/gang.png', spine:'spine/table/gang', animate:'a', request_fn:'requestAnGangCard'},
        bugang: {type:'gang', icon:'resources/table/action/gang.png', spine:'spine/table/gang', animate:'a', request_fn:'requestBuGangCard'},
        zimo:   {type:'hu', icon:'resources/table/action/hu.png', spine:'spine/table/hu', animate:'a', request_fn:'requestHu'},
        dianpao:{type:'hu', icon:'resources/table/action/hu.png', spine:'spine/table/hu', animate:'a', request_fn:'requestDianPao'},
    },

    resources: {
        wildIcon: 'resources/newui/huier_icon.png'
    }

};

//规则字符串
exp.getRuleStr = function(opts) {
	return getRuleStrHongZhong(opts);
}

exp.getRuleHandler = function() {
	return MahjongRules;
}

exp.getDataHandler = function() {
    return MahjongData;
}

exp.getProtocolHandler = function() {
    return MahjongProtocol;
}

module.exports = exp;
