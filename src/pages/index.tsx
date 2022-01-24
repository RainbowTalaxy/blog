import React, { useState } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styled from 'styled-components';
import Emoji from '../components/Emoji';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 20px;
    min-height: 75vh;
    overflow-y: scroll;
`;

const Introduction = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
`;

const Avatar = styled.img`
    display: block;
    margin-right: min(5vmin, 35px);
    width: min(30vmin, 210px);
    height: min(30vmin, 210px);
    border: min(1.5vmin, 10px) solid #f1f1f1;
    border-radius: 50%;
`;

const Info = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled.div`
    display: flex;
    align-items: center;
    font-size: min(10vmin, 70px);
    font-weight: bold;
`;

const Description = styled.div`
    font-size: min(6vmin, 42px);
    color: #888;
`;

const Paragraph = styled.p`
    font-size: large;
    text-align: center;

    strong {
        position: relative;
        display: inline-block;
        padding: 0 5px;
    }

    strong:hover::before {
        position: absolute;
        content: '';
        height: 0.4em;
        left: 5px;
        right: 5px;
        bottom: 3px;
        background: rgb(136, 136, 136, 0.5);
        z-index: -1;
    }
`;

const TopTip = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 30px;
    background: rgb(106, 139, 173, 0.75);
    color: white;

    a {
        font-weight: bold;
        color: #e1f0ff;
    }

    button {
        flex-shrink: 0;
        margin-left: 18px;
        border: none;
        background: transparent;
        font-size: medium;
        color: white;
    }

    button:hover {
        cursor: pointer;
    }
`;

const ContactBar = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin: 24px 0;
`;

const ContactCell = styled.div`
    display: flex;
    align-items: center;
    margin: 10px;
    padding: 5px 20px 5px 18px;
    border-radius: 18px;
    background: rgb(106, 139, 173, 0.1);

    > span {
        padding-right: 10px;
    }

    > img {
        margin-right: 10px;
        width: 26px;
        height: 26px;
    }

    > a {
        color: var(--ifm-font-color-base);
    }
`;

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    const [topTipVisible, setTopTipVisible] = useState(true);

    return (
        <Layout
            title={`Hello from ${siteConfig.title}`}
            description="Description will go into a meta tag in <head />"
        >
            {topTipVisible && (
                <TopTip>
                    <div>
                        这是新博客站点。如果你在找原博客地址，
                        <a href="https://talaxy.cn">点击这里</a>。
                    </div>
                    <button onClick={() => setTopTipVisible(false)}>关闭</button>
                </TopTip>
            )}
            <Container>
                <Introduction>
                    <Avatar src={'img/mercy.png'} />
                    <Info>
                        <Title>Chen Siwei</Title>
                        <Description>@Talaxy</Description>
                    </Info>
                </Introduction>
                <ContactBar>
                    <ContactCell>
                        <Emoji symbol="🏠" />
                        Nanjing, China
                    </ContactCell>
                    <ContactCell>
                        <Emoji symbol="🐧" />
                        747797254
                    </ContactCell>
                    <ContactCell>
                        <Emoji symbol="📧" />
                        fujianchensiwei@163.com
                    </ContactCell>
                    <ContactCell>
                        <img src="img/github.png" />
                        <a href="https://github.com/RainbowTalaxy">RainbowTalaxy</a>
                    </ContactCell>
                </ContactBar>
                <Paragraph>
                    欢迎！我是<strong>Talaxy</strong>。你可能也会看到<strong>RainbowTalaxy</strong>
                    、<strong>MoonstoneTalaxy</strong>
                    等名字，那都是我 ^ ^ 。
                </Paragraph>
                <Paragraph>
                    我喜欢玩<strong>守望先锋</strong>，并关注联赛，可以通过邮箱加我好友。
                </Paragraph>
                <Paragraph>
                    我也喜欢<strong>Minecraft</strong>基岩版，搭了服务器和朋友一块儿玩，可以加 QQ
                    一起玩。
                </Paragraph>
            </Container>
        </Layout>
    );
}
