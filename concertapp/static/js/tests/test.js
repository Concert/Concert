function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
    return 'AssertException: ' + this.message;
}

function assert(exp, message) {
    if (!exp) {
        throw new AssertException(message);
    }
}

var LoadPage = function(name, url, action) {
    if(!phantom.state) {
        phantom.state = name;
        console.log('Opening '+url);
        phantom.open(url);
    } else {
        action();
        phantom.exit();
    }
};

LoadPage("login", "http://localhost:8896/", function() {
    var loginFormUsername = document.getElementById('id_username');
    var loginFormPassword = document.getElementById('id_password');
    var loginFormSubmit = document.querySelector('input[type="submit"]');

    loginFormUsername.value = 'colin';
    loginFormPassword.value = 'colin';
    loginFormSubmit.click();

    /* Now make sure we're on the dashboard page */
    while(window.location != 'http://localhost:8896/dashboard/') {
        console.log('window.location:');
        console.log(window.location);
        
    }
    console.log('window.location:');
    console.log(window.location);
    
});