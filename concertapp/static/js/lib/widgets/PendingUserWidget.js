/**
 *  @file       PendingUserWidget.js
 *  
 *  @author     amy wieliczka <amywieliczka [at] gmail.com>
 **/
 
 /**
  *  @class  Widget for displaying a member user in the admin panel.
  *  @extends    UserWidget
  **/
 var PendingUserWidget = UserWidget.extend(
     /**
      *  @scope  PendingUserWidget.prototype
      **/
 {
     initialize: function() {
         UserWidget.prototype.initialize.call(this);

         var params = this.options;

         _.bindAll(this, "render");
         _.bindAll(this, "_handle_approve_user");
         _.bindAll(this, "_handle_deny_user");
     },

     events: {
         "click .actions button.approve": "_handle_approve_user",
         "click .actions button.deny": "_handle_deny_user",
     },

     render: function() {
         UserWidget.prototype.render.call(this);

         return this;
     },
     
     _handle_approve_user: function() {
         this.collection.approve_user(this.model);
     },
     
     _handle_deny_user: function() {
         this.collection.deny_user(this.model);
     }
 });
