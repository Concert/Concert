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

         /* collection refers to a Concert collection NOT a backbone collection */
         this.collection = params.collection;

         _.bindAll(this, "render");
     },

     render: function() {
         Widget.prototype.render.call(this);

         return this;
     }
 });
