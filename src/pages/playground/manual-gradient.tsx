import styled from 'styled-components';

const Container = styled.div`
    display: flex;
`;

const Box = styled.div`
    width: 10px;
    height: 50px;
`;

const originColor = {
    r: 33,
    g: 186,
    b: 155,
};
const targetColor = {
    r: 50,
    g: 116,
    b: 238,
};

const Page = () => {
    const length = 80;
    return (
        <Container>
            {Array(length)
                .fill(null)
                .map((_, idx) => (
                    <Box
                        key={idx}
                        style={{
                            background: `rgb(${
                                originColor.r +
                                ((targetColor.r - originColor.r) * idx) / length
                            }, ${
                                originColor.g +
                                ((targetColor.g - originColor.g) * idx) / length
                            }, ${
                                originColor.b +
                                ((targetColor.b - originColor.b) * idx) / length
                            })`,
                        }}
                    />
                ))}
        </Container>
    );
};

export default Page;
