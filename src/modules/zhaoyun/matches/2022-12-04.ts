import { HeroName } from '../../../constants/zhaoyun/Hero';
import { GameMapName } from '../../../constants/zhaoyun/Map';
import { Player } from '../../../constants/zhaoyun/Player';

export default {
    date: '2022/12/04',
    matches: [
        {
            teams: {
                A: {
                    players: [
                        Player.Kaneki,
                        Player.Jimmy,
                        Player.Lengsa,
                        Player.Farway1987,
                        Player.Ameng,
                    ],
                },
                B: {
                    players: [
                        Player.Superich,
                        Player.Diya,
                        Player.Pineapple,
                        Player.GA9A,
                        Player.JinMu,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMapName.Busan,
                    A: 2,
                    B: 1,
                    ban: [
                        HeroName.Orisa,
                        HeroName.Kiriko,
                        HeroName.TBD,
                        HeroName.Winston,
                    ],
                    protect: [HeroName.Tracer, HeroName.Ana],
                },
                {
                    map: GameMapName.Hollywood,
                    A: 5,
                    B: 4,
                    ban: [
                        HeroName.Zenyatta,
                        HeroName.Ana,
                        HeroName.Pharah,
                        HeroName.WidowMaker,
                    ],
                    protect: [HeroName.Mei, HeroName.Winston],
                },
            ],
        },
        {
            teams: {
                A: {
                    players: [
                        Player.Diya,
                        Player.GA9A,
                        Player.Lengsa,
                        Player.Kaneki,
                        Player.Pineapple,
                    ],
                },
                B: {
                    players: [
                        Player.Jimmy,
                        Player.JinMu,
                        Player.Farway1987,
                        Player.Superich,
                        Player.Ameng,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMapName.Nepal,
                    A: 2,
                    B: 1,
                    ban: [
                        HeroName.Winston,
                        HeroName.Orisa,
                        HeroName.Echo,
                        HeroName.Ana,
                    ],
                    protect: [HeroName.Pharah, HeroName.Kiriko],
                },
                {
                    map: GameMapName.Junkertown,
                    A: 2,
                    B: 1,
                    ban: [
                        HeroName.Genji,
                        HeroName.Tracer,
                        HeroName.Ana,
                        HeroName.Kiriko,
                    ],
                    protect: [HeroName.Sigma, HeroName.Orisa],
                },
            ],
        },
    ],
};
