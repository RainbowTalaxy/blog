import { HeroName } from '../../../constants/zhaoyun/Hero';
import { GameMapName } from '../../../constants/zhaoyun/Map';
import { Player } from '../../../constants/zhaoyun/Player';

export default {
    date: '2022/11/20',
    matches: [
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
                    map: GameMapName.LijiangTower,
                    A: 2,
                    B: 0,
                    ban: [
                        HeroName.Genji,
                        HeroName.Ana,
                        HeroName.Tracer,
                        HeroName.Kiriko,
                    ],
                    protect: [HeroName.Sojourn, HeroName.Sombra],
                },
                {
                    map: GameMapName.CircuitRoyal,
                    A: 2,
                    B: 1,
                    ban: [
                        HeroName.Sojourn,
                        HeroName.Sigma,
                        HeroName.Zenyatta,
                        HeroName.Zarya,
                    ],
                    protect: [HeroName.Genji, HeroName.WidowMaker],
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
                    map: GameMapName.Oasis,
                    A: 1,
                    B: 2,
                    ban: [
                        HeroName.Sojourn,
                        HeroName.Lucio,
                        HeroName.Sigma,
                        HeroName.Winston,
                    ],
                    protect: [HeroName.Ana, HeroName.Ashe],
                },
                {
                    map: GameMapName.Junkertown,
                    A: 2,
                    B: 3,
                    ban: [
                        HeroName.Sigma,
                        HeroName.Sombra,
                        HeroName.Zenyatta,
                        HeroName.Lucio,
                    ],
                    protect: [HeroName.WreckingBall, HeroName.Sojourn],
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
                    map: GameMapName.Busan,
                    A: 0,
                    B: 2,
                    ban: [
                        HeroName.Ana,
                        HeroName.Sojourn,
                        HeroName.Zenyatta,
                        HeroName.Genji,
                    ],
                    protect: [HeroName.Lucio, HeroName.DoomFist],
                },
                {
                    map: GameMapName.Numbani,
                    A: 0,
                    B: 3,
                    ban: [
                        HeroName.Winston,
                        HeroName.Genji,
                        HeroName.Sigma,
                        HeroName.Lucio,
                    ],
                    protect: [HeroName.Sojourn, HeroName.Ana],
                },
            ],
        },
    ],
};
