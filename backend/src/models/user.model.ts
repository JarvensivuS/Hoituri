export interface UserRelationships {
  doctorIds?: string[];     
  patientIds?: string[];    
  caretakerId?: string;     
}

export interface UserPermissions {
  shareWithCaretaker: boolean;  
}

export interface User {
  id?: string;
  role: 'doctor' | 'patient' | 'caretaker';
  name: string;
  email: string;
  password?: string; 
  phoneNumber?: string;
  relationships?: UserRelationships;
  permissions?: UserPermissions;
}

export const VALID_ROLES = ['doctor', 'patient', 'caretaker'] as const;

export const isValidRole = (role: string): role is User['role'] => {
  return VALID_ROLES.includes(role as User['role']);
};

export const validateUserData = (data: Partial<User>): string[] => {
  const errors: string[] = [];

  if (data.role && !isValidRole(data.role)) {
    errors.push(`Role must be one of: ${VALID_ROLES.join(', ')}`);
  }

  if (data.name && (data.name.length < 2 || data.name.length > 50)) {
    errors.push('Name must be between 2 and 50 characters');
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  if (data.phoneNumber && !/^[+]?[0-9\s-]{7,15}$/.test(data.phoneNumber)) {
    errors.push('Invalid phone number format');
  }

  if (data.password !== undefined) {
    if (data.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
  }

  return errors;
};