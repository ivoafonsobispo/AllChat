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
    // const user = jwt_decode(response.credential);
    // localStorage.setItem('user', JSON.stringify(user));
}

// Function to fetch user profile data using ID token
async function fetchUserProfile(idToken) {
    const url = 'https://www.googleapis.com/oauth2/v3/userinfo';
    const options = {
        headers: {
            'Authorization': `Bearer ${idToken}`
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }
        const userData = await response.json();
        console.log('User Data:', userData);

        // Example: Display user information in UI
        displayUserData(userData);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        // Handle error
    }
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

    google.accounts.id.initialize({
        client_id: '1049613930159-p4pnna3htktedb4dacp3r1qcrsjb4kv0.apps.googleusercontent.com', // Replace with your actual client ID
        callback: handleCredentialResponse
    });
    google.accounts.id.prompt()

    // gapi.load('auth2', function() {
    //     gapi.auth2.init({
    //         client_id: '1049613930159-p4pnna3htktedb4dacp3r1qcrsjb4kv0.apps.googleusercontent.com',
    //         redirect_uri: 'http://localhost:3000', // Replace with your redirect URI
    //         scope: 'email profile openid' // Specify the scopes you need
    //     }).then(function(auth2) {
    //         console.log('Google Auth2 Initialized');
    //         // Auth2 instance is now available for use
    //         gapi.auth2.getAuthInstance().signIn().then(
    //             googleUser => { 
    //                 const idToken = googleUser.getAuthResponse().id_token;
    //                 console.log('ID Token:', idToken);
        
    //                 // Example: Call function to fetch user profile data
    //                 fetchUserProfile(idToken);
    //             },
    //             error => {
    //                 console.error('Google sign-in error:', error);
    //             }
    //         );
    //     }).catch(function(error) {
    //         console.error('Error initializing Google Auth2:', error);
    //     });
    // });
    
    

    // LoginPost(data);
    // google.accounts.id.initialize({
    //     client_id: procc,
    //     callback: handleCredentialResponse
    // });
    // google.accounts.id.prompt();
    // var url = `https://accounts.google.com/o/oauth2/v2/auth?
    //             scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly&
    //             include_granted_scopes=true&
    //             response_type=token&
    //             state=state_parameter_passthrough_value&
    //             redirect_uri=http://localhost:3000&
    //             client_id=1049613930159-5cgdnpd05d8p77q82015lpfltlslrlsq.apps.googleusercontent.com`

    // window.location.href = url

    // fetch(url)
    // .then(response => {
    //     if (!response.ok) {
    //     throw new Error('Network response was not ok');
    //     }
    //     console.log(response)
    //     return response.text(); // or response.json() if expecting JSON
    // })
    // .then(data => {
    //     // Handle the response data
    //     console.log(data);
    // })
    // .catch(error => {
    //     // Handle errors
    //     console.error('Error fetching data:', error);
    // });
    // var response = await LoginGoogle()
    // window.open("http://127.0.0.1/auth/google", "myWindow", 'width=800,height=600');
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

function getQueryParams() {
    const params = {};
    const queryString = window.location.pathname;
    const parts = queryString.split('/');
    if (parts.length >= 3) {
        params.id = parts[parts.length - 1];
    }
    return params;
}

// Display the ID
const params = getQueryParams()

// document.addEventListener('DOMContentLoaded', (event) => {
//     initializeGoogleAuth();
// });