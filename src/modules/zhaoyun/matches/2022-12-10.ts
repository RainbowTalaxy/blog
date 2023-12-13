import { HeroName } from '../../../constants/zhaoyun/Hero';
import { GameMapName } from '../../../constants/zhaoyun/Map';
import { Player } from '../../../constants/zhaoyun/Player';

export default {
    date: '2022/12/10',
    matches: [
        {
            teams: {
                A: {
                    players: [
                        Player.Kaneki,
                        Player.Jimmy,
                        Player.GA9A,
                        Player.JinMu,
                        Player.Kyo,
                    ],
                },
                B: {
                    players: [
                        Player.Farway1987,
                        Player.Pineapple,
                        Player.Lengsa,
                        Player.Diya,
                        Player.Ameng,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMapName.LijiangTower,
                    A: 1,
                    B: 2,
                    ban: [
                        HeroName.Winston,
                        HeroName.Tracer,
                        HeroName.DoomFist,
                        HeroName.Lucio,
                    ],
                    protect: [HeroName.Kiriko, HeroName.Pharah],
                },
                {
                    map: GameMapName.Colosseo,
                    A: 0,
                    B: 1,
                    ban: [
                        HeroName.DoomFist,
                        HeroName.Orisa,
                        HeroName.Genji,
                        HeroName.Tracer,
                    ],
                    protect: [HeroName.Ana, HeroName.Kiriko],
                },
                {
                    map: GameMapName.KingsRow,
                    A: 4,
                    B: 3,
                    ban: [
                        HeroName.Winston,
                        HeroName.Lucio,
                        HeroName.Zenyatta,
                        HeroName.Tracer,
                    ],
                    protect: [HeroName.Orisa, HeroName.Genji],
                },
                {
                    map: GameMapName.Junkertown,
                    A: 2,
                    B: 3,
                    ban: [
                        HeroName.Sojourn,
                        HeroName.DoomFist,
                        HeroName.Mei,
                        HeroName.WreckingBall,
                    ],
                    protect: [HeroName.Kiriko, HeroName.Tracer],
                },
            ],
        },
    ],
};
