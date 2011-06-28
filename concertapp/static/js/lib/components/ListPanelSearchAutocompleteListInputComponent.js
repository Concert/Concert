/**
 *  @file       ListPanelSearchAutocompleteListInputComponent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  Component that handles the search functionality for the `ListPanel`.
 *  @extends    AutocompleteListInputComponent
 **/
var ListPanelSearchAutocompleteListInputComponent = AutocompleteListInputComponent.extend(
    /**
     *  @scope  ListPanelSearchAutocompleteListInputComponent.prototype
     **/
{
    _initialize_elements: function() {
        this.options = _.extend(this.options, {
            resultsContainerElement: $('#list_panel_search_results_container'), 
            resultTemplate: $('#collection_autocomplete_result_template')
        });

        AutocompleteListInputComponent.prototype._initialize_elements.call(this);
        
        /* Set ajax url */
        this.inputElement.autocomplete('option', 'source', '/api/1/collection/');
        
        /* Change way autocomplete talks to server */
        this.inputElement.data('autocomplete')._search = function( value ) {
            this.pending++;
            this.element.addClass( "ui-autocomplete-loading" );

            this.source( { 'name__icontains': value }, this.response );
        };
        
    },
    /**
     *  Handle a new token that was entered in the inputElement.
     *
     *  @param  {String}    token   The token that was entered.
     **/
    _handle_new_token: function(token) {
        AutocompleteListInputComponent.prototype._handle_new_token.call(this, token);
        
        /* A collection has been selected, tell the page. */
        console.log('token:');
        console.log(token);

        return;
    }
    
});

