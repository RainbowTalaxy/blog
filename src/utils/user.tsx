export interface User {
    id?: string;
    fileApiKey?: string;
}

export const getUser = (): User => {
    const userData = localStorage.getItem('user');
    if (!userData) return {};
    return JSON.parse(userData);
};

export const setUser = (nextUrl?: string) => {
    window.location.href =
        '/user' +
        '?nextUrl=' +
        encodeURIComponent(nextUrl ?? window.location.href);
};
