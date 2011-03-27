/**
 *  @file       ConcertBackboneModel.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  This is the class that all of our models inherit from, and provides special 
 *  functionality that we need for each model.
 **/
var ConcertBackboneModel = Backbone.Model.extend(
	/**
	 *	@scope	ConcertBackboneModel.prototype
	 **/
{
    
    /**
     *  On set, make sure all foreign key attributes and many to many attributes are
     *  handled properly.  This requires that the model has oneToManyAttributes and
     *  foreignKeyAttributes set on the model.  If these values are not set, 
     *  the function passes the attributes through as normal.
     *
     *  Here is an example of oneToManyAttributes and foreignKeyAttributes that
     *  should be set on the model:
     *
     *  oneToManyAttributes: function() { return [
     *      {
     *          attr: 'requests', 
     *          collectionType: RequestSet
     *      },
     *      {
     *          attr: 'users', 
     *          collectionType: UserSet
     *      }
     *  ]},
     *  foreignKeyAttributes: function () { return [
     *      {
     *          attr: 'admin', 
     *          model: User, 
     *      }
     *  ]}
     **/
    set: function(attributes, options) {
        
        var oneToManyAttributes = this.oneToManyAttributes();
        var foreignKeyAttributes = this.foreignKeyAttributes();
        
        if(attributes && oneToManyAttributes) {
            for(var i = 0, il = oneToManyAttributes.length; i < il; i++) {
                var oneToMany = oneToManyAttributes[i];
                
                var models = attributes[oneToMany.attr];
                /* If we're trying to set the related model and it is not
                    a collection */
                if(models && !(models instanceof Backbone.Collection)) {
                    /* It is either a list of strings or objects, or empty list */
                    if(models[0] && typeof(models[0]) == 'object') {
                        /* Create new collection of request objects */
                        attributes[oneToMany.attr] = new oneToMany.collectionType(
                            models, 
                            /* Send in self incase collection requires it */
                            {
                                relatedModel: this
                            }
                        );
                        
                    }
                    else if(models[0] && typeof(models[0]) == 'string') {
                        /* We've got a list of urls */
                        throw new Error('Not handling related objs as urls currently, send the full object.');
                    }
                    else if(models.length == 0){
                        /* Set it to an empty set in case we want to add requests */
                        attributes[oneToMany.attr] = new oneToMany.collectionType(
                            null,
                            {
                                relatedModel: this 
                            }
                        );
                    }
                    else {
                        throw new Error('Do not know how to handle object');
                    }
                    
                }
                /*  Requests member is not being set now, and it hasn't been 
                    set yet */
                else if(!models && !this.get(oneToMany.attr)) {
                    /* Set it to an empty set in case we want to add requests */
                    attributes[oneToMany.attr] = new oneToMany.collectionType(
                        null,
                        {
                            relatedModel: this 
                        }
                    );
                }            
                
            }
        }
        
        if(attributes && foreignKeyAttributes) {
            /* For each foreign key attribute */
            for(var i = 0, il = foreignKeyAttributes.length; i < il; i++) {
                var foreignKey = foreignKeyAttributes[i];
                
                /* If we're trying to set this attribute */
                if(foreignKey.attr in attributes) {
                    
                    var model = attributes[foreignKey.attr];

                    /*  and it is not a model */
                    if(!(model instanceof Backbone.Model)) {
                        /* It might be an object */
                        if(model && (model instanceof Object)) {

                            /* If so we need to check with the dataset manager */
                            var seenInstances = com.concertsoundorganizer.modelManager.seenInstances[foreignKey.model.prototype.name];

                            var possibleDuplicate = seenInstances.get(model.id);

                            /* If there is a duplicate */
                            if(possibleDuplicate) {
                                /* Send the attributes to the duplicate incase there are new ones */
                                possibleDuplicate.set(model);

                                /* Use duplicate moving forward */
                                attributes[foreignKey.attr] = possibleDuplicate;
                            }            
                            /* If not, create a new one */
                            else {
                                attributes[foreignKey.attr] = new foreignKey.model(model);
                                seenInstances.add(attributes[foreignKey.attr]);
                            }

                        }
                    }
                }
            }
        }
        
        return Backbone.Model.prototype.set.call(this, attributes, options);
    },
    oneToManyAttributes: function(){
        return null;
    },
    foreignKeyAttributes: function() {
        return null;
    },
    /**
     *  Display modal error to user when error occurs.
     **/
    save : function(attrs, options) {
        var wrapErrorHelper = com.concertsoundorganizer.helpers.wrapError;

        return Backbone.Model.prototype.save.call(this, attrs, wrapErrorHelper(options));
    },

    /**
     *  Uses the 'static' name attribute of the model to create the url.  If the
     *  model has an id it is appended onto the url.
     *
     *  @param  {Boolean}    options.noBase    -    Return url without prefix
     **/
    url: function(options) {
        options || (options = {});
        
        var url = '/api/1/'
        if(options.noBase) {
            url = '';
        }
        
        url += this.name+'/';
        var id = this.get('id');
        if(id) {
            return url+id+'/';
        }
        else {
            return url;
        }
    },

});