import { Hero } from '../Hero';
import { GameMap } from '../Map';
import { Player } from '../Player';

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
                    map: GameMap.LijiangTower,
                    A: 1,
                    B: 2,
                    ban: [Hero.Winston, Hero.Tracer, Hero.DoomFist, Hero.Lucio],
                    protect: [Hero.Kiriko, Hero.Pharah],
                },
                {
                    map: GameMap.Colosseo,
                    A: 0,
                    B: 1,
                    ban: [Hero.DoomFist, Hero.Orisa, Hero.Genji, Hero.Tracer],
                    protect: [Hero.Ana, Hero.Kiriko],
                },
                {
                    map: GameMap.KingsRow,
                    A: 4,
                    B: 3,
                    ban: [Hero.Winston, Hero.Lucio, Hero.Zenyatta, Hero.Tracer],
                    protect: [Hero.Orisa, Hero.Genji],
                },
                {
                    map: GameMap.Junkertown,
                    A: 2,
                    B: 3,
                    ban: [
                        Hero.Sojourn,
                        Hero.DoomFist,
                        Hero.Mei,
                        Hero.WreckingBall,
                    ],
                    protect: [Hero.Kiriko, Hero.Tracer],
                },
            ],
        },
    ],
};
