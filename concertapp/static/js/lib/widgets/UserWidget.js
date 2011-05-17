/**
 *  @file       UserWidget.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A user widget is typically how a user is displayed on the UI.
 *  @class
 **/
function UserWidget(params) {
    if(params) {
        this.init(params);
    }
}
//UserWidget.prototype = new Widget();

UserWidget.prototype.init = function(params) {
    //Widget.prototype.init.call(this, params);
    
    var container = params.container;
    if(typeof(container) == 'undefined') {
        throw new Error('params.container is undefined');
    }
    else if(container.length == 0) {
        throw new Error('container not found');
    }
    this.container = container;

    

    var usernameContainer = container.children('.user_widget_username');
    if(typeof(usernameContainer) == 'undefined') {
        throw new Error('usernameContainer is undefined');
    }
    else if(usernameContainer.length == 0) {
        throw new Error('malformed HTML: usernameContainer not found');
    }
    this.usernameContainer = usernameContainer;

    
    
}