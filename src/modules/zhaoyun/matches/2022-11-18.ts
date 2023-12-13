import { HeroName } from '../../../constants/zhaoyun/Hero';
import { GameMapName } from '../../../constants/zhaoyun/Map';
import { Player } from '../../../constants/zhaoyun/Player';

export default {
    date: '2022/11/18',
    matches: [
        {
            teams: {
                A: {
                    players: [
                        Player.Coldest,
                        Player.ShowCheng,
                        Player.JinMu,
                        Player.Lengsa,
                        Player.Ameng,
                    ],
                },
                B: {
                    players: [
                        Player.Farway1987,
                        Player.Kaneki,
                        Player.GA9A,
                        Player.MoLanran,
                        Player.Eileen,
                    ],
                },
            },
            rounds: [
                {
                    map: GameMapName.BlizzardWorld,
                    A: 2,
                    B: 1,
                    ban: [
                        HeroName.WreckingBall,
                        HeroName.Sojourn,
                        HeroName.Zarya,
                        HeroName.Genji,
                    ],
                },
                {
                    map: GameMapName.LijiangTower,
                    A: 0,
                    B: 2,
                    ban: [
                        HeroName.WreckingBall,
                        HeroName.Pharah,
                        HeroName.Zarya,
                        HeroName.Lucio,
                    ],
                },
                {
                    map: GameMapName.Rialto,
                    A: 1,
                    B: 3,
                    ban: [
                        HeroName.WreckingBall,
                        HeroName.Sojourn,
                        HeroName.Winston,
                        HeroName.DVA,
                    ],
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
                    map: GameMapName.Nepal,
                    A: 1,
                    B: 2,
                    ban: [
                        HeroName.WreckingBall,
                        HeroName.Kiriko,
                        HeroName.Winston,
                        HeroName.Lucio,
                    ],
                },
                {
                    map: GameMapName.KingsRow,
                    A: 3,
                    B: 4,
                    ban: [
                        HeroName.WreckingBall,
                        HeroName.Mei,
                        HeroName.Zarya,
                        HeroName.Lucio,
                    ],
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
                    map: GameMapName.Busan,
                    A: 0,
                    B: 2,
                    ban: [
                        HeroName.DoomFist,
                        HeroName.Sojourn,
                        HeroName.Soldier,
                        HeroName.Genji,
                    ],
                },
                {
                    map: GameMapName.Junkertown,
                    A: 1,
                    B: 0,
                    ban: [
                        HeroName.Sombra,
                        HeroName.Sojourn,
                        HeroName.Tracer,
                        HeroName.WidowMaker,
                    ],
                },
                {
                    map: GameMapName.Paraiso,
                    A: 3,
                    B: 2,
                    ban: [
                        HeroName.Ashe,
                        HeroName.Sojourn,
                        HeroName.Winston,
                        HeroName.Lucio,
                    ],
                },
            ],
        },
    ],
};
