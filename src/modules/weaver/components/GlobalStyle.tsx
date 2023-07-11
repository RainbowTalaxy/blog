import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }

    #__docusaurus {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .sidebar-container {
        height: 100%;
    }

    .sidebar-content {
        padding: 0;
        height: 100%;
        overflow: hidden;
    }
    
    .main-wrapper {
        height: calc(100% - var(--ifm-navbar-height));
    }

    footer {
        display: none;
    }

    @media (pointer: fine) {
        html, body {
            overflow: hidden;
        }
    }
`;

export default GlobalStyle;
