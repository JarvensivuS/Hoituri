const API_BASE_URL = 'http://localhost:3001/api';

export const loginUser = async (email, password, platform = 'web') => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, platform }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getUsers = async (doctorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        'user-id': doctorId
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch users');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getPatients = async (doctorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users?role=patient`, {
      headers: {
        'user-id': doctorId
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch patients');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

export const getPrescriptions = async (doctorId, filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.patientId) queryParams.append('patientId', filters.patientId);
    if (filters.doctorId) queryParams.append('doctorId', filters.doctorId);
    
    const url = `${API_BASE_URL}/prescriptions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'user-id': doctorId
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch prescriptions');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    throw error;
  }
};

export const createPrescription = async (doctorId, prescriptionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/prescriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': doctorId
      },
      body: JSON.stringify(prescriptionData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create prescription');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw error;
  }
};

export const deletePrescription = async (doctorId, prescriptionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/prescriptions/${prescriptionId}`, {
      method: 'DELETE',
      headers: {
        'user-id': doctorId
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete prescription');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting prescription:', error);
    throw error;
  }
};