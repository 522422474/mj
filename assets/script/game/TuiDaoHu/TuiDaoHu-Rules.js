var game = require('gameConfig');
var roomHandler = require('roomHandler');

var MjCards = {
    //条
    tiao: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    //万
    wan: [11, 12, 13, 14, 15, 16, 17, 18, 19],
    //筒
    tong: [21, 22, 23, 24, 25, 26, 27, 28, 29],
    //东南西北
    feng: [31, 41, 51, 61],
    //中发白
    jian: [71, 81, 91],
    //春夏秋冬、梅兰竹菊
    hua: [111, 112, 113, 114, 121, 122, 123, 124]
};

var Mahjong = module.exports;

Mahjong.isWildCard = function (card) {
    return game.getGameData().game.wildcard.indexOf(card) != -1;
}

Mahjong.getWildCards = function () {
    return game.getGameData().game.wildcard;
}
