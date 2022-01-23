import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 70px 0;
`;

const Introduction = styled.div`
    display: flex;
    margin-bottom: 40px;
`;

const Avatar = styled.img`
    display: block;
    margin-right: min(3vmin, 21px);
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
    font-size: min(10vmin, 70px);
    font-weight: bold;
`;

const Description = styled.div`
    font-size: min(7vmin, 49px);
    color: #888;
`;

const Paragraph = styled.p`
    strong {
        padding: 0 5px;
    }
`;

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={`Hello from ${siteConfig.title}`}
            description="Description will go into a meta tag in <head />"
        >
            <Container>
                <Introduction>
                    <Avatar src={'img/mercy.png'} />
                    <Info>
                        <Title>Talaxy</Title>
                        <Description>凉冷寒，冷寒暖。</Description>
                    </Info>
                </Introduction>
                <Paragraph>
                    欢迎！我是 Talaxy ，你可能也会看到 RainbowTalaxy 、MoonstoneTalaxy
                    等名字，那都是我 ^ ^ 。
                </Paragraph>
                <Paragraph>
                    我喜欢玩<strong>守望先锋</strong>并关注联赛，可以通过邮箱加我好友。我也喜欢
                    <strong>Minecraft</strong>基岩版，搭了服务器和朋友一块儿玩。
                </Paragraph>
            </Container>
        </Layout>
    );
}
