/**
 *  @name     UploadFileWidget
 *  @class    A widget for a file that is currently uploading
 *  or processing.
 *  @extends  Widget
 **/
var UploadFileWidget = Widget.extend(
  /**
   *  @scope  UploadFileWidget.prototype
   **/
{
  initialize: function() {
    Widget.prototype.initialize.call(this);

    var params = this.options;

    /* When model changes, just refresh entire widget for now */
    this.model.bind("change", this.render);
  },

  render: function() {
    Widget.prototype.render.call(this);


    
    return this;
  }, 
});
