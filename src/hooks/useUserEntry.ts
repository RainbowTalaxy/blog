import { useHistory } from '@docusaurus/router';
import { useEffect } from 'react';
import { getUser } from '../utils/user';

const useUserEntry = () => {
    const history = useHistory();

    useEffect(() => {
        const user = getUser();
        const element = document.querySelector<HTMLAnchorElement>(
            '.header-placeholder',
        );
        if (!element) return;
        element.innerHTML = user.id || '设置用户';
        element.removeAttribute('target');
        element.removeAttribute('rel');
        element.addEventListener('click', (e) => {
            e.preventDefault();
            history.push(
                '/user' +
                    '?nextUrl=' +
                    encodeURIComponent(window.location.href),
            );
        });
        element.style.background = 'var(--ifm-menu-color-background-active)';
        element.style.borderRadius = '0.25rem';
        element.style.marginRight = '8px';
    }, []);
};

export default useUserEntry;
