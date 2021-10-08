// Discord requires a authorization token to send messages.
// We will fetch this token by listening to request discord makes
let authTokenObtained = false;
let insideChannelRequest = false;
let authToken = "";
let xsuperToken = "";

// We override the default AJAX request to listen to the requests discord makes.
var proxied1 = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function() {
    console.log(arguments[1]);
    if(arguments[1].startsWith('https://discordapp.com/api/v9/channels')){
        if(!authTokenObtained){
            insideChannelRequest = true;
        }
        (function(url){
            setTimeout(function(){ // wait for the ui to update.
                let elements = document.getElementsByTagName('h3');
                // We update the UI to display the channel name.
                if(elements.length >= 1 && elements[0].style.userSelect !== "text"){ // add channel URL to name
                    elements[0].style.userSelect = "text";
                    elements[0].innerHTML += " | "+url.substring("https://discordapp.com/api/v9/channels".length);
                }
            },1000);
        })(arguments[1]);
    }
    return proxied1.apply(this, [].slice.call(arguments));
};

let proxied2 = window.XMLHttpRequest.prototype.setRequestHeader;
window.XMLHttpRequest.prototype.setRequestHeader = function() {
    if(insideChannelRequest && !authTokenObtained && arguments[0] === "Authorization"){
        authToken = arguments[1];
        authTokenObtained = true;
        console.log("Token Obtained.");
    }
    if(insideChannelRequest && arguments[0] == "X-Super-Properties"){
        xsuperToken = arguments[1];
        console.log("X-Super-Properties updated.")
    }
    // console.log( arguments );
    return proxied2.apply(this, [].slice.call(arguments));
};

// We can now define a sendMessage function that behaves exactly like discord:
function sendMessage(msg,channel){
    if(!authTokenObtained){
        console.log("Unable to send message without authToken.");
        console.log("Try typing something in a chat to obtain the token.");
    }
    channel_url = `https://discordapp.com/api/v9/channels/${channel}/messages`;

    request = new XMLHttpRequest();
    request.withCredentials = true;
    request.open("POST", channel_url);
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("Authorization", authToken);
    request.setRequestHeader("X-Super-Properties", xsuperToken);
    request.send(JSON.stringify({ content: msg, tts: false }));
}