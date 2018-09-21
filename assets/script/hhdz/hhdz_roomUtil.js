var hhdz_roomUtil = {
    //牌池
    AllCards : [
        102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114,  //方块2 3 4 5 6 7 8 9 10 J Q K A
        202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214,  //梅花2 3 4 5 6 7 8 9 10 J Q K A
        302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314,  //红桃2 3 4 5 6 7 8 9 10 J Q K A
        402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414,  //黑桃2 3 4 5 6 7 8 9 10 J Q K A
    ],

    //牌型
    CardType:{
        Common:0,
        DuiZi:1,
        ShunZi:2,
        JinHua:3,
        ShunJin:4,
        BaoZi:5,
    },

    //游戏状态
    GameStatus:{
        WaitStart:0,  //等待开始
        SendCard:1,   //发牌
        StartPour:2,  //开始下注
        ShowCard:3,   //开牌
    },

    //下注点数
    Pour:[100, 500, 1000, 2000, 5000],

    WaitTime: 15000,    //下注等待时间
    StepTime: 2000,     //状态切换间隔

    //赢家返还倍数
    WinTimes:{
        RedBlackTimes:1.9,  //红黑区返还倍数
        BaoZiTimes:10,
        ShunJinTimes:5,
        JinHuaTimes:3,
        ShunZiTimes:2,
        DuiZi9Times:1,
    },

    WinnerType:{
        Red:0,
        Black:1
    },
};
module.exports = hhdz_roomUtil;

hhdz_roomUtil.getPokerImgUrl = function(pokerId){
    if(pokerId == undefined){
        return null;
    }
    return 'resources/hhdz/table/pokers/poker_'+ pokerId +'.png';
};

hhdz_roomUtil.getWinnerFlagImg = function(winner){
    switch (winner){
        case this.WinnerType.Red:{
            return 'resources/hhdz/table/runChart/red.png';
        }break;
        case this.WinnerType.Black:{
            return 'resources/hhdz/table/runChart/black.png';
        }break;
        default: return null;
    }
};

hhdz_roomUtil.getBetImgUrl = function(lv) {
    var value = this.getBetValue(lv);
    return 'resources/hhdz/table/'+ value +'.png';
};

hhdz_roomUtil.getBetValue = function(lv){
    var value = this.Pour[lv];
    value === undefined ? value = this.Pour[0] : null;
    return value;
};

hhdz_roomUtil.getFakeJetonData = function(){
    var array = [];
    for(var i = 0;i < 3;i++){
        var data = [];
        var sum = 10;
        for(var j = 0;j < this.Pour.length;j++){
            if(sum <= 0){
                break;
            }
            var number = getRandomInt(1, sum);
            number > sum ? number = sum : null;
            sum -= number;

            var temp = {};
            temp.lv = j;
            temp.number = number;

            data.push(temp);
        }
        array.push(data);
    }
    return array;
};

hhdz_roomUtil.getOnLineFakeAddJetonData = function(){

    var obj = {};
    var time = getRandomInt(500, 1500);
    var number = getRandomInt(1, 5);

    var data = [];
    for(var i = 0;i < number;i++){
        var lv = getRandomInt(0, 4);
        var type = getRandomInt(0, 2);
        data.push(lv);
        data.push(type);
    }

    obj.time = time;
    obj.data = data;
    return obj;
};