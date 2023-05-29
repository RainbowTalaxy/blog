import { useEffect } from 'react';
import { getUser } from '../utils/user';

const useUserEntry = () => {
    useEffect(() => {
        const user = getUser();
        const element = document.querySelector(
            '.header-unsplash-link',
        ) as HTMLAnchorElement;
        element.innerHTML = user.id || '设置用户';
        element.setAttribute(
            'href',
            '/user' + '?nextUrl=' + encodeURIComponent(window.location.href),
        );
        element.removeAttribute('target');
        element.removeAttribute('rel');
        element.style.background = 'var(--ifm-menu-color-background-active)';
        element.style.borderRadius = '0.25rem';
        element.style.marginRight = '8px';
    }, []);
};

export default useUserEntry;
