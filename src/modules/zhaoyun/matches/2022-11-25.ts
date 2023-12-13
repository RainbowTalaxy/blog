import { HeroName } from '../../../constants/zhaoyun/Hero';
import { GameMapName } from '../../../constants/zhaoyun/Map';
import { Player } from '../../../constants/zhaoyun/Player';

export default {
    date: '2022/11/25',
    matches: [
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
                    map: GameMapName.LijiangTower,
                    A: 1,
                    B: 2,
                    ban: [
                        HeroName.Lucio,
                        HeroName.RoadHog,
                        HeroName.Mei,
                        HeroName.Zenyatta,
                    ],
                    protect: [HeroName.DoomFist, HeroName.Orisa],
                },
                {
                    map: GameMapName.Colosseo,
                    A: 0,
                    B: 1,
                    ban: [
                        HeroName.Lucio,
                        HeroName.Sigma,
                        HeroName.Mei,
                        HeroName.Tracer,
                    ],
                    protect: [HeroName.DoomFist, HeroName.Orisa],
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
                    map: GameMapName.Nepal,
                    A: 1,
                    B: 2,
                    ban: [
                        HeroName.DoomFist,
                        HeroName.Orisa,
                        HeroName.Kiriko,
                        HeroName.Sojourn,
                    ],
                    protect: [HeroName.Ana, HeroName.Lucio],
                },
                {
                    map: GameMapName.NewQueenStreet,
                    A: 1,
                    B: 0,
                    ban: [
                        HeroName.DoomFist,
                        HeroName.Ana,
                        HeroName.Zenyatta,
                        HeroName.Orisa,
                    ],
                    protect: [HeroName.Sojourn, HeroName.Sigma],
                },
                {
                    map: GameMapName.CircuitRoyal,
                    A: 2,
                    B: 1,
                    ban: [
                        HeroName.Sigma,
                        HeroName.WidowMaker,
                        HeroName.Genji,
                        HeroName.Ana,
                    ],
                    protect: [HeroName.Sojourn, HeroName.DoomFist],
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
                    map: GameMapName.Oasis,
                    A: 0,
                    B: 2,
                    ban: [
                        HeroName.DoomFist,
                        HeroName.Lucio,
                        HeroName.Kiriko,
                        HeroName.Winston,
                    ],
                    protect: [HeroName.Zenyatta, HeroName.Genji],
                },
                {
                    map: GameMapName.Paraiso,
                    A: 2,
                    B: 3,
                    ban: [
                        HeroName.Kiriko,
                        HeroName.Winston,
                        HeroName.Genji,
                        HeroName.Sojourn,
                    ],
                    protect: [HeroName.Ana, HeroName.Zarya],
                },
            ],
        },
    ],
};
