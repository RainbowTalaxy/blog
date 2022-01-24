import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { TabBarItems } from '../data';

interface ProgressViewProps {
    topSpace?: number;
    bottomSpace?: number;
}

const ProgressView = styled.div`
    --progress-left-size: 30px;
    --progress-line-width: 4px;

    position: relative;
    margin-left: var(--progress-left-size);
    padding: ${({ topSpace = 1, bottomSpace = 1 }: ProgressViewProps) =>
        `${topSpace}px 0 ${bottomSpace}px`};

    ::before {
        position: absolute;
        top: 0;
        left: calc(-1 * var(--progress-left-size));
        bottom: 0;
        border-right: var(--progress-line-width) dashed var(--theme-secondary);
        content: '';
    }

    > div + div {
        margin-top: 20px;
    }
`;

export default ProgressView;

export const ProgressItem = styled.div`
    position: relative;

    ::before {
        --dot-size: 10px;
        position: absolute;
        margin: auto 0;
        top: 0;
        bottom: 0;
        left: calc(
            -1 * var(--progress-left-size) - 0.5 * var(--dot-size) + 0.5 * var(--progress-line-width)
        );
        width: var(--dot-size);
        height: var(--dot-size);
        border-radius: 50%;
        background: var(--theme-color);
        content: '';
    }

    ::after {
        position: absolute;
        margin: auto 0;
        top: 0;
        bottom: 0;
        left: calc(-1 * var(--progress-left-size));
        width: var(--progress-left-size);
        height: 2px;
        background: var(--theme-primary);
        content: '';
    }
`;
