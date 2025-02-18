export interface Prescription {
    id?: string;
    patientId: string;
    doctorId: string;
    medication: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate: string;
    notes?: string;
    reminderSettings?: {
      times: string[];
      notifyCaretaker: boolean;
    }
  }
  
  export const validatePrescriptionData = (data: Partial<Prescription>): string[] => {
    const errors: string[] = [];
  
    if (!data.medication || data.medication.length < 2) {
      errors.push('Medication name must be at least 2 characters long');
    }
  
    if (!data.dosage) {
      errors.push('Dosage is required');
    }
  
    if (!data.frequency) {
      errors.push('Frequency is required');
    }
  
    if (!data.startDate || !isValidDate(data.startDate)) {
      errors.push('Valid start date is required');
    }
  
    if (!data.endDate || !isValidDate(data.endDate)) {
      errors.push('Valid end date is required');
    }
  
    if (data.startDate && data.endDate) {
      if (new Date(data.startDate) > new Date(data.endDate)) {
        errors.push('End date must be after start date');
      }
    }
  
    return errors;
  };
  
  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };