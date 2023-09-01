import { createGlobalStyle } from 'styled-components';
import homeStyles from './home.module.css';
import layoutStyles from './layout.module.css';
import documentStyles from './document.module.css';

const EditingModeGlobalStyle = createGlobalStyle`
    .${homeStyles.container},
    .${layoutStyles.pageView},
    .${layoutStyles.contentView},
    .${layoutStyles.content},
    .${documentStyles.docView} {
        height: 100%;
        overflow: auto;
    }
`;

export default EditingModeGlobalStyle;
