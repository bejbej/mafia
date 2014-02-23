/* Navigation */
//{
$('#view-click-cover').on('click', ClosePane);

/* Show a pane on the right side of the screen. */
function ShowRightPane(id){
	$('.side-pane').hide();
	$('#view-click-cover').show();
	$('#'+id).css({left:''})
	         .css({right:'0'})
	         .show();
	$('#content>div').css({left:'-24rem'},100);
}

/* Show a pane on the left side of the screen. */
function ShowLeftPane(id){
	$('.side-pane').hide();
	$('#view-click-cover').show();
	$('#'+id).css({right:''})
	         .css({left:'0'})
	         .show();
	$('#content>div').css({left:'24rem'},100);
}

/* Close the currently open pane if any. */
function ClosePane(){
	$('#view-click-cover').hide();
	$('#content>div').css({left:'0'},100);
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









