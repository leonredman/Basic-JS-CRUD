// 1. Initialize Firebase



  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBV6KDaXxgVCdXtZFqjTTZgcsGuMLbfDM4",
    authDomain: "js-circuits-c5c1b.firebaseapp.com",
    databaseURL: "https://js-circuits-c5c1b.firebaseio.com",
    projectId: "js-circuits-c5c1b",
    storageBucket: "js-circuits-c5c1b.appspot.com",
    messagingSenderId: "659130224623"
  };
  firebase.initializeApp(config);


var database = firebase.database();


// 2. connect to your Firebase application using your reference URL

  // by default a form submit reloads the DOM which will subsequently reload all our JS
  // to avoid this we preventDefault()
  $('#comment-form').on('submit', function (e) {
  e.preventDefault();
  // grab user's comment from input field
  //var comment = $('comment').val();
  var userInput = $('#comment').val();
  // clear the user's comment from the input (for UX purposes)
    $('#comment').val('')
  // create a section for comments data in your db to store items
  var commentsReference = database.ref('comments');
  // use the set method to save data to the comments
  //well use the push() menthod to append new data to the comments with JSON format
  commentsReference.push({
    comment: userInput,
    likes: 0
});


});



// 3. retrieve comments data when page loads and when comments are added/updated
  function getComments() {

  // use reference to database to listen for changes in comments data
    database.ref('comments').on('value', function (results) {
    // Get all comments stored in the results we received back from Firebase
    var allComments = results.val();

    // Set an empty array where we can add new comment element
      var comments = [];
    // iterate (loop) through all comments coming from database call
      for (var item in allComments) {
      // Create an object literal with the data we'll pass to Handlebars
        var context = {
          comment: allComments[item].comment,
          likes: allComments[item].likes,
          commentId: item
        };

      // Get the HTML from our Handlebars comment template
      var source = $("#comment-template").html();

      // Compile our Handlebars template
        var template = Handlebars.compile(source);
      // Pass the data for this comment (context) into the template
      var commentListElement = template(context);
      // push newly created element to array of comments
      comments.push(commentListElement)
    }
    // remove all list items from DOM before appending list items
    $('.comments').empty()
    // append each comment to the list of comments in the DOM
      for (var i in comments) {
        $('.comments').append(comments[i])
      }
   });
  }

// 4). When page loads, get comments
getComments();


// 5). Click event to delete comments
$('.comments').on('click', '.delete', function (e) {

  // Get the ID for te comment we want to update
   var id = $(e.target).parent().data('id')

  // find comment whose objectId is equal to the id we're searching with
   var commentReference = database.ref('comments/' + id)
// use remove method to remove the omment from the database
commentReference.remove()
});



//var commentReference = database.ref('comments/' + id);


// 6). Click event to like comments
$('.comments').on('click', '.like', function (e) {

    // Get the ID for te comment we want to update
   var id = $(e.target).parent().data('id')

  // find comment whose objectId is equal to the id we're searching with
var commentReference = database.ref('comments/' + id);

  // Get number of likes from HTML
var likes = $('#likes').html();
  // Convert likes to a number and add a like
likes = parseInt(likes, 10) + 1;
  // Update likes property in database
  commentReference.update({
    likes: likes
  });
});
