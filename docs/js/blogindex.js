$(document).ready(function(){

// Trigger style/sort fxn by clicking on date/cat spans
$('#by-date').on('click', function(){sortby(0);savesort('date');});
$('#by-cat').on('click', function(){sortby(1);savesort('category')});

// Function to style the date/cat spans, change the tab look, and trigger the sorting functions
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
        $('.categories').append('<div><h4 class="category" id="c'+i+'c"><i class="fas fa-lg fa-caret-down fa-caret-right"></i> ' + thisheader + ' (' + thiscount + ')</h4></div>');
        //$('.categories').append('<div id=' + i + '><h4 class="category" id="'+i+'"><i class="fas fa-lg fa-caret-down fa-caret-right"></i> ' + thisheader + ' (' + thiscount + ')</h4></div>');
        //identify any posts that belong in this category
        $('.recent>li').each(function() {
          var thisli=$(this).html();
          var thesetags = $(this).find('div.tags').html();
          if(thesetags.indexOf(taglist()[i]) != -1){
            //add these posts under the header
            $('#c'+i+'c').after('<li class="c'+i+'c">'+thisli+'</li>');
          }
        });
      }
   }

  // add toggling function now that elements exist 
  $('.categories').find('.category').unbind('click'); // first unbind preexisting versions of this fxn
  $('.category').on('click', function(){
    var catname = $(this).attr('id');
    cattoggle(catname);
    savedrop(catname);
  });
  
  // Show categories list and hide by-date list
  $('.recent').css('display','none');
  $('.categories').css('display','block')

}  
  

// Re-display posts by date and hide the by-category sorting
function datesort() {
  $('.categories, .categories li').css('display','none');
  $('.recent').css('display','block');
  $('.fas').removeClass('fa-caret-down, fa-caret-right').addClass('fa-caret-right');
}

// categories toggling function
function cattoggle(catname) {
  $('.'+catname).slideToggle();
  $('#'+catname+' .fas').toggleClass('fa-caret-right');
}

// save interactions with the date vs category tabs and the category dropdowns in url query string param
function savesort(sortby) {
  var sortbyparam = '?sort='+sortby;
  history.pushState(null, '', sortbyparam);
}
function savedrop(dropcat) {
  var urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('sort') == 'category') {
    var currentdrops = urlParams.getAll('v');
    if (!currentdrops.includes(dropcat)) {urlParams.append('v',dropcat);var newurl='?'+urlParams.toString();}
    else {var newurl='?'+urlParams.toString().replace('&v='+dropcat,'');}
    history.pushState(null,'',newurl);
  }
}

// function to do whatever is saved in the url query string param
  if ('URLSearchParams' in window) {
    var urlParams = new URLSearchParams(window.location.search);
  // if we're sorting by category, put the category tab in front
    if (urlParams.get('sort') == 'category') {
      sortby(1);
    // check if any categories should be expanded and if so expand them
      var dropped = urlParams.getAll('v');
      for (var i=0;i<dropped.length;i++) {cattoggle(dropped[i]);}
    } 
  // otherwise, sort by date
    else {sortby(0);}
  }


// On screen touch (aka device is mobile/tablet), add nouserselect class to more elements
 window.addEventListener('touchstart', function onFirstTouch() {
    $('.category h4').addClass('nouserselect')
    $('.title').addClass('nouserselect')
    window.removeEventListener('touchstart', onFirstTouch, false);
  }, false);

});