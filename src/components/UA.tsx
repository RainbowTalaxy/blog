import { useEffect, useState } from 'react';

const UA = () => {
    const [ua, setUA] = useState('');

    useEffect(() => {
        setUA(window.navigator.userAgent);
    }, []);

    return <span>{ua}</span>;
};

export default UA;
