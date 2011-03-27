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
     *  On initialize, set our oneToManyAttributes to new collections if it hasn't
     *  already been done by the set method.
     **/
    initialize: function(attributes, options) {
        Backbone.Model.prototype.initialize.call(this, attributes, options);
        
        var oneToManyAttributes = this.oneToManyAttributes();
        
        /* If we have one to many attributes on this model */
        if(oneToManyAttributes) {
            /* For each one to many attribute */
            for(var i = 0, il = oneToManyAttributes.length; i < il; i++) {
                var oneToMany = oneToManyAttributes[i];
                
                /* If the one to many attribute has not yet been set */
                if(!this.get(oneToMany.attr)) {
                    var setArgs = {};
                    setArgs[oneToMany.attr] = this._createOneToManyAttribute(oneToMany);
                    
                    /* do it */
                    this.set(setArgs);
                }
            }
        }
    }, 
    
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
            /* For each one to many attribute */
            for(var i = 0, il = oneToManyAttributes.length; i < il; i++) {
                var oneToMany = oneToManyAttributes[i];
                
                /* something that is being set for this related attribute */
                var models = attributes[oneToMany.attr];
                
                /* If we're trying to set the related model */
                if(models) {
                    
                    /* If the argument is not of the proper type */
                    if(!(models instanceof oneToMany.collectionType)) {
                        
                        /* Create one of the proper type */
                        var newAttr = this._createOneToManyAttribute(oneToMany);
                        
                        /* If it is a list */
                        if(typeof(models) == 'object' && 
                        typeof(models.length) != 'undefined') {
                            /* Load in objects */
                            newAttr.refresh(models);
                        }
                        /* If it is something else */
                        else {
                            throw new Error('Do not know how to handle this currently.');
                        }
                        
                        /* save new collection attribute */
                        attributes[oneToMany.attr] = newAttr;
                    }
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
    
    /**
     *  Create a one to many attribute initially.
     **/
    _createOneToManyAttribute: function(oneToMany) {
        /* Create new collection of request objects */
        var attr = new oneToMany.collectionType(
            null, 
            /* Send in self incase collection requires it */
            {
                relatedModel: this
            }
        );
        
        if(oneToMany.comparator) {
            attr.comparator = oneToMany.comparator;
        }
        
        return attr;        
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