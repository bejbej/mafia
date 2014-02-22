/* Navigation */
//{
$('.navigation-button').on('click', ShowNavigation);

$('#view-click-cover').on('click', CloseMenu);

function ShowNavigation () {
	$('.side-pane').hide();
	$('#view-click-cover').show();
	$('#navigation').show();
	$('#view,#view-background').animate({left:'24rem'},200);
}

function ShowPlayerAction(player){
	$('.side-pane').hide();
	$('#view-click-cover').show();
	$('#player-action').show();
	$('#view,#view-background').animate({left:'-24rem'},200);
	LoadPlayer(player);
}

function ShowGameAction(){
	$('.side-pane').hide();
	$('#view-click-cover').show();
	$('#game-action').show();
	$('#view,#view-background').animate({left:'-24rem'},200);
}

function CloseMenu () {
	$('#view-click-cover').hide();
	$('#view,#view-background').animate({left:'0'},200);
}

$('.navigation-pane>button').on('click', function(){
	$('.navigation-pane>button').removeClass('active');
	$(this).addClass('active');

	$('.page').hide();
	$('.action-button').hide();

	var pagename = $(this).attr('id').replace(/^show-/, '');
	$('#'+pagename).show();
	$('#'+pagename+'-action-button').show();
	CloseMenu();
});
//}









