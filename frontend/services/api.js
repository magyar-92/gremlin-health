import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const userService = {
  async createUser(email, username) {
    const response = await api.post('/users', { email, username });
    return response.data;
  },

  async getUser(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  async listUsers() {
    const response = await api.get('/users');
    return response.data;
  },
};

export const stepsService = {
  async syncSteps(userId, date, steps) {
    const response = await api.post(`/users/${userId}/steps`, {
      date,
      steps,
    });
    return response.data;
  },

  async getStepsHistory(userId) {
    const response = await api.get(`/users/${userId}/steps`);
    return response.data;
  },

  async getStepsByDate(userId, date) {
    const response = await api.get(`/users/${userId}/steps/date/${date}`);
    return response.data;
  },
};

export const photoService = {
  async uploadPhoto(userId, latitude, longitude, imageUrl, metadata = null) {
    const response = await api.post(`/users/${userId}/photos`, {
      latitude,
      longitude,
      image_url: imageUrl,
      photo_metadata: metadata,
    });
    return response.data;
  },

  async getPhotos(userId) {
    const response = await api.get(`/users/${userId}/photos`);
    return response.data;
  },

  async getPhoto(photoId) {
    const response = await api.get(`/photos/${photoId}`);
    return response.data;
  },
};

export const cardService = {
  async createCard(userId, stepsCount, photoId, title, description, cardUrl) {
    const response = await api.post(`/users/${userId}/cards`, {
      steps_count: stepsCount,
      photo_id: photoId,
      title,
      description,
      card_url: cardUrl,
    });
    return response.data;
  },

  async getCards(userId) {
    const response = await api.get(`/users/${userId}/cards`);
    return response.data;
  },

  async getCard(cardId) {
    const response = await api.get(`/cards/${cardId}`);
    return response.data;
  },
};

export default api;
