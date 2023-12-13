import { HeroName } from '../../../constants/zhaoyun/Hero';
import { GameMapName } from '../../../constants/zhaoyun/Map';
import { Player } from '../../../constants/zhaoyun/Player';

export default {
    date: '2022/11/26',
    matches: [
        {
            teams: {
                A: {
                    players: [
                        Player.ShowCheng,
                        Player.GA9A,
                        Player.Farway1987,
                        Player.Diya,
                        Player.MoLanran,
                    ],
                },
                B: {
                    players: [
                        Player.Ameng,
                        Player.JinMu,
                        Player.Jimmy,
                        Player.Kyo,
                        Player.Lengsa,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMapName.Nepal,
                    A: 2,
                    B: 0,
                    ban: [
                        HeroName.DoomFist,
                        HeroName.Orisa,
                        HeroName.Sombra,
                        HeroName.Genji,
                    ],
                    protect: [HeroName.Lucio, HeroName.Ana],
                },
                {
                    map: GameMapName.Havana,
                    A: 3,
                    B: 2,
                    ban: [
                        HeroName.Genji,
                        HeroName.Sigma,
                        HeroName.Mei,
                        HeroName.DoomFist,
                    ],
                    protect: [HeroName.Zenyatta, HeroName.Orisa],
                },
                {
                    map: GameMapName.KingsRow,
                    A: 1,
                    B: 3,
                    ban: [
                        HeroName.Genji,
                        HeroName.DoomFist,
                        HeroName.Mei,
                        HeroName.DVA,
                    ],
                    protect: [HeroName.Ana, HeroName.Kiriko],
                },
                {
                    map: GameMapName.NewQueenStreet,
                    A: 0,
                    B: 1,
                    ban: [
                        HeroName.DoomFist,
                        HeroName.Orisa,
                        HeroName.Tracer,
                        HeroName.Kiriko,
                    ],
                    protect: [HeroName.Genji, HeroName.Ana],
                },
                {
                    map: GameMapName.LijiangTower,
                    A: 1,
                    B: 2,
                    ban: [
                        HeroName.DoomFist,
                        HeroName.Orisa,
                        HeroName.Tracer,
                        HeroName.Lucio,
                    ],
                    protect: [HeroName.Echo, HeroName.Ana],
                },
            ],
        },
    ],
};
