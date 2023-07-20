import { Button, Input, Select, TextArea } from '@site/src/components/Form';
import styled from 'styled-components';

const Container = styled.div`
    margin: 32px auto;
    width: 90vw;
    max-width: 800px;

    h2 {
        margin-top: 20px;
    }

    button {
        margin-right: 16px;
    }
`;

const Page = () => {
    return (
        <Container>
            <h2>按钮</h2>
            <Button>Normal</Button>
            <Button type="primary">Primary</Button>
            <Button type="danger">Danger</Button>

            <h2>输入框</h2>
            <Input />

            <h2>文本框</h2>
            <TextArea />

            <h2>选择框</h2>
            <Select>
                <option>hello</option>
                <option>world</option>
            </Select>
        </Container>
    );
};

export default Page;
