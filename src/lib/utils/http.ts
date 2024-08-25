type CustomOptions = Omit<RequestInit, 'method'> & {
    baseUrl?: string | undefined
}

export class HttpError extends Error {
    status: number
    message: string
    constructor({ status, message }: { status: number; message: string }) {
      super('Http Error')
      this.status = status
      this.message = message
    }
}

export const request = async<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string, 
    options?: CustomOptions | undefined,
    token?: string
    ) => {
    
    let body: FormData | string | undefined = undefined

    if (options?.body instanceof FormData) {
          body = options.body
    } else if (options?.body) {
          body = JSON.stringify(options.body)
    }

    const baseHeaders: {
        [key: string]: string
    } = body instanceof FormData ? 
        {
            'Content-Type': 'multipart/form-data'
        }
        : {
              'Content-Type': 'application/json'
        }

    if (token) {
        baseHeaders['Authorization'] = token
    }

    const baseUrl =
    options?.baseUrl === undefined
      ? process.env.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl

    const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`

    try {
        const res = await fetch(fullUrl, {
            method,
            body,
            headers: baseHeaders,
            credentials: 'include',
        })
        if (!res.ok) {
            const errorData = await res.json();
            throw new HttpError({
                status: res.status,
                message: errorData.msg || res.statusText,
            });
        }

        const payload: T = await res.json()

        const data = {
            status: res.status,
            payload
        }

        return data
    } catch (error: any) {
        throw new HttpError({
            status: 500,
            message: error.msg || 'An unexpected error occurred.',
        });
    }
}

export const http = {
    get<T>(
      url: string,
      options?: Omit<CustomOptions, 'body'> | undefined,
      token?: string 
    ) {
      return request<T>('GET', url, options, token)
    },
    post<T>(
      url: string,
      body: any,
      options?: Omit<CustomOptions, 'body'> | undefined,
      token?: string,
    ) {
      return request<T>('POST', url, { ...options, body }, token)
    },
    put<T>(
      url: string,
      body: any,
      options?: Omit<CustomOptions, 'body'> | undefined,
      token?: string,
    ) {
      return request<T>('PUT', url, { ...options, body }, token)
    },
    patch<T>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, 'body'> | undefined,
        token?: string,
    ) {
        return request<T>('PATCH', url, { ...options, body }, token)
    },
    delete<T>(
      url: string,
      options?: Omit<CustomOptions, 'body'> | undefined,
      token?: string,
    ) {
      return request<T>('DELETE', url, { ...options }, token)
    }
}