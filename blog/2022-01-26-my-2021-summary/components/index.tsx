import React from 'react';
import styled from 'styled-components';

export const ProgressItemTitle = styled.div`
    margin: 10px 0 20px 14px;
    color: var(--theme-color);
    font-size: large;
    font-weight: bold;
`;

export const Card = styled.div`
    margin-bottom: 45px;
    padding: 15px 20px 5px;
    border: 1px solid var(--theme-primary);
    border-radius: 26px;
    background: var(--theme-background);
    overflow: scroll;
`;

export const Paragraph = styled.p`
    margin-bottom: 10px;
`;

export const Image = styled.img`
    margin-bottom: 10px;
    max-height: 50vh;
    border-radius: 15px;
`;

export const Quote = styled.div`
    --quote-left-size: 18px;
    position: relative;
    margin: 0 0 10px var(--quote-left-size);
    color: var(--theme-primary);

    ::before {
        position: absolute;
        top: 0;
        left: calc(-1 * var(--quote-left-size));
        bottom: 0;
        width: 4px;
        border-radius: 2px;
        background: var(--theme-secondary);
        content: '';
    }

    p {
        margin: 0 0 5px;
    }

    p > span {
        padding: 0 10px;
    }
`;
