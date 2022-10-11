import { useEffect, useState } from 'react';

const UA = () => {
    const [ua, setUA] = useState('');

    useEffect(() => {
        setUA(window.navigator.userAgent);
    }, []);

    return <span>{window.navigator.userAgent}</span>;
};

export default UA;
