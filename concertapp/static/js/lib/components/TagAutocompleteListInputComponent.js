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
    _initialize_elements: function() {
        this.options = _.extend(this.options, {
            resultsContainerElement: $('#detail_waveform_panel_tag_autocomplete_list'), 
            resultTemplate: $('#autocomplete_list_item_template')
        });

        AutocompleteListInputComponent.prototype._initialize_elements.call(this);
    }, 
    
    /**
     *  Handle a new token that was entered in the inputElement.
     *
     *  @param  {String}    token   The token that was entered.
     **/
    _handle_new_token: function(token) {
        AutocompleteListInputComponent.prototype._handle_new_token.call(this, token);
        
        /* Remove everything from inputElement */
        this.inputElement.val('');
        
        /* A tag has been entered, tell the page. */
        this.panel.router.tag_current_segment(token);

        return;
    }
    
});
