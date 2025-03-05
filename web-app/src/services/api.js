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

export const managePatientCaretaker = async (doctorId, patientId, caretakerId, action) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${patientId}/relationships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': doctorId
      },
      body: JSON.stringify({
        caretakerId: caretakerId,
        action: action // 'add' or 'remove'
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to manage caretaker');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error managing caretaker:', error);
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

export const addCaretakerToPatient = async (doctorId, patientId, caretakerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${patientId}/relationships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': doctorId
      },
      body: JSON.stringify({
        caretakerId: caretakerId,
        action: 'add'
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add caretaker to patient');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding caretaker to patient:', error);
    throw error;
  }
};

export const addDoctorToPatient = async (doctorId, patientId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${patientId}/relationships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': doctorId
      },
      body: JSON.stringify({
        doctorId: doctorId,
        action: 'add'
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add doctor to patient');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding doctor to patient:', error);
    throw error;
  }
};

export const removeDoctorFromPatient = async (doctorId, patientId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${patientId}/relationships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': doctorId
      },
      body: JSON.stringify({
        doctorId: doctorId,
        action: 'remove'
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to remove doctor from patient');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error removing doctor from patient:', error);
    throw error;
  }
};

export const createUser = async (creatorId, userData) => {
  try {
    if (!userData.role || !userData.name || !userData.email || !userData.password) {
      throw new Error('Missing required fields: role, name, email, and password are required');
    }
    
    console.log('Creating user with data:', {
      ...userData,
      password: '[REDACTED]' 
    });
    
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': creatorId
      },
      body: JSON.stringify({
        role: userData.role,
        name: userData.name,
        email: userData.email,
        password: userData.password
      }),
    });
    
    let responseData;
    try {
      responseData = await response.json();
    } catch (error) {
      console.error('Failed to parse response', error);
      throw new Error('Invalid response from server');
    }
    
    console.log('API response status:', response.status);
    console.log('API response data:', responseData);
    
    if (!response.ok) {
      throw new Error(responseData.error || responseData.errors?.join(', ') || 'Failed to create user');
    }
    
    return responseData;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const removeCaretakerFromPatient = async (userId, patientId, caretakerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${patientId}/relationships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId
      },
      body: JSON.stringify({
        caretakerId: caretakerId,
        action: 'remove'
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to remove caretaker from patient');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error removing caretaker from patient:', error);
    throw error;
  }
};