const Path = {
    toUserConfig: () => {
        window.location.href =
            '/user' + '?nextUrl=' + encodeURIComponent(window.location.href);
    },
};

export default Path;
