const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/ws'
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/greetings', (greeting) => {
        showGreeting(JSON.parse(greeting.body).content);
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
    $("#greetings").html("");
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
    stompClient.publish({
        destination: "/app/hello",
        body: JSON.stringify({'name': $("#name").val()})
    });
}

function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
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
            // Handle successful login
            console.log('Login successful:', response);
            // Redirect user or perform any other actions
            alert('Login successful!');
        },
        error: function(xhr, status, error) {
            // Handle login error
            console.error('Error logging in:', error);
            // Display error message to the user
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

