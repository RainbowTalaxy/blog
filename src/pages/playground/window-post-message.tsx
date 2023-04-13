import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    padding: 30px;

    .preview {
        display: block;
        margin: 16px 0;
        border: 1px solid black;
    }
`;

const Page = () => {
    const [text, setText] = useState('text');

    return (
        <Container>
            <h1>window.postMessage</h1>
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <button
                onClick={() => {
                    const preview = document.querySelector(
                        '.preview',
                    ) as HTMLIFrameElement;
                    preview.contentWindow.postMessage(
                        {
                            type: 'text',
                            data: text,
                        },
                        window.location.origin,
                    );
                }}
            >
                Send
            </button>
            <iframe
                className="preview"
                src="/playground/window-post-message-duo"
            />
        </Container>
    );
};

export default Page;
