/**
 *  @file       ManageAdminCollectionWidget.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Manage a collection that the user is an administrator of
 *  @class
 *  @extends    Widget
 **/
var ManageAdminCollectionWidget = Widget.extend(
	/**
	 *	@scope	ManageAdminCollectionWidget.prototype
	 **/
{
    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;
        
        /**
         *  The template for a collection request
         **/
        var collectionRequestWidgetTemplate = $('#collection_request_widget_template');
        if(typeof(collectionRequestWidgetTemplate) == 'undefined' || collectionRequestWidgetTemplate.length == 0) {
            throw new Error('collectionRequestWidgetTemplate not found');
        }
        this.collectionRequestWidgetTemplate = collectionRequestWidgetTemplate;
        
        
        /**
         *  The container for the collection requests
         **/
        this.requestContainer = null;
        
        

        
        /* Render when users has changed */
        this.model.get('users').bind('add', this.render);
        this.model.get('users').bind('remove', this.render);
        this.render();
    },
    render: function() {
        Widget.prototype.render.call(this);
        
        if(!this.requestContainer) {
            var requestContainer = $(this.el).children('.user_collection_requests');
            this.requestContainer = requestContainer;
        }
        else {
            var requestContainer = this.requestContainer;
        }
        
        var frag = document.createDocumentFragment();
        
        /*  We are now done rendering the collection information, but we need to 
            create a widget for every user who has requested to join the collection*/
        this.model.get('requests').each(function(parentWidget, template, frag){
            return function(req) {
                var widget = new CollectionRequestWidget({
                    panel: parentWidget.panel, 
                    model: req, 
                    template: template
                });

                frag.appendChild(widget.el);
            };
        }(this, this.collectionRequestWidgetTemplate, frag));
        
        requestContainer.html(frag);
        
        return this;
    },
    events: {
        'click .delete_collection': 'delete_collection'
    },
    /**
     *  This is called when the user first clicks the delete button.  Let page
     *  handle it.
     **/
    delete_collection: function() {
        this.panel.page.deleteCollectionWithConfirm(this.model);
    }, 
});
