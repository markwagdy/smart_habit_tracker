import axios from 'axios';

const baseUrl = "http://localhost:8000/api/auth";


export const getHabits=() => {
  return axios.get(`${baseUrl}/habits/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  })
  .then(response => {
    console.log('Habits fetched successfully:', response.data);
    return response.data;
  })
  .catch(error => {
    console.error('Error fetching habits:', error);
    throw error;
  });
}


export const addHabit = async (habit) => {
  try {
    const response = await axios.post(`${baseUrl}/habits/`, habit, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding habit:', error);
    throw error;
  }
};

export const updateHabit = async (habitId, updatedHabit) => {
  try {
    const response = await axios.put(`${baseUrl}/habits/${habitId}/`, updatedHabit, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating habit:', error);
    throw error;
  }
};
export const deleteHabit = async (habitId) => {
  try {
    const response = await axios.delete(`${baseUrl}/habits/${habitId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting habit:', error);
    throw error;
  }
};

export const addLog = async (habitId) => {
  try {
    const response = await axios.post(`${baseUrl}/habits/${habitId}/add_log/`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding log:', error);
    throw error;
  }
};
