import { useLocation } from '@docusaurus/router';
import { useMemo } from 'react';

function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

export default useQuery;
