import { Hero } from '../Hero';
import { GameMap } from '../Map';
import { Player } from '../Player';

export default {
    date: '2022/11/27',
    matches: [
        {
            teams: {
                A: {
                    players: [
                        Player.JinMu,
                        Player.Lengsa,
                        Player.Diya,
                        Player.ShowCheng,
                        Player.Coldest,
                    ],
                },
                B: {
                    players: [
                        Player.Kyo,
                        Player.Farway1987,
                        Player.Ameng,
                        Player.Eileen,
                        Player.MoLanran,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMap.LijiangTower,
                    A: 2,
                    B: 0,
                    ban: [
                        Hero.DoomFist,
                        Hero.Orisa,
                        Hero.Brigitte,
                        Hero.Sombra,
                    ],
                    protect: [Hero.Tracer, Hero.Lucio],
                },
                {
                    map: GameMap.KingsRow,
                    A: 2,
                    B: 1,
                    ban: [Hero.Ana, Hero.Lucio, Hero.Tracer, Hero.Genji],
                    protect: [Hero.DoomFist, Hero.Orisa],
                },
            ],
        },
        {
            teams: {
                A: {
                    players: [
                        Player.Kyo,
                        Player.Lengsa,
                        Player.Jimmy,
                        Player.MoLanran,
                        Player.Eileen,
                    ],
                },
                B: {
                    players: [
                        Player.GA9A,
                        Player.Diya,
                        Player.Superich,
                        Player.Coldest,
                        Player.ShowCheng,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMap.Oasis,
                    A: 0,
                    B: 2,
                    ban: [Hero.Kiriko, Hero.DoomFist, Hero.Genji, Hero.Winston],
                    protect: [Hero.Lucio, Hero.Tracer],
                },
                {
                    map: GameMap.CircuitRoyal,
                    A: 2,
                    B: 3,
                    ban: [Hero.WidowMaker, Hero.Sigma, Hero.Baptiste, Hero.Mei],
                    protect: [Hero.Genji, Hero.Zenyatta],
                },
            ],
        },
    ],
};
