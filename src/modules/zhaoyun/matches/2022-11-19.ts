import { HeroName } from '../../../constants/zhaoyun/Hero';
import { GameMapName } from '../../../constants/zhaoyun/Map';
import { Player } from '../../../constants/zhaoyun/Player';

export default {
    date: '2022/11/19',
    matches: [
        {
            teams: {
                A: {
                    players: [
                        Player.Kaneki,
                        Player.GA9A,
                        Player.Lengsa,
                        Player.Eileen,
                        Player.ShowCheng,
                    ],
                },
                B: {
                    players: [
                        Player.Farway1987,
                        Player.Ameng,
                        Player.JinMu,
                        Player.MoLanran,
                        Player.MinSea,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMapName.LijiangTower,
                    A: 1,
                    B: 2,
                    ban: [
                        HeroName.Sojourn,
                        HeroName.Pharah,
                        HeroName.Lucio,
                        HeroName.WreckingBall,
                    ],
                },
                {
                    map: GameMapName.Numbani,
                    A: 0,
                    B: 3,
                    ban: [
                        HeroName.Sombra,
                        HeroName.Sojourn,
                        HeroName.Lucio,
                        HeroName.Echo,
                    ],
                },
                {
                    map: GameMapName.Junkertown,
                    A: 2,
                    B: 1,
                    ban: [
                        HeroName.Genji,
                        HeroName.Sojourn,
                        HeroName.Sombra,
                        HeroName.WidowMaker,
                    ],
                },
                {
                    map: GameMapName.TempleOfAnubis,
                    A: 0,
                    B: 2,
                    ban: [
                        HeroName.Sombra,
                        HeroName.Sojourn,
                        HeroName.Ashe,
                        HeroName.Echo,
                    ],
                },
            ],
        },
        {
            teams: {
                A: {
                    players: [
                        Player.JinMu,
                        Player.Ameng,
                        Player.Farway1987,
                        Player.GA9A,
                        Player.Kaneki,
                    ],
                },
                B: {
                    players: [
                        Player.MoLanran,
                        Player.Eileen,
                        Player.ShowCheng,
                        Player.Lengsa,
                        Player.Kyo,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMapName.Oasis,
                    A: 2,
                    B: 1,
                    ban: [
                        HeroName.Ana,
                        HeroName.Lucio,
                        HeroName.Sombra,
                        HeroName.Kiriko,
                    ],
                    protect: [HeroName.Sojourn, HeroName.WreckingBall],
                },
                {
                    map: GameMapName.CircuitRoyal,
                    A: 4,
                    B: 3,
                    ban: [
                        HeroName.Sigma,
                        HeroName.Winston,
                        HeroName.Ana,
                        HeroName.Kiriko,
                    ],
                    protect: [HeroName.Genji, HeroName.Sojourn],
                },
                {
                    map: GameMapName.KingsRow,
                    A: 3,
                    B: 3,
                    ban: [
                        HeroName.Zarya,
                        HeroName.Winston,
                        HeroName.Mei,
                        HeroName.Genji,
                    ],
                    protect: [HeroName.Ana, HeroName.Lucio],
                },
                {
                    map: GameMapName.LijiangTower,
                    A: 1,
                    B: 2,
                    ban: [
                        HeroName.Sojourn,
                        HeroName.Genji,
                        HeroName.Ana,
                        HeroName.Sombra,
                    ],
                    protect: [HeroName.Winston, HeroName.Pharah],
                },
                {
                    map: GameMapName.Nepal,
                    A: 1,
                    B: 2,
                    ban: [
                        HeroName.Genji,
                        HeroName.Zarya,
                        HeroName.Tracer,
                        HeroName.Lucio,
                    ],
                    protect: [HeroName.Sojourn, HeroName.Sombra],
                },
                {
                    map: GameMapName.Colosseo,
                    A: 0,
                    B: 1,
                    ban: [
                        HeroName.Genji,
                        HeroName.Kiriko,
                        HeroName.Ana,
                        HeroName.Lucio,
                    ],
                    protect: [HeroName.Sojourn, HeroName.Winston],
                },
            ],
        },
    ],
};
