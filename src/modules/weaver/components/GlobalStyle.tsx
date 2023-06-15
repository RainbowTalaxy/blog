import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    #__docusaurus {
        width: 100%;
        height: 100%;
        overflow: auto;
    }

    .sidebar-content {
        padding: 0;
        height: 100%;
        overflow: hidden;
    }

    footer {
        display: none;
    }
`;

export default GlobalStyle;
