Game.Instructions = function (game) {

    "use strict";

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    this.trial = 0
    this.problem = [0,0,0]
    this.buttonPressed = 'none'
    this.numGraded = 0
    this.points = 0
    this.streak = 0
    this.reps = 0
    this.usedLocs = []
    this.threeTries = false
		this.inst_num = 1
		this.inst_finished = false

};

Game.Instructions.prototype = {

  init: function(week, problem_set) {
    this.week = week
    this.problem_set = problem_set
  },

  create: function() {
    problems = problemGen(this.week, this.problem_set)
    reProblems = problemGen(this.week, this.problem_set) //repeat problem set in SPT
		this.op1s = [1]//problems[1].concat(reProblems[1])
		this.op2s = [2]//problems[2].concat(reProblems[2])
		this.problem_ids = [0]//problems[3].concat(reProblems[3])

    //task info
    this.task = 'VS_verification'
    task_type = 'VS'
    //initializing subject for this game

    //this.results = set_up_subject(this.task)
    //user = this.results[0]
    //session = this.results[1]
    //play = this.results[2]
    //this.subject = new Subject(user, this.task, task_type, this.problem_set, session, play)

    equivalenceGen(true)
    this.equivalence = equivalence

    this.game.world.setBounds(0, 0, 600, 800)
    //background = this.game.add.sprite(0,0,'chalkboard')
    //background.width = this.game.width
    //background.height = this.game.height

    d = new Date()
    this.startTime = d.getTime()

    this.makeButtons()

    this.nextTrial()

		this.instruct(this.inst_num)

  },

	makeBox: function(x,y,width,height) {
		rect = this.game.add.graphics(x,y)
		rect.lineStyle(2, 0x13bee3, 1);
		rect.beginFill(0x0c3ef0, 1)
		rect.drawRect(0,0, width, height)
		return rect
	},

	instruct: function (num) {
		if (num == 1) {
					instruct_text = this.game.add.text(this.game.world.centerX-60,360,"In this game you'll be deciding whether\n the number of dots equals the number on the right.",
					{font: "20px Arial", fill: "#FFFFFF", align: "center"})
					this.nextB = this.add.button(this.game.world.centerX+175, 430, 'next', function () {
						this.game.world.remove(instruct_text)
						this.rmInstructB = true
					}, this);
					this.inst_finished = false
					this.back_ground = this.makeBox(instruct_text.x-20,instruct_text.y-10,500,120)
					this.game.world.sendToBack(this.back_ground)
					this.nextB.anchor.x = (0.5,0.5)
					this.nextB.scale.setTo(0.5,0.5)
					this.game.world.bringToTop(this.back_ground)
					this.game.world.bringToTop(instruct_text)
					this.game.world.bringToTop(this.nextB)

		} if (num == 2) {
					instruct_text = this.game.add.text(this.game.world.centerX-20,360,"If they do equal the number, press True.\nIf they don't equal the number, press False.",
					{font: "20px Arial", fill: "#FFFFFF", align: "center"})
					this.nextB = this.add.button(this.game.world.centerX+175, 430, 'next', function () {
						this.game.world.remove(instruct_text)
						this.rmInstructB = true
					}, this);
					this.inst_finished = false
					this.nextB.anchor.x = (0.5,0.5)
					this.nextB.scale.setTo(0.5,0.5)
					this.game.world.bringToTop(instruct_text)
					this.game.world.bringToTop(this.nextB)
		} if (num == 3) {
					instruct_text = this.game.add.text(this.game.world.centerX+40,360,"Hit next to try this problem now.",
					{font: "20px Arial", fill: "#FFFFFF", align: "center"})
					this.nextB = this.add.button(this.game.world.centerX+175, 430, 'next', function () {
						this.game.world.remove(instruct_text)
						this.rmInstructB = true
						this.inst_finished = true
						this.game.world.remove(this.back_ground)
					}, this);
					this.inst_finished = false
					this.nextB.anchor.x = (0.5,0.5)
					this.nextB.scale.setTo(0.5,0.5)
					this.game.world.bringToTop(instruct_text)
					this.game.world.bringToTop(this.nextB)
		}
	},


  makeButtons: function () {
    d = new Date()
    this.start_time = d.getTime()

    this.equal = this.game.add.button(540, 540, 'equalB')
    this.equal.scale.x = 0.3
    this.equal.scale.y = 0.3
    this.equal.onInputDown.add(function() {
			if (this.inst_finished) {
				this.buttonPressed = 'equal'
	      newd = new Date()
	      this.RT = newd.getTime() - this.start_time
	      //check to see if they are correct
	      this.grade(this.start_time)
			}
    }, this)

    this.unequal = this.game.add.button(315, 540, 'unequalB')
    this.unequal.scale.x = .3
    this.unequal.scale.y = .3
    this.unequal.onInputDown.add(function() {
			if (this.inst_finished) {
				this.buttonPressed = 'unequal'
	      newd = new Date()
	      this.RT = newd.getTime() - this.start_time
	      //check to see if they are correct
	      this.grade(this.start_time)
			}
    }, this)
  },

  nextTrial: function () {

    var d = new Date()
    this.start_time = d.getTime()

    if (this.op1s[this.trial] <= 9) {
        op1 = '  ' + this.op1s[this.trial];
    } else { op1 = this.op1s[this.trial];}

    if (this.op2s[this.trial] <= 9) {
        op2 = '  ' + this.op2s[this.trial];
    } else { op2 = this.op2s[this.trial];}

    this.problem[0] = +op1;
    this.problem[1] = +op2;
    this.problem[2] = +op1 + +op2;

    this.trial++
    this.progress = this.game.add.text(860, 560, this.trial + ' out of ' + this.op1s.length, {font:'30px Arial', fill:'#FFFFFF', align:'center'})
    this.progress.anchor.x = 0.5

    this.pointDisplay = this.game.add.text(85, 560, 'Coins: ' + this.points, {font:'30px Arial', fill:'#FFFFFF', align:'center'})
    this.pointDisplay.anchor.x = 0.5

    this.makeProb()
    this.equal.visible = true
    this.unequal.visible = true
  },

  makeProb: function() {
    trialNum = this.trial-1
		this.equalVal = true

    // if (this.buttonPressed == 'none' || this.answer == 'correct' || this.reps == 1) {
    //   this.presentedNum = unequalGen(equal, this.problem[2], this.problem[0], this.problem[1])
    // } else if (this.answer == 'incorrect') {
    //   this.presentedNum = this.presentedNum
    // }
    this.presentedNum = unequalGen(this.equalVal, this.problem[2], this.problem[0], this.problem[1])

    this.probText = this.game.add.group()
    this.game.add.text(370,this.game.height/2-75,'+',{font:'80px Arial', fill:'#FFFFFF', align:'center'}, this.probText)
    this.game.add.text(760,this.game.height/2-75,'=',{font:'80px Arial', fill:'#FFFFFF', align:'center'}, this.probText)
    this.game.add.text(840,this.game.height/2-75,this.presentedNum,{font:'80px Arial', fill:'#FFFFFF', align:'center'}, this.probText)

    this.circle_group = this.game.add.group()

    this.op1_circs = this.circleGen(this.problem[0],1)
    this.op2_circs = this.circleGen(this.problem[1],2)


    this.answerText = [this.problem[0],' + ',this.problem[1], ' = ',this.presentedNum]
    this.answerText = this.answerText.join('')
    // this.probText = this.game.add.text(this.game.width/2, this.game.height/2-100, this.answerText, {font:'80px Arial', fill:'#FFFFFF', align:'center'})
    // this.probText.anchor.x = 0.5
    //
    if (this.equalVal) {
      numFeedbackText = this.answerText
    } else {
      numFeedbackText = [this.problem[0],' + ',this.problem[1], ' ≠ ',this.presentedNum]
      numFeedbackText = numFeedbackText.join('')
    }
    this.numFeedback = this.game.add.text(this.game.width/2, this.game.height/2-100, numFeedbackText, {font:'80px Arial', fill:'#FFFFFF', align:'center'})
    this.numFeedback.anchor.x = 0.5
    this.numFeedback.visible = false

  },

  circleGen: function(numCircs,op) {
    // numCircs = 15
    // if ((this.reps == 0 && typeof(this.answer) == 'undefined') || (this.reps == 1 && this.answer == 'incorrect') || this.answer == 'correct') {
      this.circVals = []

      if (op == 1) {
        graphics = this.game.add.graphics(50,20)
        color = 0xff6262
      } else {
        graphics = this.game.add.graphics(440,20)
        color = 0x65c5f0
      }

      y = 50
      coords = []
      for (j = 0; j < 5; j++) {
        x = 50
        for (i = 0; i < 3; i++) {
          x = x + 50 + 50
          coords.push([x,y])
        }
        y = y + 50 + 50
      }

      this.usedLocs = []
      for (i = 0; i < numCircs; i++) {
        rProb = this.getRandom(0,1)
        if (rProb <= 0.6) {
          r = this.getRandom(10,30)
        } else if (rProb <= 0.85) {
          r = this.getRandom(31,40)
        } else {
          r = this.getRandom(61,90)
        }
        loc = Math.floor(this.getRandom(0,coords.length))
        for (c = 0; c < 1000; c++) {
          if (this.usedLocs.indexOf(loc) >= 0) {
            loc = Math.floor(this.getRandom(0,coords.length))
          }
        }
        if (r <= 20) {
          yOffset = this.getRandom(0,35)
          xOffset = this.getRandom(0,35)
        } if (r <= 30) {
          yOffset = this.getRandom(0,25)
          xOffset = this.getRandom(0,25)
        } else if (r <= 60) {
          yOffset = this.getRandom(0,15)
          xOffset = this.getRandom(0,15)
        } else if (r <= 80) {
          yOffset = this.getRandom(3,8)
          xOffset = this.getRandom(3,8)
        } else if (r <= 90) {
          yOffset = this.getRandom(1,4)
          xOffset = this.getRandom(1,4)
        } else {
          offsetAmount = 0
          yOffset = 0
          xOffset = 0
        }
        offsetDirection = this.getRandom(0,1)
        if (offsetDirection >= 0.5) {
          xOffset = -xOffset
        } else {
          yOffset = -yOffset
        }

        graphics.lineStyle(0)
        graphics.beginFill(color, 1)
        graphics.drawCircle(coords[loc][0]-100+xOffset,coords[loc][1]+yOffset,r)
        graphics.endFill()

        this.circle_group.add(graphics)

        this.usedLocs.push(loc)

        this.circVals.push([coords[loc][0]-100+xOffset,coords[loc][1]+yOffset,r])
        }
    // } else {
    //   if (op == 1) {
    //     this.graphics = this.game.add.graphics(50,20)
    //     this.circVals = this.op1_circs
    //     color = 0xff6262
    //   } else {
    //     this.graphics = this.game.add.graphics(440,20)
    //     this.circVals = this.op2_circs
    //     color = 0x65c5f0
    //   }
    //   for (i=0; i < numCircs; i++) {
    //     this.graphics.lineStyle(0)
    //     this.graphics.beginFill(color, 1)
    //     this.graphics.drawCircle(this.circVals[i][0],this.circVals[i][1],this.circVals[i][2])
    //     this.graphics.endFill()
    //   }
    // }
    return this.circVals

  },

  getRandom: function(min, max) {
    return Math.random() * (max - min) + min;
  },

  grade: function(time_stamp) {
    this.numGraded += 1
    if (this.buttonPressed == 'equal') { //it is equal and they are correct
      this.answer = 'correct'
    } else if (this.buttonPressed == 'unequal') {
      if (this.equivalence[this.trial-1] == 2) { //it is unequal and they are correct
        this.answer = 'incorrect'
      }
    }

    if (this.answer == 'correct') {
      this.points+= 1
      if (this.reps == 0) {
        this.streak += 1
      }
      this.reps = 0
    } else if (this.answer = 'incorrect') {
      this.streak = 0
      this.reps += 1
      if (this.points == 0) {
        this.points = 0
      } else {
        this.points -= 1
      }
    }

    if (this.streak == 3 || this.streak == 7 || this.streak == 15 || this.streak == 24) {
      this.points += 1
    }

    this.onSubmit()

    //this.save()


  },

  save: function() {
    if (this.buttonPressed == 'equal') {
      inputData('answer', 0)
    } else {
      inputData('answer', 1)
    }
    inputData('problem', [this.problem[0],' + ',this.problem[1],' = ',this.presentedNum].join(""))
    inputData('RT', this.RT/1000)
    inputData('n1', this.op1s[this.trial-1])
    inputData('n2', this.op2s[this.trial-1])
    inputData('points', this.points)
    inputData('problem_id', this.problem_ids[this.trial-1])
    inputData('solution', this.op1s[this.trial-1] + this.op2s[this.trial-1])

    if (this.answer == 'correct') {
      inputData('ACC', 1)
    } else {
      inputData('ACC',0)
    }

    if (this.trial >= this.op1s.length && this.answer == 'correct') {
      inputData('finished', 1)
    } else {
      inputData('finished', 0)
    }

    sendData(this.numGraded)

  },

  onSubmit: function () {
      this.endTrial();
  },

  endTrial: function () {

    // this.graphics.lineStyle(0)
    // this.graphics.beginFill(0x000000, 1)
    // this.graphics.drawRect(-600, 0, 1200, 500);
    // this.graphics.endFill()

    this.circle_group.destroy()
    this.probText.destroy()

    if (this.streak == 3) {
      corrFeedback = '3 in a row! Extra coin!'
      disp_col = '#3CF948'
    } else if (this.streak == 7) {
      corrFeedback = '7 in a row! Extra coin!'
      disp_col = '#3CF948'
    } else if (this.streak == 15) {
      corrFeedback = '15 in a row! Extra coin!'
      disp_col = '#3CF948'
    } else if (this.streak == 24) {
      corrFeedback = 'Perfect Score! Extra coin!'
      disp_col = '#3CF948'
    } else {
      correct_feedback = ['Way to go!','Awesome!','You Rock!','Correct!','Fantastic!','Nice!']
      feedbackIndex = Math.floor(Math.random() * correct_feedback.length) + 0
      corrFeedback = correct_feedback[feedbackIndex]
      disp_col = '#FFFFFF'
    }

    this.equal.visible = false
    this.unequal.visible = false
		that = this
    if (this.trial >= this.op1s.length && this.answer == "correct") {
      this.feedback = this.game.add.text(this.game.width/2, 50, corrFeedback, {font:'80px Arial', fill:disp_col, align:'center'})
      this.feedback.anchor.x = 0.5
      this.numFeedback.visible = true
      this.game.world.remove(this.progress)
      this.game.world.remove(this.pointDisplay)
      setTimeout(function() {
        that.game.world.remove(that.feedback)
        that.numFeedback.visible = false
        that.quitGame()
      }, 1000)
    } else {
      that = this
      if (this.answer == "incorrect") {
        this.feedback = this.game.add.text(this.game.width/2, 50, "Sorry, that's incorrect :(", {font:'80px Arial', fill:disp_col, align:'center'})
        this.feedback.anchor.x = 0.5
        this.numFeedback.visible = true
        this.game.world.remove(this.progress)
        this.game.world.remove(this.pointDisplay)

        setTimeout(function() {
          if (that.reps == 1) {
            that.threeTries = true
            that.game.world.remove(that.feedback)
            that.numFeedback.visible = false
            that.op1s.push(that.op1s[that.trial-1])
            that.op2s.push(that.op2s[that.trial-1])
            that.nextTrial()
          } else {
            that.game.world.remove(that.feedback)
            that.numFeedback.visible = false
            that.numFeedback.visible = false
            that.op1s.push(that.op1s[that.trial-1])
            that.op2s.push(that.op2s[that.trial-1])
            that.nextTrial()
            // that.makeProb()
            // that.makeButtons()
            // that.progress = that.game.add.text(860, 560, that.trial + ' out of ' + that.op1s.length, {font:'30px Arial', fill:'#FFFFFF', align:'center'})
            // that.progress.anchor.x = 0.5
            //
            // that.pointDisplay = that.game.add.text(85, 560, 'Coins: ' + that.points, {font:'30px Arial', fill:'#FFFFFF', align:'center'})
            // that.pointDisplay.anchor.x = 0.5
          }
          if (that.equalVal == true) {
            that.equivalence.push(1)
          } else {
            that.equivalence.push(0)
          }

        }, 1000)

      } else {
				this.feedback = this.game.add.text(this.game.width/2, 50, corrFeedback, {font:'80px Arial', fill:disp_col, align:'center'})
	      this.feedback.anchor.x = 0.5
	      this.numFeedback.visible = true
	      this.game.world.remove(this.progress)
	      this.game.world.remove(this.pointDisplay)
	      setTimeout(function() {
	        that.game.world.remove(that.feedback)
	        that.numFeedback.visible = false
	        that.quitGame()
	      }, 1000)
      }
    }
  },

  update: function() {
		if (this.rmInstructB) {
      this.game.world.remove(this.nextB)
      this.rmInstructB = false
      this.inst_num += 1
      this.instruct(this.inst_num)
    }

    if (this.correct) {
      this.game.world.remove(this.instruct_text)
    }

  },

  quitGame: function () {
    d = new Date()
    endTime = d.getTime()

    this.trial = 0
    this.numGraded = 0

    //this.subject.inputData('endGameStats', [this.startTime, endTime, 'completed'])
    //nextTask(this.results[0], this.task)


		      d = new Date()
		      endTime = d.getTime()

		      this.numGraded = 0

		      //this.subject.inputData('endGameStats', [this.gameStartTime, endTime, 'completed'])
		      //session_url = 'http://' + homebase + '/session/'

		      //nextTask(this.results[0], this.task)

		      //Let them know it's done...
		      this.game.time.events.add(Phaser.Timer.SECOND, function () {
		        instructions = this.game.add.text(490, 50, 'Nice job! Make sense? If so you can get started by pressing the "go" button.\nIf not, you can repeat the instructions by clicking the "back" button\nYou will complete 24 problems in the main game.', {font:'20px Arial', fill:'#FFFFFF', align:'center'});
		        instructions.anchor.x = 0.5
		        instructions.lineSpacing = -8
		        this.back_ground = this.makeBox(143,instructions.y-10,instructions.width+20,instructions.height+200)
		        this.game.world.sendToBack(this.back_ground)
		        this.go = this.add.button(250, 225, 'go', function () {this.state.start('Run', true, false, 0, false, this.problem_set);}, this);
		        this.back = this.add.button(650, 225, 'back', function () {

		          this.cx = 0;
		          this.cy = 0;

							this.trial = 0
					    this.problem = [0,0,0]
					    this.buttonPressed = 'none'
					    this.numGraded = 0
					    this.points = 0
					    this.streak = 0
					    this.reps = 0
					    this.usedLocs = []
					    this.threeTries = false
							this.inst_num = 1
							this.inst_finished = false

		          this.state.start('Instructions', true, false, this.week, this.problem_set);}, this);


		      }, this);
  }

};
