import queryString from 'query-string';

export const sendRequest = async <T>(props: IRequest) => {
    //type
    let { url, method, body, queryParams = {}, useCredentials = false, headers = {}, nextOption = {} } = props;

    const options: any = {
        method: method,
        // by default setting the content-type to be json type
        headers: new Headers({ 'content-type': 'application/json', ...headers }),
        body: body ? JSON.stringify(body) : null,
        ...nextOption,
    };
    if (useCredentials) options.credentials = 'include';

    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    return fetch(url, options).then(async (res) => {
        const isJson = res.headers.get('content-type')?.includes('application/json');
        if (res.ok) {
            if (isJson) {
                return (await res.json()) as T;
            } else {
                return {} as T;
            }
        } else {
            if (isJson) {
                return res.json().then(function (json) {
                    // to be able to access error status when you catch the error
                    return {
                        statusCode: res.status,
                        message: json?.message ?? '',
                        error: json?.error ?? '',
                    } as T;
                });
            } else {
                return {
                    statusCode: res.status,
                    message: '',
                    error: '',
                } as T;
            }
        }
    });
};

export const sendRequestFile = async <T>(props: IRequest) => {
    //type
    let { url, method, body, queryParams = {}, useCredentials = false, headers = {}, nextOption = {} } = props;

    const options: any = {
        method: method,
        // by default setting the content-type to be json type
        headers: new Headers({ ...headers }),
        body: body ? body : null,
        ...nextOption,
    };
    if (useCredentials) options.credentials = 'include';

    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    return fetch(url, options).then(async (res) => {
        const isJson = res.headers.get('content-type')?.includes('application/json');
        if (res.ok) {
            if (isJson) {
                return (await res.json()) as T;
            } else {
                return {} as T;
            }
        } else {
            if (isJson) {
                return res.json().then(function (json) {
                    // to be able to access error status when you catch the error
                    return {
                        statusCode: res.status,
                        message: json?.message ?? '',
                        error: json?.error ?? '',
                    } as T;
                });
            } else {
                return {
                    statusCode: res.status,
                    message: '',
                    error: '',
                } as T;
            }
        }
    });
};
