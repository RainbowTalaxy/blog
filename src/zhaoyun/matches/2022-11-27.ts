import { Hero } from '../Hero';
import { GameMap } from '../Map';
import { Player } from '../Player';

export default {
    date: '2022/11/27',
    matchs: [
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
                    keep: [Hero.Tracer, Hero.Lucio],
                },
                {
                    map: GameMap.KingsRow,
                    A: 2,
                    B: 1,
                    ban: [Hero.Ana, Hero.Lucio, Hero.Tracer, Hero.Genji],
                    keep: [Hero.DoomFist, Hero.Orisa],
                },
            ],
        },
    ],
};
