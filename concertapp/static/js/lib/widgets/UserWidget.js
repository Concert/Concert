/**
 *  @file       UserWidget.js
 *  
 *  @author     amy wieliczka <amywieliczka [at] gmail.com>
 **/
 
 /**
  *  @class  Widget for displaying a user in the admin panel.
  *  @extends    Widget
  **/
 var UserWidget = Widget.extend(
     /**
      *  @scope  UserWidget.prototype
      **/
 {
     initialize: function() {
         Widget.prototype.initialize.call(this);

         var params = this.options;



         _.bindAll(this, "render");
     },

     render: function() {
         Widget.prototype.render.call(this);

         return this;
     }
 });
