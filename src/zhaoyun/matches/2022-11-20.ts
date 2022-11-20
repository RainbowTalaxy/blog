import { Hero } from '../Hero';
import { GameMap } from '../Map';
import { Player } from '../Player';

export default {
    date: '2022/11/19',
    matchs: [
        {
            teams: {
                A: {
                    players: [
                        Player.GA9A,
                        Player.ShowCheng,
                        Player.JinMu,
                        Player.Kaneki,
                        Player.MoLanran,
                    ],
                },
                B: {
                    players: [
                        Player.Farway1987,
                        Player.Jimmy,
                        Player.Eileen,
                        Player.Kyo,
                        Player.Coldest,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMap.LijiangTower,
                    A: 2,
                    B: 0,
                    ban: [Hero.Genji, Hero.Ana, Hero.Tracer, Hero.Kiriko],
                    keep: [Hero.Sojourn, Hero.Sombra],
                },
                {
                    map: GameMap.CircuitRoyal,
                    A: 2,
                    B: 1,
                    ban: [Hero.Sojourn, Hero.Sigma, Hero.Zenyatta, Hero.Zarya],
                    keep: [Hero.Genji, Hero.WidowMaker],
                },
            ],
        },
    ],
};
