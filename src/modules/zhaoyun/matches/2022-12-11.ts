import { HeroName } from '../../../constants/zhaoyun/Hero';
import { GameMapName } from '../../../constants/zhaoyun/Map';
import { Player } from '../../../constants/zhaoyun/Player';

export default {
    date: '2022/12/11',
    matches: [
        {
            teams: {
                A: {
                    players: [
                        Player.Molly,
                        Player.Ameng,
                        Player.Pineapple,
                        Player.JinMu,
                        Player.Kyo,
                    ],
                },
                B: {
                    players: [
                        Player.Diya,
                        Player.Lengsa,
                        Player.Farway1987,
                        Player.Jimmy,
                        Player.Apr1ta,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMapName.Oasis,
                    A: 2,
                    B: 1,
                    ban: [
                        HeroName.Orisa,
                        HeroName.Ana,
                        HeroName.RoadHog,
                        HeroName.Kiriko,
                    ],
                    protect: [HeroName.Sojourn, HeroName.Tracer],
                },
                {
                    map: GameMapName.Junkertown,
                    A: 1,
                    B: 3,
                    ban: [
                        HeroName.WidowMaker,
                        HeroName.Genji,
                        HeroName.Zenyatta,
                        HeroName.Brigitte,
                    ],
                    protect: [HeroName.Orisa, HeroName.Sigma],
                },
                {
                    map: GameMapName.Colosseo,
                    A: 0,
                    B: 1,
                    ban: [
                        HeroName.Orisa,
                        HeroName.Ana,
                        HeroName.Kiriko,
                        HeroName.Hanzo,
                    ],
                    protect: [HeroName.Tracer, HeroName.Mei],
                },
                {
                    map: GameMapName.TempleOfAnubis,
                    A: 2,
                    B: 1,
                    ban: [
                        HeroName.Genji,
                        HeroName.Lucio,
                        HeroName.Kiriko,
                        HeroName.WidowMaker,
                    ],
                    protect: [HeroName.Ana, HeroName.Orisa],
                },
                {
                    map: GameMapName.Busan,
                    A: 0,
                    B: 2,
                    ban: [
                        HeroName.RoadHog,
                        HeroName.Orisa,
                        HeroName.Lucio,
                        HeroName.Kiriko,
                    ],
                    protect: [HeroName.Tracer, HeroName.Ana],
                },
            ],
        },
    ],
};
