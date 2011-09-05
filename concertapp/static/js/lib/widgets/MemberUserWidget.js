/**
 *  @file       MemberUserWidget.js
 *  
 *  @author     amy wieliczka <amywieliczka [at] gmail.com>
 **/
 
 /**
  *  @class  Widget for displaying a member user in the admin panel.
  *  @extends    UserWidget
  **/
 var MemberUserWidget = UserWidget.extend(
     /**
      *  @scope  MemberUserWidget.prototype
      **/
 {
     initialize: function() {
         UserWidget.prototype.initialize.call(this);

         var params = this.options;



         _.bindAll(this, "render");
         _.bindAll(this, "_handle_remove_user")
     },
     
     events: {
         "click .actions button.remove_user": "_handle_remove_user",
     },

     render: function() {
         UserWidget.prototype.render.call(this);

         return this;
     }, 
     
     _handle_remove_user: function() {
         this.collection.remove_user(this.model);
     }
 });
