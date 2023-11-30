// @ts-check

const { Dir } = require('../../config');
const { uuid } = require('../../utils');
const File = require('../../utils/file');

const ZhaoyunDir = Dir.storage.zhaoyun;

/** @type {import('./controller')} */
const Controller = {
    statistics: {
        get content() {
            if (!File.exists(ZhaoyunDir.statistics)) {
                File.writeJSON(ZhaoyunDir.statistics, {
                    updated_at: Date.now(),
                    match_days: [],
                });
            }
            return File.readJSON(ZhaoyunDir.statistics);
        },
        update() {
            const newStatistic = {};
            const now = Date.now();
            newStatistic.match_days = File.files(ZhaoyunDir.matchDays)
                .map((dayFile) => File.readJSON(dayFile))
                .filter((day) => !day.removed)
                .map((matchDay) => {
                    return {
                        id: matchDay.id,
                        date: matchDay.date,
                        description: matchDay.description,
                        matches: matchDay.matches,
                    };
                });
            newStatistic.updated_at = now;
            File.writeJSON(ZhaoyunDir.statistics, newStatistic);
        },
    },
    matchDay: {
        add(props, creator) {
            if (!props || !creator)
                throw new Error('`props` or `creator` is required');
            const now = Date.now();
            const matchDay = {
                id: uuid(),
                date: props.date ?? 0,
                description: props.description ?? '',
                matches: props.matches ?? [],
                created_at: now,
                updated_at: now,
                removed: false,
                creator,
                updater: creator,
            };
            const matchDayFile = File.join(
                ZhaoyunDir.matchDays,
                `${matchDay.id}.json`,
            );
            File.writeJSON(matchDayFile, matchDay);
            Controller.statistics.update();
            return matchDay;
        },
        ctr(id) {
            if (!id) throw new Error('`id` is required');
            const dayFile = File.join(ZhaoyunDir.matchDays, `${id}.json`);
            if (!File.exists(dayFile)) return null;
            return {
                get content() {
                    return File.readJSON(dayFile);
                },
                set content(newMatchDay) {
                    if (!newMatchDay) throw new Error('`newDay` is required');
                    File.writeJSON(dayFile, newMatchDay);
                },
                update(props, updater) {
                    if (!props) throw new Error('`props` is required');
                    const now = Date.now();
                    const slice = this.content;
                    // ---
                    slice.date = props.date ?? slice.date;
                    slice.description = props.description ?? slice.description;
                    slice.matches = props.matches ?? slice.matches;
                    slice.updated_at = now;
                    slice.updater = updater ?? slice.updater;
                    // ---
                    this.content = slice;
                    Controller.statistics.update();
                    return slice;
                },
                remove(remover) {
                    if (!remover) throw new Error('`remover` is required');
                    const now = Date.now();
                    const slice = this.content;
                    // ---
                    slice.removed = true;
                    slice.updated_at = now;
                    slice.updater = remover ?? slice.updater;
                    // ---
                    this.content = slice;
                    Controller.statistics.update();
                },
            };
        },
    },
};

module.exports = Controller;
