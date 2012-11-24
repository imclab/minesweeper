var mine = function() {};

$(window).load(function() {
var mines = 0;
var cleared = 0;

// Fill the board randomly
function fillBoard() {
	while (mines < 10) {
		$('.tile').each(function(index) {
			if ((mines < 10) && ((Math.floor(Math.random()*64)) === 0)) {
				var mine = $('<img />').attr('src', 'img/bomb.png');
				$(this).html(mine);
				mines++;
			}
		});
	}
}

// Make the board pretty
function prettyBind() {
	$('.tile').mousedown(function() {
		$(this).css('background-color', '#97CEEC');
	});
	$('.tile').mouseout(function() {
		$(this).mouseup();
	});
}

// Figure out adjacent tiles
// (this was fun to code!)
function adjacentTiles(tile) {
	var abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	var tiles = [];
	if (tile[0] !== 'a') {
		tiles.push(
			abc[abc.indexOf(tile[0]) - 1] + tile[1]
		);
	}
	if ((tile[0] !== 'a') && (tile[1] !== '8') ) {
		tiles.push(
			abc[abc.indexOf(tile[0]) - 1] + (parseInt(tile[1]) + 1)
		);
	}
	if (tile[1] !== '8') {
		tiles.push(
			tile[0] + (parseInt(tile[1]) + 1)
		);
	}
	if ((tile[0] !== 'h') && (tile[1] !== '8') ) {
		tiles.push(
			abc[abc.indexOf(tile[0]) + 1] + (parseInt(tile[1]) + 1)
		);
	}
	if (tile[0] !== 'h') {
		tiles.push(
			abc[abc.indexOf(tile[0]) + 1] + tile[1]
		);
	}
	if ((tile[0] !== 'h') && (tile[1] !== '1') ) {
		tiles.push(
			abc[abc.indexOf(tile[0]) + 1] + (parseInt(tile[1]) - 1)
		);
	}
	if (tile[1] !== '1') {
		tiles.push(
			tile[0] + (parseInt(tile[1]) - 1)
		);
	}
	if ((tile[0] !== 'a') && (tile[1] !== '1') ) {
		tiles.push(
			abc[abc.indexOf(tile[0]) - 1] + (parseInt(tile[1]) - 1)
		);
	}
	return tiles;
}

mine.newGame = function() {
	mines = 0;
	cleared = 0;
	$('#messageText').fadeOut();
	$('.tile').html('');
	$('.tile').css('cursor', 'pointer');
	$('.tile').css('background-color', '#000');
	$('#board').fadeIn();
	fillBoard();
	prettyBind();
	// When a tile is clicked...
	$('.tile').click(function() {
		// If there is a mine...
		if ($(this).html().match('img')) {
			$('.tile').unbind();
			$('td img').css('display', 'inline');
			$('.tile').css('background-color', '#FFF');
			$('.tile').css('cursor', 'auto');
			if (cleared === 54) {
				$('#messageText').text('Well done.').fadeIn();
			}
			else {
				$('#messageText').text('Reinitializing...').fadeIn();
			}
			window.setTimeout(function() {
				$('#board').fadeOut(function() {
					$.get('bits.php', function(data) {
						Math.seedrandom(data);
						mine.newGame();
					});
				});
			}, 5000);
		}
		// If there is no mine...
		else {
			var counter = 0;
			var adjacent = adjacentTiles($(this).attr('id'));
			for (var i = 0; i !== adjacent.length; i++) {
				if ($('#' + adjacent[i]).html().match('img')) {
					counter++;
				}
			}
			$(this).unbind();
			$(this).text(counter);
			$(this).css('background-color', '#FFF');
			$(this).css('cursor', 'auto');
			cleared++;
			// If 54 tiles are cleared, then we've won!
			if (cleared === 54) {
				$('.tile').click();
			}
			// If tile is surrounded by no mines, click adjacent tiles automatically
			else if (counter === 0) {
				for (var i = 0; i !== adjacent.length; i++) {
					if ($('#' + adjacent[i]).css('cursor') === 'pointer') {
						$('#' + adjacent[i]).click();
					}
				}
			}
		}
	});
	// Right click...
	$('.tile').bind('contextmenu', function() {
		if ($(this).css('cursor') === 'pointer') {
			$(this).css('cursor', 'auto');
			$(this).css('background-color', '#F00');
		}
		else {
			$(this).css('cursor', 'pointer');
			$(this).css('background-color', '#000')
		}
		return false;
	});
}

$.get('bits.php', function(data) {
	console.log(data);
	Math.seedrandom(data);
	mine.newGame();
});

// -----------------------------------------

$('#infoLink').click(function() {
	if ($(this).text() === 'What is this?') {
		$('#board').fadeOut(function() {
			$('#info').fadeIn();
			$('#infoLink').text('Go back');
		});
	}
	else {
		$('#info').fadeOut(function() {
			$('#board').fadeIn();
			$('#infoLink').text('What is this?');
		});
	}
})

});