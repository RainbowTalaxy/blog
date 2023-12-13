import { HeroName } from '@site/src/constants/zhaoyun/Hero';
import { GameMapName } from '@site/src/constants/zhaoyun/Map';

export enum MatchModeName {
    FT2 = 'FT2',
    FT3 = 'FT3',
    Wolf = '狼人杀',
}

export type Hero = keyof typeof HeroName;
export type GameMap = keyof typeof GameMapName;
export type MatchMode = keyof typeof MatchModeName;
