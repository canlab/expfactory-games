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
		this.game.load.image('brick', '/static/experiments/bridge_game/images/brick.png')
		this.game.load.image('userCol', '/static/experiments/bridge_game/images/cloud-platform.png')
		this.game.load.spritesheet('dude', '/static/experiments/bridge_game/images/dude.png', 32, 48)
		this.game.load.image('go', '/static/experiments/bridge_game/images/go_button.png')
		this.game.load.image('cloud', '/static/experiments/bridge_game/images/cloud-platform.png')
		this.game.load.image('compCol', '/static/experiments/bridge_game/images/cloud-platform.png')
		this.game.load.image('crossB','/static/experiments/bridge_game/images/cross_button.png')
		this.game.load.image('bridgethegap', '/static/experiments/bridge_game/images/bridgethegap.png')
                this.game.load.image('background', '/static/experiments/bridge_game/images/moon_background.png')

	},

	create: function () {

		this.preloadBar.cropEnabled = false
		this.state.start('Menu', true, false, this.problem_set)


	},


}
