/**
 *  @file       ConcertBackboneCollection.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  A ConcertBackboneCollection is our extension of Backbone.Collection to include
 *  functionality that all collections need.
 **/
var ConcertBackboneCollection = Backbone.Collection.extend(
	/**
	 *	@scope	ConcertBackboneCollection.prototype
	 **/
{
    
    initialize: function(models, options) {
        this.relatedModel = options.relatedModel;
        
        /**
         *  If we are a seenInstances collection.
         **/
        this.seenInstances = options.seenInstances || false;
    }, 
    
    /**
     *  Overriding this method allows for each collection to be aware of the master
     *  list of model instances, so no duplicate instances are ever created.  We
     *  can also save our o2m relationship if options.save is set.
     *
     *  @param  {Boolean}    options.save    -  Save relation?
     *  @param  {Function}    options.error_callback    -    Error callback
     *  @param  {String}    options.error_message    Error message
     **/
    _add : function(model, options) {
        options || (options = {});
        
        /* If we are not a seenInstances collection */
        if(this.seenInstances) {
            var modelManagerSeenInstances = com.concertsoundorganizer.modelManager.seenInstances;
            var seenInstances = modelManagerSeenInstances[this.model.prototype.name];

            var parentSeenInstances = null;
            /* If model has a parent class that is not 
            ConcertBackboneModel */
            var parentType = this.model.__super__;
            if(parentType != ConcertBackboneModel.prototype) {
                /* parent name */
                var modelParentName = parentType.name;
                parentSeenInstances = modelManagerSeenInstances[modelParentName];
            }


            /* If the model hasn't yet been instantiated */
            if(!(model instanceof Backbone.Model)) {
                /* Check with dataset manager to see if it already exists */
                var possibleDuplicate = seenInstances.get(model.id);

                /* If there was no duplicate found, try parent seen instances */
                if(!possibleDuplicate && parentSeenInstances) {
                    possibleDuplicate = parentSeenInstances.get(model.id);
                }

                /* If there is a duplicate */
                if(possibleDuplicate) {
                    /* Send the attributes to the duplicate incase there are new ones */
                    possibleDuplicate.set(model);

                    /* Use duplicate moving forward */
                    model = possibleDuplicate;
                }
                /* If there is not a duplicate, create new instance */
                else {
                    model = new this.model(model);

                    seenInstances.add(model);
                    if(parentSeenInstances) {
                        parentSeenInstances.add(model);
                    }
                }   
            }
        }

        model = Backbone.Collection.prototype._add.call(this, model, options);
        
        /**
         *  If we're supposed to save this relationship
         **/
        if(options.save) {
            /* We are 'creating' our relationship (in our modified REST
            implementation) */
            var method = 'create';
            options = com.concertsoundorganizer.helpers.wrapError(options);
            options.error = com.concertsoundorganizer.helpers.backboneWrapError(
                options.error, null, options
            );
            
            /* This will be the related URL.  For example, when adding a tag
            to an audio segment's list of tags, the url should be something like
            "/api/1/audiosegment/1/tag/2/" */
            options.url = this.relatedModel.url()+model.url({noBase:true});
            
            /* If the related instance hasn't even been created on the server */
            if(!model.get('id')) {
                /* when the instance is created, it will return a serialized 
                representation of the related instance, and therefore we need
                to update the related model */
                var success = options.success;
                options.success = function(resp) {
                    if (!model.set(model.parse(resp), options)) return false;
                    if (success) success(model, resp);
                };


                /* send the related model instance too */
                (this.sync || Backbone.sync)(method, model, options);
            }
            else {
                /* The model instance has already been created, just need to create
                the relationship */
                
                /* we POST to this URL with no other data */
                (this.sync || Backbone.sync)(method, null, options);                
            }
            
            
        }
    },
    
    /**
     *  Override internal remove method to allow to save our o2m relationship.
     *
     *  @param  {Boolean}    options.save    -  Wether or not to save this relation.
     *  @param  {Function}    options.error    -    Error callback.
     **/
    _remove : function(model, options) {
        options || (options = {});

        model = Backbone.Collection.prototype._remove.call(this, model, options);

        if(options.save) {
            var method = 'delete';
            var wrapErrorHelper = com.concertsoundorganizer.helpers.wrapError;
            options = wrapErrorHelper(options);

            options.url = this.relatedModel.url()+model.url({noBase:true});

            options.error = com.concertsoundorganizer.helpers.backboneWrapError(options.error, null, options);

            (this.sync || Backbone.sync)(method, null, options);
        }
    },
     
     
    
});
