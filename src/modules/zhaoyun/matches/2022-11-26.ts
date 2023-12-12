import { Hero } from '../../../constants/zhaoyun/Hero';
import { GameMap } from '../../../constants/zhaoyun/Map';
import { Player } from '../../../constants/zhaoyun/Player';

export default {
    date: '2022/11/26',
    matches: [
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
                    protect: [Hero.Lucio, Hero.Ana],
                },
                {
                    map: GameMap.Havana,
                    A: 3,
                    B: 2,
                    ban: [Hero.Genji, Hero.Sigma, Hero.Mei, Hero.DoomFist],
                    protect: [Hero.Zenyatta, Hero.Orisa],
                },
                {
                    map: GameMap.KingsRow,
                    A: 1,
                    B: 3,
                    ban: [Hero.Genji, Hero.DoomFist, Hero.Mei, Hero.DVA],
                    protect: [Hero.Ana, Hero.Kiriko],
                },
                {
                    map: GameMap.NewQueenStreet,
                    A: 0,
                    B: 1,
                    ban: [Hero.DoomFist, Hero.Orisa, Hero.Tracer, Hero.Kiriko],
                    protect: [Hero.Genji, Hero.Ana],
                },
                {
                    map: GameMap.LijiangTower,
                    A: 1,
                    B: 2,
                    ban: [Hero.DoomFist, Hero.Orisa, Hero.Tracer, Hero.Lucio],
                    protect: [Hero.Echo, Hero.Ana],
                },
            ],
        },
    ],
};
