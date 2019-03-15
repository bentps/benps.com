$(document).ready(function(){

// Trigger style/sort fxn by clicking on date/cat spans
$('#by-date').on('click', function(){sortby(0);});
$('#by-cat').on('click', function(){sortby(1);});

// Function to style the date/cat spans, slide the slider, and trigger the sorting functions
function sortby(picked) {
  // Based on what we picked, style spans and trigger sorting functions  
    if (picked==1){$('#by-date').removeClass('sort-selected');$('#by-cat').addClass('sort-selected');catsort();}
    if (picked==0){$('#by-cat').removeClass('sort-selected');$('#by-date').addClass('sort-selected');datesort();}
}


// Utility function for title casing things
function toTitleCase(str) {
  return str.replace(/(?:^|\s)\w/g, function(match) {
      return match.toUpperCase();
  });
}


// Make a list of all tags for sorting by category
function gettags() {
  var alltags;
  $(".recent .tags").each(function(){
    thistag=$(this).html().substring(6);
    alltags += ', ' + thistag;
  });
  var alltags = alltags.split(", ");
  return alltags;
}

// Get only the unique tags and alphebatize
function taglist(){
  var unique = Array.from(new Set(gettags()));
  unique.shift(); // Take the 'undefined' value off the beginning of the array
  unique.sort();
  return unique;
}


// Get counts of each tag 
function getcounts(tag) {
  var counts = 0;
  for (var i = 0; i < gettags().length; i++) {
    if (gettags()[i] == tag){counts += 1;}
  }
  return counts;
}

// Sort posts by category, then show these and hide the by-date sorting
function catsort() {
  // If categories have not yet been figured out on this page-load, do so now
  if ($('ul.categories').find('li').length ==0){
    // loop over categories
    var i;for (i = 0; i < taglist().length; i++) { 
        // make a header element for this category
        var thisheader = (toTitleCase(taglist()[i]));
        var thiscount = getcounts(taglist()[i]);
        $('.categories').append('<div id=' + i + '><h4 class="category" id="'+i+'"><i class="fa fa-lg fa-caret-down fa-caret-right"></i> ' + thisheader + ' (' + thiscount + ')</h4></div>');
        //identify any posts that belong in this category
        $('.recent>li').each(function() {
          var thisli=$(this).html();
          var thesetags = $(this).find('div.tags').html();
          if(thesetags.indexOf(taglist()[i]) != -1){
            //add these posts under the header
            $('#'+i).after('<li class="'+i+'">'+thisli+'</li>');
          }
        });
      }

    // And trigger toggling function now that categories element exists
    $('.category').on('click', function(){
      console.log('clicked ' + this);
      $('.'+$(this).attr('id')).slideToggle();
      $('#'+$(this).attr('id')+' .fa').toggleClass('fa-caret-right');
    });

   }

  // Show categories list and hide by-date list
  $('.recent').css('display','none');
  $('.categories').css('display','block')
}  
  

// Re-display posts by date and hide the by-category sorting
function datesort() {
  $('.categories').css('display','none');
  $('.recent').css('display','block')
}

// On screen touch, add nouserselect class to more elements
 window.addEventListener('touchstart', function onFirstTouch() {
    $('.category h4').addClass('nouserselect')
    $('.title').addClass('nouserselect')
    window.removeEventListener('touchstart', onFirstTouch, false);
  }, false);

});