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
     *  This is called from elsewhere when an area of the waveform was highlighted by 
     *  the user.  Ensure that UI displays the highlight and the segment
     *  is to be created.
     *
     *  @param  {Number}    startTime    -  The time (in seconds) of highlight start
     *  @param  {Number}    endTime    -    The time of the highlight end.
     **/
    create_new_segment: function(startTime, endTime) {
        /* Find parent audio file */
        var selectedSegments = this.selectedAudioSegments;
        var selectedFiles = this.selectedAudioFiles;

        /* The audio file that will be the parent for our new segment */
        var audioFile = null;

        /* If a segment is currently selected */
        if(selectedSegments.length) {
            /* Use segment's parent audio file */
            audioFile = selectedSegments.first().get('audioFile');
        }
        /* If a file is currently selected */
        else if(selectedFiles.length) {
            /* Use it as the segment's parent */
            audioFile = selectedFiles.first();
        }

        /* Create new audio segment */
        this.modelManager.create_and_select_new_segment(startTime, endTime, audioFile);
    },
    
        /**
         *  This is called from elsewhere when an area of the waveform was highlighted by 
         *  the user.  Ensure that UI displays the highlight and the segment
         *  is to be created.
         *
         *  @param  {Number}    startTime    -  The time (in seconds) of highlight start
         *  @param  {Number}    endTime    -    The time of the highlight end.
         **/
        create_new_segment: function(startTime, endTime) {
            /* Find parent audio file */
            var selectedSegments = this.selectedAudioSegments;
            var selectedFiles = this.modelManagerselectedAudioFiles;

            /* The audio file that will be the parent for our new segment */
            var audioFile = null;

            /* If a segment is currently selected */
            if(selectedSegments.length) {
                /* Use segment's parent audio file */
                audioFile = selectedSegments.first().get('audioFile');
            }
            /* If a file is currently selected */
            else if(selectedFiles.length) {
                /* Use it as the segment's parent */
                audioFile = selectedFiles.first();
            }

            /* Create new audio segment */
            this.modelManager.create_and_select_new_segment(startTime, endTime, audioFile);
        },

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
