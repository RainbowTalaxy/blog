import ActivityView from './containers/ActivityView';
import RecreationView from './containers/RecreationView';
import TravelingView from './containers/TravelingView';

export enum Section {
    Activity,
    Traveling,
    Recreation,
}

export const SECTION_NAME = {
    [Section.Activity]: '动态',
    [Section.Traveling]: '户外',
    [Section.Recreation]: '休闲',
};

export const TabBarItems = [
    Section.Activity,
    Section.Traveling,
    Section.Recreation,
].map((section) => SECTION_NAME[section]);

export const SECTION_ITEMS = {
    [Section.Activity]: <ActivityView />,
    [Section.Traveling]: <TravelingView />,
    [Section.Recreation]: <RecreationView />,
};

interface SongDetail {
    name: string;
    artist: string;
    imgUrl: string;
    time: number;
}

export const APPLE_MUSIC_DATA: SongDetail[] = [
    {
        name: 'A Moment Apart',
        artist: 'ODESZA',
        imgUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/eb/d4/22/ebd422d1-b959-dd5d-b395-f9413044cff1/5054429119183.png/300x300bb.webp',
        time: 189,
    },
    {
        name: '中間人',
        artist: 'Ice Paper',
        imgUrl: 'https://is4-ssl.mzstatic.com/image/thumb/Music123/v4/d9/a2/c7/d9a2c7d2-4ec9-b88e-5d1e-c1bd791dea84/4710243789506_cover.jpg/300x300bb.webp',
        time: 474,
    },
    {
        name: 'LMLY',
        artist: '王嘉尔',
        imgUrl: 'https://is4-ssl.mzstatic.com/image/thumb/Music115/v4/4a/3e/32/4a3e32fe-a9ec-7f3e-9901-febb21055223/4718009883796.jpg/300x300bb.webp',
        time: 612,
    },
    {
        name: 'Kiss Me More (feat. SZA)',
        artist: 'Doja Cat',
        imgUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/84/bb/4f/84bb4f76-20cb-7945-84be-af73777d42ac/886449138791.jpg/300x300bb.webp',
        time: 893,
    },
    {
        name: 'LOVE.',
        artist: 'Kendrick Lamar',
        imgUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/04/a2/2e/04a22e49-4716-9a1b-5fdc-a328d0b80daf/00602557608717.rgb.jpg/300x300bb.webp',
        time: 503,
    },
    {
        name: 'Save Your Tears (Remix)',
        artist: 'The Weeknd & Ariana Grande',
        imgUrl: 'https://is5-ssl.mzstatic.com/image/thumb/Music125/v4/bb/35/39/bb353980-b0c7-eac5-9509-267feb48d1b3/21UMGIM33221.rgb.jpg/300x300bb.webp',
        time: 1173,
    },
    {
        name: 'Good Days',
        artist: 'SZA',
        imgUrl: 'https://is5-ssl.mzstatic.com/image/thumb/Music125/v4/ef/09/cf/ef09cf1f-a057-6039-00d3-7b5d14c7eba1/886449006717.jpg/300x300bb.webp',
        time: 1377,
    },
    {
        name: 'Moon River (From "Breakfast at Tiffany\'s")',
        artist: 'Audrey Hepburn',
        imgUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music5/v4/8a/07/4f/8a074f09-4e22-2f66-7ef6-3bf980607ee7/cover.jpg/300x300bb.webp',
        time: 645,
    },
];

export const WATCHED = {
    films: ['速度与激情 9', '长津湖', '我和我的父辈'],
    animations: [
        '五等分的新娘',
        '灵笼',
        '辉夜大小姐想让我告白～天才们的恋爱头脑战～',
    ],
    TVs: ['赘婿', '旺达幻视', '洛基', '觉醒年代', '扫黑风暴'],
    games: ['烟火', 'Fragile', '生化危机 村庄'],
};
