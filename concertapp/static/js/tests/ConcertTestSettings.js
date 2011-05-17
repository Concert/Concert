/**
 *  @file       ConcertTestSettings.js
 *  Contains settings for tests.  Change this file for your specific database
 *  setup.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
(function(){

  // Initial Setup
  // -------------
  
  var ConcertTestSettings = {};
  if (typeof exports !== 'undefined') {
      ConcertTestSettings = exports;
  } else {
      ConcertTestSettings = this.ConcertTestSettings = {};
  }
  
  
  ConcertTestSettings.baseUrl = 'http://localhost:8896';
  ConcertTestSettings.userOne = {
      username: 'colin', 
      password: 'colin'
  };
  ConcertTestSettings.userTwo = {
      username: 'amy', 
      password: 'amy'
  };
  /* Just a name of a collection that is not already in your database */
  ConcertTestSettings.newCollectionName = '6q273oieyhujsdkf';
  
  /* Wether or not to display a million lines of zombie.js output */
  ConcertTestSettings.debug = false;
  
}).call(this);
