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

function handleCredentialResponse(response) {
    console(response)
    const user = jwt_decode(response.credential);
    localStorage.setItem('user', JSON.stringify(user));
}

$('#loginForm').submit(async function (event) {
    event.preventDefault(); // Prevent form submission

    // Get username and password values
    var username = $('#name').val();
    var password = $('#password').val();

    // Create data object with username and password
    var data = {
        name: username,
        password: password
    };

    // LoginPost(data);
    // google.accounts.id.initialize({
    //     client_id: procc,
    //     callback: handleCredentialResponse
    // });
    // google.accounts.id.prompt();
    var response = await LoginGoogle()
    // console.log(response)
});

function initializeGoogleAuth(){
    // google.accounts.id.initialize({
    //     client_id: '1049613930159-5cgdnpd05d8p77q82015lpfltlslrlsq.apps.googleusercontent.com',
    //     callback: handleCredentialResponse
    // });
    // google.accounts.id.prompt();

    // google.accounts.id.renderButton(
    //     document.getElementById('googleLoginBtn'),
    //     { theme: 'outline', size: 'large' }  // customization attributes
    // );
}

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

// document.addEventListener('DOMContentLoaded', (event) => {
//     initializeGoogleAuth();
// });