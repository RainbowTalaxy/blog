import React from 'react';
import ActivityView from './containers/ActivityView';
import MusicView from './containers/MusicView';
import TravelingView from './containers/TravelingView';

export enum Section {
    Activity,
    Traveling,
    Music,
}

export const SECTION_NAME = {
    [Section.Activity]: '动态',
    [Section.Traveling]: '徒步日记',
    [Section.Music]: '音乐',
};

export const TabBarItems = [Section.Activity, Section.Traveling, Section.Music].map(
    (section) => SECTION_NAME[section],
);

export const SECTION_ITEMS = {
    [Section.Activity]: <ActivityView />,
    [Section.Traveling]: <TravelingView />,
    [Section.Music]: <MusicView />,
};
