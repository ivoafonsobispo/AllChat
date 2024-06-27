var configData;
fetch('/config')
    .then(response => response.json())
    .then(config => {
        configData = config

    })
    .catch(error => console.error('Error fetching config:', error));


async function getGroupMessages(group_id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: configData.chatbackendURL + `chat/${group_id}`,
            contentType: 'application/json',
            success: function (response) {
                resolve(response);
            },
            error: function (xhr, status, error) {
                console.error('Error retrieving user groups:', error);
                resolve(null);
            }
        });
    });
}


async function sendMessageToGroup(group_id, message){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: configData.chatbackendURL + `chat`,
            contentType: 'application/json',
            data: JSON.stringify({ groupId: group_id, message: {"username": message.username, "content": message.content} }),
            error: function (xhr, status, error) {
                console.error('Error sending message:', error);
            }
        });
    });
}