$(document).ready(init());

var player_count;
var civilian_count;
var civilian_profession_count;
var mafia_count;
var mafia_profession_count;
var trait_count;
var role_names = [];
var trait_names = [];

/* Initialization and Setup */
//{
var mafia_professions;
var civilian_professions;
var traits;

function init () {
	mafia_professions = ['Escort','Thief','Spy','Mob Boss'];
	civilian_professions = ['Bodyguard','Doctor','Medic','Nurse','Reporter','Sheriff'];
	traits = ['Alien','Assassin','Bus Driver','Mad Scientist','Witch','Idiot','Judge','Female Lover','Male Lover','Magician','Mute','Slow Plague','Fast Plague','Procrastinator','Stalker','Zombie'];
	AddCivilian(civilian_professions);
	AddMafia(mafia_professions);
	AddTrait(traits);
	PopulateSelect();
	$('.navigation-pane>button#show-edit-game-page').click();
};

function PopulateSelect () {
	var player_select = $('#player-count');
	player_select.append('<option value='+0+'>0 Players</option>');
	player_select.append('<option value='+1+'>1 Player</option>');
	for (var i=2; i<21; ++i)
		player_select.append('<option value='+i+'>'+i+' Players</option>');

	var mafia_select = $('#mafia-count');
	for (var i=0; i<21; ++i)
		mafia_select.append('<option value='+i+'>'+i+' Mafia</option>');

	var civilian_select = $('#civilian-count');
	civilian_select.append('<option value='+0+'>0 Civilians</option>');
	civilian_select.append('<option value='+1+'>1 Civilian</option>');
	for (var i=2; i<21; ++i)
		civilian_select.append('<option value='+i+'>'+i+' Civilians</option>');
}

function AddCivilian(array) {
	for (i=0; i<array.length; ++i) {
		AddCheckBoxTo($('#civilian-list'), 'civilian', array[i]);
	}
}

function AddMafia(array) {
	for (i=0; i<array.length; ++i) {
		AddCheckBoxTo($('#mafia-list'), 'mafia', array[i]);
	}
}

function AddTrait(array) {
	for (i=0; i<array.length; ++i) {
		AddCheckBoxTo($('#trait-list'), 'trait', array[i]);
	}
}

function AddCheckBoxTo(object, class_name, name) {
	object.append("<div><label class='check0'><div class='check' /><span class='check-label'>"+name+"</span><input type='checkbox' class='"+class_name+"' name='"+name+"' autocomplete='off' style='display:none;'></label></div>");
}
//}

/* Edit Game */
//{
function UpdateModel() {
	player_count = +$('#player-count').val();
	civilian_count = +$('#civilian-count').val();
	mafia_count = +$('#mafia-count').val();
	civilian_profession_count = +$('#civilian-list .check-civilian').size();
	mafia_profession_count = +$('#mafia-list .check-mafia').size();
	trait_count = +$('#trait-list .check-trait').size();
}

function ApplyModel() {
	$('#player-count').val(player_count);
	$('#civilian-count').val(civilian_count);
	$('#mafia-count').val(mafia_count);
	var civilian_profession_count_text = civilian_profession_count==0?'':'('+civilian_profession_count+')';
	var mafia_profession_count_text = mafia_profession_count==0?'':'('+mafia_profession_count+')';
	var trait_count_text = trait_count==0?'':'('+trait_count+')';
	$('#civilian-profession-count').text(civilian_profession_count_text);
	$('#mafia-profession-count').text(mafia_profession_count_text);
	$('#trait-count').text(trait_count_text);
}

$('#player-count').on('change', function(){
	UpdateModel();
	UpdateFromPlayer();
	ApplyModel();
});

$('#mafia-count').on('change', function(){
	UpdateModel();
	UpdateFromMafia();
	ApplyModel();
});

$('#civilian-count').on('change', function(){
	UpdateModel();
	UpdateFromCivilian();
	ApplyModel();
});

$('.civilian').on('change', function() {
	$(this).parent().children('.check').toggleClass('check-civilian');
	UpdateModel();
	if (civilian_count<civilian_profession_count) {
		civilian_count = civilian_profession_count;
		UpdateFromCivilian();
	}
	ApplyModel();
});

$('.mafia').on('change', function() {
	$(this).parent().children('.check').toggleClass('check-mafia');
	UpdateModel();
	if (mafia_count<mafia_profession_count) {
		mafia_count = mafia_profession_count;
		UpdateFromMafia();
	}
	ApplyModel();
});

$('.trait').on('change', function() {
	$(this).parent().children('.check').toggleClass('check-trait');
	UpdateModel();
	if (player_count<trait_count) {
		player_count = trait_count;
		UpdateFromPlayer();
	}
	ApplyModel();
});

function UpdateFromPlayer() {
	if (player_count > civilian_count + mafia_count ) {
		civilian_count = player_count - mafia_count;
	} else {
		player_count = Math.max(civilian_profession_count + mafia_profession_count, player_count, trait_count);
		civilian_count = Math.max(player_count - mafia_count, civilian_profession_count, trait_count - mafia_count);
		mafia_count = Math.max(player_count - civilian_count, mafia_profession_count);
	}
}

function UpdateFromCivilian() {
	if (player_count < civilian_count + mafia_count ) {
		mafia_count = Math.max(player_count - civilian_count, mafia_profession_count);
		player_count = civilian_count + mafia_count;
	} else {
		civilian_count = Math.max(civilian_count, civilian_profession_count);
		mafia_count = player_count - civilian_count;
	}
}

function UpdateFromMafia() {
	if (player_count < civilian_count + mafia_count ) {
		civilian_count = Math.max(player_count - mafia_count, civilian_profession_count);
		player_count = civilian_count + mafia_count;
	} else {
		mafia_count = Math.max(mafia_count, mafia_profession_count);
		civilian_count = player_count - mafia_count;
	}
}
//}

/* Game Page */
//{
$('#game-page-new-game').on('click', function(){
	NewGame();
	if ($('#player-list').children().length > 0) {
		$(this).hide();
	}
});

function AddPlayer(param) {
	param = param || {};
	name = param.name || 'Player';
	role = param.role || 'Civilian';
	trait = param.trait || 'No Trait';
	var player = $('<button class="player"><div class="player-color"></div><div class="player-info"><h4>'+name+'</h4><span class="profession">'+role+'</span>&nbsp;<span class="trait">'+trait+'</span></div></button>');

	player.data('name', name);
	player.data('note', '');
	player.data('status', 'Alive');
	player.data('role', role);
	player.data('trait', trait);
	AssignColor(player);
	player.on('click', function(){
		LoadPlayer($(this));
		ShowRightPane('player-action');
	})
	$('#game-page>#player-list').append(player);
	if (param.animate) {
		player.css('opacity','0');
		player.animate({opacity:'1'}, 200, function(){
			player.css("opacity","");
		});
	}
}

function AssignColor(player){
	var civilian_colors = ['rgb(63,127,255)','rgb(127,191,255)','rgb(95,159,255)'];
	var mafia_colors = ['rgb(255,95,95)','rgb(255,127,127)'];
	if (civilian_professions.indexOf(player.data('role')) > -1 || player.data('role') == 'Civilian'){
		var color = civilian_colors[Math.floor(Math.random()*civilian_colors.length)];
	} else {
		var color = mafia_colors[Math.floor(Math.random()*mafia_colors.length)];
	}
	player.children('.player-color').css('background-color', color);
}
//}

/* Card Page */
//{
$('#navigation>#show-card-page').on('click', function(){
	var select = $('#card-page>#player-name');
	select.children().remove();
	$('.player').each(function(){
		var option = $('<option></option>');
		option.text($(this).data('name'));
		option.data('role', $(this).data('role'));
		option.data('trait', $(this).data('trait'));
		select.append(option);
	});
});

$('#card-page #player-name').on('change', function(){
	var player = $(this).find(':selected');
	$('#card-page #role-name').html(player.data('role'));
	$('#card-page #trait-name').html(player.data('trait'));
});

//}

/* Player Action */
//{
function LoadPlayer(player) {
    $('#player-action').data('player', player);
	$('#player-action-name').val(player.data('name'));
	$('#player-action-status>li').removeClass('active');
	$('#player-action-status>#'+player.data('status')).addClass('active');
	$('#player-action-note').val(player.data('note'));
}

$('#player-action-name').on('change', function(){
	player = $('#player-action').data('player');
	player.data('name', $(this).val());
	player.find('h4').text($(this).val());
	player.find('h4').text($(this).val());
});

$('#player-action-status>li').on('click', function(){
	player = $('#player-action').data('player');
	$('#player-action-status>li').removeClass('active');
	$(this).addClass('active');
	player.data('status', $(this).attr('id'));
	player.removeClass('Alive Dying Dead');
	player.addClass($(this).attr('id'));
	ClosePane();
});

$('#player-action-note').on('change', function(){
	player = $('#player-action').data('player');
	player.data('note', $(this).val());
});

$('#player-action-remove').on('click', function()
{
	player = $('#player-action').data('player');
	player.animate({height:'0',opacity:'0','padding-top':'1','padding-bottom':'0',border:'1px'}, 400);
	setTimeout(function(){player.remove();}, 400);
	param = {};
	param.name = 'Player';
	param.role = player.data('role');
	param.trait = player.data('trait');
	param.animate = true;
	AddPlayer(param);
	ClosePane();
});
//}

/* Game Action */
//{
$('#game-action-reset-status').on('click', ResetPlayerStatuses);

$('#game-action-reassign-roles').on('click', ShuffleRoles);

$('#game-action-new-game').on('click', NewGame);

function ResetPlayerStatuses(){
	$('.player').removeClass('Dying Dead').addClass('Alive').data('status', 'Alive');
	ClosePane();
}

function ShuffleRoles(){
	role_names = shuffle(role_names);
	trait_names = shuffle(trait_names);
	var player_names = [];
	
	$('.player').each(function(){
		player_names.push($(this).data('name'));
	});

	$('.player').remove();

	for (var i=0; i<role_names.length; ++i) {
		param = {};
		param.name = player_names[i];
		param.role = role_names[i];
		param.trait = trait_names[i];
		AddPlayer(param);
	}
	
	ClosePane();
}

function NewGame(){
	role_names = [];
	trait_names = [];
	
	$('#civilian-list input:checked').each(function(){
		role_names.push($(this).attr('name'));
	});
	for (i=role_names.length; i<civilian_count; ++i) {
		role_names.push('Civilian');
	}
	$('#mafia-list input:checked').each(function(){
		role_names.push($(this).attr('name'));
	});
	for (i=role_names.length; i<player_count; ++i) {
		role_names.push('Mafia');
	}
	$('#trait-list input:checked').each(function(){
		trait_names.push($(this).attr('name'));
	});
	for (i=trait_names.length; i<player_count; ++i) {
		trait_names.push('No Trait');
	}

	current_roles = role_names;
	current_traits = trait_names;
	
	ShuffleRoles();
}

function shuffle(array){
	var ret = [];
	while (array.length > 0) {
		var element = array.splice(Math.random()*array.length|0,1)[0];
		ret.push(element);
	}
	return ret;
}
//}


