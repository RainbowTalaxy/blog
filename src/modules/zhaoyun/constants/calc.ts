import { Statistics } from '@site/src/api/zhaoyun';
import { Hero } from '.';

export const calcBanRank = (statistics: Statistics) => {
    const stat = new Map<
        Hero,
        {
            times: number;
        }
    >();

    statistics.matchDays.map((matchDay) =>
        matchDay.matches.map((match) =>
            match.rounds.map((round) =>
                round.ban.map((ban) => {
                    if (ban === 'TBD') return;
                    const hero = stat.get(ban);
                    if (hero) {
                        hero.times += 1;
                    } else {
                        stat.set(ban, {
                            times: 1,
                        });
                    }
                }),
            ),
        ),
    );

    const result = Array.from(stat);
    result.sort(([ah, ad], [bh, bd]) => {
        return bd.times - ad.times;
    });
    return {
        list: result,
        highest: result[0]?.[1].times ?? 1,
    };
};
