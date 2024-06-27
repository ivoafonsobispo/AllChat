function showMessageBroadcast(message) {
    $("#broadcast-chat").append("<tr><td>" + message + "</td></tr>");
}

console.log(process.env)

var configData;
fetch('/config')
    .then(response => response.json())
    .then(config => {
        configData = config

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
    // console.log(credsResponse);
    var headerObj  = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(credsResponse.credential.split(".")[0]));
    var payloadObj  = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(credsResponse.credential.split(".")[1]));
    // console.log(headerObj);
    // console.log(payloadObj); // User data

    var userData = {
        "name": payloadObj.email,
        "password": 123
    }
    LoginPost(userData)
};

$('#loginForm').submit(async function (event) {
    event.preventDefault(); // Prevent form submission

    google.accounts.id.initialize({
        client_id: configData.googleClientId,
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
	//Get /API/KEY

});

updateButtonsDisabled()
