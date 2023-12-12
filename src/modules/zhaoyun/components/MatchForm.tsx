import API from '@site/src/api';
import { MatchDay, Statistics } from '@site/src/api/zhaoyun';
import { Input } from '@site/src/components/Form';
import { formDate, time } from '@site/src/utils';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div``;

const FormItem = styled.div`
    display: flex;
    margin-bottom: 16px;
    font-size: 18px;

    > label {
        flex-shrink: 0;
        margin: 5px 0;
        width: 5em;
        font-weight: bold;
        text-align: right;
    }

    input[type='date'] {
        max-width: 300px;
    }
`;

interface Props {
    matchDayId: string;
}

const MatchForm = ({ matchDayId }: Props) => {
    const [matchDay, setMatchDay] = useState<MatchDay | null>();

    useEffect(() => {
        (async () => {
            const data = await API.zhaoyun.matchDay(matchDayId);
            setMatchDay(data);
        })();
    }, [matchDayId]);

    if (!matchDay) return null;

    return (
        <Container>
            <FormItem>
                <label>ID：</label>
                <Input value={matchDay?.id} />
            </FormItem>
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
                <Input
                    defaultValue={matchDay.description}
                    onChange={(e) => (matchDay.description = e.target.value)}
                />
            </FormItem>
            <FormItem>
                <label>比赛数据：</label>
            </FormItem>
        </Container>
    );
};

export default MatchForm;
