import { Hero } from './Hero';

export enum Player {
    Ameng = 'Ameng',
    Coldest = 'Coldest',
    Diya = 'Diya',
    Eileen = 'Eileen',
    Farway1987 = 'Farway1987',
    GA9A = 'GA9A',
    Jimmy = 'Jimmy',
    JinMu = 'JinMu',
    Kaneki = 'Kaneki',
    Kyo = 'Kyo',
    Lengsa = 'Lengsa',
    MinSea = 'MinSea',
    MoLanran = 'MoLanran',
    Nisha = 'Nisha',
    Pineapple = 'Pineapple',
    ShowCheng = 'ShowCheng',
    Superich = 'Superich',
}

export const PLAYER_DATA = {
    [Player.Ameng]: { name: 'Ameng', hero: Hero.WreckingBall },
    [Player.Coldest]: { name: 'Coldest', hero: Hero.Zenyatta },
    [Player.Diya]: { name: 'Diya', hero: Hero.WidowMaker },
    [Player.Eileen]: { name: 'Eileen', hero: Hero.Sombra },
    [Player.Farway1987]: { name: 'Farway1987', hero: Hero.Ana },
    [Player.GA9A]: { name: 'GA9A', hero: Hero.Reinhardt },
    [Player.Jimmy]: { name: 'Jimmy', hero: Hero.Sojourn },
    [Player.JinMu]: { name: 'JinMu', hero: Hero.Genji },
    [Player.Kaneki]: { name: 'Kaneki', hero: Hero.Tracer },
    [Player.Kyo]: { name: 'Kyo', hero: Hero.Kiriko },
    [Player.Lengsa]: { name: 'Lengsa', hero: Hero.Brigitte },
    [Player.MinSea]: { name: 'MinSea', hero: Hero.Mercy },
    [Player.MoLanran]: { name: 'MoLanran', hero: Hero.Pharah },
    [Player.ShowCheng]: { name: 'ShowCheng', hero: Hero.DoomFist },
    [Player.Superich]: { name: 'Superich', hero: Hero.Lucio },
};
