import styled from 'styled-components';

const Container = styled.div`
    position: relative;
    margin-bottom: 20px;

    .box {
        --item-gap: 16px;
        display: flex;
        flex-wrap: wrap;
        max-width: 500px;
        border: 2px dashed #6a8bad;
    }

    .box > div {
        flex: 1 0 auto;
        min-width: 150px;
        height: 70px;
        background: #6a8bad;
    }

    .box > div + div {
        margin: 0 0 var(--item-gap) var(--item-gap);
    }

    .box2 {
        --item-gap: 16px;
        display: flex;
        flex-wrap: wrap;
        max-width: calc(500px + var(--item-gap));
        width: calc(100% + var(--item-gap));
        transform: translateX(calc(-0.5 * var(--item-gap)));
        border: 2px dashed #6a8bad;
    }

    .box2 > div {
        flex: 1 0 auto;
        margin: 0 calc(0.5 * var(--item-gap)) var(--item-gap);
        min-width: 130px;
        height: 70px;
        background: #6a8bad;
    }
`;

export const FlexDemo1 = () => {
    return (
        <Container>
            <div className="box">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </Container>
    );
};

export const FlexDemo2 = () => {
    return (
        <Container>
            <div className="box2">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </Container>
    );
};
