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
        
        _.bindAll(this, "_handle_remove_user");
    },
    
    render: function() {
        $("#bottom_left_container").removeClass('manage');
        
        if (this.collection) {
            this.collection.get('users').unbind('remove', this._handle_remove_user);
            this.collection = null;
        }
    },
    
    render_collection_manage: function(collectionId, collection) {
        $("#bottom_left_container").addClass('manage');
        
        this.collection = collection;
        var self = this;
        var adminTemplate = this.adminTemplate;
        var memberTemplate = this.memberTemplate;
        var pendingTemplate = this.pendingTemplate;
        var frag = document.createDocumentFragment();
        var userWidgets = {};
        
        this.header.html(adminTemplate.tmpl(com.concertsoundorganizer.modelManager.user));
        
        /* Create a widget for each pending user & append to document fragment */
        collection.get('pendingUsers').each(function(user) {
            var widget = new PendingUserWidget({
                template: pendingTemplate,
                panel: self,
                model: user});
            
            widget.render();
            
            frag.appendChild(widget.el);
            
            userWidgets[user.get('id')] = widget;
        });
        
        /* Create a widget for each user (that is not the currently logged in user) & append to document fragment */
        collection.get('users').each(function(user) {
            if (user !== com.concertsoundorganizer.modelManager.user) {
                var widget = new MemberUserWidget({
                    template: memberTemplate, 
                    panel: self,
                    model: user,
                    /* collection refers to a Concert collection NOT a backbone collection */
                    collection: collection});
            
                widget.render();

                frag.appendChild(widget.el);
                
                userWidgets[user.get('id')] = widget;
            }
        });
        
        /* Insert frag into panel contents */
        self.contents.append(frag);
        
        collection.get('users').bind('remove', this._handle_remove_user);
        
        this.userWidgets = userWidgets;
    }, 
    
    _handle_remove_user: function(user) {
        this.userWidgets[user.get('id')].remove();
        this.userWidgets[user.get('id')] = null;
    }
    
});
