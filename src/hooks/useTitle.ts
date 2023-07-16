import { useHistory } from '@docusaurus/router';
import { useEffect } from 'react';

const useTitle = (name: string, url?: string) => {
    const history = useHistory();

    useEffect(() => {
        const titleEle = document.querySelector('.navbar__brand');
        if (titleEle) {
            titleEle.addEventListener('click', (e) => {
                e.preventDefault();
                history.push(url || '/');
            });
            document.querySelector('.navbar__title')!.textContent = name;
        }
    }, []);
};

export default useTitle;
