/**
 *  @file       CollectionSearchResultsWidget.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  This is the widget that displays the search results when searching for a
 *  collection.
 *  @class
 *  @extends Widget
 **/
var CollectionSearchResultsWidget = Widget.extend({
    
    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;
        
        var resultTemplate = $('#create_join_result_template');
        if(typeof(resultTemplate) == 'undefined' || resultTemplate.length == 0) {
            throw new Error('resultTemplate not found');
        }
        this.resultTemplate = resultTemplate;
        
        var createNewTemplate = $('#create_join_create_new_template');
        if(typeof(createNewTemplate) == 'undefined' || createNewTemplate.length == 0) {
            throw new Error('createNewTemplate not found');
        }
        this.createNewTemplate = createNewTemplate;
        
        var searchResults = params.searchResults;
        if(typeof(searchResults) == 'undefined') {
            throw new Error('params.searchResults is undefined');
        }
        this.searchResults = searchResults;

        

        /* Bind collection events to render */
        searchResults.bind('refresh', this.render);
    },
    render: function() {
        
        var collections = this.searchResults;

        /* Clear results */
        $(this.el).empty();
        
        var resultTemplate = this.resultTemplate;
        
        var frag = document.createDocumentFragment();
        
        var currentTerm = this.panel.currentTerm;
        var exact = this.panel.exactResult;
        
        /* There was no exact match, so we can create this collection */
        if(!exact && currentTerm != '') {
            /* "create new" button */
            var createNewElement = this.createNewTemplate.tmpl({
                term: currentTerm, 
            });
            
            var createNewButton = new CreateNewCollectionButton({
                container: createNewElement, 
                newCollectionName: currentTerm,
                panel: this.panel,  
            });
            
            /* Put in search results area */
            frag.appendChild(createNewElement.get(0));
        }
        
        /* If there were search results */
        if(collections.length) {
            /* For each element in the collection */
            collections.each(function(frag, resultTemplate, panel) {
                return function(collection){

                    /* Create a CollectionSearchResult widget */
                    var widget = new CollectionSearchResultWidget({
                        template: resultTemplate, 
                        model: collection,
                        panel: panel, 
                    });

                    frag.appendChild(widget.el);

                };
            }(frag, resultTemplate, this.panel));            
        }
        
        $(this.el).html(frag);
        return this;
    }
});
