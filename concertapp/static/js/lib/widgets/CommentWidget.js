/**
 *  @file       CommentWidget.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Widget that displays a comment.  Used on organize page, and probably elsewhere.
 *  @class
 *  @extends    Widget
 **/
var CommentWidget = Widget.extend({
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
