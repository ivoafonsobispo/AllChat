// --- Users
function createUser() {
    var username = $('#newUsername').val();
    var password = $('#newPassword').val();

    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/api/users',
        contentType: 'application/json',
        data: JSON.stringify({ name: username, password: password }),
        success: function (response) {
            // Handle success response
            alert('Account created successfully!');
        },
        error: function (xhr, status, error) {
            // Handle error response
            console.error('Error creating account:', error);
            alert('Error creating account. Please try again');
        }
    });
}

async function getUsers() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8000/api/users',
            contentType: 'application/json',
            success: function (response) {
                resolve(response);
            },
            error: function (xhr, status, error) {
                console.error('Error retrieving users:', error);
                resolve(null);
            }
        });
    });
}

// --- Login
function LoginPost(userData){
    // Send AJAX request
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/api/users/login',
        contentType: 'application/json',
        data: JSON.stringify(userData),
        success: function (response) {
            var userInfo = {
                "id": response.id,
                "name": userData.name,
                "password": userData.password
            };
            
            // Save user credentials in local storage
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            updateButtonsDisabled();
            displayUserChats();

        },
        error: function (xhr, status, error) {
            console.error('Error logging in:', error);
            alert('Login failed. Please check your credentials.');
        }
    });
}

// --- Groups
function createGroupPost(users){
    const names = users.map(user => user["name"]).sort();
    var groupName = names.join(", ");

    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/api/groups',
        contentType: 'application/json',
        data: JSON.stringify({ name: groupName, users: users }),
        success: function (response) {
            // Handle success response
            alert('Group created successfully!');
        },
        error: function (xhr, status, error) {
            // Handle error response
            console.error('Error creating group:', error);
            alert('Error creating group. Please try again');
        }
    });
}

async function getGroups() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8000/api/groups',
            contentType: 'application/json',
            success: function (response) {
                resolve(response);
            },
            error: function (xhr, status, error) {
                console.error('Error retrieving groups:', error);
                resolve(null);
            }
        });
    });
}

async function getUserGroups(id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: `http://localhost:8000/api/groups/${id}`,
            contentType: 'application/json',
            success: function (response) {
                resolve(response);
            },
            error: function (xhr, status, error) {
                console.error('Error retrieving user groups:', error);
                resolve(null);
            }
        });
    });
}

async function getGroupDetails(id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: `http://localhost:8000/api/groups/${id}`,
            contentType: 'application/json',
            success: function (response) {
                resolve(response);
            },
            error: function (xhr, status, error) {
                console.error('Error retrieving group details:', error);
                resolve(null);
            }
        });
    });
}