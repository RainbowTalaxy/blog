import React from 'react';
import ActivityView from './containers/ActivityView';
import MusicView from './containers/MusicView';
import TravelingView from './containers/TravelingView';

export enum Section {
    Activity,
    Traveling,
    Recreation,
}

export const SECTION_NAME = {
    [Section.Activity]: '动态',
    [Section.Traveling]: '外出',
    [Section.Recreation]: '听歌看视频',
};

export const TabBarItems = [Section.Activity, Section.Traveling, Section.Recreation].map(
    (section) => SECTION_NAME[section],
);

export const SECTION_ITEMS = {
    [Section.Activity]: <ActivityView />,
    [Section.Traveling]: <TravelingView />,
    [Section.Recreation]: <MusicView />,
};
