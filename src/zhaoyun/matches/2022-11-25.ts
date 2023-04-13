import { Hero } from '../Hero';
import { GameMap } from '../Map';
import { Player } from '../Player';

export default {
    date: '2022/11/25',
    matchs: [
        {
            teams: {
                A: {
                    players: [
                        Player.Lengsa,
                        Player.Diya,
                        Player.Ameng,
                        Player.Kyo,
                        Player.MoLanran,
                    ],
                },
                B: {
                    players: [
                        Player.JinMu,
                        Player.Jimmy,
                        Player.ShowCheng,
                        Player.Coldest,
                        Player.Eileen,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMap.LijiangTower,
                    A: 1,
                    B: 2,
                    ban: [Hero.Lucio, Hero.RoadHog, Hero.Mei, Hero.Zenyatta],
                    protect: [Hero.DoomFist, Hero.Orisa],
                },
                {
                    map: GameMap.Colosseo,
                    A: 0,
                    B: 1,
                    ban: [Hero.Lucio, Hero.Sigma, Hero.Mei, Hero.Tracer],
                    protect: [Hero.DoomFist, Hero.Orisa],
                },
            ],
        },
        {
            teams: {
                A: {
                    players: [
                        Player.Eileen,
                        Player.ShowCheng,
                        Player.Lengsa,
                        Player.Kaneki,
                        Player.MoLanran,
                    ],
                },
                B: {
                    players: [
                        Player.Farway1987,
                        Player.Diya,
                        Player.GA9A,
                        Player.Jimmy,
                        Player.Ameng,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMap.Nepal,
                    A: 1,
                    B: 2,
                    ban: [Hero.DoomFist, Hero.Orisa, Hero.Kiriko, Hero.Sojourn],
                    protect: [Hero.Ana, Hero.Lucio],
                },
                {
                    map: GameMap.NewQueenStreet,
                    A: 1,
                    B: 0,
                    ban: [Hero.DoomFist, Hero.Ana, Hero.Zenyatta, Hero.Orisa],
                    protect: [Hero.Sojourn, Hero.Sigma],
                },
                {
                    map: GameMap.CircuitRoyal,
                    A: 2,
                    B: 1,
                    ban: [Hero.Sigma, Hero.WidowMaker, Hero.Genji, Hero.Ana],
                    protect: [Hero.Sojourn, Hero.DoomFist],
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
                        Player.Kyo,
                        Player.MoLanran,
                    ],
                },
                B: {
                    players: [
                        Player.Lengsa,
                        Player.Coldest,
                        Player.GA9A,
                        Player.Ameng,
                        Player.Jimmy,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMap.Oasis,
                    A: 0,
                    B: 2,
                    ban: [Hero.DoomFist, Hero.Lucio, Hero.Kiriko, Hero.Winston],
                    protect: [Hero.Zenyatta, Hero.Genji],
                },
                {
                    map: GameMap.Paraiso,
                    A: 2,
                    B: 3,
                    ban: [Hero.Kiriko, Hero.Winston, Hero.Genji, Hero.Sojourn],
                    protect: [Hero.Ana, Hero.Zarya],
                },
            ],
        },
    ],
};
