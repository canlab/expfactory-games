Game.Run = function (game) {

    "use strict"

    this.game     //  a reference to the currently running game (Phaser.Game)
    this.add       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
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
    this.rnd       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    this.trial = 0
    this.problem = [0,0,0]
    this.numGraded = 0
    this.prevMoverX = 50
    this.points = 0

  };

Game.Run.prototype = {
    init: function(problem_set) {
      this.problem_set = problem_set
    },

    create: function() {
      problems = problemGen(this.week, this.problem_set)
      this.op1s = problems[1]
      this.op2s = problems[2]
      this.problem_ids = problems[3]

      //task info
      this.task = 'VS_production'
      task_type = 'VS'

      //initializing subject for this game
    	//this.results = set_up_subject(this.task);
    	//user = this.results[0];
    	//session = this.results[1];
    	//play = this.results[2];
    	//this.subject = new Subject(user, this.task, task_type, this.problem_set, session, play)

      //this.game.add.tileSprite(0,0,this.op1s.length*1000,600,'background')

      this.game.world.setBounds(0, 0, 960, 600)

      d = new Date()
      this.startTime = d.getTime()

      this.progress = this.game.add.text(860, 560, '1 out of 13', {font:'30px Arial', fill:'#FFFFFF', align:'center'})
      this.progress.fixedToCamera = true
      this.progress.anchor.x = 0.5

      this.pointDisplay = this.game.add.text(85, 560, 'Points: ' + this.points, {font:'30px Arial', fill:'#FFFFFF', align:'center'})
      this.pointDisplay.anchor.x = 0.5
      this.pointDisplay.fixedToCamera = true

      this.nextTrial()

      this.mainLineY = 350
      this.mainLineX = 49
      this.mainLineLength = 851
      this.mainLine = this.game.add.graphics(this.mainLineX, this.mainLineY)
      this.mainLine.lineStyle(6, 0xFFFFFF)
      this.mainLine.lineTo(this.mainLineLength, 0)

      hashX = 50
      this.hashes = this.game.add.group()
      this.labels = this.game.add.group()
      for (i = 0; i < 31; i++) {
        hashMark = this.game.add.graphics(hashX,this.mainLineY - 2.22)
        hashMark.lineStyle(5, 0xFFFFFF)
        hashMark.lineTo(0,20)
        label = this.game.add.text(hashX,this.mainLineY + 20,i,{font: "15px Arial", fill: "#FFFFFF", align: "center"})
        label.anchor.x = 0.5
        this.hashes.add(hashMark)
        this.labels.add(label)
        hashX = hashX + 28.3
      }

      this.mover = this.game.add.graphics(50,this.mainLineY-250)
      this.mover.beginFill(0x33cccc)
      this.mover.lineStyle(4,0x33cccc,1)
      this.mover.drawCircle(0, 250, 20)

      submitButton = this.game.add.button(425, 500, 'go')
      submitButton.onInputUp.add(function() {
        if (this.mover.x > 60) {
          this.submit = true
          var d = new Date()
          this.RT = d.getTime() - this.start_time
          this.grade(this.startTime)
        }

      }, this)

      this.game.input.onDown.add(this.mouseDragStart, this)
      this.game.input.onUp.add(this.mouseDragEnd, this)

      this.front = this.makeFollower(1000, 0x3232ff,-1000,250)
      this.occlude()

    },

    mouseDragStart: function() {
      this.mouseDown = true
    },

    mouseDragEnd: function() {
      this.mouseDown = false
    },

    makeFollower: function(width, color, originX, originY) {
      follower = this.game.add.graphics(originX, originY)
      follower.beginFill(color, 1)
      follower.drawRect(-3, this.mainLineY-253, width, 6)
      return follower
    },

    makeRect: function(x,y, length) {
      rect = this.game.add.graphics(x,y)
      rect.beginFill(0x000000, 1)
      rect.drawRect(0,this.mainlineY-250, length, 25)
    },

    occlude: function() {
      this.occluder1 = this.makeRect(this.mainLineX-102,this.mainLineY-15, 100)
      this.occluder2 = this.makeRect(this.mainLineLength+50.5,this.mainLineY-15, 100)

      this.topLayer = this.game.add.group() //group added to make mover on top
      this.topLayer.add(this.mover)
    },

    nextTrial: function () {

      //clock
      var d = new Date();
      this.start_time = d.getTime();
      //reset the RT counter

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

      this.answerTxt = [this.problem[0],' + ',this.problem[1]]
      this.answerTxt = this.answerTxt.join('')
      this.probText = this.game.add.text(480, 200, this.answerTxt, {font: "70px Arial", fill: "#FFFFFF", align: "center"})
      this.probText.anchor.x = 0.5

      this.trial++;
      this.progress.setText(this.trial + ' out of 13')
    },

    grade: function(time_stamp) {
      this.hashes.forEachAlive(function(h) {
        cent = (this.mover.x + this.mover.width/2)
        if (this.submit && (h.x < cent+15 && h.x >= cent-15)) {
          this.response = Math.round((h.x - 50)/28.3)
        }
      }, this)

      if (this.response == this.problem[2] && this.trial == this.op1s.length) {
        this.correct = true
        this.game.world.remove(this.probText)
        sumtxt = [this.answerTxt + ' = ' + this.problem[2]]
        sumtxt = sumtxt.join('')
        this.sumText = this.game.add.text(480, 200,sumtxt, {font: "70px Arial", fill: "#FFFFFF", align: "center"})
        this.sumText.anchor.x = 0.5
        giveFeedback(this, this.correct, 470, 40, '90px Arial')
        this.points += 1
        this.numGraded++
        this.pointDisplay.setText("Points: " + this.points)
        this.save()
        this.quitGame()
        return
      } else if (this.response == this.problem[2] && this.trial != this.op1s.length) {
        this.correct = true
        this.game.world.remove(this.probText)
        sumtxt = [this.answerTxt + ' = ' + this.problem[2]]
        sumtxt = sumtxt.join('')
        this.sumText = this.game.add.text(480, 200,sumtxt, {font: "70px Arial", fill: "#FFFFFF", align: "center"})
        this.sumText.anchor.x = 0.5
      } else {
        this.correct = false
        this.game.world.remove(this.probText)
        sumtxt = [this.answerTxt + ' ≠ ' + this.response]
        sumtxt = sumtxt.join('')
        this.sumText = this.game.add.text(480, 200,sumtxt, {font: "70px Arial", fill: "#FFFFFF", align: "center"})
        this.sumText.anchor.x = 0.5
        that = this
      }

      if (this.correct) {
        this.points += 1
      } else {
        this.points -= 1
      }

      this.pointDisplay.setText("Points: " + this.points)
      giveFeedback(this, this.correct, 470, 40, '90px Arial')


      this.numGraded++
      this.save()
      this.endTrial()
    },

    save: function() {
      inputData('answer', this.response)
      inputData('problem', [this.problem[0],' + ',this.problem[1],' = ','?'].join(""))
      inputData('RT', this.RT/1000)
      inputData('n1', parseInt(this.problem[0]))
      inputData('n2', parseInt(this.problem[1]))
      inputData('problem_id', parseInt(this.problem[3]))
      inputData('solution', parseInt(this.problem[2]))

      if (this.correct) {
        inputData('ACC', 1)
      } else {
        inputData('ACC', 0)
      }
      if (this.trial-1 == 0) {
        currTrial = 1
      } else {
        currTrial = this.trial
      }
      inputData('points', this.points)

      if (this.numGraded >= this.op1s.length && this.correct) {
        inputData('finished', 1)
      } else {
        console.log(0)
        inputData('finished', 0)
      }

      sendData(this.numGraded)

    },

    endTrial: function() {
      that = this
      setTimeout(function() {
        that.game.world.remove(that.sumText)
        if (that.correct) {
          that.nextTrial()
        } else {
          that.probText = that.game.add.text(480, 200, that.answerTxt, {font: "70px Arial", fill: "#FFFFFF", align: "center"})
          that.probText.anchor.x = 0.5
          //clock
          var d = new Date();
          that.start_time = d.getTime();
          //reset the RT counter
        }
      }, 1000)
    },

    quitGame: function () {
        d = new Date()
        endTime = d.getTime()

        //this.subject.inputData('endGameStats', [this.startTime, endTime, 'completed'])

        that = this
        setTimeout(function() {
          that.game.world.remove(that.sumText)

          //nextTask(that.results[0], that.task)


        }, 1000)

        //Let them know it's done...
        this.game.time.events.add(Phaser.Timer.SECOND * 1.5, function () {
          endText = this.game.add.text(480, 100, 'All done!', {'font': '70px Arial', 'fill':'#fff'});
          endText.anchor.x = 0.5
          finalPoints = this.game.add.text(this.game.width/2, 200, 'You got ' + this.points + ' points', {font:'70px Arial', fill:'#FFFFFF', align:'center'});
          finalPoints.anchor.x = 0.5
          totalPoints = this.points
          this.points = 0
          //  Then let's go back to the main menu.
          this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {this.state.start('Menu', true, false, this.problem_set);}, this);
        }, this);
    },

    moverMaker: function(x, color) {
      this.mover.destroy()
      this.mover = this.game.add.graphics(x,this.mainLineY-250)
      this.mover.beginFill(0x33cccc)
      this.mover.lineStyle(4,color,1)
      this.mover.drawCircle(0, 250, 20)
    },

    update: function() {

      //pointerX = this.game.input.pointer1.x
      //pointerY = this.game.input.pointer1.y
      pointerX = this.game.input.mousePointer.x
      pointerY = this.game.input.mousePointer.y

      if (this.mouseDown && pointerX >= this.mover.x - 50  && pointerX <= this.mover.x + 50 && pointerY >= this.mainLineY-20 && pointerY <= this.mainLineY+20) {
        if (pointerX < this.mainLineLength+50 && pointerX > this.mainLineX) {
          this.moverMaker(pointerX, 0x3232ff)
          this.front.x = this.mover.x-1000
        }
      } else {
        prevX = this.mover.x
        this.moverMaker(prevX,0x33cccc)
      }

      moverPos = this.mover.x
      if (this.submit) {
        this.mover.x = moverPos - 15
        this.front.x = this.mover.x-1000
        if (moverPos <= 74) {
          this.submit = false
        }
      }

      this.labels.forEachAlive(function(l) {
        //centLabel = (this.mover.x + this.mover.width/2)
        labelX = l.x
        labelY = l.y
        oldLabel = l.text
        if ((labelX > this.mover.x-10 && labelX < this.mover.x+10 && this.mouseDown) || (labelX > this.mover.x-10 && labelX < this.mover.x+10 && !this.submit)) {
          l.destroy()
          label = this.game.add.text(labelX,labelY,oldLabel,{font: "30px Arial", fill: "#FFFFFF", align: "center"})
          label.anchor.x = 0.5
        } else if (l.style.font == "30px Arial"){
          //l.destroy()
          label = this.game.add.text(l.x,l.y,l.text,{font: "15px Arial", fill: "#FFFFFF", align: "center"})
          label.anchor.x = 0.5
          l.destroy()

        }
        this.labels.add(label)
        this.prevMoverX = this.mover.x
      }, this)
    }
}
