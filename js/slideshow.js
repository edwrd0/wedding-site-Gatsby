// Licensed under GPLv3 (http://www.opensource.org/licenses/gpl-3.0.html). 

$(document).ready(function(){

	$('#toggle').click(function() {                   //Toggles slideshow
		if(bttnx == 1) {togglePlay(0);} 
		else {togglePlay(1);}
	});

	$('#nav').hide();                                 
	$('#controls').hide();
	$('#nav').click(function(){togglePlay(0);});
	//$('#controlcell, #controls').hover(function(){$('#controls').show();},function(){$('#controls').hide();});
	$('#showButton').click(function () {showToggle(1);});		
	//$('#commoncell, #cycle').hover(function(){$('#controls, #nav').show();},function(){$('#controls, #nav').hide();});
	//$('#navcell, #thumbs').hover(function(){ $('#nav').show();},function(){$('#nav').hide();});

});

$(window).load(function () {

	$('#cycle').cycle({                          //call to jCycle plugin.  This is the logic to display the photos

		before: beforeLoad,                  //callback function to prevent slideshow from looping                       
		timeout: timeOut,
		next:  '#next', 
		prev:  '#prev', 
		pager: '#nav',
		onPagerEvent: pagerLoad,
		onPrevNextEvent: navLoad,
		

		pagerAnchorBuilder: function(idx, slide) {         //creates thumbnail navigation

		return '#nav li:eq(' + idx + ') img'; 
	} 
	});
});

//global variables
var bttnx = 1;                    //global variable to indicate whether slideshow is playing or is paused             
var listLength = 0;               //initializes the length of the photoset
var slideStart = 0;               
var timeOut= 0;
 
function setFlickrdata(data) {     //function to use AJAX calls to pull the Flickr photoset as JSON.
	json = data;
	for (var i=0; i < data.photoset.photo.length ; ++i)
	{var template = '<li id="' + i + '"><a href="http://www.flickr.com/photos/' + 
		data.photoset.owner + '/' + data.photoset.photo[i].id + '" ><img id="' + 
		data.photoset.photo[i].id + '" src="http://farm' + data.photoset.photo[i].farm + 
		'.static.flickr.com/' + data.photoset.photo[i].server + '/' + data.photoset.photo[i].id + '_' + 
		data.photoset.photo[i].secret + '.jpg"' + 'alt="' + data.photoset.photo[i].title + '" /></a></li>';
	$('#cycle, #nav').append(template);
	listLength += 1;
	}}

function beforeLoad(curr, next, opts) {             //initializes slideshow to be paused and prevents slideshow from looping.
	var $slide = $(next); 
	
	var height = $slide.outerHeight() ; 
	var width = $slide.outerWidth();
	var margint = (510 - height)/2 ; 
	var marginl = (510 - width)/2 ; 
	$slide.css({marginTop :margint , marginLeft:marginl });
	if (next.id == listLength - 1)
	{
		vanish(1);
		setTimeout('showToggle(0)', timeOut);
	}
	if (slideStart == 0)
	{
		togglePlay(0);
	}
}


function slideshow(photoset, slideTime) {                 //function that initializes AJAX call and slideshow 
    var url = 'http://api.flickr.com/services/rest/?format=json&method=flickr.photosets.getPhotos&api_key=fc8d0bce9e99848af3ff4f9a0a79bf28&photoset_id='+ photoset + '&jsoncallback=?';
    console.log(url);
	$.getJSON( url , setFlickrdata);
	timeOut = slideTime;
}

function togglePlay(arg) {                             //toggles slideshow and navigation buttons
	if (arg == 0) {
		bttnx = 0; $('#cycle').cycle('pause'); 
		$('#toggle').attr('src', 'images/play.gif');
		}
	else if (arg == 1) 
	{bttnx = 1; $('#cycle').cycle('resume', true); $('#toggle').attr('src', 'images/pause.gif');}
}

/////////HELPER FUNCTIONS/////////
function showToggle(arg) {                
	if (arg == 1)
	{
		vanish(0);
		if (slideStart == 0)
		{
			slideStart = 1;
			setTimeout('togglePlay(1)', timeOut);
		}
		else {
			togglePlay(1);}
	}
	else if (arg == 0)
	{
		togglePlay(0);
		$('#showButton').attr('src', 'images/replay.gif');
		$('#showButton').css('left', 235);
	}	
}

function vanish(arg) {
	if (arg == 1)
	{ 
		$('#next, #prev, #toggle , #nav').css('left', -2000);

	}
	else if (arg == 0)
	{
		$('#showButton').css('left', -2000);
		$('#nav').css('left', 0);
		$('#next').css('left', 455);
		$('#prev').css('left', 13);
		$('#toggle').css('left', 235);	
	}	
}
