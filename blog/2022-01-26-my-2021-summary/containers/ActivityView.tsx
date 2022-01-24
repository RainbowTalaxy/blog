import Emoji from '@site/src/components/Emoji';
import React from 'react';
import styled from 'styled-components';
import ProgressView, { ProgressItem } from '../components/ProgressLine';

interface Props {}

const Container = styled.div``;

const DateInfo = styled.div`
    margin: 10px 0 20px;
    color: var(--theme-color);
    font-size: large;
    font-weight: bold;
`;

const Paragraph = styled.p`
    margin-bottom: 20px;
`;

const Image = styled.img`
    margin-bottom: 10px;
    max-height: 50vh;
    border-radius: 15px;
`;

const Quote = styled.div`
    --quote-left-size: 18px;
    position: relative;
    margin: 0 0 20px var(--quote-left-size);
    color: var(--theme-primary);

    ::before {
        content: '';
        position: absolute;
        top: 0;
        left: calc(-1 * var(--quote-left-size));
        bottom: 0;
        width: 4px;
        border-radius: 2px;
        background: var(--theme-secondary);
    }

    p {
        margin: 0 0 5px;
    }

    p > span {
        padding: 0 10px;
    }
`;

const ActivityView = ({}: Props) => {
    return (
        <Container>
            <ProgressView>
                <ProgressItem>
                    <DateInfo>2021 年 1 月 14 日</DateInfo>
                    <Paragraph>收到了蚂蚁森林送的明信片：</Paragraph>
                    <Image
                        referrerPolicy="no-referrer"
                        src="http://a1.qpic.cn/psc?/V12to3FW0jLYul/bqQfVz5yrrGYSXMvKr.cqbVa05X*D.54OdGuaRt2eKUwVXztj.PdF17VPLWuG1e7f*V6.d5ejDC.N3U6bCTtV5O6db51tjWqSmT7*fUYlMU!/b&ek=1&kp=1&pt=0&bo=VQhABlUIQAYRECc!&tl=3&vuin=747797254&tm=1643032800&sce=60-2-2&rf=viewer_311&t=5"
                    />
                </ProgressItem>
                <ProgressItem>
                    <DateInfo>2021 年 1 月 21 日</DateInfo>
                    <Paragraph>写了个脚本来应对学校的每日疫情打卡。</Paragraph>
                    <Paragraph>而且一年下来依旧非常的稳定！</Paragraph>
                </ProgressItem>
                <ProgressItem>
                    <DateInfo>2021 年 4 月 11 日</DateInfo>
                    <Paragraph>在宿舍煮了第一枚茶叶蛋：</Paragraph>
                    <Image
                        referrerPolicy="no-referrer"
                        src="http://m.qpic.cn/psc?/V12to3FW0jLYul/TmEUgtj9EK6.7V8ajmQrEF3VJ2h*ivqrh*upQ70w3tD3xCJ8FF4ljzy6Vt04TFJqpk0E.x9Bjjx88KVUHjG6oVCVdQhZ236Qf7ibdoyMFko!/b&bo=OASgBTgEoAUBKQ4!&rf=viewer_4"
                    />
                </ProgressItem>
                <ProgressItem>
                    <DateInfo>2021 年 5 月 3 日</DateInfo>
                    <Paragraph>
                        爆肝了个 SwiftUI 的 Markdown 渲染器：
                        <a href="https://github.com/RainbowTalaxy/RoomTime">RoomTime - GitHub</a>
                    </Paragraph>
                    <Paragraph>但是发版后一直没更新，专心学前端了。</Paragraph>
                </ProgressItem>
                <ProgressItem>
                    <DateInfo>2021 年 5 月 6 日</DateInfo>
                    <Paragraph>用 VuePress 搭建了最初的博客：</Paragraph>
                    <Image
                        referrerPolicy="no-referrer"
                        src="http://a1.qpic.cn/psc?/V12to3FW0jLYul/bqQfVz5yrrGYSXMvKr.cqekzhyTHgEbP8RWn6kShosBeNn9JjhsSJTQU5uS1L9w2gGJ7Lyyzfi9Wx8.v57bBx9FkLSqBjRYvSiDevT8yPeU!/b&ek=1&kp=1&pt=0&bo=VQhABlUIQAYRECc!&tl=3&vuin=747797254&tm=1643029200&sce=60-2-2&rf=viewer_311&t=5"
                    />
                </ProgressItem>
                <ProgressItem>
                    <DateInfo>2021 年 6 月 13 日</DateInfo>
                    <Paragraph>给想搭建服务器的 MC 党写了教程：</Paragraph>
                    <Quote>
                        <p>爆肝了三天的 Minecraft 服务器搭建教程</p>
                        <p>
                            感兴趣可以瞅瞅
                            <Emoji symbol="💪" />
                            <a href="https://talaxy.cn/minecraft/">网页链接</a>
                        </p>
                    </Quote>
                </ProgressItem>
                <ProgressItem>
                    <DateInfo>2021 年 7 月 8 日</DateInfo>
                    <Quote>
                        <p>
                            躲雨的
                            <Emoji symbol="🐝" />
                        </p>
                    </Quote>
                    <Image
                        referrerPolicy="no-referrer"
                        src="http://photogz.photo.store.qq.com/psc?/V12to3FW1Klfn3/TmEUgtj9EK6.7V8ajmQrEPvzXm*2bEee3cOlCpA*M2mFGyiwIMFKRzXHpnwuKbRxuWsLTB*FwabGSVBpFYbb0oYeIj4ykpq3C.4kXMrxcjM!/b&bo=VQhABsAP0AsBKQE!&rf=viewer_4"
                    />
                </ProgressItem>
                <ProgressItem>
                    <DateInfo>2021 年 7 月 19 日</DateInfo>
                    <Paragraph>暑假的开头，开始了一个人在外租房独居的日子。</Paragraph>
                </ProgressItem>
                <ProgressItem>
                    <DateInfo>2021 年 9 月 20 日</DateInfo>
                    <Quote>
                        <p>临中秋节和舍友小聚</p>
                        <p>一路在纠结怎么用南京消费券</p>
                        <p>还有夜游玄武湖赏月</p>
                    </Quote>
                    <Image
                        referrerPolicy="no-referrer"
                        src="http://a1.qpic.cn/psc?/V12to3FW0jLYul/bqQfVz5yrrGYSXMvKr.cqeL96Ro6cDbFlZ*OkypBYso76SELqZVUCs4mW9PxB0ryWyi40MXTKxl5X84E6WVYoqkgMmPkg8.*yppcjf7Mz48!/b&ek=1&kp=1&pt=0&bo=VQhABlUIQAYRECc!&tl=3&vuin=747797254&tm=1643032800&sce=60-4-3&rf=viewer_311"
                    />
                </ProgressItem>
                <ProgressItem>
                    <DateInfo>2021 年 11 月 17 日</DateInfo>
                    11 月 8 日，我去了扇贝实习：
                    <Paragraph></Paragraph>
                    <Quote>
                        <p>真的好巧…</p>
                        <p>
                            下班后在小区底下吃鸭血粉丝汤，结果碰到了隔壁工位的同事…{' '}
                            <Emoji symbol="😲" />
                        </p>
                    </Quote>
                </ProgressItem>
            </ProgressView>
        </Container>
    );
};

export default ActivityView;
