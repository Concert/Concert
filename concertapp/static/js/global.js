/**
 *  @file       global.js
 *  Contains the functionality that all pages must have.
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
 
if(!concertapp) {
    /**
     *  @namespace All our globals
     **/
    var concertapp = {
        apiBaseURL: '/api/1/', 
        animation: {
            speed: 200, 
        }, 
        compatibility: {}, 
        
        /**
         *  @namespace  Components for our user interface.  These are not widgets
         *  because they are not data-driven (and there is likely only one 
         *  instance), but they are at the same hierarchy (controlled by
         *  panels).
         **/
        components: {}, 
        
        /**
         *  @namespace  Classes to help us along
         **/
        helpers: {}, 
        
        /**
         *  @namespace  Objects that are part of the Page, but are removed from the
         *  Page to get all model-manipulation functionality out of there.
         **/
        modelmanagers: {}, 
        
        /**
         *  @namespace  Model instances.  Where all our data is stored.
         **/
        models: {}, 
        
        /**
         *  @namespace  Modal notification framework stuff.
         **/
        notifications: {}, 
        
        /**
         *  @namespace  Pages are the highest level in the hierarchy of 
         *  functionality.  They are the first object to be instantiated, and 
         *  are considered the "controller" of each page.
         **/
        pages: {}, 
        
        /**
         *  @namespace  Panels are typically controlled by pages, and delineate
         *  large groups of functionality on the page.
         **/
        panels: {}, 
        
        /**
         *  @namespace  All of our lovely open source dependencies :)
         **/
        vendor: {}, 
        
        /**
         *  @namespace  Widgets are data-driven repeating dudes that are typically
         *  located within a panel.
         **/
        widgets: {}, 
    };
}