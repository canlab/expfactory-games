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
		//	As this is just a Project Template I've not provided these assets, swap them for your own.
		this.game.load.image('go', '/static/games/is_it_equal_lightning/images/Go_button.png');
		this.game.load.image('lightning','/static/games/is_it_equal_lightning/images/LightningRound_Button.png')
		this.game.load.image('equalB','/static/games/is_it_equal_lightning/images/Equal_Button.png')
		this.game.load.image('unequalB','/static/games/is_it_equal_lightning/images/Unequal_Button.png')

	},

	create: function () {

		this.preloadBar.cropEnabled = false
		this.state.start('Menu', true, false, this.problem_set)


	},


}
