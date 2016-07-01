Game.Instructions = function (game) {

	this.music = null
	this.playButton = null

}

Game.Instructions.prototype = {

	init: function (problem_set) {

		this.problem_set = problem_set

	},

  create: function () {

		// TO ADD ONCE FINISHED WITH TRIAL TASK
    instructions = this.game.add.text(490, 50, 'CIRCLES!', {font:'20px Arial', fill:'#FFFFFF', align:'center'});
    instructions.anchor.x = 0.5
    instructions.lineSpacing = -8
    this.bucket = this.add.button(450, 410, 'go', function () {this.state.start('Run', true, false, this.week, this.problem_set);}, this);

  },

}
