import { Hero } from '../Hero';
import { GameMap } from '../Map';
import { Player } from '../Player';

export default {
    date: '2022/12/04',
    matchs: [
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
                    map: GameMap.Busan,
                    A: 2,
                    B: 1,
                    ban: [Hero.Orisa, Hero.Kiriko, Hero.TBD, Hero.Winston],
                    protect: [Hero.Tracer, Hero.Ana],
                },
                {
                    map: GameMap.Hollywood,
                    A: 5,
                    B: 4,
                    ban: [
                        Hero.Zenyatta,
                        Hero.Ana,
                        Hero.Pharah,
                        Hero.WidowMaker,
                    ],
                    protect: [Hero.Mei, Hero.Winston],
                },
            ],
        },
    ],
};
