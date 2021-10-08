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
    editUsername()

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

alert('dinject script loader has been injected successfully!\nfor more info, visit https://github.com/angelsflyinhell/disject')
// function loadCSS() {
//     const file = location.pathname.split( "/" ).pop();
//
//     const link = document.createElement( "link" );
//     link.href = "Y:\\Downloads\\theme.css";
//     link.type = "text/css";
//     link.rel = "stylesheet";
//     link.media = "screen,print";
//
//     document.getElementsByTagName( "head" )[0].appendChild( link );
// }
// loadCSS()

function editUsername() {
    document.getElementsByClassName('size14-e6ZScH title-eS5yk3').item(0).textContent = 'Dinject'
}