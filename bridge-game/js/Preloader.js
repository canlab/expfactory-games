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
		this.game.load.image('brick', 'images/brick.png')
		this.game.load.image('userCol', 'images/cloud-platform.png')
		this.game.load.spritesheet('dude', 'images/dude.png', 32, 48)
		this.game.load.image('go', 'images/go_button.png')
		this.game.load.image('cloud', 'images/cloud-platform.png')
		this.game.load.image('compCol', 'images/cloud-platform.png')
		this.game.load.image('crossB','images/cross_button.png')
		this.game.load.image('bridgethegap', 'images/bridgethegap.png')
    this.game.load.image('background', 'images/moon_background.png')

	},

	create: function () {

		this.preloadBar.cropEnabled = false
		this.state.start('Menu', true, false, this.problem_set)


	},


}
