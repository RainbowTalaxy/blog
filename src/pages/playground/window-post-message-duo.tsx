import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div``;

const Page = () => {
    const [text, setText] = useState('');

    useEffect(() => {
        const callback = (event) => {
            if (event.data.type === 'text') {
                setText(event.data.data);
            }
        };
        window.addEventListener('message', callback);
        return () => window.removeEventListener('message', callback);
    });

    return <Container>{text}</Container>;
};

export default Page;
