import { Hero } from '../Hero';
import { GameMap } from '../Map';
import { Player } from '../Player';

export default {
    date: '2022/11/26',
    matchs: [
        {
            teams: {
                A: {
                    players: [
                        Player.ShowCheng,
                        Player.GA9A,
                        Player.Farway1987,
                        Player.Diya,
                        Player.MoLanran,
                    ],
                },
                B: {
                    players: [
                        Player.Ameng,
                        Player.JinMu,
                        Player.Jimmy,
                        Player.Kyo,
                        Player.Lengsa,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMap.Nepal,
                    A: 2,
                    B: 0,
                    ban: [Hero.DoomFist, Hero.Orisa, Hero.Sombra, Hero.Genji],
                    keep: [Hero.Lucio, Hero.Ana],
                },
                {
                    map: GameMap.Havana,
                    A: 3,
                    B: 2,
                    ban: [Hero.Genji, Hero.Sigma, Hero.Mei, Hero.DoomFist],
                    keep: [Hero.Zenyatta, Hero.Orisa],
                },
            ],
        },
    ],
};
