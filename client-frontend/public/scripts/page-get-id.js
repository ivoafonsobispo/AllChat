// Function to get URL parameters
function getQueryParams() {
    const params = {};
    const queryString = window.location.pathname;
    const parts = queryString.split('/');
    if (parts.length >= 3) {
        params.id = parts[parts.length - 1];
    }
    return params;
}

// Display the ID
const params = getQueryParams();
// document.getElementById('display-id').innerText += params.id;