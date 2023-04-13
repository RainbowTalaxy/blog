import { AnchorTarget } from '@site/src/constants/css';
import { Fragment } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    padding: 30px;

    > * {
        display: block;
        margin-bottom: 16px;
    }
`;

const TARGETS = Object.values(AnchorTarget);
const parentRoute = '/playground/anchor-target';
const route = '/playground/anchor-target-duo';

const Page = () => {
    return (
        <Container>
            <p>
                <strong>页面地址：</strong>
                <a href={route}>{route}</a>
            </p>
            {[parentRoute, route].map((r) => (
                <Fragment key="r">
                    {TARGETS.map((t) => (
                        <a href={r} target={t}>
                            <strong>href</strong>={r} <strong>target</strong>=
                            {t}
                        </a>
                    ))}
                </Fragment>
            ))}
        </Container>
    );
};

export default Page;
