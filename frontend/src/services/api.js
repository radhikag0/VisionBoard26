import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Goals API
export const goalsAPI = {
  getAll: async () => {
    const response = await axios.get(`${API}/goals`);
    return response.data;
  },
  create: async (goalData) => {
    const response = await axios.post(`${API}/goals`, goalData);
    return response.data;
  },
  update: async (id, goalData) => {
    const response = await axios.put(`${API}/goals/${id}`, goalData);
    return response.data;
  },
  delete: async (id) => {
    const response = await axios.delete(`${API}/goals/${id}`);
    return response.data;
  }
};

// Todos API
export const todosAPI = {
  getAll: async () => {
    const response = await axios.get(`${API}/todos`);
    return response.data;
  },
  create: async (todoData) => {
    const response = await axios.post(`${API}/todos`, todoData);
    return response.data;
  },
  update: async (id, todoData) => {
    const response = await axios.put(`${API}/todos/${id}`, todoData);
    return response.data;
  },
  delete: async (id) => {
    const response = await axios.delete(`${API}/todos/${id}`);
    return response.data;
  }
};

// MoodBoard API
export const moodboardAPI = {
  getAll: async () => {
    const response = await axios.get(`${API}/moodboard`);
    return response.data;
  },
  create: async (imageData) => {
    const response = await axios.post(`${API}/moodboard`, imageData);
    return response.data;
  },
  update: async (id, imageData) => {
    const response = await axios.put(`${API}/moodboard/${id}`, imageData);
    return response.data;
  },
  delete: async (id) => {
    const response = await axios.delete(`${API}/moodboard/${id}`);
    return response.data;
  }
};

// Gallery API
export const galleryAPI = {
  getAll: async () => {
    const response = await axios.get(`${API}/gallery`);
    return response.data;
  },
  create: async (itemData) => {
    const response = await axios.post(`${API}/gallery`, itemData);
    return response.data;
  },
  delete: async (id) => {
    const response = await axios.delete(`${API}/gallery/${id}`);
    return response.data;
  }
};

// File Upload API
export const uploadAPI = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
