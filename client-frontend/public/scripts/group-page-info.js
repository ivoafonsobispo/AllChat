var groupPageGroupName = document.getElementById("group-page-group-name");
var groupPageGroupUsers = document.getElementById("group-page-group-users");

var groupId = getQueryParams().id;

let socket;

var configData;
fetch('/config')
    .then(response => response.json())
    .then(config => {
        // console.log('Frontend URL:', config.frontendURL);
        // console.log('Google Client ID:', config.googleClientId);
        // console.log('Google Client Secret:', config.googleClientSecret);
        configData = config
        document.getElementById('chat-back-href').href = config.frontendURL;

    })
    .catch(error => console.error('Error fetching config:', error));


function getUserInfo() {
    var storedInfo = localStorage.getItem('userInfo');
    if (storedInfo) {
        return JSON.parse(storedInfo);
    } else {
        return null;
    }
}

async function displayGroupInfo() {
    var groupInfo = await getGroupDetails(groupId);

    var groupUsers = groupInfo["users"];
    var groupUsersNames = [];

    groupUsers.forEach(user => {
        groupUsersNames.push(user.name)
    });

    groupPageGroupName.innerHTML = groupInfo["name"];
    groupPageGroupUsers.innerHTML = groupUsersNames.join(", ");

    displayGroupMessages()
}

function newTableline(message) {
    return `<tr style='display: block;'>
                <td style='display: flex;'> 
                    <div class="group-message-name-and-message">
                        <span><b>${message.username}</b></span>
                        <span>${message.content}</span>
                    </div>
                    <span style='margin-left: auto; color: #a6a6a6;'> ${message.timestamp}</span>
                </td>
            </tr>`
}

function newTablelineWS(message) {
    return `<tr style='display: block;'>
                <td style='display: flex;'> 
                    <div class="group-message-name-and-message">
                        <span>${message}</span>
                    </div>
                </td>
            </tr>`
}

async function displayGroupMessages() {
    var messagesObject = await getGroupMessages(groupId);
    var messages = messagesObject.messages;

    messages.forEach(message => {
        message.timestamp = formatMessageDate(message.timestamp);
        $("#group-chat-body").append(newTableline(message));
    });

    var groupChatBody = document.getElementById('group-chat-body');
    groupChatBody.scrollTop = groupChatBody.scrollHeight;
}


function sendMessage() {
    var message = {
        "username": getUserInfo().name,
        "content": $('#group-message').val()
    }

    socket.send(JSON.stringify(message));

    if (message) {
        sendMessageToGroup(groupId, message);
    }
}

function formatMessageDate(isoDateString){
    let date = new Date(isoDateString);

    // Define an array of weekday names
    let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // Define an array of month names
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Get the various components of the date
    let weekday = weekdays[date.getUTCDay()];
    let month = months[date.getUTCMonth()];
    let day = date.getUTCDate();
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    
    // Ensure double digits for hours and minutes
    let formattedHours = hours.toString().padStart(2, '0');
    let formattedMinutes = minutes.toString().padStart(2, '0');
    
    // Format the date string
    return `${weekday} ${month} ${day} ${formattedHours}:${formattedMinutes}`;
}

// Websocket Config
function connect() {
    socket = new WebSocket(configData.websocketsURL + "/chat?groupId=" + groupId);

    socket.onopen = function (event) {
        console.log("Connected: " + event);
    };

    socket.onmessage = function (event) {
        
        // Date
        let parts = event.data.substring(1).split(") ");
        let date = parts[0];

        let nameContent = parts[1].split(": ");
        let username = nameContent[0];

        let content = nameContent[1];

        message = {
            "timestamp": date,
            "username": username,
            "content": content
        }
        $("#group-chat-body").append(newTableline(message));
    };

    socket.onerror = function (error) {
        console.error('Error with WebSocket', error);
    };

    socket.onclose = function (event) {
        console.log("Disconnected");
    };
}

function disconnect() {
    if (socket) {
        socket.close();
    }
}

displayGroupInfo()

$(function () {
    connect()
    $("form").on('submit', (e) => e.preventDefault());
    $("#send-group-message").click(() => sendMessage());
});


