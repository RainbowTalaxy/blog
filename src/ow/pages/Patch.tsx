import { useContext } from 'react';
import CHANGELOG from '../CHANGELOG.md';
import OperatorButton from '../components/OperatorButton';
import { PageContext } from '../models/context';

const Patch = () => {
    const context = useContext(PageContext);

    return (
        <>
            <header className="ow-header-middle">更新说明</header>
            <main className="ow-content-middle">
                <div className="ow-post ow-hide-h1">
                    <CHANGELOG />
                </div>
                <OperatorButton
                    className="ow-right-bottom-button"
                    keyName="ESC"
                    onClick={context.method.pop}
                >
                    返回
                </OperatorButton>
            </main>
        </>
    );
};

export default Patch;
