Game.Instructions = function (game) {

	this.music = null
	this.playButton = null

}

Game.Instructions.prototype = {

	init: function (problem_set) {

		this.problem_set = problem_set

	},

  create: function () {

		instructions = this.game.add.text(490, 50, 'In this game, addition problems will appear on the screen.\n\nSolve each problem however it’s easiest for you.\n\nOnce you have solved the problem, enter your answer using the buttons on the on-screen keypad.\n\nOnce you have finished entering your answer, press the “Go” button.\n\nIf you answer the problem correctly, you will advance to the next problem.\n\nIf you answer the problem incorrectly, you will get to try again.\n\nYou will have three seconds to solve each problem.\n\n\n\n\n\n\n\n\n\nPress the button below when you are ready to start.', {font:'20px Arial', fill:'#FFFFFF', align:'center'});
		instructions.anchor.x = 0.5
		instructions.lineSpacing = -10
    this.bucket = this.add.button(450, 410, 'go', function () {this.state.start('Run', true, false, 3000, false, this.problem_set);}, this);

  },

}
