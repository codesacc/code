document.addEventListener('DOMContentLoaded', function() {
    // Login Logic
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const userId = document.getElementById('userId');
        const password = document.getElementById('password');

        // Example prefilled values
        userId.value = 'user123';
        password.value = 'password123';

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const enteredUserId = userId.value;
            const enteredPassword = password.value;

            if (enteredUserId === 'user123' && enteredPassword === 'password123') {
                // Redirect to the dashboard
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid credentials!');
            }
        });
    }

    // Dashboard Logic
    const dataEntryForm = document.getElementById('dataEntryForm');
    const dataTable = document.getElementById('dataTable')?.querySelector('tbody');
    const downloadExcelButton = document.getElementById('downloadExcel');
    const logoutButton = document.getElementById('logoutButton');

    let dataEntries = JSON.parse(localStorage.getItem('dataEntries')) || [];

    if (dataEntryForm) {
        dataEntryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('entryName').value;
            const age = document.getElementById('entryAge').value;
            const location = document.getElementById('entryLocation').value;

            const entry = { id: Date.now(), name, age, location };
            dataEntries.push(entry);
            localStorage.setItem('dataEntries', JSON.stringify(dataEntries));

            renderTable();
            dataEntryForm.reset();
        });
    }

    function renderTable() {
        dataTable.innerHTML = '';
        dataEntries.forEach(entry => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${entry.name}</td>
                <td>${entry.age}</td>
                <td>${entry.location}</td>
                <td class="actions">
                    <button onclick="editEntry(${entry.id})">Edit</button>
                    <button class="delete" onclick="deleteEntry(${entry.id})">Delete</button>
                </td>
            `;

            dataTable.appendChild(row);
        });
    }

    window.editEntry = function(id) {
        const entry = dataEntries.find(e => e.id === id);
        document.getElementById('entryName').value = entry.name;
        document.getElementById('entryAge').value = entry.age;
        document.getElementById('entryLocation').value = entry.location;

        deleteEntry(id);
    };

    window.deleteEntry = function(id) {
        dataEntries = dataEntries.filter(e => e.id !== id);
        localStorage.setItem('dataEntries', JSON.stringify(dataEntries));
        renderTable();
    };

    if (downloadExcelButton) {
        downloadExcelButton.addEventListener('click', function() {
            const ws = XLSX.utils.json_to_sheet(dataEntries);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Entries');
            XLSX.writeFile(wb, 'data_entries.xlsx');
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    if (dataTable) {
        renderTable();
    }
});
