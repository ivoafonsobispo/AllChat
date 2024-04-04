let socket;

function connect() {
    socket = new WebSocket("ws://localhost:8001/chat");

    socket.onopen = function (event) {
        setConnected(true);
        console.log("Connected: " + event);
    };

    socket.onmessage = function (event) {
        showMessage(event.data);
    };

    socket.onerror = function (error) {
        console.error('Error with WebSocket', error);
    };

    socket.onclose = function (event) {
        setConnected(false);
        console.log("Disconnected");
    };
}

function disconnect() {
    if (socket) {
        socket.close();
    }
}

function sendName() {
    var storedCredentials = getUserCredentials();

    if (storedCredentials) {
        var username = storedCredentials.name;

        var message = {
            'name': username,
            'content': $('#message').val()
        };

        socket.send(JSON.stringify(message));
    } else {
        alert('User credentials not found.');
    }
}

function showMessage(message) {
    console.log('Message received:', message);
    $("#chat").append("<tr><td>" + message + "</td></tr>");
}

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    } else {
        $("#conversation").hide();
    }
    $("#chat").html("");
}

function getUserCredentials() {
    var storedCredentials = localStorage.getItem('userCredentials');
    if (storedCredentials) {
        return JSON.parse(storedCredentials);
    } else {
        return null;
    }
}

function createAccount() {
    var username = $('#newUsername').val();
    var password = $('#newPassword').val();

    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/api/users',
        contentType: 'application/json',
        data: JSON.stringify({ name: username, password: password }),
        success: function (response) {
            // Handle success response
            console.log('Account created successfully:', response);
            alert('Account created successfully!');
        },
        error: function (xhr, status, error) {
            // Handle error response
            console.error('Error creating account:', error);
            alert('Error creating account. Please try again');
        }
    });
}

// Check if user credentials exist in local storage on page load
var storedCredentials = getUserCredentials();
if (storedCredentials) {
    // If credentials exist, populate the login form
    $('#name').val(storedCredentials.name);
    $('#password').val(storedCredentials.password);
}


$('#loginForm').submit(function (event) {
    event.preventDefault(); // Prevent form submission

    // Get username and password values
    var username = $('#name').val();
    var password = $('#password').val();

    // Create data object with username and password
    var data = {
        name: username,
        password: password
    };

    // Send AJAX request
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/api/users/login',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            console.log('Login successful:', response);
            // Save user credentials in local storage
            localStorage.setItem('userCredentials', JSON.stringify(data));
            alert('Login successful!');
        },
        error: function (xhr, status, error) {
            console.error('Error logging in:', error);
            alert('Login failed. Please check your credentials.');
        }
    });
});

$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    $("#connect").click(() => connect());
    $("#disconnect").click(() => disconnect());
    $("#send").click(() => sendName());
    $("#createAccountBtn").click(() => createAccount());
});
