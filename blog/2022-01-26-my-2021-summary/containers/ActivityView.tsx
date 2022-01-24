import React from 'react';
import styled from 'styled-components';
import ProgressView, { ProgressItem } from '../components/ProgressLine';

interface Props {}

const Container = styled.div``;

const DateInfo = styled.div`
    color: var(--theme-primary);
    font-size: large;
    font-weight: bold;
`;

const Paragraph = styled.p``;

const Image = styled.img``;

const Wrapper = styled.div`
    width: 300px;
    height: 300px;
    padding: 0;
    overflow: hidden;

    #scaled-frame {
        width: 1000px;
        height: 2000px;
        border: 0px;
    }

    #scaled-frame {
        zoom: 0.2;
        transform: scale(0.75);
        -moz-transform: scale(0.75);
        transform-origin: 0 0;
        -moz-transform-origin: 0 0;
        -o-transform: scale(0.75);
        -o-transform-origin: 0 0;
        -webkit-transform: scale(0.75);
        -webkit-transform-origin: 0 0;
    }
`;

const ActivityView = ({}: Props) => {
    return (
        <Container>
            <ProgressView>
                <ProgressItem>
                    <DateInfo>2020 年 05 月 06 日</DateInfo>
                    <Paragraph>用 VuePress 搭建了最初的博客：</Paragraph>
                    <Image
                        referrerPolicy="no-referrer"
                        src="http://a1.qpic.cn/psc?/V12to3FW0jLYul/bqQfVz5yrrGYSXMvKr.cqekzhyTHgEbP8RWn6kShosBeNn9JjhsSJTQU5uS1L9w2gGJ7Lyyzfi9Wx8.v57bBx9FkLSqBjRYvSiDevT8yPeU!/b&ek=1&kp=1&pt=0&bo=VQhABlUIQAYRECc!&tl=3&vuin=747797254&tm=1643029200&sce=60-2-2&rf=viewer_311&t=5"
                    />
                </ProgressItem>
                <ProgressItem>World</ProgressItem>
                <ProgressItem>Talaxy</ProgressItem>
            </ProgressView>
        </Container>
    );
};

export default ActivityView;
