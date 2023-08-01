import HomePage from '@site/src/modules/luoye/pages/HomePage';
import { useEffect } from 'react';

const Page = () => {
    useEffect(() => {
        document.title = '落页';
    }, []);

    return <HomePage />;
};

export default Page;
