import Layout from '@theme/Layout';
import { useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    position: relative;
    flex: 1;
    height: var(--app-height);
    background-color: rgb(0, 3, 19);

    > div {
        position: relative;
        margin: 0 auto;
        height: var(--app-height);
        width: 100%;
        max-width: 1000px;
    }
`;

const Page = () => {
    useEffect(() => {
        // 将 html 的 data-theme 属性设置为 dark
        document.documentElement.setAttribute('data-theme', 'dark');
        const appHeight = () => {
            const doc = document.documentElement;
            doc.style.setProperty(
                '--app-height',
                `${window.innerHeight - 60}px`,
            );
        };
        window.addEventListener('resize', appHeight);
        appHeight();
        return () => {
            window.removeEventListener('resize', appHeight);
        };
    }, []);

    return (
        <Layout title="Chatbot">
            <Container>
                <div>
                    <iframe
                        src={`https://ora.sh/embed/76bca14a-a142-4906-a4d4-d73b3a2f13db`}
                        width="100%"
                        height="100%"
                        style={{ border: '0' }}
                    />
                </div>
            </Container>
        </Layout>
    );
};

export default Page;
