import { Hero } from './Hero';
import { GameMap } from './Map';
import { MATCHES } from './matches/Matches';
import { Player } from './Player';

export const RANK = (() => {
    const stat = new Map<
        Player,
        {
            score: number;
            matchTotal: number;
            win: number;
            loss: number;
            mapScore: number;
            amount: number;
        }
    >();
    const days = MATCHES;
    days.forEach((day) => {
        day.matchs.forEach((match) => {
            let AScore = 0;
            let BScore = 0;
            let tbdFlag = 1;
            match.rounds.forEach((round) => {
                if (round.map === GameMap.TBD) {
                    tbdFlag = 0;
                    return;
                }
                if (round.A > round.B) {
                    AScore += 1;
                } else if (round.B > round.A) {
                    BScore += 1;
                }
            });
            let AWin = AScore > BScore ? tbdFlag : 0;
            let BWin = BScore > AScore ? tbdFlag : 0;
            match.teams.A.players.forEach((player) => {
                const targetPlayer = stat.get(player);
                if (targetPlayer) {
                    targetPlayer.win += AWin;
                    targetPlayer.loss += BWin;
                    targetPlayer.matchTotal += tbdFlag;
                    targetPlayer.mapScore += AScore - BScore;
                    targetPlayer.amount += 100 * AWin;
                    targetPlayer.score += AWin - BWin;
                } else {
                    stat.set(player, {
                        win: AWin,
                        loss: BWin,
                        matchTotal: tbdFlag,
                        mapScore: AScore - BScore,
                        amount: 100 * AWin,
                        score: AWin - BWin,
                    });
                }
            });
            match.teams.B.players.forEach((player) => {
                const targetPlayer = stat.get(player);
                if (targetPlayer) {
                    targetPlayer.win += BWin;
                    targetPlayer.loss += AWin;
                    targetPlayer.matchTotal += tbdFlag;
                    targetPlayer.mapScore += BScore - AScore;
                    targetPlayer.amount += 100 * BWin;
                    targetPlayer.score += BWin - AWin;
                } else {
                    stat.set(player, {
                        win: BWin,
                        loss: AWin,
                        matchTotal: tbdFlag,
                        mapScore: BScore - AScore,
                        amount: 100 * BWin,
                        score: BWin - AWin,
                    });
                }
            });
        });
    });
    const result = Array.from(stat);
    result.sort(([ap, ad], [bp, bd]) => {
        if (ad.score === bd.score) {
            if (ad.mapScore === bd.mapScore) {
                return 0;
            }
            return bd.mapScore - ad.mapScore;
        }
        return bd.score - ad.score;
    });
    return result;
})();

export const BAN_PICK = (() => {
    const stat = new Map<
        Hero,
        {
            times: number;
        }
    >();
    const days = MATCHES;
    days.forEach((day) => {
        day.matchs.forEach((match) => {
            match.rounds.forEach((round) => {
                round.ban.forEach((ban) => {
                    if (!ban) return;
                    const hero = stat.get(ban);
                    if (hero) {
                        hero.times += 1;
                    } else {
                        stat.set(ban, {
                            times: 1,
                        });
                    }
                });
            });
        });
    });
    const result = Array.from(stat);
    result.sort(([ah, ad], [bh, bd]) => {
        return bd.times - ad.times;
    });
    return {
        list: result,
        highest: result[0]?.[1].times ?? 1,
    };
})();
