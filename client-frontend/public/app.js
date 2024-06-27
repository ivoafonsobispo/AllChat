var Key = null;
var BACKEND_URL = null;
var REMOTE_WEBSOCKET = null;
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
    LoginPost(userData, BACKEND_URL)
};

$('#loginForm').submit(async function (event) {
    event.preventDefault(); // Prevent form submission

    google.accounts.id.initialize({
        client_id: Key,
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
	$.get('/env/KEY').done(function (data) {
		console.log(data)
		console.log(data.KEY)
		Key = data.KEY;
		BACKEND_URL = data.BACKEND_URL;
		REMOTE_WEBSOCKET = data.REMOTE_WEBSOCKET
	});
    $("form").on('submit', (e) => e.preventDefault());
    $("#createAccountBtn").click(() => createUser());
    $("#logoutBtn").click(() => logout())
	//Get /API/KEY
	
	
	
});

updateButtonsDisabled()
