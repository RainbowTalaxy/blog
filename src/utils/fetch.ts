export interface ResponseError {
    error: string;
    message?: string;
}

export async function rawFetch<Data>(
    url: string,
    method: string,
    data: any = null,
) {
    const isGET = method === 'GET' || method === 'HEAD';
    if (isGET) {
        url = url + (data ? `?${new URLSearchParams(data)}` : '');
    }
    const options = isGET
        ? {}
        : {
              body: JSON.stringify(data || {}),
          };
    const res = await fetch(url, {
        method,
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    });
    const result: Data = await res.json();
    if (!res.ok)
        throw new Error((result as ResponseError).message || '其他错误');
    return result;
}
