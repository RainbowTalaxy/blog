import WordBank from '@site/src/modules/word-bank';
import Layout from '@theme/Layout';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    footer {
        display: none;
    }
`;

const Page = () => {
    return (
        <Layout title="WordBank">
            <GlobalStyle />
            <WordBank />
        </Layout>
    );
};

export default Page;
