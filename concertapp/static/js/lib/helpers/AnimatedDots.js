/**
 *  @file       AnimatedDots.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This is a class that can be used when we want to animate some dots
 *  .
 *  ..
 *  ...
 *  ^ Like that.
 *  Sometimes I like to do this because it is much cheaper than a graphical
 *  loading notification.
 *	@class
 **/
function AnimatedDots(params) {
    if(params) {
        this.init(params);
    }
}

/**
 *  @param  {jQuery HTMLDivElement/HTMLSpanElement...Anything really.}  container       
 *  @param  {Number}         numDots - defaults to 3  
 *  @param  {Number}        animationSpeed - defaults to 500  
 **/
AnimatedDots.prototype.init = function(params) {

    var container = params.container;
    if(typeof(container) == 'undefined') {
        throw new Error('params.container is undefined');
    }
    else if(container.length == 0) {
        throw new Error('container not found');
    }
    this.container = container;
    
    var numDots = params.numDots;
    if(typeof(numDots) == 'undefined') {
        numDots = 3;
    }
    else if(numDots < 1) {
        throw new Error('params.numDots must be at least 1');
    }
    this.numDots = numDots;
    
    var animationSpeed = params.animationSpeed;
    if(typeof(animationSpeed) == 'undefined') {
        animationSpeed = 500;
    }
    this.animationSpeed = animationSpeed;

    /* We will keep track of the contents in a variable so we don't have to both
        check the DOM, and update the DOM. */
    this.contents = container.html();
    
    /* This is what the final step of the animation will look like, it will just be
        numDots amount of period characters */
    var finalContents = '';
    for(var i = 0; i < numDots; i++) {
        finalContents += '.';
    }
    this.finalContents = finalContents;
    
    /* Keep the interval so we can stop it */
    this.interval = null;
    
}

/**
 *  This function is called every this.animationSpeed ms, from within the interval
 *  it animates the dots one more step further.
 **/
AnimatedDots.prototype.animate = function() {
    var currentContents = this.contents;
    var finalContents = this.finalContents;
    
    var newContents = null;
    
    if(currentContents == finalContents) {
        newContents = '';
    }
    else {
        newContents = currentContents + '.';
    }
    
    this.contents = newContents;
    this.container.html(newContents);
}

/**
 *  This will start the animation, and should be called from outside.
 **/
AnimatedDots.prototype.start = function() {
    this.interval = setInterval(function(me) {
        return function() {
            me.animate();
        };
    }(this), this.animationSpeed);
}

/**
 *  This will stop the animation, and should be called from outside.
 **/
AnimatedDots.prototype.stop = function() {
    clearInterval(this.interval);
    this.interval = null;
}


