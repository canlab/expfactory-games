Game.Preloader = function (game) {

	this.background = null
	this.preloadBar = null
	this.ready = false
	this.rnd

}

Game.Preloader.prototype = {

	init: function (problem_set) {
		this.problem_set = problem_set
	},

	preload: function () {

		this.preloadBar = this.add.sprite(120, 200, 'preloaderBar')

		this.load.setPreloadSprite(this.preloadBar)

		//	Here we load the rest of the assets our game needs.
    this.game.load.spritesheet('balls', 'images/balls.png', 17, 17)
    this.game.load.spritesheet('board', 'images/board.png')
		this.game.load.image('go', 'images/Go_button.png')
		this.game.load.image('equalB','images/Equal_Button.png')
		this.game.load.image('unequalB','images/Unequal_Button.png')
		this.game.load.image('jar', 'images/jar.png')
		this.game.load.image('jarSmall', 'images/jar2.png')
		this.game.load.image('dispenser','images/BallDispenser.png')
		this.game.load.physics('jarData','images/jar.json')
		this.game.load.physics('smalljarData', 'images/jar2.json')
		this.game.load.image('balancingact', 'images/BalancingAct_Button.png')

	},

	create: function () {

		this.preloadBar.cropEnabled = false
		this.state.start('Menu', true, false, this.problem_set)


	},


}
