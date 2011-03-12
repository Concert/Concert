/**
 *  @file       FileWidget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  This is a widget that is found in the Audio list panel (when it is on file mode)
 *  it contains the functionality associated with an audio file on the organize
 *  page.
 *  @class
 *  @extends    AudioListWidget
 **/
var FileWidget = AudioListWidget.extend({
    initialize: function() {
        AudioListWidget.prototype.initialize.call(this);

        var params = this.options;        
        
        _.bindAll(this, "render");
        this.render();
    },
    events: {
        'click': 'select_file'
    }, 
    /**
     *  This is called when this file was selected in the list.
     **/
    select_file: function() {
        this.panel.page.select_audio({files: [this.model]});
    }, 
});

