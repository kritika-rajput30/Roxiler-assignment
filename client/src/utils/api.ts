const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Access the environment variable

const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Something went wrong');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Helper functions for HTTP methods
// Updated helper functions
const get = (endpoint: string, headers: HeadersInit = {}) =>
  fetchApi(endpoint, {
    method: 'GET',
    headers,
  });

const post = (endpoint: string, body: object, headers: HeadersInit = {}) =>
  fetchApi(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  });

const put = (endpoint: string, body: object, headers: HeadersInit = {}) =>
  fetchApi(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers,
  });

const del = (endpoint: string, headers: HeadersInit = {}) =>
  fetchApi(endpoint, {
    method: 'DELETE',
    headers,
  });

export { get, post, put, del };
