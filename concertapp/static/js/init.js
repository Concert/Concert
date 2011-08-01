/**
 *  @file       init.js
 *  This file contains the function that is called from the bottom of the template,
 *  to initialize all client side code.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  Initialize all client side functionality by creating the Router object.
 *
 *  @param  {Object}        data   -   the JSON object that contains all of the
 *  data we need for this page.
 **/
function initializeUI(data) {
    $(document).ready(function(){
        /* Make global notifier object that we can use anywhere to notify the user */
        com.concertsoundorganizer.notifier = new Notifier({});

        /* image urls put here will be loaded 
        preloadImages([
            '/graphics/ajax-loader.gif',
            '/graphics/somethingelse.jpg'
        ]);
        */
        /* Check browser problems */
        detectBrowserCompatibility()

        /* Run the initializer function for this page. */
        com.concertsoundorganizer.router = new Router(data);

		/*temp*/
		$('.file_list_widget_admin').live('click', function(){
			$('#bottom_left').toggleClass('active_admin');
		});
    });
}