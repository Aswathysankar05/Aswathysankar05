// src/utils/logger.ts
import axios from 'axios';

export const sendLogToBackend = async (message: string, level: string) => {
  try {
    const response = await axios.post('http://localhost:8080/api/logs', {
      message,
      level,
    });
    console.log('Log sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending log:', error);
  }
};
