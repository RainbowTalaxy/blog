import { GameMap } from './Map';
import { Player } from './Player';

export const Match = [
    {
        date: '2022/11/18',
        matchs: [
            {
                teams: {
                    A: {
                        players: [
                            Player.Coldest,
                            Player.Lengsa,
                            Player.JinMu,
                            Player.ShowCheng,
                            Player.Ameng,
                        ],
                    },
                    B: {
                        players: [
                            Player.Farway1987,
                            Player.Kaneki,
                            Player.MoLanran,
                            Player.Eileen,
                            Player.GA9A,
                        ],
                    },
                },
                rounds: [
                    {
                        map: GameMap.BlizzardWorld,
                        A: 2,
                        B: 1,
                    },
                    {
                        map: GameMap.LijiangTower,
                        A: 0,
                        B: 2,
                    },
                    {
                        map: GameMap.Rialto,
                        A: 1,
                        B: 3,
                    },
                ],
            },
            {
                teams: {
                    A: {
                        players: [
                            Player.Kaneki,
                            Player.Farway1987,
                            Player.JinMu,
                            Player.MoLanran,
                            Player.Ameng,
                        ],
                    },
                    B: {
                        players: [
                            Player.ShowCheng,
                            Player.GA9A,
                            Player.Eileen,
                            Player.Coldest,
                            Player.Lengsa,
                        ],
                    },
                },
                rounds: [
                    {
                        map: GameMap.Nepal,
                        A: 1,
                        B: 2,
                    },
                    {
                        map: GameMap.KingsRow,
                        A: 3,
                        B: 4,
                    },
                ],
            },
            {
                teams: {
                    A: {
                        players: [
                            Player.Eileen,
                            Player.ShowCheng,
                            Player.JinMu,
                            Player.Coldest,
                            Player.Ameng,
                        ],
                    },
                    B: {
                        players: [
                            Player.Kaneki,
                            Player.GA9A,
                            Player.Farway1987,
                            Player.MoLanran,
                            Player.Lengsa,
                        ],
                    },
                },
                rounds: [
                    {
                        map: GameMap.Busan,
                        A: 0,
                        B: 2,
                    },
                    {
                        map: GameMap.Junkertown,
                        A: 1,
                        B: 0,
                    },
                    {
                        map: GameMap.Paraiso,
                        A: 3,
                        B: 2,
                    },
                ],
            },
        ],
    },
];
