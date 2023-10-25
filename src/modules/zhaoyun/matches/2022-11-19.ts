import { Hero } from '../Hero';
import { GameMap } from '../Map';
import { Player } from '../Player';

export default {
    date: '2022/11/19',
    matches: [
        {
            teams: {
                A: {
                    players: [
                        Player.Kaneki,
                        Player.GA9A,
                        Player.Lengsa,
                        Player.Eileen,
                        Player.ShowCheng,
                    ],
                },
                B: {
                    players: [
                        Player.Farway1987,
                        Player.Ameng,
                        Player.JinMu,
                        Player.MoLanran,
                        Player.MinSea,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMap.LijiangTower,
                    A: 1,
                    B: 2,
                    ban: [
                        Hero.Sojourn,
                        Hero.Pharah,
                        Hero.Lucio,
                        Hero.WreckingBall,
                    ],
                },
                {
                    map: GameMap.Numbani,
                    A: 0,
                    B: 3,
                    ban: [Hero.Sombra, Hero.Sojourn, Hero.Lucio, Hero.Echo],
                },
                {
                    map: GameMap.Junkertown,
                    A: 2,
                    B: 1,
                    ban: [
                        Hero.Genji,
                        Hero.Sojourn,
                        Hero.Sombra,
                        Hero.WidowMaker,
                    ],
                },
                {
                    map: GameMap.TempleOfAnubis,
                    A: 0,
                    B: 2,
                    ban: [Hero.Sombra, Hero.Sojourn, Hero.Ashe, Hero.Echo],
                },
            ],
        },
        {
            teams: {
                A: {
                    players: [
                        Player.JinMu,
                        Player.Ameng,
                        Player.Farway1987,
                        Player.GA9A,
                        Player.Kaneki,
                    ],
                },
                B: {
                    players: [
                        Player.MoLanran,
                        Player.Eileen,
                        Player.ShowCheng,
                        Player.Lengsa,
                        Player.Kyo,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMap.Oasis,
                    A: 2,
                    B: 1,
                    ban: [Hero.Ana, Hero.Lucio, Hero.Sombra, Hero.Kiriko],
                    protect: [Hero.Sojourn, Hero.WreckingBall],
                },
                {
                    map: GameMap.CircuitRoyal,
                    A: 4,
                    B: 3,
                    ban: [Hero.Sigma, Hero.Winston, Hero.Ana, Hero.Kiriko],
                    protect: [Hero.Genji, Hero.Sojourn],
                },
                {
                    map: GameMap.KingsRow,
                    A: 3,
                    B: 3,
                    ban: [Hero.Zarya, Hero.Winston, Hero.Mei, Hero.Genji],
                    protect: [Hero.Ana, Hero.Lucio],
                },
                {
                    map: GameMap.LijiangTower,
                    A: 1,
                    B: 2,
                    ban: [Hero.Sojourn, Hero.Genji, Hero.Ana, Hero.Sombra],
                    protect: [Hero.Winston, Hero.Pharah],
                },
                {
                    map: GameMap.Nepal,
                    A: 1,
                    B: 2,
                    ban: [Hero.Genji, Hero.Zarya, Hero.Tracer, Hero.Lucio],
                    protect: [Hero.Sojourn, Hero.Sombra],
                },
                {
                    map: GameMap.Colosseo,
                    A: 0,
                    B: 1,
                    ban: [Hero.Genji, Hero.Kiriko, Hero.Ana, Hero.Lucio],
                    protect: [Hero.Sojourn, Hero.Winston],
                },
            ],
        },
    ],
};
