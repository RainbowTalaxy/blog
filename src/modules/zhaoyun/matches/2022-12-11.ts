import { Hero } from '../Hero';
import { GameMap } from '../Map';
import { Player } from '../Player';

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
                    map: GameMap.Oasis,
                    A: 2,
                    B: 1,
                    ban: [Hero.Orisa, Hero.Ana, Hero.RoadHog, Hero.Kiriko],
                    protect: [Hero.Sojourn, Hero.Tracer],
                },
                {
                    map: GameMap.Junkertown,
                    A: 1,
                    B: 3,
                    ban: [
                        Hero.WidowMaker,
                        Hero.Genji,
                        Hero.Zenyatta,
                        Hero.Brigitte,
                    ],
                    protect: [Hero.Orisa, Hero.Sigma],
                },
                {
                    map: GameMap.Colosseo,
                    A: 0,
                    B: 1,
                    ban: [Hero.Orisa, Hero.Ana, Hero.Kiriko, Hero.Hanzo],
                    protect: [Hero.Tracer, Hero.Mei],
                },
                {
                    map: GameMap.TempleOfAnubis,
                    A: 2,
                    B: 1,
                    ban: [Hero.Genji, Hero.Lucio, Hero.Kiriko, Hero.WidowMaker],
                    protect: [Hero.Ana, Hero.Orisa],
                },
                {
                    map: GameMap.Busan,
                    A: 0,
                    B: 2,
                    ban: [Hero.RoadHog, Hero.Orisa, Hero.Lucio, Hero.Kiriko],
                    protect: [Hero.Tracer, Hero.Ana],
                },
            ],
        },
    ],
};
