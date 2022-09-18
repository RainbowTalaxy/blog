import Slider from '@site/src/components/Slider';
import styled from 'styled-components';

const Container = styled.div`
    padding: 30px;
`;

const Page = () => {
    return (
        <Container>
            <Slider />
        </Container>
    );
};

export default Page;
