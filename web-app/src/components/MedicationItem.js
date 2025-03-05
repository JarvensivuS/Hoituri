import { handleDeletePrescription } from "../utils/medicationHandlers";
import "../styles.css"

const MedicationItem = ({ prescription, userId, onDelete }) => {
  const handleDelete = async () => {
    try {
      const success = await handleDeletePrescription(userId, prescription.id);
      if (success && onDelete) {
        onDelete(prescription.id);
      }
    } catch (error) {
      console.error("Error during deletion:", error);
      alert("Lääkemuistutuksen poistaminen epäonnistui");
    }
  };

  return (
    <tr style={{ backgroundColor: prescription.index % 2 === 0 ? "#fff" : "#f9f9f9" }}>
      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{prescription.patientName}</td>
      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{prescription.medicine}</td>
      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{prescription.dosage}</td>
      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{prescription.day}</td>
      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{prescription.time}</td>
      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
        {prescription.notifyCaretaker ? "Kyllä" : "Ei"}
      </td>
      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
        <button 
          onClick={handleDelete}
          className="delete-btn"
        >
          Poista
        </button>
      </td>
    </tr>
  );
};

export default MedicationItem;