let socket;
var WEBSOCKETS_URL = localStorage.getItem('WEBSOCKETS_URL');
var CHAT_BACKEND_URL = localStorage.getItem('CHAT_BACKEND_URL');
var broadcastChatTitle = document.getElementById("broadcast-chat-title");
function fetchEnvs(){
	return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: '/env/KEY',
            contentType: 'application/json',
            success: function (response) {
                CHAT_BACKEND_URL = response.CHAT_BACKEND_URL;
				WEBSOCKETS_URL = response.WEBSOCKETS_URL;
				console.log(response)

				localStorage.setItem('CHAT_BACKEND_URL', CHAT_BACKEND_URL);
				localStorage.setItem('WEBSOCKETS_URL', WEBSOCKETS_URL);
            },
            error: function (xhr, status, error) {
                console.error('Error retrieving groups:', error);
                resolve(null);//TODO this should be async but oh well
			}
		});
	})
}
async function connect() {
	$.get('/env/KEY').done(function (data) {
		console.log(data)
		console.log(data.KEY)
		Key = data.KEY;
		BACKEND_URL = data.BACKEND_URL;
		CHAT_BACKEND_URL = data.CHAT_BACKEND_URL
		
	});
	console.log("HERE");
	console.log(localStorage.getItem('WEBSOCKETS_URL'))
    socket = new WebSocket(localStorage.getItem('WEBSOCKETS_URL')+"/chat");

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
	console.log(CHAT_BACKEND_URL)

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
            url: CHAT_BACKEND_URL+'/chat',
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