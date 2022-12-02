import { Hero } from '../Hero';
import { GameMap } from '../Map';
import { Player } from '../Player';

export default {
    date: '2022/12/02',
    matchs: [
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
                    map: GameMap.LijiangTower,
                    A: 2,
                    B: 1,
                    ban: [Hero.Orisa, Hero.Ana, Hero.DVA, Hero.Zenyatta],
                    protect: [Hero.Winston, Hero.Kiriko],
                },
                {
                    map: GameMap.Hollywood,
                    A: 4,
                    B: 5,
                    ban: [Hero.Zenyatta, Hero.Kiriko, Hero.Tracer, Hero.Genji],
                    protect: [Hero.Orisa, Hero.Winston],
                },
                {
                    map: GameMap.KingsRow,
                    A: 2,
                    B: 3,
                    ban: [Hero.RoadHog, Hero.Ana, Hero.Winston, Hero.Lucio],
                    protect: [Hero.Kiriko, Hero.Zenyatta],
                },
                {
                    map: GameMap.Colosseo,
                    A: 1,
                    B: 0,
                    ban: [Hero.Kiriko, Hero.Mercy, Hero.Sombra, Hero.Reaper],
                    protect: [Hero.Winston, Hero.Orisa],
                },
                {
                    map: GameMap.Oasis,
                    A: 2,
                    B: 0,
                    ban: [Hero.Ana, Hero.Orisa, Hero.Zenyatta, Hero.RoadHog],
                    protect: [Hero.Lucio, Hero.Winston],
                },
            ],
        },
    ],
};
