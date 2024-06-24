var groupPageGroupName = document.getElementById("group-page-group-name");
var groupPageGroupUsers = document.getElementById("group-page-group-users");

var groupId = getQueryParams().id;

function getUserInfo() {
    var storedInfo = localStorage.getItem('userInfo');
    if (storedInfo) {
        return JSON.parse(storedInfo);
    } else {
        return null;
    }
}

async function displayGroupInfo(){
    var groupInfo = await getGroupDetails(groupId);
    console.log(groupInfo)

    var groupUsers = groupInfo["users"];
    var groupUsersNames = [];

    groupUsers.forEach(user => {
        groupUsersNames.push(user.name)
    });

    groupPageGroupName.innerHTML = groupInfo["name"];
    groupPageGroupUsers.innerHTML = groupUsersNames.join(", ");

    displayGroupMessages()
}

function newTableline(message){
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

async function displayGroupMessages(){
    var messagesObject = await getGroupMessages(groupId);
    var messages = messagesObject.messages;

    messages.forEach(message => {
        $("#group-chat-body").append(newTableline(message));
    });

    var groupChatBody = document.getElementById('group-chat-body');
    groupChatBody.scrollTop = groupChatBody.scrollHeight;
}

function sendMessage(){
    var message = { 
        "username": getUserInfo().name,
        "content": $('#group-message').val()
    }

    if(message){
        sendMessageToGroup(groupId, message);
    }
}


displayGroupInfo()

$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    $("#send-group-message").click(() => sendMessage());
});
