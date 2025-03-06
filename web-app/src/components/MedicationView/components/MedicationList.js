import MedicationItem from "./MedicationItem";
import "../styles/MedicationList.css";

const MedicationList = ({ reminders, userId, onDeletePrescription }) => {
  if (!reminders || reminders.length === 0) {
    return <p>Ei muistutuksia</p>;
  }

  return (
    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
      <h3>Olemassa olevat muistutukset:</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Potilas</th>
            <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Lääke</th>
            <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Annostus</th>
            <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Päivä</th>
            <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Aika</th>
            <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Jaettu hoitajalle</th>
            <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Toiminnot</th>
          </tr>
        </thead>
        <tbody>
          {reminders.map((reminder, index) => (
            <MedicationItem 
              key={reminder.id || index}
              prescription={{...reminder, index}} 
              userId={userId}
              onDelete={onDeletePrescription}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicationList;