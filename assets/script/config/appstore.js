var gameDefine = require('gameDefine');

var Config = {
  areaType:gameDefine.AreaType.Area_TianJin, //地区
  serverIP:"116.62.203.138",   //服务器地址
  serverPort:3910,  //端口
  gameName:"天津攒局麻将",  //游戏名称
  versionText:"审批文号：新广出审[2017]10415号  出版物号：ISBN978-7-498-03201-0  出版单位：天津电子出版社有限公司",  //版号内容
  notice: "抵制不良游戏，拒绝盗版游戏，注意自我保护，谨防受骗上当。适度游戏益脑，沉迷游戏伤身，合理安排时间，享受健康生活.",
  wxShareUrl: "https://fir.im/rytianjinmajiang",  //微信分享链接
  wxWelcomeText: "还等嘛!我在天津攒局麻将等你!",  //微信邀请语
  loginLogo: "resources/login/cuanjumajiang.png", //登录界面LOGO
  //海报（如果不想显示一个不写就行）
  Poster: [
      "resources/poster/tianjin/poster_tianjin_1.png"
      // "resources/poster/tianjin/poster_tianjin_2.png"
  ],
  //包含游戏类型
  GameVisible:[
    gameDefine.GameType.Game_Mj_Tianjin,
    gameDefine.GameType.Game_MJ_HuaDian,
    gameDefine.GameType.Game_Mj_CC,
    gameDefine.GameType.Game_Mj_Heb,
    gameDefine.GameType.Game_Poker_DDZ,
    gameDefine.GameType.Game_Poker_TianjinDDZ,
    gameDefine.GameType.Game_TDK,
    gameDefine.GameType.Game_niu_niu,
    gameDefine.GameType.Game_Poker_paodekuai
  ],
  //游戏开启模式类型
  ModeType: {
      Game_Mj_Tianjin: {
          //付费货币类型
          CurrencyType: gameDefine.currencyType.Currency_Card,
          //结算奖励类型
          SettleType: []
      },
      Game_MJ_HuaDian: {
          CurrencyType: gameDefine.currencyType.Currency_Card,
          SettleType: []
      },
      Game_Mj_CC: {
          CurrencyType: gameDefine.currencyType.Currency_Card,
          SettleType: []
      },
      Game_Mj_Heb: {
          CurrencyType: gameDefine.currencyType.Currency_Card,
          SettleType: []
      },
      Game_niu_niu: {
          CurrencyType: gameDefine.currencyType.Currency_Card,
          SettleType: []
      },
      Game_TDK: {
          CurrencyType: gameDefine.currencyType.Currency_Card,
          SettleType: []
      },
      Game_Poker_TianjinDDZ: {
          CurrencyType: gameDefine.currencyType.Currency_Card,
          SettleType: []
      },
      Game_Poker_DDZ: {
          CurrencyType: gameDefine.currencyType.Currency_Card,
          SettleType: []
      },
      Game_Poker_paodekuai: {
          CurrencyType: gameDefine.currencyType.Currency_Card,
          SettleType: []
      }
  },
  //调牌是否开启
  SetCardsOpen: false,
  //匹配是否开启
  MatchGameType: [
      gameDefine.GameType.Game_Mj_Tianjin,
      gameDefine.GameType.Game_MJ_HuaDian,
      gameDefine.GameType.Game_TDK,
      gameDefine.GameType.Game_Poker_TianjinDDZ,
      gameDefine.GameType.Game_Mj_CC,
      gameDefine.GameType.Game_Mj_Heb,
      gameDefine.GameType.Game_Poker_DDZ,
  ],
  serverConfig:{
    //匹配金币场
    "matchCoin": {
          "1": {"name":"天津麻将匹配局", "roundType":1, "roundMax":1, "joinerMax":4, "cost":[0,0,0],"enter":[5000,15000,10000]},
          "5": {"name":"牛牛匹配局", "roundType":1, "roundMax":1, "joinerMax":4, "cost":[0,0,0], "enter":[30000,100000,500000]},
          "6": {"name":"桦甸麻将匹配局", "roundType":1, "roundMax":1, "joinerMax":4, "cost":[0,0,0], "enter":[5000,15000,100000]},
          "7": {"name":"填大坑匹配局", "roundType":1, "roundMax":1, "joinerMax":4, "cost":[0,0,0], "enter":[30000,100000,500000]},
          "8": {"name":"天津斗地主匹配局", "roundType":1, "roundMax":1, "joinerMax":3, "cost":[0,0,0], "enter":[2000,15000,10000]},
          "10": {"name":"长春麻将匹配局", "roundType":1, "roundMax":1, "joinerMax":4, "cost":[0,0,0], "enter":[5000,15000,100000]},
          "13": {"name":"哈尔滨麻将匹配局", "roundType":1, "roundMax":1, "joinerMax":4, "cost":[0,0,0], "enter":[2000,15000,100000]},
          "102": {"name":"经典斗地主匹配局", "roundType":1, "roundMax":1, "joinerMax":3, "cost":[0,0,0], "enter":[2000,15000,10000]},
     },
      //金币
    "roomCoin": {
      "1": [
        {"name":"4局", "roundType":1, "roundMax":4, "cost":1, "enter":[20,50,100], "perround":5},
        {"name":"8局", "roundType":1, "roundMax":8, "cost":2, "enter":[40,100,200], "perround":5},
        {"name":"16局", "roundType":1, "roundMax":16, "cost":4, "enter":[80,200,400], "perround":5},
        {"name":"1圈", "roundType":2, "roundMax":1, "cost":1, "enter":[20,50,100], "perround":5},
        {"name":"2圈", "roundType":2, "roundMax":2, "cost":2, "enter":[40,100,200], "perround":5},
        {"name":"4圈", "roundType":2, "roundMax":4, "cost":4, "enter":[80,200,400], "perround":5}
      ],
      "8": [
        {"name":"6局", "roundType":1, "roundMax":6, "cost":1, "enter":[20,50,100], "perround":5},
        {"name":"10局", "roundType":1, "roundMax":10, "cost":2, "enter":[40,100,200], "perround":5},
        {"name":"20局", "roundType":1, "roundMax":20, "cost":4, "enter":[80,200,400], "perround":5}
      ],
      "102": [
        {"name":"6局", "roundType":1, "roundMax":6, "cost":1, "enter":[20,50,100], "perround":5},
        {"name":"10局", "roundType":1, "roundMax":10, "cost":2, "enter":[40,100,200], "perround":5},
        {"name":"20局", "roundType":1, "roundMax":20, "cost":4, "enter":[80,200,400], "perround":5}
      ]
    },
      //房卡
    "roomCard": {
      "1": {
        "1": {"name": "4局","cost": {"2": {"final": 0},"3": {"final": 0},"4": {"final": 0}}},
        "2": {"name": "8局","cost": {"2": {"final": 0},"3": {"final": 0},"4": {"final": 0}}},
        "3": {"name": "16局","cost": {"2": {"final": 0},"3": {"final": 0},"4": {"final": 0}}},
        "4": {"name": "1圈","cost": {"2": {"final": 0},"3": {"final": 0},"4": {"final": 0}}},
        "5": {"name": "2圈","cost": {"2": {"final": 0},"3": {"final": 0},"4": {"final": 0}}},
        "6": {"name": "4圈","cost": {"2": {"final": 0},"3": {"final": 0},"4": {"final": 0}}}
      },
      "2": {
        "1": {"name": "4局","cost": {"2": {"final": 0},"3": {"final": 0},"4": {"final": 0}}},
        "2": {"name": "8局","cost": {"2": {"final": 0},"3": {"final": 0},"4": {"final": 0}}},
        "3": {"name": "16局","cost": {"2": {"final": 0},"3": {"final": 0},"4": {"final": 0}}},
        "4": {"name": "1课/50分","cost": {"2": {"final": 0},"3": {"final": 0},"4": {"final": 0}}},
        "5": {"name": "1课/100分","cost": {"2": {"final": 0},"3": {"final": 0},"4": {"final": 0}}}
      },
      "3": {
        "1": {"name": "15局", "cost": {"2": { "final": 0}, "3": { "final": 0}, "4": { "final": 0}, "5": { "final": 0}}},
        "2": {"name": "30局", "cost": {"2": { "final": 0}, "3": { "final": 0}, "4": { "final": 0}, "5": { "final": 0}}},
        "3": {"name": "45局", "cost": {"2": { "final": 0}, "3": { "final": 0}, "4": { "final": 0}, "5": { "final": 0}}},
        "4": {"name": "60局", "cost": {"2": { "final": 0}, "3": { "final": 0}, "4": { "final": 0}, "5": { "final": 0}}},
        "5": {"name": "75局", "cost": {"2": { "final": 0}, "3": { "final": 0}, "4": { "final": 0}, "5": { "final": 0}}}
      },
      "5":{
        "1":{"name":"10局", "cost":{"6":{ "final":0}}},
        "2":{"name":"20局", "cost":{"6":{ "final":0}}},
        "3":{"name":"30局", "cost":{"6":{ "final":0}}}
      },
      "6" : {
        "61":{"name":"6局", "cost":{"2":{ "final":0},"4":{ "final":0}}},
        "62":{"name":"12局", "cost":{"2":{ "final":0},"4":{ "final":0}}},
        "63":{"name":"24局", "cost":{"2":{ "final":0},"4":{ "final":0}}},
        "64":{"name":"1圈", "cost":{"2":{ "final":0},"4":{ "final":0}}},
        "65":{"name":"2圈", "cost":{"2":{ "final":0},"4":{ "final":0}}},
        "66":{"name":"4圈", "cost":{"2":{ "final":0},"4":{ "final":0}}}
      },
      "7":{
        "71":{"name":"15局", "cost":{"3":{ "final":0}, "4":{ "final":0}, "5":{ "final":0}, "6":{ "final":0}}},
        "72":{"name":"30局", "cost":{"3":{ "final":0}, "4":{ "final":0}, "5":{ "final":0}, "6":{ "final":0}}}  
      },
      "8":{
        "6":{"name":"6局", "cost":{"3":{ "final":0}}},
        "10":{"name":"10局", "cost":{"3":{ "final":0}}},
        "20":{"name":"20局", "cost":{"3":{ "final":0}}}
      },
      "9": {
        "1": {"name": "4局","cost": {"2": {"final": 0},"3": {"final": 0},"4": {"final": 0}}},
        "2": {"name": "8局","cost": {"2": {"final": 0},"3": {"final": 0},"4": {"final": 0}}},
        "3": {"name": "16局","cost": {"2": {"final": 0},"3": {"final": 0},"4": {"final": 0}}}
      },
      "10":{
        "61":{"name":"4局", "cost":{"2":{ "final":0}}},
        "62":{"name":"8局", "cost":{"2":{ "final":0}}},
        "63":{"name":"16局", "cost":{"2":{ "final":0}}},
        "64":{"name":"1圈", "cost":{"4":{ "final":0}}},
        "65":{"name":"2圈", "cost":{"4":{ "final":0}}},
        "66":{"name":"4圈", "cost":{"4":{ "final":0}}}
      },
      "11":{
        "10":{"name":"10局", "cost":{"2":{ "final":0},"3":{ "final":0}}},
        "20":{"name":"20局", "cost":{"2":{ "final":0},"3":{ "final":0}}},
        "30":{"name":"30局", "cost":{"2":{ "final":0},"3":{ "final":0}}}
      },
      "13":{
        "1":{"name":"4局", "cost":{"2":{ "final":0}}},
        "2":{"name":"8局", "cost":{"2":{ "final":0}}},
        "3":{"name":"16局", "cost":{"2":{ "final":0}}},
        "64":{"name":"1圈", "cost":{"4":{ "final":0}}},
        "65":{"name":"2圈", "cost":{"4":{ "final":0}}},
        "66":{"name":"4圈", "cost":{"4":{ "final":0}}}
      },
      "102":{
        "6":{"name":"6局", "cost":{"3":{ "final":0}}},
        "10":{"name":"10局", "cost":{"3":{ "final":0}}},
        "20":{"name":"20局", "cost":{"3":{ "final":0}}}
      }
    }
  },
};

module.exports = Config;