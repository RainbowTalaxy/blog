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
    overflow-y: scroll;

    -ms-overflow-style: none;
    scrollbar-width: none;
    ::-webkit-scrollbar {
        display: none;
    }
`;

export const Paragraph = styled.p`
    margin-bottom: 10px;
`;

const ImageWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    max-height: 50vh;
    border-radius: 15px;
    overflow: hidden;

    > img {
        display: block;
    }
`;

export const Image = ({
    src,
    className,
}: {
    src: string;
    className?: string;
}) => {
    return (
        <ImageWrapper className={className}>
            <img referrerPolicy="no-referrer" src={src} />
        </ImageWrapper>
    );
};

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

export const Keyword = styled.div`
    margin: 0 0 0 18px;
    font-weight: bold;
    font-size: 1.5em;

    span {
        padding: 0 10px;
        font-size: 0.7em;
        font-weight: normal;
    }
`;

export const Primary = styled.span`
    padding: 0 5px;
    font-weight: bold;
    color: var(--theme-primary);
`;
