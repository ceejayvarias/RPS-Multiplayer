//-----------FIREBASE-----------
// Initialize Firebase
var config = {
	apiKey: "AIzaSyAuHoCc3dCEK8X4W4vuQ1UvAVUVkZQ8Zms",
	authDomain: "rps-multiplayer-98c12.firebaseapp.com",
	databaseURL: "https://rps-multiplayer-98c12.firebaseio.com",
	storageBucket: "rps-multiplayer-98c12.appspot.com",
};

firebase.initializeApp(config);

var database = firebase.database();
var playerURL = new Firebase("https://rps-multiplayer-98c12.firebaseio.com");
var players = playerURL.child("players");
var turn = playerURL.child("turn");
turn.onDisconnect().remove();

var connectedRef = playerURL.child(".info/connected");


//-----------JAVASCRIPT-----------

var str, int, user; //arbitrary

function displayChoices(str){
	var choiceQuery = '#player' + str + ' > .choice';
	var rock = $('<button class="rps" data-choice="rock">Rock</button>');
	var paper = $('<button class="rps" data-choice="paper">Paper</button>');
	var scissors = $('<button class="rps" data-choice="scissors">Scissors</button>');
	$(choiceQuery).append(rock);
	$(choiceQuery).append(paper);
	$(choiceQuery).append(scissors);
}

function addPlayer(int) {
	var name = $('#name').val().trim();
	$('name').empty();
	user = players.child(int);
	user.onDisconnect().remove();
	user.set({
		name: name,
		wins: 0,
		losses: 0
	});
}

//keeps track of who's turn it is
turn.on('value', function(snapshot){
	var turnNum = snapshot.val();
	if(turnNum == 1){
		$('#player1 > .choice').empty();
		$('#player2 > .choice').empty();
		$('#message').empty();
		turnOne();
	}
	else if(turnNum == 2){
		turnTwo();
	}
	else if(turnNum == 3){
		turnThree();
	}
})

function turnOne(){
	if (playerID == 1) {
		displayChoices(playerID);
	}
}

function turnTwo(){
	if (playerID == 2) {
		displayChoices(playerID);
	}
}

function turnThree(){
	players.once('value', function(snapshot) {
		var p1 = snapshot.val()[1];
		var p2 = snapshot.val()[2];

		//setting local variable with firebase data
		choice1 = p1.choice;
		wins1 = p1.wins;
		losses1 = p1.losses;
		choice2 = p2.choice;
		wins2 = p2.wins;
		losses2 = p2.losses;

		if (choice1 == choice2) {
			$('#message').html('<h1>TIE</h1>');
			setScore(0);
		} else if (choice1 == 'rock') {
			if (choice2 == 'paper') {
				$('#message').html('<h1>' + p2.name + ' wins!</h1>');
				setScore(2);
			} else if (choice2 == 'scissors') {
				$('#message').html('<h1>' + p1.name + ' wins!</h1>');
				setScore(1);
			}
		} else if (choice1 == 'paper') {
			if (choice2 == 'rock') {
				$('#message').html('<h1>' + p1.name + ' wins!</h1>');
				setScore(1);
			} else if (choice2 == 'scissors') {
				$('#message').html('<h1>' + p2.name + ' wins!</h1>');
				setScore(2);
			}
		} else if (choice1 == 'scissors') {
			if (choice2 == 'rock') {
				$('#message').html('<h1>' + p2.name + ' wins!</h1>');
				setScore(2);
			} else if (choice2 == 'paper') {
				$('#message').html('<h1>' + p1.name + ' wins!</h1>');
				setScore(1);
			}
		}
		setTimeout(resetTurn, 5000);
	})
}

//checking who won and sets score
function setScore(int){
	if(int == 0){ //tie

	}
	else if(int == 1){ //player 1 wins
		winner = wins1;
		loser = losses2;
		intL = int + 1;
	}
	else if(int == 2){ //player 2 wins
		winner = wins2;
		loser = losses1;
		intL = int - 1;
	}
	winner++;
	loser++;
	players.child(int).update({
		wins : winner
	})
	players.child(intL).update({
		losses : loser
	})
}

function resetTurn() {
	turn.set(1);
	user.update({
		choice: null
	})
}

var playerID, wins1, wins2, losses1, losses2, choice; //initialized variables

//what happpens when I click a choice for RPS

$(document).on('click', '.rps', function(){
	var picked = $(this).data('choice');
	user.update({
		choice: picked
	})
	turn.once('value', function(snapshot){
		var turnNum = snapshot.val();
		turnNum++
		turn.set(turnNum);
	})
})

//when clicking start
$('#addName').on('click', function(event){
	database.ref().once('value', function(snapshot){
		var playerList = snapshot.child('players');
		var numPlayers = playerList.numChildren();
		if (numPlayers == 0) {
			playerID = 1;
			addPlayer(playerID);
			turn.set(1);
		}
		else if(numPlayers == 1 && playerList.child('2').exists()){
			playerID = 1;
			addPlayer(playerID);
			turn.set(1);
		}
		else if(numPlayers == 1){
			playerID = 2;
			addPlayer(playerID);
			turn.set(1);
		}
	});
	event.preventDefault();
});
