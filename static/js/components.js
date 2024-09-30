function loadComponent(url, placeholderId) {
    return fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(placeholderId).innerHTML = data;
        })
        .catch(error => console.error(`Error loading ${placeholderId}:`, error));
}

document.addEventListener('DOMContentLoaded', function() {
    Promise.all([
        loadComponent('./components/footer.html', 'footer-placeholder'),
        loadComponent('./components/sidebar.html', 'sidebar-placeholder'),
        loadComponent('./components/navbar.html', 'navbar-placeholder')
    ]).then(() => {
        const script = document.createElement('script');
        script.src = './static/js/script.js';
        document.body.appendChild(script);
    }).catch(error => console.error('Error loading components:', error));
});