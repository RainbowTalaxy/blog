import { HeroName } from '../../../constants/zhaoyun/Hero';
import { GameMapName } from '../../../constants/zhaoyun/Map';
import { Player } from '../../../constants/zhaoyun/Player';

export default {
    date: '2022/11/27',
    matches: [
        {
            teams: {
                A: {
                    players: [
                        Player.JinMu,
                        Player.Lengsa,
                        Player.Diya,
                        Player.ShowCheng,
                        Player.Coldest,
                    ],
                },
                B: {
                    players: [
                        Player.Kyo,
                        Player.Farway1987,
                        Player.Ameng,
                        Player.Eileen,
                        Player.MoLanran,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMapName.LijiangTower,
                    A: 2,
                    B: 0,
                    ban: [
                        HeroName.DoomFist,
                        HeroName.Orisa,
                        HeroName.Brigitte,
                        HeroName.Sombra,
                    ],
                    protect: [HeroName.Tracer, HeroName.Lucio],
                },
                {
                    map: GameMapName.KingsRow,
                    A: 2,
                    B: 1,
                    ban: [
                        HeroName.Ana,
                        HeroName.Lucio,
                        HeroName.Tracer,
                        HeroName.Genji,
                    ],
                    protect: [HeroName.DoomFist, HeroName.Orisa],
                },
            ],
        },
        {
            teams: {
                A: {
                    players: [
                        Player.Kyo,
                        Player.Lengsa,
                        Player.Jimmy,
                        Player.MoLanran,
                        Player.Eileen,
                    ],
                },
                B: {
                    players: [
                        Player.GA9A,
                        Player.Diya,
                        Player.Superich,
                        Player.Coldest,
                        Player.ShowCheng,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMapName.Oasis,
                    A: 0,
                    B: 2,
                    ban: [
                        HeroName.Kiriko,
                        HeroName.DoomFist,
                        HeroName.Genji,
                        HeroName.Winston,
                    ],
                    protect: [HeroName.Lucio, HeroName.Tracer],
                },
                {
                    map: GameMapName.CircuitRoyal,
                    A: 2,
                    B: 3,
                    ban: [
                        HeroName.WidowMaker,
                        HeroName.Sigma,
                        HeroName.Baptiste,
                        HeroName.Mei,
                    ],
                    protect: [HeroName.Genji, HeroName.Zenyatta],
                },
            ],
        },
    ],
};
