import React from 'react';

interface Props {
    symbol: string;
    label?: string;
}

const Emoji = ({ symbol, label }: Props) => (
    <span className="emoji" role="img" aria-label={label || ''} aria-hidden={!label}>
        {symbol}
    </span>
);

export default Emoji;
