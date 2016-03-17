Game.Instructions = function (game) {

	this.music = null
	this.playButton = null

}

Game.Instructions.prototype = {

	init: function (problem_set) {

		this.problem_set = problem_set

	},

  create: function () {

    instructions = this.game.add.text(490, 50, 'Help your character bridge the gap!\n\nIn this game, your character will be given one stack of blocks\n to use to cross the gap between two clouds.\n\n Use your finger to drag the block on the other side of the gap up and down to create \n a second stack of blocks. Your goal is to create a stack of blocks that when added to the stack\n your character was given, will add up to the number at the top of the screen.\n\n Once you have created a stack that does this, press the "Cross" button.\n\n If your stack of blocks is the right size, the two stacks will create a bridge between the clouds \n for your character to cross. If your stack is too long or not long enough, your character will be \n unable to cross the gap in between the clouds and you will get to try again.\n\n Press the button below when you are ready to begin.', {font:'20px Arial', fill:'#FFFFFF', align:'center'});
    instructions.anchor.x = 0.5
    instructions.lineSpacing = -8
    this.bridge = this.add.button(450, 410, 'go', function () {this.state.start('Run', true, false, this.week, this.problem_set);}, this);

  },

}
