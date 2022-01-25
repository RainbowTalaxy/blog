import React from 'react';
import styled from 'styled-components';
import { Card, ProgressItemTitle, Image, Paragraph, Keyword } from '../components';
import ProgressView, { ProgressItem } from '../components/ProgressLine';
import { APPLE_MUSIC_DATA, WATCHED } from '../constant';

interface Props {}

const Container = styled.div``;

const ListItem = styled.div`
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--theme-secondary);

    > * {
        flex-shrink: 0;
    }
`;

const SongInfo = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 15px;
`;

const SongName = styled.div``;

const Artist = styled.div`
    font-size: small;
    color: var(--theme-color);
`;

const Album = styled(Image)`
    display: block;
    margin: 0 15px 0 0;
    width: 50px;
    height: 50px;
    border-radius: 5px;
`;

const PlayTimes = styled.div``;

const CardFooter = styled.div`
    position: relative;
    top: -25px;
    margin-left: 20px;
    color: var(--theme-secondary);
`;

const Hint = styled.span`
    padding: 0 8px;
    font-weight: bold;
    font-size: 1.5em;
    color: var(--theme-color);
`;

const NumberMark = styled.div`
    width: 1.7em;
    font-weight: bold;
    color: var(--theme-color);
`;

const RecreationView = ({}: Props) => {
    const favoriteSong = APPLE_MUSIC_DATA.find((song) => song.name === 'Good Days');

    return (
        <Container>
            <ProgressView topSpace={75} bottomSpace={30}>
                <ProgressItem>
                    <ProgressItemTitle>这一年我最喜爱的单曲是：</ProgressItemTitle>
                </ProgressItem>
                <Card>
                    <ListItem style={{ border: 'none', marginBottom: '0px' }}>
                        <Album src={favoriteSong.imgUrl} />
                        <SongInfo>
                            <SongName>{favoriteSong.name}</SongName>
                            <Artist>{favoriteSong.artist}</Artist>
                        </SongInfo>
                        <PlayTimes>播放 {favoriteSong.time} 次</PlayTimes>
                    </ListItem>
                </Card>
                <ProgressItem>
                    <ProgressItemTitle>这一年我的年度歌单：</ProgressItemTitle>
                </ProgressItem>
                <Card>
                    {APPLE_MUSIC_DATA.map((song, idx) => (
                        <ListItem>
                            <NumberMark>{idx + 1}.</NumberMark>
                            <Album src={song.imgUrl} />
                            <SongInfo>
                                <SongName>{song.name}</SongName>
                                <Artist>{song.artist}</Artist>
                            </SongInfo>
                        </ListItem>
                    ))}
                </Card>
                <CardFooter>看来这一年的听歌风格是：{'R&B'}</CardFooter>
                <ProgressItem>
                    <ProgressItemTitle>这一年在电影院看过的电影：</ProgressItemTitle>
                </ProgressItem>
                <Card>
                    {WATCHED.films.map((film) => (
                        <ListItem>{film}</ListItem>
                    ))}
                </Card>
                <CardFooter>因为疫情，去电影院的机会也少了...</CardFooter>
                <ProgressItem>
                    <ProgressItemTitle>这一年我追过的动漫番剧：</ProgressItemTitle>
                </ProgressItem>
                <Card>
                    {WATCHED.animations.map((film) => (
                        <ListItem>{film}</ListItem>
                    ))}
                </Card>
                <CardFooter>灵笼，国漫之光！</CardFooter>
                <ProgressItem>
                    <ProgressItemTitle>这一年我看过的电视剧：</ProgressItemTitle>
                </ProgressItem>
                <Card>
                    {WATCHED.TVs.map((film) => (
                        <ListItem>{film}</ListItem>
                    ))}
                </Card>
                <CardFooter>国产质量越来越好了。</CardFooter>
                <ProgressItem>
                    <ProgressItemTitle>这一年我云过的单机游戏：</ProgressItemTitle>
                </ProgressItem>
                <Card>
                    {WATCHED.games.map((film) => (
                        <ListItem>{film}</ListItem>
                    ))}
                </Card>
                <CardFooter>看来只有恐怖游戏符合我的胃口...</CardFooter>
                <ProgressItem>
                    <ProgressItemTitle>这一年我在 B 站：</ProgressItemTitle>
                </ProgressItem>
                <Card>
                    <ListItem>
                        看了<Hint>11399</Hint>个视频
                    </ListItem>
                    <ListItem>
                        总计时长<Hint>891.6</Hint>小时
                    </ListItem>
                    <ListItem>
                        直播观看超过<Hint>776.6</Hint>小时
                    </ListItem>
                    <ListItem>
                        使用了<Hint>73</Hint>次三连
                    </ListItem>
                    <ListItem>
                        喜爱的分区<Hint>游戏/生活/搞笑</Hint>
                    </ListItem>
                </Card>
                <CardFooter>每天都能看到有创意、走心的视频。</CardFooter>
                <ProgressItem>
                    <ProgressItemTitle>这一年我最喜爱的游戏依旧是：</ProgressItemTitle>
                </ProgressItem>
                <Keyword>守望先锋</Keyword>
                <Card>
                    <Paragraph style={{ color: 'var(--theme-color)' }}>在这一年中：</Paragraph>
                    <ListItem>
                        游戏时长最长的英雄是<Hint>艾什</Hint>
                    </ListItem>
                    <ListItem>
                        最喜欢的英雄是<Hint>艾什</Hint>
                    </ListItem>
                    <Paragraph style={{ marginTop: '30px', color: 'var(--theme-color)' }}>
                        觉得自己最拿得出手的英雄：
                    </Paragraph>
                    <ListItem>
                        坦克位为<Hint>西格玛、查莉娅</Hint>
                    </ListItem>
                    <ListItem>
                        输出位为<Hint>艾仕、卡西迪</Hint>
                    </ListItem>
                    <ListItem>
                        辅助位为<Hint>安娜、禅雅塔</Hint>
                    </ListItem>
                </Card>
                <CardFooter>社交游戏罢了。</CardFooter>
                <ProgressItem>
                    <ProgressItemTitle>这一年我只读过一本小说：</ProgressItemTitle>
                </ProgressItem>
                <Keyword>
                    动物园<span>[日] 乙一</span>
                </Keyword>
            </ProgressView>
        </Container>
    );
};

export default RecreationView;
