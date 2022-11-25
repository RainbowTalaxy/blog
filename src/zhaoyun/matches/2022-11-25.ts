import { Hero } from '../Hero';
import { GameMap } from '../Map';
import { Player } from '../Player';

export default {
    date: '2022/11/25',
    matchs: [
        {
            teams: {
                A: {
                    players: [
                        Player.Lengsa,
                        Player.Diya,
                        Player.Ameng,
                        Player.Kyo,
                        Player.MoLanran,
                    ],
                },
                B: {
                    players: [
                        Player.JinMu,
                        Player.Jimmy,
                        Player.ShowCheng,
                        Player.Coldest,
                        Player.Eileen,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMap.LijiangTower,
                    A: 1,
                    B: 2,
                    ban: [Hero.Lucio, Hero.RoadHog, Hero.Mei, Hero.Zenyatta],
                    keep: [Hero.DoomFist, Hero.Orisa],
                },
                {
                    map: GameMap.Colosseo,
                    A: 0,
                    B: 1,
                    ban: [Hero.Lucio, Hero.Sigma, Hero.Mei, Hero.Tracer],
                    keep: [Hero.DoomFist, Hero.Orisa],
                },
            ],
        },
    ],
};
