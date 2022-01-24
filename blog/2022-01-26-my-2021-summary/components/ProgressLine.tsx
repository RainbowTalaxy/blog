import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { TabBarItems } from '../data';

interface Props {
    children: ReactNode;
}

const ProgressView = styled.div`
    --progress-left-size: 30px;
    --progress-line-width: 2px;

    position: relative;
    padding: 15px 0;

    ::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        border: var(--progress-line-width) dashed var(--theme-secondary);
    }

    > div + div {
        margin-top: 20px;
    }
`;

export default ProgressView;

const Container = styled.div`
    position: relative;
    margin: 0 0 0 var(--progress-left-size);
    padding: 15px 30px;
    border: 1px solid var(--theme-primary);
    border-radius: 30px;
    background: var(--theme-background);

    ::before {
        --dot-size: 10px;
        content: '';
        position: absolute;
        margin: auto 0;
        top: 0;
        bottom: 0;
        left: calc(
            -1 * var(--progress-left-size) - 0.5 * var(--dot-size) + var(--progress-line-width)
        );
        width: var(--dot-size);
        height: var(--dot-size);
        border-radius: 50%;
        background: var(--theme-color);
    }

    ::after {
        content: '';
        position: absolute;
        margin: auto 0;
        top: 0;
        bottom: 0;
        left: calc(-1 * var(--progress-left-size));
        width: var(--progress-left-size);
        height: 2px;
        background: var(--theme-primary);
    }
`;

export const ProgressItem = ({ children }: Props) => {
    return <Container>{children}</Container>;
};
