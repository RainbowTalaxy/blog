import styled from 'styled-components';

const Container = styled.div`
    display: grid;
    align-items: center;
    justify-items: center;
    flex: 1;
    background-color: var(--theme-color-yellow);

    .box {
        display: grid;
        align-items: center;
        justify-items: center;
        width: 500px;
        height: 500px;

        --stripe-color: var(--theme-color-red);
        --gt: linear-gradient(var(--stripe-color), var(--stripe-color));
        --n: 100px;
        --h: calc(var(--n) - 5px);

        width: 500px;
        height: 500px;
        background: var(--gt) top right, var(--gt) top var(--n) right,
            var(--gt) top calc(var(--n) * 2) right,
            var(--gt) top calc(var(--n) * 3) right,
            var(--gt) top calc(var(--n) * 4) right, var(--theme-color-orange);
        background-repeat: no-repeat;
        background-size: 60% var(--h), 90% var(--h), 70% var(--h), 40% var(--h),
            10% var(--h);

        transition: background-size 0.75s;
    }

    .box:hover {
        background-size: 100% var(--h);
    }
`;

const Page = () => {
    return (
        <Container>
            <div className="box" />
        </Container>
    );
};

export default Page;
