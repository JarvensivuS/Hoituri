import { useState, useEffect } from "react";
import { 
  getPatients, 
  getUsers, 
  removeDoctorFromPatient, 
  addCaretakerToPatient, 
  removeCaretakerFromPatient,
  addDoctorToPatient,
  createUser
} from "../../../services/api";

export default function usePatientData(userId) {
  const [patients, setPatients] = useState([]);
  const [caretakers, setCaretakers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [patientsData, allUsers] = await Promise.all([
          getPatients(userId),
          getUsers(userId)
        ]);
        
        setPatients(patientsData);
        
        const caretakersData = allUsers.filter(user => user.role === 'caretaker');
        setCaretakers(caretakersData);
        
        const doctorsData = allUsers.filter(user => user.role === 'doctor');
        setDoctors(doctorsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Tietojen lataaminen epäonnistui");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const createPatient = async (patientName, patientEmail, password = "password123", phoneNumber = "") => {
    if (!patientName || !patientEmail) {
      throw new Error("Potilaan nimi ja sähköposti ovat pakollisia kenttiä");
    }
  
    try {
      setActionLoading(true);
    
      const patientData = {
        role: "patient",
        name: patientName,
        email: patientEmail,
        password: password,
        phoneNumber: phoneNumber || undefined 
      };
      
      const newPatientResponse = await createUser(userId, patientData);
      
      if (newPatientResponse && newPatientResponse.id) {
        try {
          await addDoctorToPatient(userId, newPatientResponse.id);
          
          const updatedPatient = {
            ...newPatientResponse,
            relationships: {
              doctorIds: [userId]
            }
          };
          
          setPatients([...patients, updatedPatient]);
          
          return updatedPatient;
        } catch (relationError) {
          console.error("Failed to add doctor relationship:", relationError);
          throw new Error("Potilas luotiin, mutta lääkärisuhdetta ei voitu asettaa.");
        }
      }
    } catch (err) {
      console.error("Failed to create patient:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const createCaretaker = async (patientId, caretakerName, caretakerEmail, caretakerPhone = "") => {
    if (!caretakerName || !caretakerEmail) {
      throw new Error("Omaisen nimi ja sähköposti ovat pakollisia kenttiä");
    }
    
    if (!patientId) {
      throw new Error("Potilasta ei ole valittu");
    }
  
    try {
      setActionLoading(true);
      
      const caretakerData = {
        role: "caretaker",
        name: caretakerName,
        email: caretakerEmail,
        phoneNumber: caretakerPhone,
        password: "password123"
      };
      
      const newCaretakerResponse = await createUser(userId, caretakerData);
      
      if (newCaretakerResponse && newCaretakerResponse.id) {
        try {
          await addCaretakerToPatient(userId, patientId, newCaretakerResponse.id);
          
          const updatedPatients = patients.map(patient => {
            if (patient.id === patientId) {
              return {
                ...patient,
                relationships: {
                  ...patient.relationships || {},
                  caretakerId: newCaretakerResponse.id
                }
              };
            }
            return patient;
          });
          
          setPatients(updatedPatients);
          setCaretakers([...caretakers, newCaretakerResponse]);
          
          return newCaretakerResponse;
        } catch (relationError) {
          console.error("Failed to set patient-caretaker relationship:", relationError);
          throw new Error("Omainen luotiin, mutta potilassuhdetta ei voitu asettaa.");
        }
      }
    } catch (err) {
      console.error("Failed to create caretaker:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const addDoctor = async (patientId, doctorId) => {
    if (!patientId || !doctorId) {
      throw new Error("Potilas ja lääkäri vaaditaan");
    }
    
    try {
      setActionLoading(true);
      await addDoctorToPatient(doctorId, patientId);
      
      const updatedPatients = patients.map(patient => {
        if (patient.id === patientId) {
          const updatedRelationships = { ...patient.relationships || {} };
          if (!updatedRelationships.doctorIds) {
            updatedRelationships.doctorIds = [];
          }
          if (!updatedRelationships.doctorIds.includes(doctorId)) {
            updatedRelationships.doctorIds.push(doctorId);
          }
          
          return {
            ...patient,
            relationships: updatedRelationships
          };
        }
        return patient;
      });
      
      setPatients(updatedPatients);
      return true;
    } catch (err) {
      console.error("Failed to add doctor:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const removeDoctor = async (patientId, doctorId) => {
    try {
      setActionLoading(true);
      await removeDoctorFromPatient(doctorId, patientId);
      
      const updatedPatients = patients.map(patient => {
        if (patient.id === patientId) {
          const updatedRelationships = { ...patient.relationships || {} };
          if (updatedRelationships.doctorIds) {
            updatedRelationships.doctorIds = updatedRelationships.doctorIds.filter(
              id => id !== doctorId
            );
          }
          
          return {
            ...patient,
            relationships: updatedRelationships
          };
        }
        return patient;
      });
      
      setPatients(updatedPatients);
      return true;
    } catch (err) {
      console.error("Failed to remove doctor:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const removeCaretaker = async (patientId, caretakerId) => {
    try {
      setActionLoading(true);
      await removeCaretakerFromPatient(userId, patientId, caretakerId);
      
      const updatedPatients = patients.map(patient => {
        if (patient.id === patientId) {
          const updatedRelationships = { ...patient.relationships || {} };
          delete updatedRelationships.caretakerId;
          
          return {
            ...patient,
            relationships: updatedRelationships
          };
        }
        return patient;
      });
      
      setPatients(updatedPatients);
      return true;
    } catch (err) {
      console.error("Failed to remove caretaker:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    patients,
    caretakers,
    doctors,
    loading,
    error,
    actionLoading,
    createPatient,
    createCaretaker,
    addDoctor,
    removeDoctor,
    removeCaretaker
  };
}