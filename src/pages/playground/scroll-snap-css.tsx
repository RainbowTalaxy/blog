import styled from 'styled-components';

const Container = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;

    .card-view {
        position: relative;
        padding: 20px;
        width: 100%;
        height: 100%;
        scroll-snap-align: start;
    }

    .red {
        background-color: var(--theme-color-red);
    }

    .yellow {
        background-color: var(--theme-color-yellow);
    }

    .green {
        background-color: var(--theme-color-green);
    }

    .blue {
        background-color: var(--theme-color-blue);
    }
`;

const Page = () => {
    return (
        <Container>
            <div className="card-view red">
                <h2>Red</h2>
            </div>
            <div className="card-view yellow">
                <h2>Yellow</h2>
            </div>
            <div className="card-view green">
                <h2>Green</h2>
            </div>
            <div className="card-view blue">
                <h2>Blue</h2>
            </div>
        </Container>
    );
};

export default Page;
