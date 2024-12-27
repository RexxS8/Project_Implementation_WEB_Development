document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
        showHomePage();
    } else {
        showLoginPage();
    }

    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        fetch('/login/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('isLoggedIn', 'true');
                showHomePage();
            } else {
                alert(data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    document.getElementById('update-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const projectId = document.getElementById('project-name').dataset.projectId;
        fetch(`/api/implementations/${projectId}/`, {
            method: 'PUT',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Project updated successfully!');
                showProjectListPage();
                loadProjectsFromStorage();
            } else {
                alert('Error updating project');
            }
        })
        .catch(error => console.error('Error:', error));
    });

    loadProjectsFromStorage();
});

function showLoginPage() {
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('project-list-page').style.display = 'none';
    document.getElementById('update-implementation-page').style.display = 'none';
}

function showHomePage() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('home-page').style.display = 'block';
    document.getElementById('project-list-page').style.display = 'none';
    document.getElementById('update-implementation-page').style.display = 'none';
}

function showProjectListPage() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('project-list-page').style.display = 'block';
    document.getElementById('update-implementation-page').style.display = 'none';
}

function showUpdateImplementationPage(projectId) {
    fetch(`/api/implementations/${projectId}/`)
    .then(response => response.json())
    .then(data => {
        document.getElementById('project-name').value = data.project_name;
        document.getElementById('project-name').dataset.projectId = data.id;
        document.getElementById('activity').value = data.activity;
        document.getElementById('start-date').value = data.start_date;
        document.getElementById('end-date').value = data.end_date;
        document.getElementById('status').value = data.status;
        // Add logic to handle file input if needed
        showUpdateFormPage(); // Menampilkan halaman update setelah mendapatkan data
    })
    .catch(error => console.error('Error:', error));
}

function showUpdateFormPage() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('project-list-page').style.display = 'none';
    document.getElementById('update-implementation-page').style.display = 'block';
}

function loadProjectsFromStorage() {
    fetch('/api/implementations/')
    .then(response => response.json())
    .then(data => {
        const projects = data.projects || [];
        displayProjects(projects);
    })
    .catch(error => console.error('Error:', error));
}

function displayProjects(projects) {
    const tbody = document.getElementById('project-table').querySelector('tbody');
    tbody.innerHTML = '';

    projects.forEach((project, index) => {
        const row = document.createElement('tr');

        const projectNameCell = document.createElement('td');
        projectNameCell.textContent = project['Project Name'];
        row.appendChild(projectNameCell);

        const activityCell = document.createElement('td');
        activityCell.textContent = project['Activity'];
        row.appendChild(activityCell);

        const startDateCell = document.createElement('td');
        startDateCell.textContent = project['Start Date'];
        row.appendChild(startDateCell);

        const endDateCell = document.createElement('td');
        endDateCell.textContent = project['End Date'];
        row.appendChild(endDateCell);

        const statusCell = document.createElement('td');
        statusCell.textContent = project['Status'];
        row.appendChild(statusCell);

        const fileCell = document.createElement('td');
        fileCell.textContent = project['File'];
        row.appendChild(fileCell);

        const actionsCell = document.createElement('td');
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => showUpdateImplementationPage(project.id));
        actionsCell.appendChild(updateButton);
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });
}

function searchProjects() {
    const searchValue = document.getElementById('search-box').value.toLowerCase();
    const rows = document.querySelectorAll('#project-table tbody tr');

    rows.forEach(row => {
        const projectName = row.cells[0].textContent.toLowerCase();
        if (projectName.includes(searchValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function showDownloadPopup() {
    // Implement functionality to show a download popup if needed
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
