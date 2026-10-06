const API_BASE_URL = '/api';

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
  const primaryUrl = `${API_BASE_URL}${endpoint}`;

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
    try {
      const res = await fetch(`${API_BASE_URL}/problems`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }
};


