import API from '@site/src/api';
import { MatchDay } from '@site/src/api/zhaoyun';
import { Button, ButtonGroup, Input, Select } from '@site/src/components/Form';
import { clone, formDate, time, uuid } from '@site/src/utils';
import { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { MatchMode } from '../constants';
import { Player } from '@site/src/constants/zhaoyun/Player';
import { GameMap } from '@site/src/constants/zhaoyun/Map';
import { Hero } from '@site/src/constants/zhaoyun/Hero';
import { useHistory } from '@docusaurus/router';

const Container = styled.div``;

const Gap = styled.div`
    height: 24px;
`;

const FormItem = styled.div`
    display: flex;
    margin-bottom: 16px;
    font-size: 18px;

    > label {
        flex-shrink: 0;
        margin: 5px 0;
        width: 7em;
        font-weight: bold;
        text-align: right;
    }

    input[type='date'],
    input[type='number'] {
        max-width: 300px;
    }

    select {
        max-width: 300px;
    }
`;

const InputGroup = styled.div`
    display: flex;
    align-items: center;

    > select {
        margin-right: 8px;
    }
`;

const MATCH_MODE_OPTIONS = Object.keys(MatchMode).map((mode) => ({
    label: mode,
    value: mode,
}));

const PLAYER_OPTIONS = Object.keys(Player).map((player) => ({
    label: Player[player],
    value: player,
}));

const GAME_MAP_OPTIONS = Object.keys(GameMap).map((map) => ({
    label: GameMap[map],
    value: map,
}));

const HERO_OPTIONS = Object.keys(Hero).map((hero) => ({
    label: Hero[hero],
    value: hero,
}));

const MAX_PLAYER_COUNT = 6;
const MAX_BAN_COUNT = 4;

const createDefaultMatch = () => ({
    id: uuid(),
    mode: MatchMode.FT2,
    teamA: {
        players: Array(MAX_PLAYER_COUNT).fill(Player.TBD),
        wolf: {
            real: Player.TBD,
            fake: Player.TBD,
        },
    },
    teamB: {
        players: Array(MAX_PLAYER_COUNT).fill(Player.TBD),
        wolf: {
            real: Player.TBD,
            fake: Player.TBD,
        },
    },
    rounds: [],
});

const createDefaultRound = () => ({
    id: uuid(),
    map: GameMap.TBD,
    scoreA: 0,
    scoreB: 0,
    ban: Array(MAX_BAN_COUNT).fill(Hero.TBD),
    wolf: {
        voteA: Player.TBD,
        voteB: Player.TBD,
    },
});

type FormData = Pick<MatchDay, 'date' | 'description' | 'matches'> & {
    id?: string;
};

function customTrimEnd<T>(arr: T[], value: T) {
    let i = arr.length;
    while (i-- && arr[i] === value) {}
    return arr.slice(0, i + 1);
}

const formatFormData = (data: FormData) => {
    const formData = clone(data);
    const result = {
        ...formData,
        matches: formData.matches.map((match) => ({
            ...match,
            teamA: {
                ...match.teamA,
                players: customTrimEnd(match.teamA.players, Player.TBD),
            },
            teamB: {
                ...match.teamB,
                players: customTrimEnd(match.teamB.players, Player.TBD),
            },
            rounds: match.rounds.map((round) => ({
                ...round,
                ban: customTrimEnd(round.ban, Hero.TBD),
            })),
        })),
    };
    result.matches.forEach((match) => {
        if (match.mode !== MatchMode.Wolf) {
            delete match.teamA.wolf;
            delete match.teamB.wolf;
            match.rounds.forEach((round) => delete round.wolf);
        }
        delete match.id;
        match.rounds.forEach((round) => delete round.id);
    });
    return result;
};

interface Props {
    matchDayId?: string;
}

const MatchForm = ({ matchDayId }: Props) => {
    const history = useHistory();
    const [matchDay, setMatchDay] = useState<FormData>();
    const [selectedMatchIdx, setSelectedMatchIdx] = useState(0);
    const [selectedRoundIdx, setSelectedRoundIdx] = useState(0);

    useEffect(() => {
        (async () => {
            if (!matchDayId)
                return setMatchDay({
                    date: Date.now(),
                    description: '',
                    matches: [],
                });
            const data = await API.zhaoyun.matchDay(matchDayId);
            setMatchDay({
                ...data,
                matches: data.matches.map((match) => ({
                    ...match,
                    id: uuid(),
                    teamA: {
                        ...match.teamA,
                        players: match.teamA.players.concat(
                            Array(MAX_PLAYER_COUNT - match.teamA.players.length).fill(Player.TBD),
                        ),
                        wolf: match.teamA.wolf ?? {
                            real: Player.TBD,
                            fake: Player.TBD,
                        },
                    },
                    teamB: {
                        ...match.teamB,
                        players: match.teamB.players.concat(
                            Array(MAX_PLAYER_COUNT - match.teamB.players.length).fill(Player.TBD),
                        ),
                        wolf: match.teamB.wolf ?? {
                            real: Player.TBD,
                            fake: Player.TBD,
                        },
                    },
                    rounds: match.rounds.map((round) => ({
                        ...round,
                        id: uuid(),
                        ban: round.ban.concat(Array(MAX_BAN_COUNT - round.ban.length).fill(Hero.TBD)),
                        wolf: round.wolf ?? {
                            voteA: Player.TBD,
                            voteB: Player.TBD,
                        },
                    })),
                })),
            });
        })();
    }, [matchDayId]);

    if (!matchDay) return null;

    const selectedMatch = matchDay.matches[selectedMatchIdx];
    const selectedRound = selectedMatch?.rounds[selectedRoundIdx];

    return (
        <Container>
            {matchDay.id && (
                <FormItem>
                    <label>ID：</label>
                    <Input value={matchDay?.id} onChange={() => {}} />
                </FormItem>
            )}
            <FormItem>
                <label>日期：</label>
                <Input
                    type="date"
                    defaultValue={formDate(matchDay.date)}
                    onChange={(e) => (matchDay.date = time(e.target.value))}
                />
            </FormItem>
            <FormItem>
                <label>描述：</label>
                <Input defaultValue={matchDay.description} onChange={(e) => (matchDay.description = e.target.value)} />
            </FormItem>
            <Gap />
            <FormItem>
                <label></label>
                <ButtonGroup>
                    {matchDay.matches.map((match, mIdx) => (
                        <Button
                            key={match.id}
                            type={selectedMatchIdx === mIdx ? 'primary' : undefined}
                            onClick={() => {
                                setSelectedMatchIdx(mIdx);
                                setSelectedRoundIdx(0);
                            }}
                        >
                            第{mIdx + 1}场
                        </Button>
                    ))}
                    <Button
                        type="primary"
                        onClick={() => {
                            matchDay.matches.push(createDefaultMatch());
                            setMatchDay(clone(matchDay));
                        }}
                    >
                        新建场次
                    </Button>
                </ButtonGroup>
            </FormItem>
            {selectedMatch && (
                <Fragment key={selectedMatch.id}>
                    <FormItem>
                        <label>模式：</label>
                        <Select
                            defaultValue={selectedMatch.mode}
                            options={MATCH_MODE_OPTIONS}
                            onSelect={(value) => {
                                selectedMatch.mode = value as MatchMode;
                                setMatchDay(clone(matchDay));
                            }}
                        />
                    </FormItem>
                    <FormItem>
                        <label>队伍 A ：</label>
                        <InputGroup>
                            {selectedMatch.teamA.players.map((player, pIdx) => (
                                <Select
                                    key={pIdx}
                                    defaultValue={player}
                                    options={PLAYER_OPTIONS}
                                    onSelect={(value) => (selectedMatch.teamA.players[pIdx] = value as Player)}
                                />
                            ))}
                        </InputGroup>
                    </FormItem>
                    {selectedMatch.mode === MatchMode.Wolf && (
                        <FormItem>
                            <label>队伍 A 狼人：</label>
                            <InputGroup>
                                <Select
                                    defaultValue={selectedMatch.teamA.wolf!.real}
                                    options={PLAYER_OPTIONS}
                                    onSelect={(value) => (selectedMatch.teamA.wolf!.real = value as Player)}
                                />
                                <Select
                                    defaultValue={selectedMatch.teamA.wolf!.fake}
                                    options={PLAYER_OPTIONS}
                                    onSelect={(value) => (selectedMatch.teamA.wolf!.fake = value as Player)}
                                />
                            </InputGroup>
                        </FormItem>
                    )}
                    <FormItem>
                        <label>队伍 B ：</label>
                        <InputGroup>
                            {selectedMatch.teamB.players.map((player, pIdx) => (
                                <Select
                                    key={pIdx}
                                    defaultValue={player}
                                    options={PLAYER_OPTIONS}
                                    onSelect={(value) => (selectedMatch.teamB.players[pIdx] = value as Player)}
                                />
                            ))}
                        </InputGroup>
                    </FormItem>
                    {selectedMatch.mode === MatchMode.Wolf && (
                        <FormItem>
                            <label>队伍 B 狼人：</label>
                            <InputGroup>
                                <Select
                                    defaultValue={selectedMatch.teamB.wolf!.real}
                                    options={PLAYER_OPTIONS}
                                    onSelect={(value) => (selectedMatch.teamB.wolf!.real = value as Player)}
                                />
                                <Select
                                    defaultValue={selectedMatch.teamB.wolf!.fake}
                                    options={PLAYER_OPTIONS}
                                    onSelect={(value) => (selectedMatch.teamB.wolf!.fake = value as Player)}
                                />
                            </InputGroup>
                        </FormItem>
                    )}
                    <FormItem>
                        <label></label>
                        <Button
                            type="danger"
                            onClick={() => {
                                matchDay.matches.splice(selectedMatchIdx, 1);
                                setSelectedMatchIdx(0);
                                setMatchDay(clone(matchDay));
                            }}
                        >
                            删除当前场次
                        </Button>
                    </FormItem>
                    <Gap />
                    <Fragment key={selectedMatch.id}>
                        <FormItem>
                            <label></label>
                            <ButtonGroup>
                                {selectedMatch.rounds.map((round, rIdx) => (
                                    <Button
                                        key={round.id}
                                        type={selectedRoundIdx === rIdx ? 'primary' : undefined}
                                        onClick={() => setSelectedRoundIdx(rIdx)}
                                    >
                                        第{rIdx + 1}局
                                    </Button>
                                ))}
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        selectedMatch.rounds.push(createDefaultRound());
                                        setMatchDay(clone(matchDay));
                                    }}
                                >
                                    新建局
                                </Button>
                            </ButtonGroup>
                        </FormItem>
                        {selectedRound && (
                            <Fragment key={selectedRound.id}>
                                <FormItem>
                                    <label>地图：</label>
                                    <Select
                                        defaultValue={selectedRound.map}
                                        options={GAME_MAP_OPTIONS}
                                        onSelect={(value) => (selectedRound.map = value as GameMap)}
                                    />
                                </FormItem>
                                <FormItem>
                                    <label>队伍 A 得分：</label>
                                    <Input
                                        type="number"
                                        defaultValue={selectedRound.scoreA.toString()}
                                        onChange={(e) => (selectedRound.scoreA = Number(e.target.value))}
                                    />
                                </FormItem>
                                <FormItem>
                                    <label>队伍 B 得分：</label>
                                    <Input
                                        type="number"
                                        defaultValue={selectedRound.scoreB.toString()}
                                        onChange={(e) => (selectedRound.scoreB = Number(e.target.value))}
                                    />
                                </FormItem>
                                {selectedMatch.mode === MatchMode.Wolf && (
                                    <>
                                        <FormItem>
                                            <label>队伍 A 投票：</label>
                                            <Select
                                                defaultValue={selectedRound.wolf!.voteA}
                                                options={PLAYER_OPTIONS}
                                                onSelect={(value) => (selectedRound.wolf!.voteA = value as Player)}
                                            />
                                        </FormItem>
                                        <FormItem>
                                            <label>队伍 B 投票：</label>
                                            <Select
                                                defaultValue={selectedRound.wolf!.voteB}
                                                options={PLAYER_OPTIONS}
                                                onSelect={(value) => (selectedRound.wolf!.voteB = value as Player)}
                                            />
                                        </FormItem>
                                    </>
                                )}
                                <FormItem>
                                    <label>禁用：</label>
                                    <InputGroup>
                                        {selectedRound.ban.map((map, bIdx) => (
                                            <Select
                                                key={bIdx}
                                                defaultValue={map}
                                                options={HERO_OPTIONS}
                                                onSelect={(value) => (selectedRound.ban[bIdx] = value as Hero)}
                                            />
                                        ))}
                                    </InputGroup>
                                </FormItem>
                                <FormItem>
                                    <label></label>
                                    <Button
                                        type="danger"
                                        onClick={() => {
                                            selectedMatch.rounds.splice(selectedRoundIdx, 1);
                                            setSelectedRoundIdx(0);
                                            setMatchDay(clone(matchDay));
                                        }}
                                    >
                                        删除当前局
                                    </Button>
                                </FormItem>
                            </Fragment>
                        )}
                    </Fragment>
                </Fragment>
            )}
            <Gap />
            <FormItem>
                <label></label>
                <ButtonGroup>
                    <Button
                        onClick={async () => {
                            console.log(formatFormData(matchDay));
                        }}
                    >
                        预 览
                    </Button>
                    <Button
                        type="primary"
                        onClick={async () => {
                            const data = formatFormData(matchDay);
                            if (matchDay.id) {
                                await API.zhaoyun.updateMatchDay(matchDay.id, data);
                            } else {
                                await API.zhaoyun.createMatchDay(data);
                            }
                            alert('保存成功');
                            history.push('?');
                        }}
                    >
                        保 存
                    </Button>
                </ButtonGroup>
            </FormItem>
        </Container>
    );
};

export default MatchForm;
