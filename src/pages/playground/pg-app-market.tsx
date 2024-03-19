import { Button, ButtonGroup, Input } from '@site/src/components/Form';
import { useRef, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;

    & > * {
        margin-bottom: 20px;
    }
`;

const iosLink = 'https://itunes.apple.com/app/id1661274824';
const androidLink = 'market://details?id=com.shanbay.kaoyan';

const Page = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Container>
            <ButtonGroup>
                <Button>
                    <a href={iosLink}>iOS App Store</a>
                </Button>
                <Button>
                    <a href={androidLink}>安卓 market 链接</a>
                </Button>
            </ButtonGroup>
            <Input raf={inputRef} />
            <ButtonGroup>
                <Button
                    onClick={() => {
                        window.open(inputRef.current?.value || '');
                    }}
                >
                    跳转
                </Button>
                <Button
                    onClick={() => {
                        inputRef.current!.value = '';
                    }}
                >
                    清除
                </Button>
            </ButtonGroup>
        </Container>
    );
};

export default Page;
