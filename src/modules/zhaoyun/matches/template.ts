import { Hero } from '../../../constants/zhaoyun/Hero';
import { GameMap } from '../../../constants/zhaoyun/Map';
import { Player } from '../../../constants/zhaoyun/Player';

export default {
    date: '',
    matches: [
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
