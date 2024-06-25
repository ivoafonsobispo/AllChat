let socket;

var broadcastChatTitle = document.getElementById("broadcast-chat-title");

function connect() {
    socket = new WebSocket("ws://localhost:8001/chat");

    socket.onopen = function (event) {
        setConnected(true);
        console.log("Connected: " + event);
    };

    socket.onmessage = function (event) {
        showMessageBroadcast(event.data);
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

function sendMessage() {
    var storedInfo = getUserInfo();

    if (storedInfo) {
        var username = storedInfo.name;

        var message = {
            'username': username,
            'content': $('#message').val()
        };

        socket.send(JSON.stringify(message));

        $.ajax({
            type: 'POST',
            url: 'http://localhost:8002/chat',
            contentType: 'application/json',
            data: JSON.stringify({ name: message.name, content: message.content }),
            error: function (xhr, status, error) {
                console.error('Error saving message:', error);
            }
        });
    } else {
        alert('User credentials not found.');
    }
}

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#broadcast-chat").show();
        broadcastChatTitle.innerHTML = "Chat - receiving ✅";
    } else {
        $("#broadcast-chat").hide();
        broadcastChatTitle.innerHTML = "Chat - not receiving ❌";
    }
    $("#chat").html("");
}

$(function () {
    $("#connect").click(() => connect());
    $("#disconnect").click(() => disconnect());
    $("#send-broadcast-message").click(() => sendMessage());
});