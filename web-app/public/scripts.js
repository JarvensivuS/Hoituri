function filterPatients() {
    let input = document.getElementById('search').value.toLowerCase();
    let patients = document.querySelectorAll('.patient-list li');
    patients.forEach(patient => {
        if (patient.textContent.toLowerCase().includes(input)) {
            patient.style.display = '';
        } else {
            patient.style.display = 'none';
        }
    });
}
