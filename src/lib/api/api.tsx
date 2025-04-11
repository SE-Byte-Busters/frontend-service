"use client";

type FetchOptions = {
    method: 'GET' | 'POST' | 'PUT';
    url: string;
    body?: any;
    headers?: Record<string, string>;
};

export async function makeRequest({ method, url, body, headers }: FetchOptions): Promise<any> {
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: method === 'POST' || method === 'PUT' ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            throw new Error(response.message);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}
