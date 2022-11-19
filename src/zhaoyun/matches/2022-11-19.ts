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
    ],
};
