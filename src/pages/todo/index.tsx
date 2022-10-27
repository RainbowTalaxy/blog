import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import axios from 'axios';
import { useEffect } from 'react';

const Page = () => {
    const {
        siteConfig: { customFields },
    } = useDocusaurusContext();

    useEffect(() => {
        axios
            .put('https://blog.talaxy.cn/api/user', {
                username: 'test6',
                credential: 'bbb',
            })
            .then();
    }, []);

    return <div>当前环境：{customFields.env}</div>;
};

export default Page;
