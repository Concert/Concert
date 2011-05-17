/**
 *  @file       Request.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  A Request that represents a Request resource on the server.
 *  @class
 *  @extends    ConcertBackboneModel
 **/ 
var Request = ConcertBackboneModel.extend(
	/**
	 *	@scope	Request.prototype
	 **/
{
    
    foreignKeyAttributes: function() {
        return [
            {
                attr: 'user', 
                model: User
            },
            {
                attr: 'collection', 
                model: Collection 
            }
        ];
    },
    name: 'request',
    /**
     *  When a user would like to revoke the request to join a collection.
     **/
    revoke: function() {
        this._change_status_and_handle_error('r', 'Request could not be revoked');
    }, 
    /**
     *  When an administrator denies a request
     **/
    deny: function() {
        this._change_status_and_handle_error('d', 'Request was not denied');
    },
    /**
     *  When an administrator approves a request
     **/
    approve: function() {
        var previousStatus = this.get('status');
        var addedUserId = this.get('user').get('id');
        
        this.set({
            status: 'a'
        });
        
        /* Add user to collection */
        this.get('collection').get('users').add(this.get('user'));

        /* Save changes. */
        this.save(null, {
            error_message: 'Request could not be approved', 
            error_callback: function(me, previousStatus, addedUserId) {
                return function() {
                    /* On error, put request back to previous state */
                    me.set({
                        status: previousStatus 
                    });
                    /* Remove user from collection */
                    me.get('collection').get('users').remove(addedUserId);
                };
            }
        });
        
    }, 
    /**
     *  A helper function for changing the status of a request, and changing it back
     *  if an error occurs.
     **/
    _change_status_and_handle_error: function(newStatus, error_message) {
        var previousStatus = this.get('status');
        this.set({
            status: newStatus
        });
        this.save(null, {
            error_message: error_message, 
            error_callback: function(me, previousStatus) {
                return function() {
                    me.set({
                        status: previousStatus
                    });
                };
            }(this, previousStatus)
        });
    }
});

/**
 *  A set of Request objects.
 *  @class
 *  @extends    ConcertBackboneCollection
 **/
var RequestSet = ConcertBackboneCollection.extend(
	/**
	 *	@scope	RequestSet.prototype
	 **/
{
    model: Request, 
});