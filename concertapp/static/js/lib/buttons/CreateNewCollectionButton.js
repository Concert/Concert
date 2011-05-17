/**
 *  @file       CreateNewCollectionButton.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  The button that will allow the user to create a new collection.
 *  @class
 **/
function CreateNewCollectionButton(params) {
    if(params) {
        this.init(params);
    }
}
CreateNewCollectionButton.prototype = new Button();

/**
 *  @constructor
 **/
CreateNewCollectionButton.prototype.init = function(params) {
    Button.prototype.init.call(this, params);
    
    /* The panel we are on.  Need to access this to reset the form (for now this is
        good enough, but TODO: in the future, the CreateJoinCollectionPanel should
        be watching the results collection and calling the resetForm method 
        automatically when the collection changes.)
        */
    var panel = params.panel;
    if(typeof(panel) == 'undefined') {
        throw new Error('params.panel is undefined');
    }
    this.panel = panel;
    
    
    /* The name that the user has entered for the new collection */
    var newCollectionName = params.newCollectionName;
    if(typeof(newCollectionName) == 'undefined') {
        throw new Error('params.newCollectionName is undefined');
    }
    this.newCollectionName = newCollectionName;
    
    
};

/**
 *  This is what will be executed when the user clicks the button, deciding to 
 *  create a new collection.
 **/
CreateNewCollectionButton.prototype.click = function() {
   /* Call corresponding method on page */
   this.panel.page.createNewCollection(this.newCollectionName);   
   /* reset form */
   this.panel.resetForm();
};
