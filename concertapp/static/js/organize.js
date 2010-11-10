/**
 *  @file       organize.js
 *  All basic functionality associated with the organize page originates from here
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

function initializeOrganizePage() {
    
    
    /*  Create waveform viewer panel */
    var viewerPanel = new WaveformViewerPanel({
        container: $('#waveform_viewer_panel'), 
    });
    
    /* Create the audio list panel */
    //  Not sure what kind of button this is yet, so we'll leave it alone for now.
    //var audioSwitcherButton = new LargeIconButton({
        
    //})
    var audioListPanel = new AudioListPanel({
        container: $('#audio_list_panel'), 
        fileWidgetTemplate: $('#file_widget_template'), 
        segmentWidgetTemplate: $('#segment_widget_template'), 
    });
    
    
    
    
    
}