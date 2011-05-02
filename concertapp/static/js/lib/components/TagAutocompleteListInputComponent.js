/**
 *  @file       TagAutocompleteListInputComponent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  This is the component used for adding tags to an audio segment.
 *  @class
 *  @extends    AutocompleteListInputComponent
 **/
var TagAutocompleteListInputComponent = AutocompleteListInputComponent.extend(
    /**
     *  @scope  TagAutocompleteListInputComponent.prototype
     **/
{
    
    /**
     *  Handle a new token that was entered in the inputElement.
     *
     *  @param  {String}    token   The token that was entered.
     **/
    _handle_new_token: function(token) {
        AutocompleteListInputComponent.prototype._handle_new_token.call(this, token);
        
        /* A tag has been entered, tell the page. */
        this.panel.page.tag_current_segment(token);

        return;
    },
    
});
