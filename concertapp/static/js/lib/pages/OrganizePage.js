/**
 *  @file       OrganizePage.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  The panels and widgets for the organize page.
 *	@class
 *  @extends    LoggedInPage
 **/
var OrganizePage = LoggedInPage.extend(
	/**
	 *	@scope	OrganizePage.prototype
	 **/
{   
    /**
     *  Called from elsewhere when the current segment has changed.  Ensure that
     *  everything is updated.
     *
     *  @param  {Number}    startTime       The new beginning of the segment
     *  @param  {Number}    endTime         The new end of the segment
     **/
    modify_current_segment_times: function(startTime, endTime) {
        /* Modify current segment */
        this.modelManager.modify_current_segment_times(startTime, endTime);
    },
    
    /**
     *  Called from elsewhere when current segment is to be tagged.
     *
     *  @param  {String}    tagName    The tag that we're giving this segment.
     **/ 
    tag_current_segment: function(tagName) {
        this.modelManager.tag_current_segment(tagName);
    }, 
    
    /**
     *  This is called from elsewhere when we are to ensure that a waveform highlight 
     *  is cleared.
     **/
    clear_waveform_highlight: function() {
        this.audioController._clear_audio_loop();
        this.detailPanel.clear_waveform_highlight();
        this.overviewPanel.clear_waveform_highlight();
    }, 
    
    /**
     *  Ensure that given audio segment is deleted.
     *
     *  @param  {AudioSegment}    segment    The AudioSegment instance to delete
     **/
    delete_audio_segment: function(segment) {
        this.modelManager.delete_audio_segment(segment);
        this.overviewPanel.audio_segment_deleted(segment);
    }, 
    
});
