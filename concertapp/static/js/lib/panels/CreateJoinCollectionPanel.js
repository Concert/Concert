/**
 *  @file       CreateJoinCollectionPanel.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This is the panel that allows a user to create or join a group on the settings
 *  page.
 *	@class
 *  @extends Panel
 **/
var CreateJoinCollectionPanel = Panel.extend(
	/**
	 *	@scope	CreateJoinCollectionPanel.prototype
	 **/
{
    
    /**
    *  Initialize all stuffs.  We have an element for the input, as well as for the
    *  results.
    **/    
    initialize: function() {
        Panel.prototype.initialize.call(this);
        
        var params = this.options;
        
        var contents = this.contents;
        
        /**
         *  The input element where the user searches for a collection
         **/
        var inputElement = contents.find('.create_join_input');
        if(typeof(inputElement) == 'undefined' || inputElement.length == 0) {
            throw new Error('inputElement not found');
        }
        this.inputElement = inputElement;
        
        
        /**
         *  The Backbone.js collection of django Collection objects for search
         *  results.
         **/
        var searchResults = new CollectionSet;
        this.searchResults = searchResults;
        
        /* Another model object for the exact result (if one exists) */
        this.exactResult = null;

        /**
         *  The search result widget that displays the search results.
         **/
        var searchResultsWidget = new CollectionSearchResultsWidget({
            el: contents.find('.create_join_results'), 
            searchResults: searchResults, 
            panel: this 
        });
        
        var createNewTemplate = $('#create_join_create_new_template');
        if(typeof(createNewTemplate) == 'undefined' || createNewTemplate.length == 0) {
            throw new Error('createNewTemplate not found');
        }
        this.createNewTemplate = createNewTemplate;
        
        var createResultsElement = $('#create_results');
        if(typeof(createResultsElement) == 'undefined' || 
            createResultsElement.length == 0) {
            throw new Error('createResultsElement not found');
        }
        this.createResultsElement = createResultsElement;

        /* This will hold a reference so we can keep track of the last Xhr */
        this.lastCreateJoinXhr = null;

        /* The current search term in the box */
        this.currentTerm = null;
        
        /* Initialize the auto complete behavior */
        this.initAutoCompleteBehavior();
        
        searchResults.bind('refresh', this.render);        
    },
    render: function() {
        this.createResultsElement.empty();
        
        /* There was no exact match, so we can create this collection */
        if(!this.exactResult && this.currentTerm != '') {

            /* "create new" button */
            var createNewElement = this.createNewTemplate.tmpl({
                term: this.currentTerm 
            });
            
            var createNewButton = new CreateNewCollectionButton({
                container: createNewElement, 
                newCollectionName: this.currentTerm,
                panel: this  
            });
                                    
            /* Put in search results area */
            this.createResultsElement.append(createNewElement);
        }
        
        return this;
    },
    
    events: {

    }, 
    
    /**
     *  This should be called from init just once, to initialize the auto complete
     *  behavior for the input element.
     **/
    initAutoCompleteBehavior: function() {
        /* The actual jQuery UI autocomplete call */
        this.inputElement.autocomplete({
            minLength: 0,
            source: function(me) {
                return function(request, response) {
                    /* Our search term */
                    var term = request.term;

                    /* If there is something to search for */
                    if(term && term != '') {    
                        /* Search for it */

                        //me.toggleLoadingNotification();
                        me.lastCreateJoinXhr = $.getJSON(
                            'search/'+term+'/', 
                            {}, 
                            function(data, status, xhr) {
                                /* If this was the last request made (ignore previous) */
                                if(xhr === me.lastCreateJoinXhr) {
                                    me.currentTerm = term;
                                    
                                    me.exactResult = data.exact;
                                    
                                    me.searchResults.refresh(data.results);
                                    
                                   // me.toggleLoadingNotification();
                                }
                            }
                        );
                    }
                    /* Search is empty */
                    else {
                        me.currentTerm = term;
                        me.searchResults.refresh([]);
                    }
                };

            }(this),

            open: function(event, ui) {
            },

            change: function(event, ui) {
            },

            search: function(event, ui) {
            }
        });
    },
    /**
     *  This should be called when the search form is to be reset.
     **/
    resetForm: function(){
        /* Clear text field */
        this.inputElement.val('');
        this.currentTerm = '';
        /* Clear auto complete */
        this.searchResults.refresh([]);
    } 

});
