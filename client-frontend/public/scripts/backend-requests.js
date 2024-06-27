var Endpoint = localStorage.getItem('Endpoint');
// --- Users
function createUser() {
    var username = $('#newUsername').val();

    $.ajax({
        type: 'POST',
        url: Endpoint+'/api/users',
        contentType: 'application/json',
        data: JSON.stringify({ name: username, password: 123 }),
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
            url: Endpoint+'/api/users',
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
function LoginPost(userData, Endpoints){
    // Send AJAX request
	console.log(Endpoints)
	Endpoint = Endpoints
	localStorage.setItem('Endpoint', Endpoint);
    $.ajax({
        type: 'POST',
        url: Endpoint+'/api/users/login',
        contentType: 'application/json',
        data: JSON.stringify(userData),
        success: function (response) {
            var userInfo = {
                "id": response.id,
                "name": userData.name,
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
async function createGroupPost(users){
    const names = users.map(user => user["name"]).sort();
    var groupName = names.join(", ");
    var is_pm_group = false;
    if (names.length == 2){
        is_pm_group = true;
    }

    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: Endpoint+'/api/groups',
            contentType: 'application/json',
            data: JSON.stringify({ name: groupName, users: users, is_pm_group: is_pm_group }),
            success: function (response) {
                // Handle success response
                displayUserChats();
                resolve(response);
                alert('Group created successfully!');
            },
            error: function (xhr, status, error) {
                // Handle error response
                console.error('Error creating group:', error);
                alert('Error creating group. Please try again');
            }
        });
    });
}

async function getGroups() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: Endpoint+'/api/groups',
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

async function getUserGroups(user_id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: Endpoint+`/api/users/${user_id}`,
            contentType: 'application/json',
            success: function (response) {
                resolve(response.groups);
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

async function checkIfPmExists(users){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: Endpoint+'/api/pms',
            contentType: 'application/json',
            data: JSON.stringify({ "Id_targ": users }),
            success: function (response) {
                // Handle success response
                if (response == "Not Found"){
                    resolve(false)
                }

                resolve(response)
            },
            error: function (xhr, status, error) {
                // Handle error response
                console.error('Error checking pm', error);
            }
        });
    });
}