import styled from 'styled-components';
import Post from './lorem.mdx';

const Container = styled.div`
    padding: 30px;
`;

const Page = () => {
    return (
        <Container>
            <Post />
            <Post />
            <Post />
        </Container>
    );
};

export default Page;
