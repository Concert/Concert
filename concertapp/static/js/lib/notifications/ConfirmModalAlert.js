/**
 *  @file       ConfirmModalAlert.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  A subclass of ModalAlert, when a confirmation is needed.
 *	@class
 **/
function ConfirmModalAlert(params) {
    if(params) {
        this.init(params);
    }
}
ConfirmModalAlert.prototype = new ModalAlert();


ConfirmModalAlert.prototype.init = function(params) {
    ModalAlert.prototype.init.call(this, params);

    /* By default, the OK button just has "OK" in it */
    var confirmButton = $('button#modal-overlay-confirm-ok');
    /* And the cancel button is hidden */
    var cancelButton = $('button#modal-overlay-confirm-cancel');
    
    
    confirmButton.bind('click', function(me) {
        return function() {
            $(me).trigger('confirm');
            me.confirmButtonCallback();
            me.close();
            me.initButtons();
        };
    }(this));
    
    cancelButton.bind('click', function(me) {
        return function() {
            $(me).trigger('cancel');
            me.cancelButtonCallback();
            me.close();
            me.initButtons();
        };
    }(this));

    this.confirmButton = confirmButton;
    this.cancelButton = cancelButton;
    
    /* The functions that will be executed when these buttons are clicked */
    this.confirmButtonCallback = null;
    this.cancelButtonCallback = null;
    
    this.initButtons();
}

ConfirmModalAlert.prototype.initButtons = function() {
    this.confirmButton.html('OK');
    this.cancelButton.hide();
    this.confirmButtonCallback = function() {
        /* Poop */
    };
    this.cancelButtonCallback = function() {
        /* Poop */
    };
    
}

/**
 *  Same as parent's loadAndDisplay, except with a confirm button.
 **/
ConfirmModalAlert.prototype.loadAndDisplayContentWithConfirm = function(params) {
    params.callback = function(me, params) {
        return function(data) {
            params.content = data;
            me.displayContentWithConfirm(params)
        }
    }(this, params);
    
    ModalAlert.prototype.loadAndDisplayContent.call(this, params);
}


/**
 *  If display content is called, make sure we hide buttons if necessary.
 **/
ConfirmModalAlert.prototype.displayContent = function(params) {
    ModalAlert.prototype.displayContent.call(this, params);
    
    var noOptions = params.noOptions;
    if(typeof(noOptions) == 'undefined') {
        noOptions = false;
    }
    
    if(noOptions) {
        this.confirmButton.hide();
        this.cancelButton.hide();
    }
    else {
        this.confirmButton.show();
        this.cancelButton.hide();
    }
}

/**
 *  Same as parent's displayContent, except with a confirm and cancel button
 *
 *  @param  {Object}        params  {
 *                          cancelText: The string to place in the cancel button
 *                          confirmText: The string for the OK button.
 *                          confirmCallback: The function to call when user confirms
 *                          cancelCallback: the function to call when user cancels
 *                          ...see ModalAlert.prototype.displayContent
 *                      }
 **/
ConfirmModalAlert.prototype.displayContentWithConfirm = function(params) {
    ModalAlert.prototype.displayContent.call(this, params);
    
    var cancelText = params.cancelText;
    var confirmText = params.confirmText;
    if(typeof(cancelText) == 'undefined') {
        cancelText = 'Cancel';
    }
    if(typeof(confirmText) == 'undefined') {
        confirmText = 'OK';
    }
    
    var confirmButton = this.confirmButton;
    var cancelButton = this.cancelButton;
    
    var confirmCallback = params.confirmCallback;
    this.confirmButtonCallback = confirmCallback;
    var cancelCallback = params.cancelCallback;
    this.cancelButtonCallback = cancelCallback;
        
    confirmButton.html(confirmText);
    cancelButton.html(cancelText).show();
    
}