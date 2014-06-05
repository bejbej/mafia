$(document).ready(init());

var role_names = [];
var trait_names = [];

/* Initialization and Setup */
//{
function init () {
	civilian_roles = ['Bodyguard','Doctor','Medic','Nurse','Reporter','Sheriff'];
	mafia_roles = ['Escort','Thief','Spy','Mob Boss'];
	traits = ['Alien','Assassin','Bus Driver','Mad Scientist','Witch','Idiot','Judge','Female Lover','Male Lover','Magician','Mute','Slow Plague','Fast Plague','Procrastinator','Stalker','Zombie'];
	AddCivilian(civilian_roles);
	AddMafia(mafia_roles);
	AddTrait(traits);
	PopulateSelect();

	UpdateFromPlayer();
	NewGame();
	ShowPage('edit-game-page');
};

function PopulateSelect () {
	var player_select = $('#player-count');
	for (var i=0; i<=20; ++i)
		player_select.append('<option value='+i+'>'+i+' Players</option>');

	var mafia_select = $('#mafia-count');
	for (var i=0; i<=20; ++i)
		mafia_select.append('<option value='+i+'>'+i+' Mafia</option>');

	var civilian_select = $('#civilian-count');
	for (var i=0; i<=21; ++i)
		civilian_select.append('<option value='+i+'>'+i+' Civilians</option>');
}

function AddCivilian(array) {
	for (i=0; i<array.length; ++i)
		$('#civilian-list').append(CheckBoxFactory(array[i], 'civilian'));
}

function AddMafia(array) {
	for (i=0; i<array.length; ++i)
		$('#mafia-list').append(CheckBoxFactory(array[i], 'mafia'));
}

function AddTrait(array) {
	for (i=0; i<array.length; ++i)
		$('#trait-list').append(CheckBoxFactory(array[i], 'trait'));
}

function CheckBoxFactory(name, class_name) {
	var checkbox = $("<button class='checkbox checkbox-"+class_name+"'><div class='check'></div><div class='check-label'>"+name+"</div></button>");
	switch (class_name) {
		case 'civilian':
			checkbox.on('click', function() {
				checkbox.toggleClass('checked');
				UpdateFromCivilian();
			});
			break;
		case 'mafia':
			checkbox.on('click', function() {
				checkbox.toggleClass('checked');
				UpdateFromMafia();
			});
			break;
		case 'trait':
			checkbox.on('click', function() {
				checkbox.toggleClass('checked');
				UpdateFromPlayer();
			});
			break;
		default:
			break;
	}
	return $(checkbox);
}
//}

/* Edit Game */
//{
function GetModel() {
	var model = {};
	model.players = +$('#player-count').val();
	model.civilians = +$('#civilian-count').val();
	model.mafias = +$('#mafia-count').val();
	model.civilian_roles = +$('#civilian-list .checkbox-civilian.checked').size();
	model.mafia_roles = +$('#mafia-list .checkbox-mafia.checked').size();
	model.traits = +$('#trait-list .checkbox-trait.checked').size();
	return model;
}

function SetModel(model) {
	$('#player-count').val(model.players);
	$('#civilian-count').val(model.civilians);
	$('#mafia-count').val(model.mafias);
	$('#civilian-profession-count')
		.text(model.civilian_roles==0?'':'('+ model.civilian_roles+')');
	$('#mafia-profession-count')
		.text(model.mafia_roles==0?'':'('+model.mafia_roles+')');
	$('#trait-count')
		.text(model.traits==0?'':'('+model.traits+')');
}

$('#player-count').on('change', UpdateFromPlayer);

$('#mafia-count').on('change', UpdateFromMafia);

$('#civilian-count').on('change', UpdateFromCivilian);

function UpdateFromPlayer() {
	var model = GetModel();
	model.players = model.players < model.traits? model.traits : model.players;
	if (model.players > model.civilians + model.mafias ) {
		model.civilians = model.players - model.mafias;
	} else {
		model.players = Math.max(model.civilian_roles + model.mafia_roles, model.players, model.traits);
		model.civilians = Math.max(model.players - model.mafias, model.civilian_roles, model.traits - model.mafias);
		model.mafias = Math.max(model.players - model.civilians, model.mafia_roles);
	}
	SetModel(model);
}

function UpdateFromCivilian() {
	var model = GetModel();
	model.civilians = model.civilians < model.civilian_roles? model.civilian_roles : model.civilians;
	if (model.players < model.civilians + model.mafias ) {
		model.mafias = Math.max(model.players - model.civilians, model.mafia_roles);
		model.players = model.civilians + model.mafias;
	} else {
		model.civilians = Math.max(model.civilians, model.civilian_roles);
		model.mafias = model.players - model.civilians;
	}
	SetModel(model);
}

function UpdateFromMafia() {
	var model = GetModel();
	model.mafias = model.mafias < model.mafia_roles? model.mafia_roles : model.mafias;
	if (model.players < model.civilians + model.mafias ) {
		model.civilians = Math.max(model.players - model.mafias, model.civilian_roles);
		model.players = model.civilians + model.mafias;
	} else {
		model.mafias = Math.max(model.mafias, model.mafia_roles);
		model.civilians = model.players - model.mafias;
	}
	SetModel(model);
}

$('#civilian-profession-count').parent().on('click', function(){
	$('#civilian-list').toggle();
});

$('#mafia-profession-count').parent().on('click', function(){
	$('#mafia-list').toggle();
});

$('#trait-count').parent().on('click', function(){
	$('#trait-list').toggle();
});
//}

/* Game Page */
//{
$('#game-page-new-game').on('click', function(){
	NewGame();
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
	if (civilian_roles.indexOf(player.data('role')) > -1 || player.data('role') == 'Civilian'){
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
	var select = $('#card-page #player-name');
	select.children().remove();
	$('.player').each(function(){
		var option = $('<option></option>');
		option.text($(this).data('name'));
		option.data('role', $(this).data('role'));
		option.data('trait', $(this).data('trait'));
		select.append(option);
	});
	$('#card-page #player-name').change();
});

$('#card-page #player-name').on('change', function(){
	var player = $(this).find(':selected');
	$('#player-name-label').html($(this).val());
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
	
	$('#game-page .player').each(function(){
		player_names.push($(this).data('name'));
	});

	$('#game-page .player').remove();

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
	var model = GetModel();
	role_names = [];
	trait_names = [];
	
	$('#civilian-list .checkbox-civilian.checked').each(function(){
		role_names.push($(this).find('.check-label').text());
	});
	for (i=role_names.length; i<model.civilians; ++i) {
		role_names.push('Civilian');
	}
	$('#mafia-list .checkbox-mafia.checked').each(function(){
		role_names.push($(this).find('.check-label').text());
	});
	for (i=role_names.length; i<model.players; ++i) {
		role_names.push('Mafia');
	}
	$('#trait-list .checkbox-trait.checked').each(function(){
		trait_names.push($(this).find('.check-label').text());
	});
	for (i=trait_names.length; i<model.mafias; ++i) {
		trait_names.push('No Trait');
	}

	current_roles = role_names;
	current_traits = trait_names;
	
	ShuffleRoles();
	
	if ($('#player-list').children().length > 0) {
		$('#game-page-new-game').hide();
	} else {
		$('#game-page-new-game').show();
	}
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


