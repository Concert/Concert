/**
 *  @file       AutocompleteListInputComponent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  This is a component when we need to input a list of entities, with auto complete.
 *  @class
 *  @extends    Component
 **/
var AutocompleteListInputComponent = Component.extend(
/**
 *  @scope AudiocompleteListInputComponent.prototype
 **/
{
    initialize: function() {
        Component.prototype.initialize.call(this);

        var params = this.options;
        
        var inputElement = params.inputElement;
        if(typeof(inputElement) == 'undefined') {
            throw new Error('params.inputElement is undefined');
        }
        this.inputElement = inputElement;
        
        _.bindAll(this, '_handle_input_keyup');
        inputElement.bind('keyup', this._handle_input_keyup);
        
        _.bindAll(this, '_handle_input_blur');
        inputElement.bind('blur', this._handle_input_blur);

        _.bindAll(this, "render");
    },
    
    /**
     *  Regexp used to split the input into separate tokens.
     **/
    TOKEN_SPLITTER: /\s*,\s*|\s{2,}/,
    SPACE_MATCH: /^\s*$/,
    
    /**
     *  Called when there is a keyup event on the input element.
     *
     *  @param  {Event}    e    The keyup event.
     **/
    _handle_input_keyup: function(e) {
        var inputElement = this.inputElement;
        
        var wordSplit = inputElement.val().split(AutocompleteListInputComponent.prototype.TOKEN_SPLITTER);
        
        /* If another token was created because a delimiter was entered */
        if(wordSplit.length > 1
            /* Or the return key was pressed */
            || e.keyCode == 13) {
            /* Grab previous token */
            var token = wordSplit[0];
            
            /* Remove everything from inputElement */
            this.inputElement.val('');
            
            /* If token was fo-real (not just another delimiter character) */
            if(token.length && !token.match(AutocompleteListInputComponent.prototype.SPACE_MATCH)) {
                this._handle_new_token(token);
            }
            
        }
    },
    
    /**
     *  Called when there is a blur event on the input element.
     *
     *  @param  {Event}    e    The blur event.
     **/
    _handle_input_blur: function(e) {
        var inputElement = this.inputElement;
        
        var finalToken = inputElement.val().split(AutocompleteListInputComponent.prototype.TOKEN_SPLITTER);
        
        if(finalToken.length) {
            /* grab final token */
            var token = finalToken[0];
            
            /* remove everything from inputElement */
            this.inputElement.val('');
            
            if(token.length && !token.match(AutocompleteListInputComponent.prototype.SPACE_MATCH)) {
                this._handle_new_token(token);
            }
        }
        
    }, 
    
    /**
     *  Called whenever input field is to be analyzed and new tokens are
     *  to be discovered.
     **/
    _look_for_tokens: function() {
        
    }, 
    
    /**
     *  Handle a new token that was entered in the inputElement.
     *
     *  @param  {String}    token   The token that was entered.
     **/
    _handle_new_token: function(token) {
        
        return;
    },
});