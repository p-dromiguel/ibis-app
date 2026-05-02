const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
}

function isAuthenticated() {
  return !!getToken();
}

// Helper genérico para fazer requests à API
async function request(endpoint, options = {}) {
  const token = getToken();

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erro na requisição');
  }

  return data;
}

// ---------- Auth ----------

async function register(email, password) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

async function login(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

function logout() {
  removeToken();
}

// ---------- Phrases ----------

async function getPhrases() {
  return request('/phrases');
}

async function createPhrase(phrase) {
  return request('/phrases', {
    method: 'POST',
    body: JSON.stringify(phrase),
  });
}

async function updatePhrase(id, phrase) {
  return request(`/phrases/${id}`, {
    method: 'PUT',
    body: JSON.stringify(phrase),
  });
}

async function deletePhrase(id) {
  return request(`/phrases/${id}`, {
    method: 'DELETE',
  });
}

async function getResonancePick() {
  return request('/phrases/resonance');
}

async function submitResonance(id, status) {
  return request(`/phrases/${id}/resonance`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
}

export {
  isAuthenticated,
  register,
  login,
  logout,
  getPhrases,
  createPhrase,
  updatePhrase,
  deletePhrase,
  getResonancePick,
  submitResonance,
};
