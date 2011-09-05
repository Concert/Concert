/**
 *  @file       EventsPanel.js
 *
 *  @author     amy wieliczka <amywieliczka [at] gmail.com>
 **/

/**
 *  @class  Panel that shows administrative actions on a collection
 *  @extends    Panel
 **/
var AdminPanel = Panel.extend({
    _initialize_elements: function() {
        Panel.prototype._initialize_elements.call(this);

        var params = this.options;
        
        var $ = jQuery;
        
        this.userTemplate = $('#user_widget_template');
    },
    
    render: function() {
        $("#bottom_left_container").removeClass('manage');
    },
    
    render_collection_manage: function(collectionId, collection) {
        $("#bottom_left_container").addClass('manage');
        
        var self = this;
        var template = this.userTemplate;
        var frag = document.createDocumentFragment();
        
        /* Create a widget for each pending user & append to document fragment */
        collection.get('pendingUsers').each(function(user) {
            var widget = new UserWidget({
                template: template,
                panel: self,
                model: user});
            
            widget.render();
            
            frag.appendChild(widget.el);
        });
        
        /* Create a widget for each user (that is not the currently logged in user) & append to document fragment */
        collection.get('users').each(function(user) {
            if (user !== com.concertsoundorganizer.modelManager.user) {
                var widget = new UserWidget({
                    template: template, 
                    panel: self,
                    model: user});
            
                widget.render();

                frag.appendChild(widget.el);
            }
        });
        
        /* Insert frag into panel contents */
        self.contents.append(frag);
    }
    
});
