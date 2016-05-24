Game.Instructions = function (game) {

    "use strict"

    this.game      //  a reference to the currently running game (Phaser.Game)
    this.add      //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera    //  a reference to the game camera (Phaser.Camera)
    this.cache     //  the game cache (Phaser.Cache)
    this.input     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load      //  for preloading assets (Phaser.Loader)
    this.math      //  lots of useful common math operations (Phaser.Math)
    this.sound     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage     //  the game stage (Phaser.Stage)
    this.time      //  the clock (Phaser.Time)
    this.tweens    //  the tween manager (Phaser.TweenManager)
    this.state     //  the state manager (Phaser.StateManager)
    this.world     //  the game world (Phaser.World)
    this.particles //  the particle manager (Phaser.Particles)
    this.physics   //  the physics manager (Phaser.Physics)
    this.rnd      //  the repeatable random number generator (Phaser.RandomDataGenerator)

    this.feedback
    this.stats
    this.trial = 0;
    this.balanceFriction = 400
    this.balance = []
    this.balanceY = 350
    this.cBalanceX = 272
    this.uBalanceX = 678
    this.problem = [0,0,0];
    this.submitted = false;
    this.buttonPressed = 'none'
    this.answer = 'none'
    this.userDropped = false
    this.startDispensing = null
    this.stopDispensing = null
    this.numGraded = 0
    this.points = 0
    this.reps = 0
    this.streak = 0
    this.rmInstructB = false
    this.inst_num = 1
    this.inst_finished = false

};

Game.Instructions.prototype = {

  init: function(week, problem_set) {
    this.week = week
    this.problem_set = problem_set
  },

  create: function () {
    problems = problemGen(this.week, this.problem_set)
    this.op1s = [1]
    this.op2s = [2]
    this.problem_ids = [0]

    //task info
    this.task = 'VS_verification'
    task_type = 'VS'

    this.points = 0

    //initializing subject for this game
    //this.results = set_up_subject(this.task)
    //user = this.results[0]
    //session = this.results[1]
    //play = this.results[2]
    //this.subject = new Subject(user, this.task, task_type, this.problem_set, session, play)

    equivalenceGen(false)
    this.equivalence = equivalence

    this.game.world.setBounds(0, 0, 960, 600);
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.gravity.y = 400

    //this.game.stage.backgroundColor = '#02425B'
    //this.game.add.tileSprite(0,0,this.op1s.length*1000,600,'background')

    d = new Date()
    this.startTime = d.getTime()

    this.numUserBalls = 0

    trialData = {}
    trialData['ACC'] = []

    this.balance[0] = this.game.add.group()
    this.balance[0].weight = 0
    this.balance[1] = this.game.add.group()
    this.balance[1].weight = 0

    this.jarCollisionGroup = this.game.physics.p2.createCollisionGroup()
    this.ballCollisionGroup = this.game.physics.p2.createCollisionGroup()

    //first trial
    this.progress = this.game.add.text(this.game.world.centerX*2-100, 560, '1 out of 1', {font:'30px Arial', fill:'#FFFFFF', align:'center'})
    this.progress.fixedToCamera = true
    this.progress.anchor.x = 0.5

    this.pointDisplay = this.game.add.text(85, 560, 'Coins: ' + this.points, {font:'30px Arial', fill:'#FFFFFF', align:'center'})
    this.pointDisplay.anchor.x = 0.5
    this.pointDisplay.fixedToCamera = true

    this.nextTrial()

    this.leftBeam = this.game.add.sprite(this.cBalanceX,this.balanceY,'board')
    //this.leftBeam.tint = 0x545454
    this.leftBeam.scale.x = 4
    this.leftBeam.scale.y = 6
    this.leftBeam.anchor.x = 0.5
    this.leftBeam.anchor.y = 0.5
    this.leftBeam.enableBody = true
    this.game.physics.enable(this.leftBeam)
    this.leftBeam.body.immovable = true
    this.balance[0].add(this.leftBeam)

    this.rightBeam = this.game.add.sprite(this.uBalanceX,this.balanceY,'board')
    //this.rightBeam.tint = 0x939393
    this.rightBeam.scale.x = 4
    this.rightBeam.scale.y = 6
    this.rightBeam.anchor.x = 0.5
    this.rightBeam.anchor.y = 0.5
    this.balance[1].add(this.rightBeam)

    this.leftJar = this.makeJar(175, 300, 'small')
    this.leftJar2 = this.makeJar(375, 300, 'small')
    this.balance[0].add(this.leftJar)
    this.balance[0].add(this.leftJar2)
    this.rightJar = this.makeJar(670,280, 'large')
    this.balance[1].add(this.rightJar)

    that = this
    setTimeout(function() {
      that.dropCompBall()
    }, 800)

    this.instruct(this.inst_num)

  },

  makeJar: function(x,y, type) {
    if (type == 'small') {
      jar = this.game.add.sprite(x,y,'jarSmall')
      dat = 'smalljarData'
      sub = 'jar2'
    } else {
      jar = this.game.add.sprite(x,y,'jar')
      dat = 'jarData'
      sub = 'jar'
    }
    this.game.physics.p2.enableBody(jar)
    jar.body.clearShapes()
    jar.body.loadPolygon(dat,sub)
    jar.body.setCollisionGroup(this.jarCollisionGroup)
    jar.body.collides([this.ballCollisionGroup])//, this.leftBall2CollisionGroup])
    jar.body.static = true
    return jar
  },

  makeButtons: function() {
    d = new Date()
    this.start_time = d.getTime()

    this.equal = this.game.add.button(500, 500, 'equalB')
    this.equal.scale.x = .3
    this.equal.scale.y = .3
    this.equal.onInputDown.add(function() {
      if (this.inst_finished) {
        this.game.world.remove(this.instruct_text)
        this.buttonPressed = 'equal'
        newd = new Date();
        this.RT = newd.getTime() - this.start_time;
        //check to see if they are correct
        if (this.equalBool) {
          this.coin.visible = true
        }
        this.adjustBalance()
        this.unequal.kill()
        this.equal.kill()
        that = this
        setTimeout(function() {
          that.grade(that.start_time)
        }, 1000)

      }
    }, this)

    this.unequal = this.game.add.button(340, 500, 'unequalB')
    this.unequal.scale.x = 0.3
    this.unequal.scale.y = 0.3
    this.unequal.onInputDown.add(function() {
      if (this.inst_finished) {
        this.game.world.remove(this.instruct_text)
        this.buttonPressed = 'unequal'
        newd = new Date();
        this.RT = newd.getTime() - this.start_time;
        //check to see if they are correct
        if (!this.equalBool) {
          this.coin.visible = true
        }
        this.adjustBalance()
        this.unequal.kill()
        this.equal.kill()
        that = this
        setTimeout(function() {
          that.grade(that.start_time)
        }, 1000)

      }
    }, this)
  },

  grade: function(time_stamp) {
    if (this.buttonPressed == 'equal') { //it is equal and they are correct
      this.answer = 'correct'
      this.points += 1
    } else if (this.buttonPressed == 'unequal') {
      this.answer = 'incorrect'
      if (this.points == 0) {
        this.points = 0
      } else {
        this.points -= 1
      }
    }

    if (this.answer == "incorrect") {
      this.reps += 1
      this.streak = 0
      giveFeedback(this, false, this.streak,'vnt',480, 50, "60px Arial")
    } else {
      if (this.reps == 0) {
        this.streak += 1
      }
      this.reps = 0
      giveFeedback(this, true, this.streak,'vnt',480, 50, "60px Arial")
    }

    if (this.streak == 3 || this.streak == 7 || this.streak == 13) {
      this.points += 1
    }

    this.balance[0].weight = 0
    this.balance[1].weight = 0

    that = this
    setTimeout(function() {
    that.adjustBalance()

    comp1Text = that.game.add.text(175, (that.balance[0].y + that.leftJar.y),that.problem[0], {font: "60px Arial", fill: "#FFFFFF", align: "center"});
    comp2Text = that.game.add.text(375, (that.balance[0].y + that.leftJar2.y),that.problem[1], {font: "60px Arial", fill: "#FFFFFF", align: "center"});
    userText = that.game.add.text(655, (that.balance[1].y + that.rightJar.y),that.numUserBalls, {font: "60px Arial", fill: "#FFFFFF", align: "center"});
    plus = that.game.add.text(275, (that.balance[0].y + that.leftJar2.y),'+', {font: "60px Arial", fill: "#FFFFFF", align: "center"});

    if (that.answer == 'correct') {
      equalSign = that.game.add.text(510, (that.balance[0].y + that.leftJar2.y),'=', {font: "60px Arial", fill: "#FFFFFF", align: "center"});
    } else {
      equalSign = that.game.add.text(510, (that.balance[0].y + that.leftJar2.y),'≠', {font: "60px Arial", fill: "#FFFFFF", align: "center"});
    }

    that.game.add.tween(comp1Text).to({
      y: -weightDiff+50
    }, 1000, Phaser.Easing.Quadratic.Out, true)
    that.game.add.tween(comp2Text).to({
      y: -weightDiff+50
    }, 1000, Phaser.Easing.Quadratic.Out, true)
    that.game.add.tween(userText).to({
      y: -weightDiff+50
    }, 1000, Phaser.Easing.Quadratic.Out, true)
    that.game.add.tween(plus).to({
      y: -weightDiff+50
    }, 1000, Phaser.Easing.Quadratic.Out, true)
    that.game.add.tween(equalSign).to({
      y: -weightDiff+50
    }, 1000, Phaser.Easing.Quadratic.Out, true)

    spaceFactor = 50 //handling edge cases for double digit text
    if (comp1Text.width > 34) {  //so #hacky
      spaceFactor1 = 70
      spaceFactor2 = 0
    } else if (comp2Text.width > 34) {
      spaceFactor2 = 80
      spaceFactor1 = spaceFactor
    } else {
      spaceFactor1 = spaceFactor
      spaceFactor2 = 0
    }

    that.game.add.tween(comp1Text).to({
      x: 465 - spaceFactor2 - spaceFactor1 * 2
    }, 1000, Phaser.Easing.Quadratic.Out, true)
    that.game.add.tween(comp2Text).to({
      x: 465 - spaceFactor2
    }, 1000, Phaser.Easing.Quadratic.Out, true)
    that.game.add.tween(userText).to({
      x: 465 - spaceFactor2/2 + spaceFactor * 2
    }, 1000, Phaser.Easing.Quadratic.Out, true)
    that.game.add.tween(plus).to({
      x: 465 - spaceFactor2 - spaceFactor
    }, 1000, Phaser.Easing.Quadratic.Out, true)
    that.game.add.tween(equalSign).to({
      x: 465 + spaceFactor - spaceFactor2/2
    }, 1000, Phaser.Easing.Quadratic.Out, true)

    that.endTrial()
    setTimeout(function() {
      comp1Text.kill()
      comp2Text.kill()
      userText.kill()
      plus.kill()
      equalSign.kill()
    }, 1750)

    that.balance[0].forEach(function(ball){
      if (ball.key == "balls") {
        ball.kill()
      }
    }, that)
    that.balance[1].forEach(function(ball){
      if (ball.key == "balls") {
        ball.kill()
      }
    }, that)
  }, 1100)

  },



  nextTrial: function() {
    var d = new Date();
    this.start_time = d.getTime();
    //reset the RT counter
    if (this.answer == "correct" || this.trial == 0) {
      if (this.trial == 0) {
        this.progress.setText(1 + ' out of 1')
        this.pointDisplay.setText("Coins: " + this.points)
      } else {
        this.progress.setText(this.trial+1 + ' out of 1')
        this.pointDisplay.setText("Coins: " + this.points)
      }
      if (this.op1s[this.trial] <= 9) {
          op1 = '  ' + this.op1s[this.trial];
      } else { op1 = this.op1s[this.trial];}

      if (this.op2s[this.trial] <= 9) {
          op2 = '  ' + this.op2s[this.trial];
      } else { op2 = this.op2s[this.trial];}
      this.problem[0] = +op1;
      this.problem[1] = +op2;
      this.problem[2] = +op1 + +op2;
      this.problem[3] = this.problem_ids[this.trial]
      this.trial++
    } else if (this.answer == "incorrect") {
      this.problem[0] = this.problem[0]
      this.problem[1] = this.problem[1]
      this.problem[2] = this.problem[2]
      this.problem[3] = this.problem[3]
    }

    this.dispenser1 = this.game.add.sprite(100,-130,'dispenser')
    this.dispenser1.scale.x = 0.3
    this.dispenser1.scale.y = 0.3

    this.dispenser2 = this.game.add.sprite(307,-130,'dispenser')
    this.dispenser2.scale.x = 0.3
    this.dispenser2.scale.y = 0.3

    this.dispenser3 = this.game.add.sprite(600,-130,'dispenser')
    this.dispenser3.scale.x = 0.3
    this.dispenser3.scale.y = 0.3

    this.startDispensing = true
    //this.game.paused = true

    this.numCompBalls = this.problem[2]
    this.balance[0].weight = (3000 * this.numCompBalls)

  },

  makeBalls: function(x,numBalls,bal) {
    for (i = 0; i < numBalls; i++) { //this.problem[0]
      ball = this.game.add.sprite(x,(60-i*20),"balls")
      this.game.physics.p2.enableBody(ball)
      ball.body.setCollisionGroup(this.ballCollisionGroup)
      ball.body.collides([this.jarCollisionGroup, this.ballCollisionGroup])//, this.leftBall2CollisionGroup])
      ball.body.mass = 500
      this.balance[bal].add(ball)
    }
  },

  dropBall: function() {

    this.equalBool = true

    if (this.equalBool) {
      this.coin = this.game.add.sprite(540,500,'coin')
    } else {
      this.coin = this.game.add.sprite(380,500,'coin')
    }
    this.coin.visible = false

    if (this.buttonPressed == 'none' || this.answer == 'correct') {
      this.ballsToDrop = unequalGen(this.equalBool, this.problem[2], this.problem[0], this.problem[1])
    } else if (this.answer == 'incorrect'){
      this.ballsToDrop = this.ballsToDrop
    }

    this.makeBalls(this.uBalanceX-5,this.ballsToDrop,1)
    this.numUserBalls = this.ballsToDrop

    this.balance[1].weight = (3000 * this.numUserBalls)

    that = this
    setTimeout(function() {
      that.makeButtons()
    }, 3000)
  },

  instruct: function(num) {
    if (num == 1) {
      instruct_text = that.game.add.text(this.game.world.centerX,450,"Dispensers will drop balls in each jar like this",
      {font: "20px Arial", fill: "#FFFFFF", align: "center"})
      instruct_text.anchor.x = (0.5,0.5)
      this.nextB = this.add.button(instruct_text.width+300, 450, 'next', function () {
        this.game.world.remove(instruct_text)
        this.rmInstructB = true
      }, this);
      this.nextB.scale.setTo(0.5,0.5)
    } else if (num == 2) {
      instruct_text = that.game.add.text(240,100,
        "You need to say whether the number of balls in",
        {font: "20px Arial", fill: "#FFFFFF", align: "center"})
      twojar = that.game.add.text(220,150,
        "these two jars",
        {font: "20px Arial", fill: "#FFFFFF", align: "center"})
      eq = that.game.add.text(430,150,
        "equals those",
        {font: "20px Arial", fill: "#FFFFFF", align: "center"})
      onejar = that.game.add.text(630,150,
        "in this jar",
        {font: "20px Arial", fill: "#FFFFFF", align: "center"})
      guess_text = that.game.add.text(180,400,
        "Try NOT to count the balls but make your best guess instead",
        {font: "20px Arial", fill: "#FFFFFF", align: "center"})
      this.nextB = this.add.button(430, 430, 'next', function () {
        this.game.world.remove(instruct_text)
        this.game.world.remove(twojar)
        this.game.world.remove(eq)
        this.game.world.remove(onejar)
        this.game.world.remove(guess_text)
        this.rmInstructB = true
      }, this);
      this.nextB.scale.setTo(0.5,0.5)
    } else if (num == 3) {
      instruct_text = that.game.add.text(this.game.world.centerX,450,
        "Use these buttons to give your answer",
        {font: "20px Arial", fill: "#FFFFFF", align: "center"})
      instruct_text.anchor.x = (0.5,0.5)
      this.nextB = this.add.button(this.game.world.centerX+200, 450, 'next', function () {
        this.game.world.remove(instruct_text)
        this.rmInstructB = true
      }, this);
      this.nextB.scale.setTo(0.5,0.5)
    } else if (num == 4) {
     instruct_text = that.game.add.text(this.game.world.centerX,100,
       "If you're correct then you will move on to another problem.\nIf you're wrong then you will have to repeat this one.",
       {font: "20px Arial", fill: "#FFFFFF", align: "center"})
       instruct_text.anchor.x = (0.5,0.5)
     this.nextB = this.add.button(450, 170, 'next', function () {
       this.game.world.remove(instruct_text)
       this.rmInstructB = true
     }, this);
     this.nextB.scale.setTo(0.5,0.5)
   } else if (num == 5) {
    instruct_text = that.game.add.text(this.game.world.centerX,100,
      "You have three chances to get each problem right.",
      {font: "20px Arial", fill: "#FFFFFF", align: "center"})
      instruct_text.anchor.x = (0.5,0.5)
    this.nextB = this.add.button(450, 170, 'next', function () {
      this.game.world.remove(instruct_text)
      this.rmInstructB = true
    }, this);
    this.nextB.scale.setTo(0.5,0.5)
   } else if (num == 6) {
     instruct_text = that.game.add.text(this.game.world.centerX,100,
       "You will get a coin for each correct answer. Try and get as many as possible!",
       {font: "20px Arial", fill: "#FFFFFF", align: "center"})
       instruct_text.anchor.x = (0.5,0.5)
     this.nextB = this.add.button(450, 170, 'next', function () {
       this.game.world.remove(instruct_text)
       this.rmInstructB = true
     }, this);
     this.nextB.scale.setTo(0.5,0.5)
   } else if (num == 7) {
     instruct_text = that.game.add.text(this.game.world.centerX,100,
       "Streaks of correct answers can get you even more coins!",
       {font: "20px Arial", fill: "#FFFFFF", align: "center"})
       instruct_text.anchor.x = (0.5,0.5)
     this.nextB = this.add.button(450, 170, 'next', function () {
       this.game.world.remove(instruct_text)
       this.rmInstructB = true
     }, this);
     this.nextB.scale.setTo(0.5,0.5)
   }  else if (num == 8) {
       instruct_text = that.game.add.text(this.game.world.centerX,100,
         "But be careful, because if you get a question wrong you will lose one of your coins!",
         {font: "20px Arial", fill: "#FFFFFF", align: "center"})
         instruct_text.anchor.x = (0.5,0.5)
       this.nextB = this.add.button(450, 170, 'next', function () {
         this.game.world.remove(instruct_text)
         this.rmInstructB = true
       }, this);
       this.nextB.scale.setTo(0.5,0.5)
   }  else if (num == 9) {
     this.instruct_text = that.game.add.text(this.game.world.centerX,100,
       "Go ahead and give your answer to this problem.",
       {font: "20px Arial", fill: "#FFFFFF", align: "center"})
       this.instruct_text.anchor.x = (0.5,0.5)
       this.inst_finished = true
   }
  },

  dropCompBall: function() {
    this.makeBalls(180-5,this.problem[0],0)

    var that = this
    setTimeout(function() {
      setTimeout(function() {
        that.comp2Dropped = true
      }, 10) //2500
      that.makeBalls(380,that.problem[1],0)
    }, 10) //3000

      setTimeout(function() {
        that.comp1Dropped = true
        setTimeout(function() {
          setTimeout(function() {
            that.userDropped = true
          }, 10) //2500
          that.dropBall()
        }, 10) //3500
      }, 10)
  },

  adjustBalance: function() {

    this.submitted = true

    weightDiff = ((this.balance[0].weight-this.balance[1].weight)/this.balanceFriction)
    if (weightDiff > this.game.height/3) { //edge cases
      weightDiff = this.game.height/3
    }
    if (weightDiff < -this.game.height/3) {
      weightDiff = -this.game.height/3
    }

    balanceTweenComp = this.game.add.tween(this.balance[0]).to({
      y: weightDiff
    }, 1000, Phaser.Easing.Quadratic.Out, true)

    balanceTweenUser = this.game.add.tween(this.balance[1]).to({
      y: -weightDiff
    }, 1000, Phaser.Easing.Quadratic.Out, true)

  },

  endTrial: function() {

    var that = this
    if ((this.trial) >= this.op1s.length && this.answer == 'correct') {
      this.pointDisplay.setText("Coins: " + this.points)
      if (this.coin) {
        this.game.world.remove(this.coin)
      }
      setTimeout(function() {
        that.quitGame();
      }, 2500)
    } else {
      this.pointDisplay.setText("Coins: " + this.points)
      if (this.coin) {
        this.game.world.remove(this.coin)
      }
      setTimeout(function() {
      that.nextTrial()
      setTimeout(function() {
        that.dropCompBall()
      }, 800)
      that.numUserBalls = 0
      that.balance[1].weight = 0
      }, 2500)
    }
  },

  update: function() {
    if (this.rmInstructB) {
      this.game.world.remove(this.nextB)
      this.rmInstructB = false
      this.inst_num += 1
      this.instruct(this.inst_num)
    }


    if (this.startDispensing == true) {
      if (this.dispenser1.y < -5) {
        this.dispenser1.y+= 4
        this.dispenser2.y+= 4
        this.dispenser3.y+= 4
      } else {
        this.startDispensing = false
        this.stopDispensing = true
      }
    }
    if (this.stopDispensing == true) {
      that = this
      setTimeout(function() {
        if (that.dispenser1.y > -130) {
          that.dispenser1.y-= 4
          that.dispenser2.y-= 4
          that.dispenser3.y-= 4
        } else {
          that.stopDispensing = false
        }
      }, 3000) //minimize this

    }

  },

  quitGame: function () {
      this.balance[0].destroy()
      this.balance[1].destroy()
      this.game.world.remove(this.pointDisplay)
      this.game.world.remove(this.progress)

      this.trial = 0
      this.inst_num = 1
      this.inst_finished = false

      d = new Date()
      endTime = d.getTime()

      this.gameFinished = false

      //Let them know it's done...
      this.game.time.events.add(Phaser.Timer.SECOND, function () {
        instructions = this.game.add.text(490, 250, 'Nice job! Make sense? If so you can get started by pressing the "go" button.\nIf not, you can repeat the instructions by clicking the "back" button\nYou will complete 12 problems in the main game.', {font:'20px Arial', fill:'#FFFFFF', align:'center'});
        instructions.anchor.x = 0.5
        instructions.lineSpacing = -8
        this.go = this.add.button(250, 375, 'go', function () {this.state.start('Run', true, false, this.week, this.problem_set);}, this);
        this.back = this.add.button(650, 375, 'back', function () {this.state.start('Instructions', true, false, this.week, this.problem_set);}, this);

      }, this);
  }
};
