import { ComponentType, useContext } from 'react';
import OperatorButton from '../components/OperatorButton';
import { PageContext } from '../models/context';

interface Props {
    title: string;
    doc: ComponentType;
}

const Document = ({ title, doc: Doc }: Props) => {
    const context = useContext(PageContext);

    return (
        <>
            <header className="ow-header-middle">{title}</header>
            <main className="ow-content-middle">
                <div className="ow-post ow-hide-h1">
                    <Doc />
                </div>
                <OperatorButton
                    className="ow-right-bottom-button"
                    keyName="ESC"
                    onClick={context.history.pop}
                >
                    返回
                </OperatorButton>
            </main>
        </>
    );
};

export default Document;
