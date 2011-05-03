/**
 *  @file       ManageTablePanel.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A class for managing the user's set on the manage set page.  
 *  This is subclassed for the various types of set that the user can manage.
 *  @class
 *  @extends Panel
 **/
var ManageTablePanel = Panel.extend(
	/**
	 *	@scope	ManageTablePanel.prototype
	 **/
{
    initialize: function() {
        Panel.prototype.initialize.call(this);
        
        var params = this.options;
        
        var contents = this.contents;
        
        var $ = jQuery;
        
        /**
         *  The set of objects we are managing on this table.
         **/
        var set = params.set;
        if(typeof(set) == 'undefined') {
            throw new Error('params.set is undefined');
        }
        this.set = set;
        
        /**
         *  The table element
         **/
        var table = $(contents).children('.table');
        if(typeof(table) == 'undefined') {
            throw new Error('table is undefined');
        }
        else if(table.length == 0) {
            throw new Error('table not found');
        }
        this.table = table;
        
        /**
         *  The table header (first row)
         **/
        var tableHeader = $(table).children('.table-header');
        if(typeof(tableHeader) == 'undefined') {
            throw new Error('tableHeader is undefined');
        }
        else if(tableHeader.length == 0) {
            throw new Error('tableHeader not found');
        }
        this.tableHeader = tableHeader;        
        
        
        
        set.bind('refresh', this.render);
        set.bind('add', this.render);
        set.bind('remove', this.render);
    },
    render: function() {

        /* Temporary fragment for all DOM additions */
        var frag = document.createDocumentFragment();

        /* The header will always be first in the table */
        frag.appendChild(this.tableHeader.get(0))
        
        this.set.each(function(panel, template, widgetClass, frag) {
            return function(obj){
                /* Create a ManageCollectionWidget */
                var widget = new widgetClass({
                    template: template, 
                    model: obj, 
                    panel: panel
                });
                frag.appendChild(widget.el);
            };
        }(this, this.widgetTemplate, this.widgetClass, frag));
        
        /* Update manage set list */
        this.table.empty().append(frag);

        return this;
    }
});
