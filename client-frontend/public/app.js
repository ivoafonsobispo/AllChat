function showMessageBroadcast(message) {
    $("#broadcast-chat").append("<tr><td>" + message + "</td></tr>");
}

function getUserInfo() {
    var storedInfo = localStorage.getItem('userInfo');
    if (storedInfo) {
        return JSON.parse(storedInfo);
    } else {
        return null;
    }
}

// Check if user credentials exist in local storage on page load
var storedInfo = getUserInfo();
if (storedInfo) {
    // If credentials exist, populate the login form
    $('#name').val(storedInfo.name);
    $('#password').val(storedInfo.password);
}

// login Logic
function updateButtonsDisabled(){
    var connectButton = document.getElementById("connect");
    var createGroupButton = document.getElementById("create_group");
    var sendPmButton = document.getElementById("send_pm");
    var sendBroadcastMessageButton = document.getElementById("send-broadcast-message");

    if (getUserInfo() != null){
        connectButton.removeAttribute("disabled");
        createGroupButton.removeAttribute("disabled");
        sendPmButton.removeAttribute("disabled");
        sendBroadcastMessageButton.removeAttribute("disabled");
    } else {
        connectButton.setAttribute("disabled", "disabled");
        createGroupButton.setAttribute("disabled", "disabled");
        sendPmButton.setAttribute("disabled", "disabled");
        sendBroadcastMessageButton.setAttribute("disabled", "disabled");
    }
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

    LoginPost(data);
});

function logout(){
    localStorage.clear()
    updateButtonsDisabled()
    displayUserChats()
}

$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    $("#createAccountBtn").click(() => createUser());
    $("#logoutBtn").click(() => logout())
});

updateButtonsDisabled()