import { Hero } from '../../../constants/zhaoyun/Hero';
import { GameMap } from '../../../constants/zhaoyun/Map';
import { Player } from '../../../constants/zhaoyun/Player';

export default {
    date: '2022/11/18',
    matches: [
        {
            teams: {
                A: {
                    players: [
                        Player.Coldest,
                        Player.ShowCheng,
                        Player.JinMu,
                        Player.Lengsa,
                        Player.Ameng,
                    ],
                },
                B: {
                    players: [
                        Player.Farway1987,
                        Player.Kaneki,
                        Player.GA9A,
                        Player.MoLanran,
                        Player.Eileen,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMap.BlizzardWorld,
                    A: 2,
                    B: 1,
                    ban: [
                        Hero.WreckingBall,
                        Hero.Sojourn,
                        Hero.Zarya,
                        Hero.Genji,
                    ],
                },
                {
                    map: GameMap.LijiangTower,
                    A: 0,
                    B: 2,
                    ban: [
                        Hero.WreckingBall,
                        Hero.Pharah,
                        Hero.Zarya,
                        Hero.Lucio,
                    ],
                },
                {
                    map: GameMap.Rialto,
                    A: 1,
                    B: 3,
                    ban: [
                        Hero.WreckingBall,
                        Hero.Sojourn,
                        Hero.Winston,
                        Hero.DVA,
                    ],
                },
            ],
        },
        {
            teams: {
                A: {
                    players: [
                        Player.Kaneki,
                        Player.Farway1987,
                        Player.JinMu,
                        Player.MoLanran,
                        Player.Ameng,
                    ],
                },
                B: {
                    players: [
                        Player.ShowCheng,
                        Player.GA9A,
                        Player.Eileen,
                        Player.Coldest,
                        Player.Lengsa,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMap.Nepal,
                    A: 1,
                    B: 2,
                    ban: [
                        Hero.WreckingBall,
                        Hero.Kiriko,
                        Hero.Winston,
                        Hero.Lucio,
                    ],
                },
                {
                    map: GameMap.KingsRow,
                    A: 3,
                    B: 4,
                    ban: [Hero.WreckingBall, Hero.Mei, Hero.Zarya, Hero.Lucio],
                },
            ],
        },
        {
            teams: {
                A: {
                    players: [
                        Player.Eileen,
                        Player.ShowCheng,
                        Player.JinMu,
                        Player.Coldest,
                        Player.Ameng,
                    ],
                },
                B: {
                    players: [
                        Player.Kaneki,
                        Player.GA9A,
                        Player.Farway1987,
                        Player.MoLanran,
                        Player.Lengsa,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMap.Busan,
                    A: 0,
                    B: 2,
                    ban: [
                        Hero.DoomFist,
                        Hero.Sojourn,
                        Hero.Soldier,
                        Hero.Genji,
                    ],
                },
                {
                    map: GameMap.Junkertown,
                    A: 1,
                    B: 0,
                    ban: [
                        Hero.Sombra,
                        Hero.Sojourn,
                        Hero.Tracer,
                        Hero.WidowMaker,
                    ],
                },
                {
                    map: GameMap.Paraiso,
                    A: 3,
                    B: 2,
                    ban: [Hero.Ashe, Hero.Sojourn, Hero.Winston, Hero.Lucio],
                },
            ],
        },
    ],
};
