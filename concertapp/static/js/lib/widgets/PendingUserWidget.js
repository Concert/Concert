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
     },

     render: function() {
         UserWidget.prototype.render.call(this);

         return this;
     }
 });
