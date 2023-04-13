import styled from 'styled-components';

const Container = styled.div`
    padding: 30px;

    .nest-window {
        display: block;
        width: 100%;
        height: 600px;
        border: 1px solid black;
    }

    > * {
        display: block;
        margin-bottom: 16px;
    }
`;

const route = '/playground/anchor-target';

const Page = () => {
    return (
        <Container>
            <h1>Anchor "target" 属性</h1>
            <p>
                <strong>页面地址：</strong>
                <a href={route}>{route}</a>
            </p>
            <iframe
                className="nest-window"
                src="/playground/anchor-target-duo"
            />
        </Container>
    );
};

export default Page;
