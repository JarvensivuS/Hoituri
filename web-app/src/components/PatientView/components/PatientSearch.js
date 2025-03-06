import "../styles/PatientSearch.css";

const PatientSearch = ({ searchTerm, setSearchTerm, disabled }) => {
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Etsi..."
      style={{ padding: '8px', width: '250px' }}
      disabled={disabled}
    />
  );
};

export default PatientSearch;