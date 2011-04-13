/**
 *  @file       JoinCollectionEventWidget.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  A widget to display a `JoinCollectionEventWidget`
 *  @extends    EventWidget
 **/
var JoinCollectionEventWidget = EventWidget.extend(
    /**
     *  @scope  JoinCollectionEventWidget.prototype
     **/
{
    initialize: function() {
        EventWidget.prototype.initialize.call(this);

        var params = this.options;
        
        

        _.bindAll(this, "render");
    },

    render: function() {
        EventWidget.prototype.render.call(this);
        
        return this;
    }
});
