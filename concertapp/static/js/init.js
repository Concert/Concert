/**
 *  @file       init.js
 *  This file contains the function that is called from the bottom of the template,
 *  to initialize all client side code.  It also contains the individual functions
 *  that are used to initialize each page on the UI.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  Initialize all client side functionality by creating the applicable
 *  page object.
 *
 *  @param  {String}        pagePath  -   From the server, the string that we will
 *  use to determine what page we are on.  This variable is sent in on 
 *  base_site.html template.
 *  @param  {Object}        data   -   the JSON object that contains all of the
 *  data we need for this page.
 **/
function initializeUI(pagePath, data) {
    $(document).ready(function(){

        /* Make global notifier object that we can use anywhere to notify the user */
        com.concertsoundorganizer.notifier = new Notifier({});

        /* image urls put here will be loaded 
        preloadImages([
            '/graphics/ajax-loader.gif',
            '/graphics/somethingelse.jpg'
        ]);
        */    
        
        /* For each page, run JS corresponding to that page */
        var pageInitializers = {
            '/login/': LoginPage,
            '/dashboard/': LoggedInPage,
            '/collections/': CollectionsPage,
            '/audio/upload/': UploadPage,
            '/organize/collection/': OrganizePage
        };
        
        /* Check browser problems */
        detectBrowserCompatibility()

        /* Run the initializer function for this page. */
        com.concertsoundorganizer.page = new pageInitializers[pagePath](data);
    });
}