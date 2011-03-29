/**
 *  @file       OverviewWaveformPanel.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This is the smaller waveform panel, which will be at the top underneath the 
 *  options bar on the "organization" page.
 *	@class
 *  @extends    WaveformPanel
 **/
var OverviewWaveformPanel = WaveformPanel.extend(
	/**
	 *	@scope	OverviewWaveformPanel.prototype
	 **/
{
    initialize: function() {
        WaveformPanel.prototype.initialize.call(this)
        
        var playheadComponent = new OverviewWaveformPlayheadComponent({
            el: this.playheadElement,
            panel: this,
            audio: this.page.audio
        });
        /**
         *  Playhead for this waveform panel
         **/
        this.playheadComponent = playheadComponent;
        
        var highlighterContainerElement = $('#overview_waveform_panel_highlight_container');
        if(typeof(highlighterContainerElement) == 'undefined') {
            throw new Error('$(\'#overview_waveform_panel_highlight_container\') is undefined');
        }
        else if(highlighterContainerElement.length == 0) {
            throw new Error('highlighterContainerElement not found');
        }
        /**
         *  Highlighter container DOM element.
         **/
        this.highlighterContainerElement = highlighterContainerElement;
        
        /* Highlighter */
        var highlighter = new OverviewWaveformInteractionComponent({
            el: highlighterContainerElement, 
            panel: this 
        });
        /**
         *  Highlighter component for this panel
         **/
        this.highlighter = highlighter;
                
        var segmentBarsContainerElement = $('#overview_waveform_panel_bottom');
        if(typeof(segmentBarsContainerElement) == 'undefined') {
            throw new Error('$(\'#overview_waveform_panel_bottom\') is undefined');
        }
        else if(segmentBarsContainerElement.length == 0) {
            throw new Error('segmentBarsContainerElement not found');
        }
        /**
         *  Container element for all of our segment bars.
         **/
        this.segmentBarsContainerElement = segmentBarsContainerElement;
        
        var segmentBarRowTemplate = $('#segment_bar_row_template');
        if(typeof(segmentBarRowTemplate) == 'undefined') {
            throw new Error('$(\'#segment_bar_row_template\') is undefined');
        }
        else if(segmentBarRowTemplate.length == 0) {
            throw new Error('segmentBarRowTemplate not found');
        }
        /**
         *  The template for each segment bar row
         **/
        this.segmentBarRowTemplate = segmentBarRowTemplate;
        
        var segmentBarTemplate = $('#segment_bar_template');
        if(typeof(segmentBarTemplate) == 'undefined') {
            throw new Error('$(\'#segment_bar_template\') is undefined');
        }
        else if(segmentBarTemplate.length == 0) {
            throw new Error('segmentBarTemplate not found');
        }
        /**
         *  The template for each segment bar.  left and width will change
         *  dynamically.
         **/
        this.segmentBarTemplate = segmentBarTemplate;
        
        
    }, 
    
    /**
     *  Called from page when an audio file is selected.
     *
     *  @param  {AudioFile}    selectedAudioFile    -   The audio file instance
     **/
    audio_file_selected: function(selectedAudioFile) {
        WaveformPanel.prototype.audio_file_selected.call(this, selectedAudioFile);
        
        this._load_waveform_image(
            selectedAudioFile.get_waveform_src(10),
            function(me, selectedAudioFile) {
                return function() {
                    /* Tell highlighter */
                    me.highlighter.audio_file_selected(selectedAudioFile);
                    /* render segments */
                    me.render_segment_bars(selectedAudioFile);
                }
            }(this, selectedAudioFile)
        );
    
        this.playheadComponent.update_speed();
    }, 
    
    /**
     *  Called from page when audio segment is selected.
     *
     *  @param  {AudioSegment}    selectedAudioSegment    - The audio segment
     **/
    audio_segment_selected: function(selectedAudioSegment) {
        WaveformPanel.prototype.audio_segment_selected.call(this, selectedAudioSegment);
        
        var audioFile = selectedAudioSegment.get('audioFile');
        
        /* Load waveform image */
        this._load_waveform_image(
            audioFile.get_waveform_src(10),
            /* Then */
            function(me, selectedAudioSegment, audioFile) {
                return function() {
                    /* Tell highlighter */
                    me.highlighter.audio_segment_selected(selectedAudioSegment);
                    /* render segments */
                    me.render_segment_bars(audioFile)
                };
            }(this, selectedAudioSegment, audioFile)
        );

        this.playheadComponent.update_speed();

    }, 
    
    /**
     *  The resolution of the waveform image (in pixels per second)
     **/
    get_resolution: function() {
        /* Width of image is currently always 960 */
        var width = 960;
        
        /* current duration of audio file */
        var duration = this.audioFileDuration;
        
        return width/duration;
    },
    
    /**
     *  Set up all of the audio segment bars.
     *
     *  @param  {AudioFile}    audioFile    The file whose segments we are rendering
     **/
    render_segment_bars: function(audioFile) {
        /* Segments for this audio file */
        var segments = audioFile.get('segments');
        
        /* For each row, save SegmentBarWidgets */
        var segmentBarWidgets = [];
        
        /* for each row, save the right most SegmentBarWidget */
        var rightmostSegmentBarWidgets = [];
        
        /* Each row element */
        var segmentRowElements = [];
        
        /* Templates we will need */
        var segmentBarRowTemplate = this.segmentBarRowTemplate;
        var segmentBarTemplate = this.segmentBarTemplate;
        
        /* DOM Elements */
        var segmentBarsContainerElement = this.segmentBarsContainerElement;
        /* Here we will store all of the new contents */
        var segmentBarsContents = document.createDocumentFragment();
        
        /**
         *  Determine if segment will fit on a given row. Called below.
         **/
        var segmentWillFitOnRow = function() {
            /* get rightmost SegmentBarWidget */
            var rightmost = rightmostSegmentBarWidgets[rowIndex];
            
            /* If this widget will fit after it */
            if(widget.leftPx > rightmost.rightPx) {
                return true;
            }
            else {
                return false;
            }
        }
        
        /* for each segment (they are already sorted by startTime)*/
        for(var s = 0, sl = segments.length; s < sl; s++) {
            var seg = segments.at(s);
            
            /* Which row we are currently on */
            var rowIndex = 0;
            
            /* Create widget for this segment */
            var widget = new AudioSegmentBarWidget({
                panel: this, 
                template: segmentBarTemplate,
                model: seg 
            }).render();
            
            while(true) {
                /* If this row has been created */
                if(segmentRowElements[rowIndex]) {
                    
                    /* If segment will fit on this row */
                    if(segmentWillFitOnRow()) {
                        /* put widget on this row */
                        segmentRowElements[rowIndex].append(widget.el);
                        
                        /* it is now the rightmost */
                        rightmostSegmentBarWidgets[rowIndex] = widget;
                        
                        /* We're done with this segment */
                        break;
                    }
                    /* if it wont fit */
                    else {
                        /* go to next row */
                        rowIndex++;
                    }                
                }
                /* There are no segments in this row yet, we will fit */
                else {
                    
                    /* Create row */
                    var rowElement = segmentBarRowTemplate.tmpl({
                        row: rowIndex
                    });
                    
                    /* Put widget in row */
                    rowElement.append(widget.el);
                    
                    /* Save row */
                    segmentRowElements[rowIndex] = rowElement;
                    
                    /* Put row in panel */
                    segmentBarsContents.appendChild(rowElement.get(0));
                    
                    /* We're currently the only segment, therefore we are the 
                    rightmost */
                    rightmostSegmentBarWidgets[rowIndex] = widget;
                    
                    /* Done with this segment */
                    break;
                }
            }
            
        }
        
        /* replace old segment bars with new ones */
        segmentBarsContainerElement.html(segmentBarsContents);
    }, 
})