Game.Instructions = function (game) {

	this.music = null
	this.playButton = null

}

Game.Instructions.prototype = {

	init: function (problem_set) {

		this.problem_set = problem_set

	},

  create: function () {

    instructions = this.game.add.text(490, 50, 'In this game, addition problems will appear on the screen.\n\nSolve each problem however it is easiest for you.\n\nOnce you have solved the problem, use your finger to drag the blue marker down the \nnumber line. Once you have reached your answer, release the blue marker and press "Go." \n\nIf you select the correct answer, you will advance to the next problem.\n If you select the incorrect answer, you will get to try again.\n\n Press the button below when you are ready to begin.', {font:'20px Arial', fill:'#FFFFFF', align:'center'});
    instructions.anchor.x = 0.5
    instructions.lineSpacing = -8
    this.bucket = this.add.button(450, 410, 'go', function () {this.state.start('Run', true, false, this.week, this.problem_set);}, this);

  },

}
