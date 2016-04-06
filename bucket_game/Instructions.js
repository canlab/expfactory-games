Game.Instructions = function (game) {

	this.music = null
	this.playButton = null

}

Game.Instructions.prototype = {

	init: function (problem_set) {

		this.problem_set = problem_set

	},

  create: function () {

    instructions = this.game.add.text(490, 50, 'In this game, three jars will appear on the screen: two small jars and one large jar.\n\n Three machines will release different\n numbers of colored balls into each jar.\n\n If the number of balls in the two small jars is the same as the \nnumber of balls in the large jar, press the "Equal" button.\n\n If the number of balls in the two small jars is NOT the same as the\n number of balls in the large jar, press the "Unequal" button.\n\n If you choose the correct answer, you will move on to the next trial.\n If you select the incorrect answer, you will get to try again.\n\n Press the button below when you are ready to begin.', {font:'20px Arial', fill:'#FFFFFF', align:'center'});
    instructions.anchor.x = 0.5
    instructions.lineSpacing = -8
    this.bucket = this.add.button(450, 410, 'go', function () {this.state.start('Run', true, false, this.week, this.problem_set);}, this);

  },

}
