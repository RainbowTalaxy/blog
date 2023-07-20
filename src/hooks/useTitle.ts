import { useHistory } from '@docusaurus/router';
import { useEffect } from 'react';

const useTitle = (name: string, url?: string) => {
    const history = useHistory();

    useEffect(() => {
        const titleEle =
            document.querySelector<HTMLAnchorElement>('.navbar__brand');
        const textEle = document.querySelector<HTMLElement>('.navbar__title');
        const oldText = textEle?.textContent;
        const handler = (e: MouseEvent) => {
            e.preventDefault();
            history.push(url || '/');
        };
        if (titleEle) {
            titleEle.addEventListener('click', handler);
            textEle!.textContent = name;
        }

        return () => {
            if (titleEle) {
                titleEle.removeEventListener('click', handler);
                textEle!.textContent = oldText;
            }
        };
    }, []);
};

export default useTitle;
