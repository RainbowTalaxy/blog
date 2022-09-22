import { createContext, ReactNode, useState, memo, useContext } from 'react';
import styled from 'styled-components';

const Container = styled.main`
    padding: 30px;

    .memo {
        margin: 20px 0;
        padding: 20px;
        border: 1px solid black;
    }

    .consumer {
        padding: 20px;
        border: 1px solid black;
    }
`;

const PageContext = createContext(true);

const Memo = memo(({ children }: { children: ReactNode }) => {
    console.log('[update] memo');

    return (
        <div className="memo">
            <h2>Memo Box.</h2>
            {children}
        </div>
    );
});

const Consumer = () => {
    const toggle = useContext(PageContext);
    console.log('[update] context consumer');

    return (
        <div className="consumer">
            <h3>Context Consumer.</h3>
            <p>Context value is {toggle ? 'true' : 'false'}</p>
        </div>
    );
};

const Page = () => {
    const [toggle, setToggle] = useState(true);
    console.log('[update] page');

    return (
        <Container>
            <h1>Context meet Memo</h1>
            <p>Context value is {toggle ? 'true' : 'false'}.</p>
            <button onClick={() => setToggle(!toggle)}>Toggle value</button>
            <PageContext.Provider value={toggle}>
                <Memo>
                    <Consumer />
                </Memo>
            </PageContext.Provider>
        </Container>
    );
};

export default Page;
