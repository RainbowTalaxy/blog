import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    html, body {
        background: var(--ly-page-background);
    }

    #__docusaurus {
        height: 100%;
    }
`;

export default GlobalStyle;
