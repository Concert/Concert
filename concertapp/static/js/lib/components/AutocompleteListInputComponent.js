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
    _initialize_elements: function() {
        Component.prototype._initialize_elements.call(this);

        var params = this.options;
        
        var inputElement = params.inputElement;
        if(typeof(inputElement) == 'undefined') {
            throw new Error('params.inputElement is undefined');
        }
        else if(inputElement.length == 0) {
            throw new Error('inputElement not found');
        }
        /**
         *  The input element for this autocomplete box.
         **/
        this.inputElement = inputElement;
        
        var resultsContainerElement = params.resultsContainerElement;
        if(typeof(resultsContainerElement) == 'undefined') {
            throw new Error('params.resultsContainerElement is undefined');
        }
        else if(resultsContainerElement.length == 0) {
            throw new Error('resultsContainerElement not found');
        }
        /**
         *  Container for the autocomplete results.
         **/
        this.resultsContainerElement = resultsContainerElement;
        
        var resultTemplate = params.resultTemplate;
        if(typeof(resultTemplate) == 'undefined') {
            throw new Error('params.resultTemplate is undefined');
        }
        else if(resultTemplate.length == 0) {
            throw new Error('resultTemplate not found');
        }
        /**
         *  The template used for a single autocomplete result.
         **/
        this.resultTemplate = resultTemplate;
        
        
        /* The jQuery autocomplete that will help us do business */
        inputElement.autocomplete({
            minLength: 0, 
            appendTo: resultsContainerElement, 
        })
        .data( "autocomplete" )._renderItem = function( ul, item ) {
            /* Pass term along to template */
            var itemWithTerm = _.extend(item, {term: this.term});
            
            return resultTemplate.tmpl(itemWithTerm)
                .data( "item.autocomplete", item )
                .appendTo( ul );
        };

    },
    
    _initialize_behavior: function() {
        Component.prototype._initialize_behavior.call(this);
        
        var inputElement = this.inputElement;
        
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
        
        /* If another token was created because a delimiter was entered or
        the return key was pressed */
        if(wordSplit.length > 1 || e.keyCode == 13) {
            /* Grab previous token */
            var token = wordSplit[0];
            
            /* Remove everything from inputElement */
            this.inputElement.val('');
            
            /* If token was fo-real (not just another delimiter character) */
            if(token.length && !token.match(AutocompleteListInputComponent.prototype.SPACE_MATCH)) {
                this._handle_new_token(token);
            }
        }
        /* A key was pressed that is not a delimiter */
        else {
            this._handle_continue_token(wordSplit[0])
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
     *  Handle a new token that was entered in the inputElement.
     *
     *  @param  {String}    token   The token that was entered.
     **/
    _handle_new_token: function(token) {
        
        return;
    },
    
    /**
     *  Handle the continuation of a token that was entered in the inputElement
     *
     *  @param  {String}    token    The token that we are building.
     **/
    _handle_continue_token: function(token) {
        
    },
    
    /**
     *  Called whenever the data for this autocomplete component needs to be set
     *
     *  @param  {Array[String]}    data    The data for the autocomplete.
     **/
    set_data: function(data) {
        this.inputElement.autocomplete('option', 'source', data)
    }, 
});