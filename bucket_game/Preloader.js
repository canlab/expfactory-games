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

		// this.game.load.image('go', '/images/Go_button.png')
		// this.game.load.image('equalB','/images/true_Button.png')
		// this.game.load.image('unequalB','/images/false_Button.png')
		// this.game.load.image('balancingact', '/images/BalancingAct_Button.png')
		// this.game.load.image('coin', '/images/coin_gold.png')
		// this.game.load.image('next', '/images/next_button.png')
		// this.game.load.image('back', '/images/back_button.png')

		this.game.load.image('go', '/static/games/bucket_game/images/Go_button.png')
		this.game.load.image('equalB','/static/games/bucket_game/images/true_button.png')
		this.game.load.image('unequalB','/static/games/bucket_game/images/false_button.png')
		this.game.load.image('balancingact', '/static/games/bucket_game/images/BalancingAct_Button.png')
		this.game.load.image('coin', '/static/games/bucket_game/images/coin_gold.png')
		this.game.load.image('next', '/static/games/bucket_game/images/next_button.png')
		this.game.load.image('back', '/static/games/bucket_game/images/back_button.png')

	},

	create: function () {

		this.preloadBar.cropEnabled = false
		this.state.start('Menu', true, false, this.problem_set)


	},


}
