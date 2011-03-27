/**
 *  @file       Comment.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A generic comment class.
 *
 *  @class      Comment
 *  @extends    ConcertBackboneModel
 **/
var Comment = ConcertBackboneModel.extend(
	/**
	 *	@scope	Comment.prototype
	 **/
{
    foreignKeyAttributes: function() {
        return [
            {
                attr: 'author', 
                model: User 
            }
        ];
    }, 
    name: 'comment'
});

/**
 *  A set of comments.
 *
 *  @class      CommentSet
 *  @extends    ConcertBackboneCollection
 **/
var CommentSet = ConcertBackboneCollection.extend(
	/**
	 *	@scope	CommentSet.prototype
	 **/
{
    model: Comment 
});
 