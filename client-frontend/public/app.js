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
  
const handleCredentialResponse = (credsResponse)=>{
    console.log(credsResponse);
    var headerObj  = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(credsResponse.credential.split(".")[0]));
    var payloadObj  = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(credsResponse.credential.split(".")[1]));
    console.log(headerObj);
    console.log(payloadObj); // User data

    // localStorage.setItem("userInfo")
};

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

    google.accounts.id.initialize({
        client_id: '1049613930159-p4pnna3htktedb4dacp3r1qcrsjb4kv0.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        ux_mode: "redirect",
        context: "signin",
        cancel_on_tap_outside: false,
        auto_select: true
    });

    google.accounts.id.prompt((notification) => {
        if(notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log("Prompt cancelled by user");
        }
    });
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