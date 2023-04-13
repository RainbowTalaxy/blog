import { Hero } from '../Hero';
import { GameMap } from '../Map';
import { Player } from '../Player';

export default {
    date: '',
    matchs: [
        {
            teams: {
                A: {
                    players: [],
                },
                B: {
                    players: [],
                },
            },
            rounds: [
                {
                    map: GameMap.TBD,
                    A: 0,
                    B: 0,
                    ban: [Hero.TBD, Hero.TBD, Hero.TBD, Hero.TBD],
                    protect: [Hero.TBD, Hero.TBD],
                },
                {
                    map: GameMap.TBD,
                    A: 0,
                    B: 0,
                    ban: [Hero.TBD, Hero.TBD, Hero.TBD, Hero.TBD],
                    protect: [Hero.TBD, Hero.TBD],
                },
                {
                    map: GameMap.TBD,
                    A: 0,
                    B: 0,
                    ban: [Hero.TBD, Hero.TBD, Hero.TBD, Hero.TBD],
                    protect: [Hero.TBD, Hero.TBD],
                },
            ],
        },
    ],
};
