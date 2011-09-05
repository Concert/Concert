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
        _.bindAll(this, "_handle_approve_user");
        _.bindAll(this, "_handle_deny_user");
    },
    
    render: function() {
        $("#bottom_left_container").removeClass('manage');
        
        if (this.collection) {
            this.collection.get('users').unbind('remove', this._handle_remove_user);
            this.collection.get('users').unbind('add', this._handle_approve_user);
            this.collection.get('pendingUsers').unbind('remove', this._handle_deny_user);
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
                model: user,
                collection: collection});
            
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
        collection.get('users').bind('add', this._handle_approve_user);
        collection.get('pendingUsers').bind('remove', this._handle_remove_user);
        
        this.userWidgets = userWidgets;
    }, 
    
    /* Removes a user widget from the list of user widgets */
    _handle_remove_user: function(user) {
        this.userWidgets[user.get('id')].remove();
        this.userWidgets[user.get('id')] = null;
    },
    
    /* Replaces a pending user widget with a member user widget */
    _handle_approve_user: function(user) {
        var self = this;
        
        var widget = new MemberUserWidget({
            template: self.memberTemplate,
            panel: self,
            model: user, 
            collection: self.collection});
            
        widget.render();
        
        oldWidget = this.userWidgets[user.get('id')];
        $(oldWidget.el).replaceWith(widget.el);
        oldWidget = widget;
    }
    
});
