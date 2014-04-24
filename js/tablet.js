/* Navigation */
//{
/* Show a pane on the specified side of the screen. */
function ShowPane(id, location){
	$('.side-pane').hide();

	var css = {};
	var css2 = {};
	css[location] = '-24rem';
	css2[location] = '0';

	$('#'+id).css({left:''})
	         .css({right:''})
	         .css(css)
	         .show()
	         .animate(css2, 80);

	var click_cover = $("<div class='view-click-cover'></div>");
	click_cover.on('click', ClosePane);
	click_cover.css({opacity:0})
	           .animate({opacity: 0.5}, 80);
	$('body').append(click_cover);
}

/* Show a pane on the right side of the screen. */
function ShowRightPane(id){
	ShowPane(id, 'right');
}

/* Show a pane on the left side of the screen. */
function ShowLeftPane(id){
	ShowPane(id, 'left');
}

/* Close the currently open pane if any. */
function ClosePane(){
	$('.view-click-cover').remove();
	$('.side-pane').hide();
}

/* Show the page with the given id. */
/* Also updates the navigation buttons if possible. */
function ShowPage(id){
	$('.navigation-pane>button').removeClass('active');
	$('#show-'+id).addClass('active');

	$('.page').hide();
	$('.action-button').hide();

	$('#'+id).show();
	$('#'+id+'-action-button').show();

	ClosePane();
}
//}









