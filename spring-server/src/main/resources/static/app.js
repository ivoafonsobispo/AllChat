const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/ws'
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/chat', (message) => {
        showMessage(JSON.parse(message.body).content);
    });
};

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#chat").html("");
}

function connect() {
    stompClient.activate();
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    // Retrieve stored credentials
    var storedCredentials = getUserCredentials();

    // Check if credentials exist
    if (storedCredentials) {
        // If credentials exist, extract the username
        var username = storedCredentials.name;

        // Publish message with the username
        stompClient.publish({
            destination: "/app/chat",
            body: JSON.stringify({'name': username, 'content': $('#message').val()})
        });
    } else {
        // Alert user if credentials not found
        alert('User credentials not found.');
    }
}

function showMessage(message) {
    console.log('Message received:', message);
    $("#chat").append("<tr><td>" + message + "</td></tr>");
}

function createAccount() {
    var username = $('#newUsername').val();
    var password = $('#newPassword').val();

    $.ajax({
        type: 'POST',
        url: 'http://localhost:8000/api/go/users',
        contentType: 'application/json',
        data: JSON.stringify({ name: username, password: password }),
        success: function(response) {
            // Handle success response
            console.log('Account created successfully:', response);
            alert('Account created successfully!');
        },
        error: function(xhr, status, error) {
            // Handle error response
            console.error('Error creating account:', error);
            alert('Error creating account. Please try again');
        }
    });
}

function getUserCredentials() {
    var storedCredentials = localStorage.getItem('userCredentials');
    if (storedCredentials) {
        return JSON.parse(storedCredentials);
    } else {
        return null; // Return null if credentials are not found
    }
}

// Check if user credentials exist in local storage on page load
var storedCredentials = getUserCredentials();
if (storedCredentials) {
    // If credentials exist, populate the login form
    $('#name').val(storedCredentials.name);
    $('#password').val(storedCredentials.password);
}

$('#loginForm').submit(function(event) {
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
        url: 'http://localhost:8000/api/go/users/login',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            console.log('Login successful:', response);
            // Save user credentials in local storage
            localStorage.setItem('userCredentials', JSON.stringify(data));
            alert('Login successful!');
        },
        error: function(xhr, status, error) {
            console.error('Error logging in:', error);
            alert('Login failed. Please check your credentials.');
        }
    });
});

$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    $( "#connect" ).click(() => connect());
    $( "#disconnect" ).click(() => disconnect());
    $( "#send" ).click(() => sendName());
});

