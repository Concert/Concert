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
        
        this.adminTemplate = $('#admin_widget_template');
        this.memberTemplate = $('#member_widget_template');
        this.pendingTemplate = $('#pending_widget_template');
    },
    
    render: function() {
        $("#bottom_left_container").removeClass('manage');
    },
    
    render_collection_manage: function(collectionId, collection) {
        $("#bottom_left_container").addClass('manage');
        
        /* Display the admin */
        
        var self = this;
        var adminTemplate = this.adminTemplate;
        var memberTemplate = this.memberTemplate;
        var pendingTemplate = this.pendingTemplate;
        var frag = document.createDocumentFragment();
        
        this.header.html(adminTemplate.tmpl(com.concertsoundorganizer.modelManager.user));
        
        /* Create a widget for each pending user & append to document fragment */
        collection.get('pendingUsers').each(function(user) {
            var widget = new PendingUserWidget({
                template: pendingTemplate,
                panel: self,
                model: user});
            
            widget.render();
            
            frag.appendChild(widget.el);
        });
        
        /* Create a widget for each user (that is not the currently logged in user) & append to document fragment */
        collection.get('users').each(function(user) {
            if (user !== com.concertsoundorganizer.modelManager.user) {
                var widget = new MemberUserWidget({
                    template: memberTemplate, 
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
