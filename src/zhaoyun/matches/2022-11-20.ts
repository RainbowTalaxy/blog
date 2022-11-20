import { Hero } from '../Hero';
import { GameMap } from '../Map';
import { Player } from '../Player';

export default {
    date: '2022/11/20',
    matchs: [
        {
            teams: {
                A: {
                    players: [
                        Player.GA9A,
                        Player.ShowCheng,
                        Player.JinMu,
                        Player.Kaneki,
                        Player.MoLanran,
                    ],
                },
                B: {
                    players: [
                        Player.Farway1987,
                        Player.Jimmy,
                        Player.Eileen,
                        Player.Kyo,
                        Player.Coldest,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMap.LijiangTower,
                    A: 2,
                    B: 0,
                    ban: [Hero.Genji, Hero.Ana, Hero.Tracer, Hero.Kiriko],
                    keep: [Hero.Sojourn, Hero.Sombra],
                },
                {
                    map: GameMap.CircuitRoyal,
                    A: 2,
                    B: 1,
                    ban: [Hero.Sojourn, Hero.Sigma, Hero.Zenyatta, Hero.Zarya],
                    keep: [Hero.Genji, Hero.WidowMaker],
                },
            ],
        },
        {
            teams: {
                A: {
                    players: [
                        Player.Kyo,
                        Player.Eileen,
                        Player.ShowCheng,
                        Player.MoLanran,
                        Player.Jimmy,
                    ],
                },
                B: {
                    players: [
                        Player.Lengsa,
                        Player.GA9A,
                        Player.Ameng,
                        Player.Kaneki,
                        Player.Farway1987,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMap.Oasis,
                    A: 1,
                    B: 2,
                    ban: [Hero.Sojourn, Hero.Lucio, Hero.Sigma, Hero.Winston],
                    keep: [Hero.Ana, Hero.Ashe],
                },
                {
                    map: GameMap.Junkertown,
                    A: 2,
                    B: 3,
                    ban: [Hero.Sigma, Hero.Sombra, Hero.Zenyatta, Hero.Lucio],
                    keep: [Hero.WreckingBall, Hero.Sojourn],
                },
            ],
        },
        {
            teams: {
                A: {
                    players: [
                        Player.MoLanran,
                        Player.ShowCheng,
                        Player.Coldest,
                        Player.Farway1987,
                        Player.GA9A,
                    ],
                },
                B: {
                    players: [
                        Player.JinMu,
                        Player.Jimmy,
                        Player.Lengsa,
                        Player.Ameng,
                        Player.Kaneki,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMap.Busan,
                    A: 0,
                    B: 2,
                    ban: [Hero.Ana, Hero.Sojourn, Hero.Zenyatta, Hero.Genji],
                    keep: [Hero.Lucio, Hero.DoomFist],
                },
                {
                    map: GameMap.Numbani,
                    A: 0,
                    B: 3,
                    ban: [Hero.Winston, Hero.Genji, Hero.Sigma, Hero.Lucio],
                    keep: [Hero.Sojourn, Hero.Ana],
                },
            ],
        },
    ],
};
