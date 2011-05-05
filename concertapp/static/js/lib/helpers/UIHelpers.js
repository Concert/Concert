/**
 *  @file       UIHelpers.js
 *  Functions associated with general UI elements.
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 

/**
 *  Preloads all images via an image beacon to the server.
 *
 *  @param  {Array}        urls 
 **/
function preloadImages(urls) {
    var images = [];
    for(var i = 0, il = urls.length; i < il; i++) {
        images.push($('<img />').attr('src', urls[i]));
    }
}

/**
 *  Detect browser compatibility problems, and notify user of any issues.  Should
 *  be called on each page to ensure we have the compatibility variables set.
 **/
function detectBrowserCompatibility() {
    var notifier = com.concertsoundorganizer.notifier;
    
    /**
     *  Detect audio compatibility, and throw notifications to the user if necessary.
     **/
    if(Modernizr.audio) {
        if(Modernizr.audio.ogg) {
            com.concertsoundorganizer.compatibility.audioType = 'ogg';
        }
        else if(Modernizr.audio.mp3) {
            com.concertsoundorganizer.compatibility.audioType = 'mp3';
        }
        else {
            /* TODO: Handle this case */
            notifier.alert({content: 'Site will not work.  Your browser says it doesn\'t support ogg or mp3 files, but that it supports the "audio" element.<br />Try upgrading your browser, or try installing one of these free modern browsers:<br /><a href="http://www.google.com/chromeframe">Chrome Frame for IE</a><br /><a href="http://www.google.com/chrome">Google Chrome</a><br /><a href="http://www.mozilla.com/firefox/upgrade.html">Mozilla Firefox</a>'});
        }
    }
    else {
        /* TODO: Handle old browsers here */
        notifier.alert({content: 'Site will not work.  Your browser does not support the HTML5 audio element.<br />Try upgrading your browser, or try installing one of these free modern browsers:<br /><a href="http://www.google.com/chromeframe">Chrome Frame for IE</a><br /><a href="http://www.google.com/chrome">Google Chrome</a><br /><a href="http://www.mozilla.com/firefox/upgrade.html">Mozilla Firefox</a>'});
    }
}

/**
 *  Takes an array of DOM nodes, and a container.  It will replace all of the nodes
 *  in the container with the given.
 *
 *  @param  {Array}                 nodes  -   of DOM nodes to add to container
 *  @param  {jQuery DOM element}    container
 **/
function domElementsReplace(nodes, container) {
    /* Empty container */
    container.empty();
    
    /* Loop through all of the nodes, and add them to a fragment */
    var frag = document.createDocumentFragment();
    for(var i = 0, il = nodes.length; i < il; i++) {
        frag.appendChild(nodes[i]);
    }
    container.append(frag);    
}

/**
 *  Takes an event, and returns the x coordinate of the event relative to the
 *  event's current target.  Why this isn't in jQuery I don't know.
 *
 *  @param  {jQuery.Event}    e    -    The event.
 **/
function get_event_x(e) {
    return e.pageX-$(e.currentTarget).offset().left;
}

/**
 *  sec_to_timecode
 *  This function will convert between an amount of seconds, and a timecode value.
 *
 *  @param  {Number}    seconds -   The amount of seconds to convert.
 *  @param  {Object}    options     Different options available for presentation
 *  @param  {Object}    options.noZeroHours    If hours are zero, omit them.
 *  @return {String}    hh:mm:ss    -   Formatted timecode string.
 **/
function seconds_to_timecode(seconds, options)
{
    options || (options = {});
    
    if(seconds < 0) {
        throw new Error('sec_to_timecode: Error: Seconds cannot be negative.');
    }
    
    var hours = Math.floor(seconds/3600);
    var rem = seconds % 3600;
    var minutes = Math.floor(rem/60);
    var seconds = Math.floor(rem%60);
    /* pad zeros */
    if(hours < 10)
    {
        hours = '0'+hours;
    }
    if(minutes < 10)
    {
        minutes = '0'+minutes;
    }
    if(seconds < 10)
    {
        /* pad to beginning */
        seconds = '0'+seconds;
    }
    
    var result = '';
    if(!(options.noZeroHours && hours == '00')) {
        result += hours+':';
    }
    
    result += minutes+':'+seconds;
    
    return result;
}

/**
 *  Takes an ISO time and returns a string representing how long ago the date 
 *  represents.
 *
 *  @param  {Date}    date    The Date object we are converting
 **/
function pretty_date(date){
    /*
     * JavaScript Pretty Date
     * Copyright (c) 2008 John Resig (jquery.com)
     * Licensed under the MIT license.
     */
    
    //var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
    var diff = (((new Date()).getTime() - date.getTime()) / 1000),
    day_diff = Math.floor(diff / 86400);

    if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
    return;

    return day_diff == 0 && (
        /* If less than a minute ago, "just now" */
        diff < 60 && "just now" ||
        /* If less than 2 minutes ago, "1 minute ago" */
        diff < 120 && "1 minute ago" ||
        /* If less than 1 hour ago, "5 minutes ago" */
        diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
        /* If less than 2 hours ago, "1 hour ago" */
        diff < 7200 && "1 hour ago" ||
        /* If less than 1 day ago, "2 hours ago" */
        diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
        /* If 1 day ago, "Yesterday at 4:25pm" */
        day_diff == 1 && "Yesterday at "+date.format("h:MMtt") ||
        /* If less than 5 days ago, "Monday at 4:25pm" */
        day_diff < 5 && date.format("dddd") + " at " + date.format("h:MMtt") ||
        /* else, "April 5 at 4:25pm" */
        date.format("mmmm d") + " at " + date.format("h:MMtt");
//        day_diff < 7 && day_diff + " days ago" ||
//        day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
}