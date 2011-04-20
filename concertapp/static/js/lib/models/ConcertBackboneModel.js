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
            var me = this;
            _.each(oneToManyAttributes, function(oneToMany) {
                /* If the one to many attribute has not yet been set */
                if(!me.get(oneToMany.attr)) {
                    var setArgs = {};
                    setArgs[oneToMany.attr] = me._createOneToManyAttribute(oneToMany);

                    /* do it */
                    Backbone.Model.prototype.set.call(me, setArgs, {silent: true});
                }
            });
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
            var me = this;
            _.each(oneToManyAttributes, function(oneToMany) {
                /* something that is being set for this related attribute */
                var models = attributes[oneToMany.attr];

                /* If we're trying to set the related collection */
                if(models) {
                    
                    /* If the argument is not of the proper type */
                    if(!(models instanceof oneToMany.collectionType)) {
                        
                        /* Get related collection */
                        var newAttr = me.attributes[oneToMany.attr];
                        /* If it hasn't been created for some reason */
                        if(!newAttr) {
                            /* Create it */
                            newAttr = me._createOneToManyAttribute(oneToMany);
                            /* save new collection attribute */
                            attributes[oneToMany.attr] = newAttr;
                        }

                        /* If it is a list */
                        if(models instanceof Array) {
                            /* If the list is not empty */
                            if(models.length) {
                                /* if this list is of objects */
                                if(typeof(models[0]) == 'object') {
                                    /* Load in objects */
                                    newAttr.refresh(models);
                                    /* Make sure we don't set the attribute
                                    because it is still a array of objects */
                                    delete attributes[oneToMany.attr];
                                }
                                /* If this is a list of strings, models were
                                sent as URLs */
                                else if(typeof(models[0]) == 'string') {
                                    /* The class for this model */
                                    var modelType = oneToMany.collectionType
                                        .prototype.model;
                                    var modelName = modelType.prototype.name;

                                    var modelManagerSeenInstances = 
                                        com.concertsoundorganizer
                                        .modelManager.seenInstances;
                                        
                                    /* The seen instances for this model */
                                    var seenInstances = 
                                        modelManagerSeenInstances[modelName];
                                    
                                    /* Seen instances of the parent model */
                                    var parentSeenInstances = null;
                                    /* If model has a parent class that is not 
                                    ConcertBackboneModel */
                                    var parentType = modelType.__super__;
                                    if(parentType != ConcertBackboneModel.prototype) {
                                        var modelParentName = parentType.name;
                                        /* We need to use the parent's seen 
                                        instances as well */
                                        parentSeenInstances = modelManagerSeenInstances[modelParentName];
                                    }

                                    /* for each model URL in list */
                                    _.each(models, function(modelUrl) {
                                           var apiURL = com.concertsoundorganizer.apiBaseURL;
                                           var modelId = modelUrl
                                               .split(apiURL)[1]
                                               .match(/\d+/);

                                           if(modelId.length != 1) {
                                               throw new Error('Malformed related model URL.');
                                           }
                                           else {
                                               modelId = modelId[0];
                                           }

                                           /* Have we created this model before? */
                                           var model = seenInstances.get(modelId);

                                           /* If model instance was not found */
                                           if(!model) {
                                               /* Check parent seen instances */
                                               if(parentSeenInstances) {
                                                   model = parentSeenInstances.get(modelId);
                                               }
                                               
                                               /* If it still wasn't found */
                                               if (!model) {
                                                   /* Create new instance with just id */
                                                   model = new modelType({
                                                       id: modelId 
                                                   });
                                                   /* add to seen instances */
                                                   seenInstances.add(model);

                                                   /* if there is a parent seen instances
                                                   then parentSeenInstances will be 
                                                   set */
                                                   if(parentSeenInstances) {
                                                       parentSeenInstances.add(model);
                                                   }                                                   
                                               }
                                           }

                                           Backbone.Collection.prototype._add.call(newAttr, model);
                                    });
                                }
                            }
                            else {
                                /* empty list */
                                newAttr.refresh([]);
                            }
                            
                            
                        }
                        /* It is something else */
                        else {
                            throw new Error('Do not know how to handle this currently.');
                        }
                        
                    }
                    
                    
                }                
            });
        }
        
        if(attributes && foreignKeyAttributes) {
            /* For each foreign key attribute */
            var me = this;
            _.each(foreignKeyAttributes, function(foreignKey) {
                /* If we're trying to set this attribute */
                if(foreignKey.attr in attributes) {
                    
                    var model = attributes[foreignKey.attr];

                    /*  and it is not a model */
                    if(model && !(model instanceof Backbone.Model)) {
                        /* It might be an object */
                        if(typeof(model) == 'object') {

                            var modelManagerSeenInstances = com.concertsoundorganizer.modelManager.seenInstances;
                            /* If so we need to check with the dataset manager */
                            var seenInstances = modelManagerSeenInstances[foreignKey.model.prototype.name];
                            
                            var parentSeenInstances = null;
                            /* If model has a parent class that is not 
                            ConcertBackboneModel */
                            var parentType = foreignKey.model.__super__;
                            if(parentType != ConcertBackboneModel.prototype) {
                                /* parent name */
                                var modelParentName = parentType.name;
                                parentSeenInstances = modelManagerSeenInstances[modelParentName];
                            }
                            

                            var possibleDuplicate = seenInstances.get(model.id);
                            
                            /* If there was no duplicate, check parent instances */
                            if(!possibleDuplicate && parentSeenInstances) {
                                possibleDuplicate = parentSeenInstances.get(model.id);
                            }

                            /* If there is a duplicate */
                            if(possibleDuplicate) {
                                /* Send the attributes to the duplicate incase there are new ones */
                                possibleDuplicate.set(model);

                                /* Use duplicate moving forward */
                                attributes[foreignKey.attr] = possibleDuplicate;
                            }            
                            /* If no duplicate was found */
                            else {
                                /* Create model instance with just id for now */
                                var modelData = model;
                                var modelInstance = new foreignKey.model(
                                    {
                                        id: modelData.id
                                    }
                                );
                                
                                seenInstances.add(modelInstance);
                                
                                if(parentSeenInstances) {
                                    parentSeenInstances.add(modelInstance);
                                }
                                
                                /* Now with rest of attributes */
                                modelInstance.set(modelData);
                                
                                attributes[foreignKey.attr] = modelInstance;
                            }

                        }
                        /* if the attribute was sent in as a string */
                        else if(typeof(model) == 'string') {
                            /* it is likely the URL of this model instance */
                            var modelUrl = model;
                            
                            var modelId = modelUrl
                                .split(com.concertsoundorganizer.apiBaseURL)[1]
                                .match(/\d+/);
                            
                            if(modelId.length != 1) {
                                throw new Error('Malformed related model url: '+modelUrl);
                            }
                            else {
                                modelId = modelId[0];
                            }
                            
                            var modelManagerSeenInstances = 
                                com.concertsoundorganizer
                                .modelManager.seenInstances;
                                
                            /* The type of model */
                            var modelType = foreignKey.model;
                            
                            /* The seen instances for this model type */
                            var seenInstances = modelManagerSeenInstances[modelType.prototype.name];

                            var parentSeenInstances = null;
                            /* If model has a parent class that is not 
                            ConcertBackboneModel */
                            var parentType = modelType.__super__;
                            if(parentType != ConcertBackboneModel.prototype) {
                                /* parent name */
                                var modelParentName = parentType.name;
                                parentSeenInstances = modelManagerSeenInstances[modelParentName];
                            }

                            var model = seenInstances.get(modelId);
                            
                            /* If model wasn't found, check parent instances */
                            if(!model && parentSeenInstances) {
                                model = parentSeenInstances.get(modelId);
                            }
                            
                            /* If model has already been instantiated */
                            if(model) {
                                attributes[foreignKey.attr] = model;
                            }
                            else {
                                /* Model has not been instantiated, so create it */
                                model = new modelType({
                                    id: modelId
                                });
                                
                                /* Add to seen instances */
                                seenInstances.add(model);
                                if(parentSeenInstances) {
                                    parentSeenInstances.add(model);
                                }
                                
                                attributes[foreignKey.attr] = model;
                            }
                        }
                    }
                }
                
            });
        }
        
        Backbone.Model.prototype.set.call(this, attributes, options);
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
     *  Wrap our error callback for destroy calls too.
     **/
    destroy: function(options) {
        var wrapErrorHelper = com.concertsoundorganizer.helpers.wrapError;
        
        return Backbone.Model.prototype.destroy.call(this, wrapErrorHelper(options));
    }, 

    /**
     *  Uses the 'static' name attribute of the model to create the url.  If the
     *  model has an id it is appended onto the url.
     *
     *  @param  {Boolean}    options.noBase    -    Return url without prefix
     **/
    url: function(options) {
        options || (options = {});
        
        var url = com.concertsoundorganizer.apiBaseURL;
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