const DEFAULT_API_URL = '/api';

export const getApiBaseUrl = () => {
  return localStorage.getItem('judgex_api_url') || DEFAULT_API_URL;
};

export const setApiBaseUrl = (url) => {
  if (!url || url.trim() === '' || url === DEFAULT_API_URL) {
    localStorage.removeItem('judgex_api_url');
  } else {
    // Remove trailing slash if present
    localStorage.setItem('judgex_api_url', url.trim().replace(/\/+$/, ''));
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('judgex_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Request with exponential backoff retry to handle Render free-tier cold starts
async function request(endpoint, options = {}, retries = 3, delay = 1500) {
  const baseUrl = getApiBaseUrl();
  let primaryUrl = baseUrl.startsWith('http') || baseUrl.startsWith('/')
    ? `${baseUrl}${endpoint}`
    : `/${baseUrl}${endpoint}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(primaryUrl, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
      }

      return data;
    } catch (err) {
      // If primaryUrl was an external absolute URL and failed (e.g. browser CORS block), try relative '/api' proxy
      if (primaryUrl.startsWith('http') && primaryUrl !== `/api${endpoint}`) {
        console.warn(`[JudgeX API] Direct call to ${primaryUrl} failed (${err.message}). Trying proxy fallback /api${endpoint}`);
        primaryUrl = `/api${endpoint}`;
      }

      if (attempt < retries) {
        console.warn(`[JudgeX API] Attempt ${attempt} failed for ${primaryUrl}. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 1.5;
      } else {
        console.error(`[JudgeX API] Request error on ${primaryUrl}:`, err);
        throw err;
      }
    }
  }
}

export const api = {
  login: (username, password) => 
    request('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }, 1), // Don't retry invalid auth attempts repeatedly

  register: (username, password, is_admin = false) =>
    request('/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, is_admin }),
    }, 1),

  getProblems: () =>
    request('/problems', { method: 'GET' }, 3, 2000),

  submitCode: (problem_id, source_code, language) =>
    request('/submit', {
      method: 'POST',
      body: JSON.stringify({ problem_id, source_code, language }),
    }, 2),

  addProblem: (problemData) =>
    request('/problems', {
      method: 'POST',
      body: JSON.stringify(problemData),
    }),

  addTestCase: (problemId, testCaseData) =>
    request(`/problems/${problemId}/testcases`, {
      method: 'POST',
      body: JSON.stringify(testCaseData),
    }),

  getUsers: () =>
    request('/users'),

  checkHealth: async () => {
    const baseUrl = getApiBaseUrl();
    const testUrl = baseUrl.startsWith('http') || baseUrl.startsWith('/')
      ? `${baseUrl}/problems`
      : `/${baseUrl}/problems`;

    try {
      const res = await fetch(testUrl, { method: 'GET' });
      if (res.ok) return true;
    } catch (err) {
      console.warn(`[JudgeX API] Health check to ${testUrl} failed:`, err);
    }

    // Try fallback proxy if primary failed
    if (baseUrl !== '/api') {
      try {
        const res = await fetch('/api/problems', { method: 'GET' });
        return res.ok;
      } catch {
        return false;
      }
    }
    return false;
  }
};

