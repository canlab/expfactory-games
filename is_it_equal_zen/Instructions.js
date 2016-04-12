Game.Instructions = function (game) {

	this.music = null
	this.playButton = null

}

Game.Instructions.prototype = {

	init: function (problem_set) {

		this.problem_set = problem_set

	},

  create: function () {

		instructions = this.game.add.text(490, 50, 'In this game, addition problems will appear on the screen.\n\nThese problems will already have a solution.\n\nIf the equation on the left is the same as the number on the right, press the "Equal" button.\n\nIf the equation on the left is NOT the same as the number on the right, press the "Unequal" button.\n\nIf you choose the right answer, you will advance to the next problem.\n\nIf you answer the problem incorrectly, you will get to try again.\n\n\n\n\n\n\n\n\n\n\n\nPress the button below when you are ready to start.', {font:'20px Arial', fill:'#FFFFFF', align:'center'});
		instructions.anchor.x = 0.5
		instructions.lineSpacing = -10
    this.bucket = this.add.button(450, 410, 'go', function () {this.state.start('Run', true, false, 0, true, this.problem_set);}, this);

  },

}
