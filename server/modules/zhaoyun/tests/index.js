const { Server } = require('../../../config');
const Assert = require('../../../utils/assert');
const { Rocket, TestCase } = require('../../../utils/test');
const PropList = require('./constant');

async function test() {
    const testCase = new TestCase('Zhaoyun');

    const talaxy = new Rocket(Server + '/zhaoyun');
    await talaxy.login('talaxy', 'talaxy');

    await testCase.pos('init statistic check', async () => {
        const statistics = await talaxy.get('/statistics');
        Assert.props(statistics, PropList.statistics.self);
        Assert.array(statistics.matchDays, 0);
    });

    const matchDayId = await testCase.pos('add and get match day', async () => {
        const props = {
            date: Date.now(),
            description: 'test',
            matches: [],
        };
        const result = await talaxy.post('/match-day', props);
        Assert.props(result, PropList.matchDay);
        const matchDay = await talaxy.get(`/match-day/${result.id}`);
        Assert.props(matchDay, PropList.matchDay);
        Assert.expect(matchDay.date, props.date);
        Assert.expect(matchDay.description, props.description);
        Assert.array(matchDay.matches, props.matches.length);
        Assert.expect(matchDay.createdAt, matchDay.updatedAt);
        Assert.expect(matchDay.removed, false);
        Assert.expect(matchDay.creator, 'talaxy');
        Assert.expect(matchDay.updater, 'talaxy');
        return matchDay.id;
    });

    await testCase.pos('update match day', async () => {
        const props = {
            date: Date.now(),
            description: 'test2',
            matches: [
                {
                    teamA: {
                        players: [],
                    },
                    teamB: {
                        players: [],
                    },
                    rounds: [],
                },
            ],
        };
        await talaxy.put(`/match-day/${matchDayId}`, props);
        const matchDay = await talaxy.get(`/match-day/${matchDayId}`);
        Assert.props(matchDay, PropList.matchDay);
        Assert.expect(matchDay.date, props.date);
        Assert.expect(matchDay.description, props.description);
        Assert.array(matchDay.matches, props.matches.length);
        Assert.expect(matchDay.updatedAt > matchDay.createdAt, true);
        Assert.expect(matchDay.removed, false);
        Assert.expect(matchDay.creator, 'talaxy');
        Assert.expect(matchDay.updater, 'talaxy');
    });

    await testCase.pos('remove match day', async () => {
        await talaxy.delete(`/match-day/${matchDayId}`);
        const matchDay = await talaxy.get(`/match-day/${matchDayId}`);
        Assert.expect(matchDay.removed, true);
    });

    return testCase.stat();
}

module.exports = test;
