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
    this.game.load.spritesheet('balls', '/static/games/bucket_game/images/balls.png', 17, 17)
    this.game.load.spritesheet('board', '/static/games/bucket_game/images/board.png')
		this.game.load.image('go', '/static/games/bucket_game/images/Go_button.png')
		this.game.load.image('equalB','/static/games/bucket_game/images/Equal_Button.png')
		this.game.load.image('unequalB','/static/games/bucket_game/images/Unequal_Button.png')
		this.game.load.image('jar', '/static/games/bucket_game/images/jar.png')
		this.game.load.image('jarSmall', '/static/games/bucket_game/images/jar2.png')
		this.game.load.image('dispenser','/static/games/bucket_game/images/BallDispenser.png')
		this.game.load.physics('jarData','/static/games/bucket_game/images/jar.json')
		this.game.load.physics('smalljarData', '/static/games/bucket_game/images/jar2.json')
		this.game.load.image('balancingact', '/static/games/bucket_game/images/BalancingAct_Button.png')


	},

	create: function () {

		this.preloadBar.cropEnabled = false
		this.state.start('Menu', true, false, this.problem_set)


	},


}
