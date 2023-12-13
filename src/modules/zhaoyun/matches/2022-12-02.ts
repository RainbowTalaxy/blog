import { HeroName } from '../../../constants/zhaoyun/Hero';
import { GameMapName } from '../../../constants/zhaoyun/Map';
import { Player } from '../../../constants/zhaoyun/Player';

export default {
    date: '2022/12/02',
    matches: [
        {
            teams: {
                A: {
                    players: [
                        Player.Ameng,
                        Player.Jimmy,
                        Player.JinMu,
                        Player.Lengsa,
                        Player.Kyo,
                    ],
                },
                B: {
                    players: [
                        Player.Kaneki,
                        Player.Diya,
                        Player.Farway1987,
                        Player.GA9A,
                        Player.Nisha,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMapName.LijiangTower,
                    A: 2,
                    B: 1,
                    ban: [
                        HeroName.Orisa,
                        HeroName.Ana,
                        HeroName.DVA,
                        HeroName.Zenyatta,
                    ],
                    protect: [HeroName.Winston, HeroName.Kiriko],
                },
                {
                    map: GameMapName.Hollywood,
                    A: 4,
                    B: 5,
                    ban: [
                        HeroName.Zenyatta,
                        HeroName.Kiriko,
                        HeroName.Tracer,
                        HeroName.Genji,
                    ],
                    protect: [HeroName.Orisa, HeroName.Winston],
                },
                {
                    map: GameMapName.KingsRow,
                    A: 1,
                    B: 3,
                    ban: [
                        HeroName.RoadHog,
                        HeroName.Ana,
                        HeroName.Winston,
                        HeroName.Lucio,
                    ],
                    protect: [HeroName.Kiriko, HeroName.Zenyatta],
                },
                {
                    map: GameMapName.Colosseo,
                    A: 1,
                    B: 0,
                    ban: [
                        HeroName.Kiriko,
                        HeroName.Mercy,
                        HeroName.Sombra,
                        HeroName.Reaper,
                    ],
                    protect: [HeroName.Winston, HeroName.Orisa],
                },
                {
                    map: GameMapName.Oasis,
                    A: 2,
                    B: 0,
                    ban: [
                        HeroName.Ana,
                        HeroName.Orisa,
                        HeroName.Zenyatta,
                        HeroName.RoadHog,
                    ],
                    protect: [HeroName.Lucio, HeroName.Winston],
                },
            ],
        },
    ],
};
