[w,h] = [1170,658]
[patw,path] = [193,278]
[of1x,of1y] = [298,273]
[dpw,dph] = [59,20]
angular.module \ERGame, <[]>
  ..config <[$compileProvider]> ++ ($compileProvider) ->
    $compileProvider.imgSrcSanitizationWhitelist(
      /^\s*(blob):|http:\/\/localhost:9998\/|http:\/\/0media.tw\/|http:\/\/reporter.tw\//
    )

  ..controller \ERGame, <[$scope $interval $timeout $http $sce]> ++ ($scope, $interval, $timeout, $http, $sce) ->
    $scope.list = [[(i % 4), parseInt(i / 4)] for i from 0 til 12]
    $scope.danger = false
    $scope.pixel = do
      scene: w: 1170, h: 658

      sprite: do
        size: [
          * w:   0, h:   0 #  0 reserved
          * w: 101, h: 142 #  1 候診病人
          * w: 108, h: 229 #  2 留觀病人(朝左)
          * w: 108, h: 229 #  3 留觀病人(朝右)
          * w: 291, h: 245 #  4 病床病人
          * w: 316, h: 269 #  5 料理台
          * w: 105, h: 196 #  6 飲水機
          * w: 146, h: 239 #  7 廁所
          * w:  98, h:  60 #  8 香蕉, deprecated but keep for proper order
          * w: 306, h: 298 #  9 醫生台
          * w: 191, h: 240 # 10 隔簾
          * w: 104, h: 136 # 11 左窗
          * w: 238, h: 184 # 12 右窗
          #* w: 358, h: 451 # 10 隔簾
        ]
        points:
          [{x: 591, y: -19, type: 6}] ++
          [{x: 317, y: 2, type: 5}] ++
          [{x: 687, y: -36, type: 7}] ++
          [{x: 507, y: 54, type: 9, variant: 1}] ++
          [{x: 249, y: 184, type: 11}] ++
          [{
            x: 293 + c * 59 + r * -127, y: 222 + c * 20 + r * 47, 
            type: 1, variant: 0, active: 1
          } for r from 0 til 3 for c from 0 til 4] ++ 
          [
            * x: 857, y: 100, type: 4, variant: 0, active: 1
          ] ++
          [{x: 870, y: 272, type: 12}] ++
          [{x: 749 + i * 66, y: 227 + i * 24, type: 2, variant: 0, active: 1} for i from 0 til 5] ++
          [
            * x: 623, y: 279, type: 3, variant: 0, active: 1
            * x: 520, y: 341, type: 10
            * x: 730, y: 387, type: 4, variant: 0, active: 1
            * x: 335, y: 387, type: 4, variant: 0, active: 1
            * x: 493, y: 418, type: 3, variant: 0, active: 1
            * x: 678, y: 418, type: 2, variant: 0, active: 1
          ]

    $scope.percent = do
      sprite: do
        size: [{
          w: 100 * p.w / $scope.pixel.scene.w
          h: 100 * p.h / $scope.pixel.scene.h
        } for p in $scope.pixel.sprite.size]
        points: [{
          x: 100 * p.x / $scope.pixel.scene.w,
          y: 100 * p.y / $scope.pixel.scene.h,
          type: p.type, variant: p.variant, active: p.active
        } for p in $scope.pixel.sprite.points ]

    $scope.rebuild = ->
      for it in $scope.percent.sprite.points =>
        it.cls = (
          ["it-#{it.type}-#{it.variant or 0}-#{it.active or 0}"]
        )

    $scope.game = do
      # 0 - landing
      # 1 - pause
      # 2 - playing
      # 3 - tutorial
      # 4 - game over
      # 5 - countdown
      state: 0
      over: ->
        @set-state 4
        $timeout (->
          r = parseInt($scope.doctor.score.value / 10)
          if r >= 6 => r--
          if r >= 6 => r = 6
          $scope.doctor.rank = r
        ), 500
      set-state: -> 
        @state = it
      tutorial: ->
        @set-state 3
        $scope.audio.bkloop 0, true, true
        $scope.audio.bk.pause true
      last-state: 0
      pause: ->
        if @state <= 1 => return
        $scope.audio.bk.pause!
        $scope.audio.bkloop.pause!
        @last-state = @state
        @set-state 1
      resume: ->
        @set-state (@last-state or 2)
        if @last-state == 2 => $scope.audio.bk!
        if @last-state == 3 => $scope.audio.bkloop!
      start: ->
        @set-state 2
        $scope.audio.bkloop.pause true
        $scope.audio.bk!
      reset: ->
        $(\#wheel).css display: \none
        $scope.danger = false
        $scope.patient.reset!
        $scope.doctor.reset!
        $scope.supply.reset!
        $scope.mouse.reset!
        $scope.audio.reset!
        $scope.dialog.reset!
        $scope.rebuild!
        $scope <<< {madmax: 0}
        $scope.dialog.toggle null, false
        @state = 0
      countdown: do
        handler: null
        value: 0
        count: ->
          @value = @value - 1
          if @value > 0 =>
            $scope.audio["count#{if @value == 1 => 2 else 1}"]!
            $timeout (~> @count!), 650
          else =>
            $scope.game.set-state 2
            $scope.audio.bkloop.pause true
            $scope.audio.bk 0, false, true
        start: ->
          $scope.game.set-state 5
          @value = 5
          @count!
    $scope.doctor = do
      sprite: $scope.percent.sprite.points.filter(->it.type==9).0
      handler: null
      energy: 1
      faint: false
      demading: 0
      chance: 5
      hurting: 0
      draining: 0
      rank: 0
      drain: ->
        @
          ..energy -= 0.2
          ..energy >?= 0
          ..draining = 1 # 震動倒數
        if $scope.doctor.energy <= 0.0001 =>
          $scope.doctor.faint = true
          $scope.doctor.demading = 0
      fail: ->
        @
          ..set-mood 7
          ..chance -= 1
          ..chance >?= 0
          ..hurting = 1 # 震動倒數
        if @chance <= 0 => $scope.game.over!
        $scope.audio.die!
      reset: ->
        @ <<< {rank: 0, energy: 1, faint: false, chance: 5, hurting: 0, draining: 0}
        if @handler => $timeout.cancel @handler
        @score.value = 0
        @score.digit = [0,0,0,0]
        @set-mood 1
      score: do
        digit: [0,0,0,0]
        value: 0
      reset-later: ->
        if @handler => $timeout.cancel @handler
        @handler = $timeout((~> 
          @set-mood 1
          @handler = null
          $scope.rebuild!
        ), 1000)

      set-mood: ->
        @sprite.variant = it
        if it > 1 => @reset-later!
        #TODO: normalize image width / height
    $scope.$watch 'doctor.score.value', ->
      score = $scope.doctor.score
      for i from 0 til 4 =>
        score.digit[ 3 - i ] = parseInt(score.value / (10 ** i)) % (10 ** (i+1))

    $scope.supply = do
      sprite: $scope.percent.sprite.points.filter(->it.type in [5 6 7])
      reset: ->
        for item in @sprite => item <<< {active: 0, countdown: -1}
      active: (defidx, isOn=true) ->
        if !defidx? => idx = parseInt(Math.random!*@sprite.length)
        else idx = defidx
        if !isOn =>
          @sprite[idx].active = 0
          delete @sprite[idx].countdown
        else if !@sprite[idx].active =>
          @sprite[idx].active = 1
          @sprite[idx].countdown = 1

    $scope.patient = do
      urgent: 0
      update-urgent: ->
        @urgent = $scope.percent.sprite.points.filter(->it.type == 1 and it.variant == 3 ).length
      reset: ->
        remains = $scope.percent.sprite.points.filter( ->it.type >=1 and it.type <= 4 )
        for item in remains => item <<< {variant: 0, mad: 0, life: 1}
        @urgent = 0
      add: (area, defvar, defpos) ->
        remains = $scope.percent.sprite.points.filter(-> it.type == area and it.variant == 0)
        if remains.length == 0 => return
        variant = parseInt(Math.random! * 3 + 1)
        if area == 1 =>
          dice = Math.random!
          if dice < $scope.config.cur.prob.pat.1 => variant = 1
          else if dice < $scope.config.cur.prob.pat.2 => variant = 2
          else variant = 3
          $scope.audio.born!
        else => variant = parseInt(Math.random! * 2 + 1)
        if area > 1 => variant <?= 2
        if defvar? => variant = defvar
        idx = if defpos? => defpos else parseInt(Math.random!*remains.length)
        des = remains[idx]
        des.variant = variant
        if des.type == 1 and des.variant == 3 => @urgent++
        if des.type == 1 => des.life = 1
        if des.type in [2 3 4] => des.mad = 0
        $scope.rebuild!

    $scope.mode = \easy
    $scope.config = do
      cur: do
        prob: {pat: [0.05, 0.60, 0.95], sup: 0.01, stay: 0.1}, decay: {life: 0.001, sup: 0.001, mad: 0.001}
      mode: do
        trivial: [
          * prob: {pat: [0.00, 0.60, 0.95], sup: 0.01, stay: 0.1}, decay: {life: 0.001, sup: 0.001, mad: 0.001}
          * prob: {pat: [0.00, 0.60, 0.95], sup: 0.01, stay: 0.1}, decay: {life: 0.001, sup: 0.001, mad: 0.001}
          * prob: {pat: [0.00, 0.60, 0.95], sup: 0.01, stay: 0.1}, decay: {life: 0.001, sup: 0.001, mad: 0.001}
          * prob: {pat: [0.00, 0.60, 0.95], sup: 0.01, stay: 0.1}, decay: {life: 0.001, sup: 0.001, mad: 0.001}
        ]
        easy: [
          * prob: {pat: [0.02, 0.60, 0.95], sup: 0.01, stay: 0.1}, decay: {life: 0.001, sup: 0.005, mad: 0.001}
          * prob: {pat: [0.04, 0.50, 0.82], sup: 0.02, stay: 0.2}, decay: {life: 0.002, sup: 0.008, mad: 0.002}
          * prob: {pat: [0.08, 0.40, 0.70], sup: 0.04, stay: 0.4}, decay: {life: 0.003, sup: 0.011, mad: 0.003}
          * prob: {pat: [0.12, 0.30, 0.60], sup: 0.10, stay: 0.5}, decay: {life: 0.006, sup: 0.014, mad: 0.006}
        ]
        normal: [
          * prob: {pat: [0.02, 0.45, 0.95], sup: 0.01, stay: 0.1}, decay: {life: 0.002, sup: 0.005, mad: 0.001}
          * prob: {pat: [0.06, 0.40, 0.80], sup: 0.03, stay: 0.3}, decay: {life: 0.003, sup: 0.015, mad: 0.003}
          * prob: {pat: [0.14, 0.30, 0.50], sup: 0.09, stay: 0.5}, decay: {life: 0.005, sup: 0.020, mad: 0.005}
          * prob: {pat: [0.22, 0.10, 0.20], sup: 0.15, stay: 0.6}, decay: {life: 0.006, sup: 0.025, mad: 0.007}
        ]
        hard: [
          * prob: {pat: [0.02, 0.10, 0.95], sup: 0.25, stay: 0.6}, decay: {life: 0.006, sup: 0.025, mad: 0.007}
          * prob: {pat: [0.02, 0.10, 0.95], sup: 0.25, stay: 0.6}, decay: {life: 0.006, sup: 0.025, mad: 0.007}
          * prob: {pat: [0.02, 0.10, 0.95], sup: 0.25, stay: 0.6}, decay: {life: 0.006, sup: 0.025, mad: 0.007}
          * prob: {pat: [0.02, 0.10, 0.95], sup: 0.25, stay: 0.6}, decay: {life: 0.006, sup: 0.025, mad: 0.007}
        ]

    $scope.mouse = do
      x: 0, y: 0, target: null
      reset: -> @target = null
      lock: -> @is-locked = true
      unlock: -> @is-locked = false
      timestamp: 0
      is-pal-on: false
      down: (e, touch = false)->
        if touchflag and !touch => return
        # touch will be troublesome if mouse can be triggered. remove it here
        if isHalt! => return
        if $scope.madmax or $scope.doctor.faint => return $scope.demad e
        if @is-locked => return
        if @is-pal-on => return
        #$(\#finger-tap).css display: \none
        $scope.dialog.finger.isOn = false
        offset = $(\#wrapper).offset!
        [ex, ey] = [(e.clientX or e.pageX), (e.clientY or e.pageY)]
        if !ex and !ey => [ex,ey] = [e.touches.0.clientX, e.touches.0.clientY]
        @{}last <<< {x: ex, y: ey}
        [x,y] = [@x, @y] = [ex - offset.left, ey - offset.top]
        xp = x * 1024 / $(\#wrapper)width!
        yp = y * 576 / $(\#wrapper)height!
        target = $scope.hitmask.resolve(xp, yp)
        if !target => return
        if target.type == 1 =>
          if target.variant == 0 => return
          pat = $scope.percent.sprite.points.filter(->it.type == 1)
          max = 0
          for item in pat => if item.variant > max => max = item.variant
          #if target.variant < max =>
          if max == 3 and target.variant < max =>
            @target = null
            return
        @target = target
        if !target or target.type != 1 => return
        $(\#wheel).css do
          display: "block"
          top: "#{y}px"
          left: "#{x}px"
        $scope.audio.blop!
        $scope.rebuild!
        @timestamp = new Date!getTime!
        @is-pal-on = true
        e.preventDefault!
      move: (e) ->
        /*[x,y] = [
          e.clientX or e.pageX or e.touches.0.clientX,
          e.clientY or e.pageY or e.touches.0.clientY
        ]*/
        #TODO prevent long press trigger menu
        #e.preventDefault()
      up: (e, touch = false) -> 
        if touchflag and !touch => return
        if isHalt! => return
        if @is-locked or $scope.madmax or $scope.doctor.faint => return
        now = new Date!getTime!
        [ex, ey] = [(e.clientX or e.pageX), (e.clientY or e.pageY)]
        if !ex and !ey =>
          if e.touches? and e.touches.length =>
            [ex,ey] = [e.touches.0.clientX, e.touches.0.clientY]
          else if e.changedTouches? and e.changedTouches.length =>
            [ex,ey] = [e.changedTouches.0.clientX, e.changedTouches.0.clientY]
        if !ex and !ey => [ex,ey] = [@last.x, @last.y]
        if @target and @target.type == 1 and
           (((ex - @last.x)**2 + (ey - @last.y)**2) < 18 or now - @timestamp < 100) => return
        <~ setTimeout _, 0
        @is-pal-on = false
        $(\#wheel).css({display: "none"})
        offset = $(\#wrapper).offset!
        [dx, dy] = [ex - @x - offset.left, ey - @y - offset.top]

        angle = Math.acos( dx / Math.sqrt( dx ** 2 + dy ** 2 ) ) * 360 / ( Math.PI * 2 )
        if dy > 0 => angle = 360 - angle
        if angle >= 320 or angle <= 10 => type = 3
        if angle > 10 and angle <=61 => type = 2
        if angle > 61 and angle < 112 => type = 1
        if @target =>
          # 待診病人
          if @target.type == 1 =>
            # 正確回答
            if @target.variant == type =>
              if @target.variant == 1 => # 輕症病患
                # 一定機率濫用資源
                mood = if Math.random! < 0.5 => 2 else 4 + parseInt(Math.random! * 3)
                if @forceMood? => mood = @forceMood
                $scope.doctor.set-mood mood
                $scope.audio.dindon!
                # 非濫用資源者才計分
                if mood == 2 =>
                  $scope.doctor.score.value += 1
              else # 中、重症病患
                # 一定機率進留觀
                if (!(@forceStay?) and Math.random! < $scope.config.cur.prob.stay) =>
                  $scope.doctor.set-mood 3
                  $scope.patient.add parseInt(3 * Math.random! + 2)
                else if @forceStay =>
                  $scope.doctor.set-mood 3
                  $scope.patient.add (@forceStayType or 4), 2, (@forceStayPos or 0)
                else $scope.doctor.set-mood 2
                $scope.audio.dindon!
                $scope.doctor.score.value += 1
              if type == 3 =>
                @target.variant = 0
            else => $scope.doctor.fail! # 答錯，難過，扣血
            if type == 3 => $scope.patient.update-urgent!

            @target.variant = 0
            $scope.rebuild!
          else if @target.type >= 2 and @target.type <= 4 and @target.variant =>
            if @target.mad > 0.8 => @target.mad = 0.8
            @target.mad <?= 0.8
            @target.mad -= 0.2
            @target.mad >?= 0
            $scope.audio.click2!
          else if @target.type >= 5 and @target.type <= 8 and @target.active => # 恢復體力
            $scope.doctor.energy += 0.1
            $scope.doctor.energy <?= 1
            $scope.doctor.set-mood 2
            $scope.rebuild!
            @target.active = 0
            @target.countdown = 1
            $scope.audio.click2!
        @target = null

    $scope.madmax = 0
    $scope.demad = (e) ->
      $scope.dialog.finger.isOn = false
      prog = 100
      madmax = $scope.percent.sprite.points.filter(->it.ismad) 
      if !madmax.length => $scope.madmax = 0
      if madmax.length =>
        madmax.0.mad <?= 0.8
        madmax.0.mad -= 0.1
        madmax.0.mad >?= 0
        if madmax.0.mad <= 0 => delete madmax.0.ismad
        cur = madmax.map(->1 - it.mad).reduce(((a,b)->a + b),0)
        sum = madmax.length
        prog = 100 * cur / sum
      else if $scope.doctor.faint =>
        $scope.doctor
          ..energy += 0.1
          ..energy <?= 1
        if $scope.doctor.energy >= 0.9999 => $scope.doctor.faint = false
        prog = $scope.doctor.energy * 100
      e.preventDefault!
      $scope.audio.click2!
      $scope.doctor.demading = prog
      return false

    $scope.rebuild!
    isHalt = ->
      if ($scope.game.state != 2 and $scope.game.state != 3) or $scope.dialog.show == true => return true
      if $scope.danger => return true
      return false
    $scope.madspeed = 0.002

    $scope.$watch 'madmax' -> if it => $(\#wheel).css({display: "none"})

    $scope.hitmask = do
      ready: false
      get: (x, y) ->
        if !@ready or !(x? and y?) or (isNaN(x) or isNaN(y)) => return [0,0,0,0]
        @ctx.getImageData(x,y,1,1).data
      resolve: (x,y) ->
        color = @get x,y
        type = color.0
        if type == 8 => type = 5
        if type == 0 => return null
        else if type ==1 => order = color.1 * 4 + color.2
        else => order = color.2
        $scope.percent.sprite.points.filter(->it.type == type)[order]
      init: ->
        @canvas = document.createElement("canvas")
          ..height = 576
          ..width = 1024
        @ctx = @canvas.getContext \2d
        @img = new Image!
        @img.src = \mask.png
        @img.onload = ~>
          @ctx.drawImage @img, 0, 0, 1024, 576
          @ready = true

    $scope.hitmask.init!
    $scope.dialog = do
      tut: true
      show: false
      idx: 0
      next: -> $timeout (~> @main true), 200
      type: ""
      h: {i: [], t: []}
      finger: value: 1, isOn: false
      reset: ->
        @ <<< {tut: true, show: false, idx: 0, type: ""}
        @finger = {value: 1, isOn: false}
        for step in @step =>
          step.fired = false
          if step.reset => step.reset!
      skip: (hold = false) ->
        $(\#finger-slide).css display: \none
        $(\#finger-tap).css display: \none
        for item in @h.i => $interval.cancel item
        for item in @h.t => $timeout.cancel item
        if !hold => @clean!
        if @idx == @step.length - 2 => @next!
        else
          @type = ""
          if hold =>
            @idx = @step.length - 2
            @toggle 0, true
      interval: (func, delay) ->
        ret = $interval func, delay
        @h.i.push ret
        ret
      timeout: (func, delay) ->
        ret = $timeout func, delay
        @h.t.push ret
        ret
      clean: ->
        delete $scope.mouse.forceStay
        delete $scope.mouse.forceMood
        $scope.game.reset!
        $scope.dialog <<< {tut: false, idx: @step.length - 1}
        $scope.mouse.unlock!
        $(\#score).remove-class \hint
        $scope.doctor
          ..chance = 5
          ..hurting = 0
          ..faint = false
          ..energy = 1
          ..set-mood 2
        $scope.game.set-state 2
        $scope.game.countdown.start!
      step: [
        * {}
        * do
            ready: false
            reset: -> @ready = false
            check: ->
              if !@ready and $scope.game.state == 3 => @ready = true
              @ready
            fire: ->
              $scope.mouse.forceStay = false
              $scope.mouse.forceMood = 1
              $scope.mouse.lock!
              $scope.dialog.timeout (-> $scope.patient.add 1, 1, 0), 800
              $scope.dialog.timeout (-> $scope.patient.add 1, 2, 0), 1600
              $scope.dialog.timeout (-> $scope.patient.add 1, 3, 0), 2400
        * do
            ready: false
            reset: -> @ready = false
            check: ->
              if @ready => return true
              if $scope.percent.sprite.points.filter(->it.type==1 and it.variant==3).length > 0 =>
                $scope.dialog.timeout (~> @ready = true), 1000
              return false
        * { check: -> true }
        * do
            check: -> true
            fire: ->
              $(\#finger-slide).css do
                display: \block
                top: \33%
                left: \22%
              set-timeout ->
                $(\#finger-slide).css display: \none
                $scope.mouse.unlock!
              , 3000
        * do
            reset: -> @ <<< handler: null
            check: ->
              if $scope.doctor.chance < 5 =>
                $(\#oops).css display: \block
                $scope.doctor.chance = 5
                $scope.patient.reset!
                $scope.patient.add 1, 1, 0
                $scope.patient.add 1, 2, 0
                $scope.patient.add 1, 3, 0
                set-timeout (~>
                  $(\#oops).css display: \none
                ), 1000
              ret = ($scope.percent.sprite.points.filter(->it.type==1 and it.variant != 0).length == 0)
              if ret and $scope.doctor.chance == 5 =>
                $scope.dialog.type = \mini
                @handler = $scope.dialog.timeout (~> 
                  $scope.doctor.hurting = 1
                  @handler = null
                ), 500
              ret
            fire: ->
              $scope.doctor <<< {chance: 5, hurting: 0}
              if @handler => $timeout.cancel @handler
        * check: ->
            $(\#score).add-class \hint
            true
          fire: ->
            $(\#score).remove-class \hint
        * do
            mood: 0
            reset: -> @ <<< handler: null, mood: 0
            check: ->
              if !(@handler?) =>
                @handler = $scope.dialog.interval (~>
                  $scope.doctor.set-mood @mood + 4
                  $scope.rebuild!
                  @mood = ( @mood + 1 ) % 3
                ), 500
              true
            fire: ->
              $scope.doctor.set-mood 1
              $scope.rebuild!
              $interval.cancel @handler
              $scope.mouse.forceStay = true
              $scope.patient.add 1, 2, 0
        * do
            mood: 3
            ready: false
            handler: null
            mood-handler: null
            reset: -> @ <<< {handler: null, mood-handler: null, ready: false, mood: 3}
            check: ->
              if $scope.doctor.chance < 5 =>
                $(\#oops).css display: \block
                $scope.doctor.chance = 5
                $scope.patient.reset!
                set-timeout (~> $(\#oops).css display: \none), 800

              has-pat2 = $scope.percent.sprite.points.filter(->(it.type==2 or it.type==4) and it.variant > 0).length
              $scope.mouse.forceStayType = if has-pat2 => 2 else 4
              has-pat1 = ($scope.percent.sprite.points.filter(->it.type==1 and it.variant==2).length > 0)
              if has-pat2 > 1 and !@handler? =>
                @handler = $scope.dialog.timeout (~> @ready = true), 1000
              if has-pat2 < 2 and !has-pat1 =>
                $scope.patient.add 1, 2, parseInt(1 + Math.random! * 4)
              if @ready and !@mood-handler =>
                @mood-handler = $scope.dialog.interval (~>
                  $scope.doctor.set-mood @mood
                  $scope.rebuild!
                  @mood = 4 - @mood
                ), 500
              return @ready
            fire: ->
              $interval.cancel @mood-handler
              $scope.dialog.finger <<< { isOn: true, y: 344, x: 800, small: true}
              $scope.madspeed = 0.015
              $scope.dialog.timeout (-> $scope.dialog.finger <<< {isOn: false, small: false}), 2300
        * do
            ready: false
            handler: null
            reset: -> @ <<< handler: null, ready: false
            check: ->
              if $scope.madspeed == 0.015 and !$scope.dialog.finger.isOn and !@handler =>
                @handler = $scope.dialog.timeout (~> @ready = true), 1000
              @ready
            fire: ->
              $scope.madspeed = 0.04
              $scope.mouse.lock!
        * do
            ready: false
            reset: -> @ready = false
            check: ->
              if $scope.madmax => @ready = true
              @ready
        * do
            launched: 0
            supply: 0
            ready: false
            reset: -> @ <<< launched: 0, supply: 0, ready: false, handler: null
            check: ->
              if $scope.madmax >= 1 and @launched==0 =>
                @launched = 1
                $scope.dialog.finger <<< { isOn: true, y: 197.4, x: 351}
                $scope.madspeed = 0.002
              if $scope.madspeed == 0.002 and $scope.madmax < 1 and @launched == 1 =>
                @launched = 2
                $scope.percent.sprite.points.filter(->it.type == 4).0.mad = 0
                $scope.dialog.timeout (~>
                  @handler = $scope.dialog.interval (~>
                    $scope.supply.active @supply, false
                    @supply = ( @supply + 1 ) % 3
                    $scope.supply.active @supply
                  ), 500
                  @ready = true
                ), 1000
              @ready
            fire: ->
              $interval.cancel @handler
              $scope.supply.active 0, false
              $scope.supply.active 1, true
              $scope.supply.active 2, false
              $scope.dialog.finger <<< { isOn: true, y: 46.06, x: 234}
              $scope.dialog.timeout (-> $scope.mouse.unlock!), 1000
        * do
            ready: false
            handler: false
            reset: -> @ <<< handler: null, ready: false
            check: ->
              if !@handler =>
                @handler = $scope.dialog.timeout (~> 
                  @ready = true
                  $scope.supply.active 1, false
                  $scope.doctor.set-mood 7
                  $scope.rebuild!
                  $scope.doctor.energy -= 0.1
                ), 3000
              @ready
            fire: ->
        * do
            check: -> true
            fire: ->
              $scope.doctor.energy = 0
              $scope.doctor.faint = true
              $scope.doctor.demading = 0
              $scope.dialog.finger <<< { isOn: true, y: 131.6, x: 351}
        * do
            ready: false
            reset: -> @ <<< ready: false, handler: null
            check: ->
              if !@handler? and $scope.doctor.energy >= 0.999 and $scope.doctor.faint == false =>
                @handler = $scope.dialog.timeout (~>
                  $scope.dialog.type = ""
                  @ready = true
                ), 1000
              @ready
        * do
            check: -> true
            fire: -> $scope.dialog.clean!
        * check: -> false
      ]
      main: (force = false) ->
        if force and @step[@idx] and @step[@idx].fire and !@step[@idx].fired =>
          @step[@idx].fire!
          @step[@idx].fired = true
        if @show and !force => return
        if @step[@idx + 1] and @step[@idx + 1].check! => @toggle @idx + 1, true
        else @toggle 0, false
      toggle: (idx, isOn) -> 
        if idx => @idx = idx
        <~ setTimeout _, 0
        if !(isOn?) => @show = !@show
        else @show = isOn
        if @show =>
          $(\#dialog).fadeIn!
          $scope.audio.menu!
        else $(\#dialog).fadeOut!

    $scope.scream = gajus.Scream width: portrait: 320, landscape: 480

    $scope.dimension = do
      update: ->
        [doc-w, doc-h] = [$(window)width!, $(window)height!]
        [cvs-w, cvs-h] = [1024,576]
        [w1,h1] = if doc-w < 1024 => [doc-w, doc-w * 576 / 1024 ] else [1024,576]
        [w2,h2] = if doc-h < 576  => [doc-h * 1024 / 576, doc-h] else [1024,576]
        [w,h] = if h1 > doc-h => [w2,h2] else [w1,h1]
        @ <<< {w,h}
        $(\#frame).css width: "#{w}px", height: "#{h}px"
        $(\#container).css width: "#{w}px"

        $(\body).css overflow: \hidden

        if doc-w < doc-h =>
          @portrait = true 
          if $scope.game.state == 2 => $scope.game.pause!
        else 
          @portrait = false


        if @portrait =>
          $(\#frame).css do
            padding: 0, position: \absolute
            top: 0, left: 0
            height: \100%, width: \100%
          $(\#wrapper).css do
            width: \100%, height: \100%
            top: \0, left: \0

        else =>
          if doc-h - h <= 110 =>
            $(\#frame).css do
              padding: \0, position: \fixed
              top: "#{(doc-h - h) / 2}px", left: "#{(doc-w - w) / 2}px",
            $(\#wrapper).css do
              width: "#{w}px", height: "#{h}px"
              top: \0, left: \0
            $(\#head).css display: \none
            $(\#foot).css display: \none
          else
            $(\#frame).css do
              padding: \10px, position: \relative
              top: \auto, left: \auto
              height: "#{h + 10}px"
            $(\#wrapper).css do
              width: "#{w - 20}px", height: "#{h - 10}px"
              top: \10px, left: \10px
            $(\#head).css display: \block
            $(\#foot).css display: \block

      portrait: false
      rotate: ->
    $scope.dimension.update!
    window.onresize = -> $scope.$apply -> $scope.dimension.update!
    document.ontouchmove = (e) -> if $scope.is-pad or $scope.ismin => return e.prevent-default!

    $scope.progress = do
      value: 0
      latest: 0
      use: null
      count: total: 0, current: 0, update: ->
      size:  total: 0, current: 0, group: {}, update: (name, value) -> 
        $scope.progress.set-use \size
        @group{}[name] <<< value
        list = [v for k,v of @group]
        @total = list.reduce(((a,b) -> a + b.total),0)
        @current = list.reduce(((a,b) -> a + b.current),0)
      set-use: -> @use = @[it]
      handler: null
      transition: ->
        if @value >= 100 => $timeout (-> $scope.loading = false), 1000
        if @value >= @latest => return @handler = null
        @value = ( @value + 3 ) <? @latest
        @handler = $timeout (~> @transition!), 10
      update: ->
        @latest = parseInt( 100 * ( @count.current + @size.current ) / ( @count.total + @size.total ) )
        if !@handler => @transition!
    $scope.$watch 'progress.count', (-> $scope.progress.update!), true
    $scope.$watch 'progress.size', (-> $scope.progress.update!), true

    $scope.debug = d1: 0, d2: 0
    interval = do
      spawn: ->
        if $scope.dialog.tut or !($scope.game.state in [1 2 4]) => return
        time = (new Date!getTime! / 1000) - $scope.audio.bkt
        if time <= 60 => $scope.config.cur = $scope.config.mode[$scope.mode]0
        else if time <= 98 => $scope.config.cur = $scope.config.mode[$scope.mode]1
        else if time <= 120 => $scope.config.cur = $scope.config.mode[$scope.mode]2
        else => $scope.config.cur = $scope.config.mode[$scope.mode]3
        $scope.debug.d2 = time
        $scope.debug.d3 = $scope.config.cur.prob.pat.2
        if time >= 98 and time <= 101 and $scope.game.state == 2 => $scope.danger = true
        else if time <= 120 => $scope.danger = false
        if isHalt! => return
        r = Math.random!
        if r < $scope.config.cur.prob.pat.0 =>
          $scope.patient.add 1
        if Math.random! < $scope.config.cur.prob.sup => $scope.supply.active!
        if $scope.percent.sprite.points.filter(->it.type == 1 and it.variant != 0).length == 0 
          and Math.random! > 0.8 =>
            $scope.patient.add 1
        $scope.madspeed = $scope.config.cur.decay.mad
      drain: ->
        if isHalt! => return
        if $scope.doctor.hurting =>
          $scope.doctor.hurting -= 0.2
          $scope.doctor.hurting >?= 0
        if $scope.doctor.draining =>
          $scope.doctor.draining -= 0.2
          $scope.doctor.draining >?= 0
        inqueue = $scope.percent.sprite.points.filter(->it.type == 1 and it.variant > 0)
        die = false
        for it in inqueue
          it.life -= ( $scope.config.cur.decay.life * it.variant )
          if it.life <= 0 =>
            it.life = 0
            $scope.doctor.fail!
            it.variant = 0
            die = true
        if die => $scope.patient.update-urgent!
        inqueue = $scope.percent.sprite.points.filter(->(it.type in [2 3 4]) and it.variant > 0)
        madmax = 0
        for it in inqueue
          if !(it.mad?) => it.mad = 0
          it.mad += $scope.madspeed
          if it.mad >= 0.8 =>
            it.mad = 1
            it.ismad = true
            madmax = 1
        if madmax and !$scope.madmax =>
          $scope.madmax = parseInt( Math.random!*2 + 1 )
          $scope.doctor.demading = 0
        if !$scope.doctor.faint =>
          inqueue = $scope.percent.sprite.points.filter(->(it.type in [5 6 7 8]) and it.active)
          for it in inqueue
            if !(it.countdown?) or it.countdown <= 0 => it.countdown = 1
            it.countdown -= $scope.config.cur.decay.sup
            if it.countdown <= 0 =>
              it.countdown = 1
              it.active = 0
              $scope.doctor.drain!
      tweak: ->
        [w,h] = [$(window)width!, $(window)height!]
        if $scope.game.state == 3 => $scope.dialog.main!
        is-pad = if /iPad/.exec(navigator.platform) => true else false
        try
          ismin = $scope.scream.is-minimal-view!
          $scope.debug.d1 = ismin
        if $scope.ismin and !ismin and !is-pad =>
          document.body.scrollTop = 0
          $(\#minimal-fix).css display: \block
        # this is not gonna work in i5. don't do this work instead.
        #if is-pad or ismin =>
        #  $(\#minimal-fix).css display: \none
        $scope.ismin = ismin
        $scope.is-pad = is-pad
        if w != @w or h != @h => $scope.dimension.update!
        @{w,h} <<< {w,h}

    $interval (->
      interval.spawn!
      interval.drain!
      interval.tweak!
    ), 100
    $scope.loading = true
    $scope.$watch 'loading', -> if !it => $(\#loading).fade-out!
    document.body
      ..ontouchstart = window.touch.down
      ..ontouchmove = window.touch.move
      ..ontouchend = window.touch.up

    $scope.assets = do
      fetch: (url, type, cb) ->
        t1 = new Date!getTime!
        $scope.progress.count.total++
        request = new XMLHttpRequest!
        request.open \GET, url, true
        request.response-type = \arraybuffer
        request.onprogress = (e) -> $scope.$apply -> 
          $scope.progress.size.update url, {current: e.loaded, total: e.total}
        request.onload = ~> $scope.$apply ~> 
          [str,buf] = ["",new Zlib.Gunzip(new Uint8Array request.response).decompress!]
          for i from 0 til buf.length => str += String.fromCharCode(buf[i])
          ret = @parse JSON.parse(str), type
          cb ret
          t2 = new Date!getTime!
          $scope.progress.count.current++
          console.log "[assets] Process #url spent #{t2 - t1} ms."
        request.send!
      parse: (d, type) ->
        ret = {url: {}, buf: {}}
        for k,v of d =>
          data = atob v
          buf = new ArrayBuffer data.length
          array = new Uint8Array buf #data.length
          for i from 0 til data.length => array[i] = data.charCodeAt i
          blob = new Blob [array], {type: type}
          ret.buf[k] = buf
          ret.url[k] = $sce.trustAsResourceUrl(URL.createObjectURL blob)
        return ret

    $scope.audio = do
      s: {}
      buf: {}
      names: <[click count1 count2 blop die menu dindon born click2 bkloop bk noop]>
      reset: ->
        for item in @names => @[item]pause true
        @bkt = 0
        if @bk =>
          delete @bk.pausetime
          delete @bk.starttime
      n: {}
      bkt: 0
      is-mute: false
      toggle-mute: ->
        @is-mute = !@is-mute
        @gain.gain.value = if @is-mute => 0 else 1
      player: (name) ->
        ret = (offset, looping = false, reset = false) ~>
          if reset =>
            delete ret.pausetime
          else if ret.pausetime =>
            offset = ret.pausetime - ret.starttime
            delete ret.pausetime
          ret.starttime = parseInt( new Date!getTime! / 1000 ) - (if offset? => offset else 0)
          if name == \bk => @bkt = ret.starttime
          if !@buf[name] => return
          if @n[name] => @n[name]disconnect!
          @n[name] = src = @context.create-buffer-source!
          src.buffer = @buf[name]
          src.connect @gain # @context.destination
          if looping => src.loop = true
          if offset? => src.start 0, offset else src.start 0
        ret.pause = (reset = false) ~> 
          if @n[name] =>
            try
              @n[name].stop 0
            catch e
          if !reset => ret.pausetime = parseInt( new Date!getTime! / 1000 )
        ret
      init: ->
        AudioContext = window.AudioContext or window.webkitAudioContext
        #TODO android browser doesn't support web audio
        if !AudioContext =>
          dummy = (name) ~>
            ret = (offset, looping = false) ~>
              if ret.pausetime =>
                offset = ret.pausetime - ret.starttime
                delete ret.pausetime
              ret.starttime = parseInt( new Date!getTime! / 1000 ) - (if offset? => offset else 0)
              if name == \bk => @bkt = ret.starttime
            ret.pause = (reset = false) ->
              if !reset => ret.pausetime = parseInt( new Date!getTime! / 1000 )
            ret
          for item in @names =>
            @[item] = dummy item
            @s[item] = pause: ->
          return
        $scope.progress.count.total += @names.length
        @context = new AudioContext!
        @gain = @context.create-gain!
        @gain.connect @context.destination
        ({url,buf}) <~ $scope.assets.fetch \assets/snd.gz, \audio/mpeg, _
        decode = (name,key) ~>
          @context.decode-audio-data buf[key], ((ret)~> @buf[name] = ret), (-> console.log(\fail))
        for [name,key] in @names.map(->[it,"snd/#it.mp3"]) =>
          @[name] = @player name
          decode name, key
        $scope.progress.count.current += @names.length

    $scope.image = do
      url: {}
      img: {}
      zoom: {}
      init: ->
        $scope.progress.count.total++
        $scope.progress.update!
        ({@url,buf}) <~ $scope.assets.fetch \assets/img.gz, \image/png, _
        [imgs,bks] = [$(\img.src), $(\.img-bk)]
        for idx from 0 til imgs.length =>
          item = $(imgs[idx])
          src = item.attr(\data-src)
          des = @url[src.replace /^.+\/img\//, "img/"]
          if des? => item.attr(\src, des.toString!)
        for idx from 0 til bks.length =>
          item = $(bks[idx])
          src = item.attr(\data-src)
          item.css "background-image": "url(#{@url[src].toString!})"
        for k,v of @url =>
          $scope.progress.count.total++
          @img[k] = img = new Image!
          img.src = v.toString!
          img.onload = -> $scope.progress.count.current++
        # a little delay before we actually remove loading panel
        $timeout (-> $scope.progress.count.current++), 100
        $scope.$watch 'loading', (-> $scope.canvas.init!)
      /* maunally downsampling. look like we don't need this ....
      canvas: null
      ctx: null
      downsample: ->
        if !@canvas =>
          @canvas = document.createElement("canvas")
          @canvas <<< {width: 1024, height: 576}
          @ctx = @canvas.getContext \2d
        {w,h} = $scope.dimension{w,h}
        [w,h] = [w/100,h/100]
        for k,v of @url =>
          ret = /img\/it-(\d+)/.exec k
          if !ret => continue
          type = ret.1
          dim = $scope.percent.sprite.size[type]
          img = $scope.image.img["img/it-#{it.type}-#{it.variant or 0}-0.png"]
          raw = {w: img.width, h: img.height}
          des = {w: dim.w * w, h: dim.h * h}
          rate = {w: (des.w / raw.w)**0.25, h :(des.h / raw.h)**0.25}
          cur = {} <<< raw
          data = null
          for i from 0 til 4 =>
            if data => @ctx.putImageData data, 0, 0
            cur.w *= rate.w
            cur.h *= rate.h
            @ctx.drawImageData img, 0, 0, cur.w, cur.h
            data = @ctx.getImageData 0, 0, cur.w, cur.h

          0, 0, img.width,  img.height, it.x * w, it.y * h, dim.w * w, dim.h * h
        */
        
    $scope.audio.init!
    $scope.image.init!

    vizchange = [
      <[hidden visibilitychange]>
      <[mozHidden mozvisibilitychange]>
      <[msHidden msvisibilitychange]>
      <[webkitHidden webkitvisibilitychange]>
    ].filter(->document[it.0]?).0
    if vizchange =>
      document.addEventListener vizchange.1, (->
        if document[vizchange.0] => $scope.game.pause!
      ), false
      document.addEventListener \pagehide, (-> $scope.game.pause!), false

    $scope.canvas = do
      e: null
      ctx: null
      init: ->
        @e = document.getElementById(\main-canvas)
        {w,h} = $scope.dimension{w,h}
        [w,h] = [w/100,h/100]
        @e <<< {width: 1170, height: 658}
        @e.style <<< {width: "#{w * 100}px", height: "#{h * 100}px"}
        @ctx = @e.getContext \2d
        @ctx.imageSmoothingEnabled = true
        @ctx.mozImageSmoothingEnabled = true
        @ctx.webkitImageSmoothingEnabled = true
        @ctx.msImageSmoothingEnabled = true

        if $scope.usedom => return
        <~ $interval _, 100
        @ctx.fillStyle = "rgba(0,0,0,0.0)"
        @ctx.fillRect 0, 0, 1170, 658
        img = $scope.image.img["img/scenario.png"]
        @ctx.drawImage img, 0, 0, 1170, 658
        for it in $scope.percent.sprite.points =>
          img = $scope.image.img["img/it-#{it.type}-#{it.variant or 0}-0.png"]
          dim = $scope.percent.sprite.size[it.type]
          des = {w: dim.w * 11.70, h: dim.h * 6.58, x: it.x * 11.70, y: it.y * 6.58}
          @ctx.drawImage img, des.x, des.y, des.w, des.h
          if it.active =>
            img = $scope.image.img["img/it-#{it.type}-#{it.variant or 0}-1.png"]
            if it.type == 1 =>
              if it.life < 1 => @ctx.drawImage img,
                0, 0, img.width, (1 - it.life) * img.height,
                des.x, des.y, des.w, (1 - it.life) * des.h
            else if it.type <= 4 =>
              if it.mad > 0 => @ctx.drawImage img,
                0, ( 1 - it.mad ) * img.height, img.width, it.mad * img.height,
                des.x, des.y + ( 1 - it.mad ) * des.h, des.w, it.mad * des.h
            else if it.type >=5 =>
              @ctx.drawImage img,
                0, 0, img.width,  img.height, des.x, des.y, des.w, des.h

        if $scope.doctor.faint or $scope.madmax or 
          ($scope.dialog.show and !$scope.dialog.type) or 
          $scope.game.state == 5 =>
          @ctx.fillStyle = "rgba(65,65,65,0.7)"
          @ctx.fillRect 0, 0, 1170, 658
        if $scope.patient.urgent =>
          img = $scope.image.img["img/urgency.png"]
          @ctx.drawImage img, 0, 0, 1170, 658
        if $scope.doctor.faint or $scope.madmax =>
          ts = parseInt(new Date!getTime! / 250)
          mod = ( ts % 2 ) + 1
          [mw,mh] = [11.70 * 35.5, 11.70 * 35.5]
          [mx,my] = [(1170 - mw) * 0.6, (658 - mh) * 0.4]
          if $scope.doctor.faint and !$scope.madmax =>
            img = $scope.image.img["img/mad/hungry#mod.png"]
          else if $scope.madmax == 1 =>
            img = $scope.image.img["img/mad/gangster#mod.png"]
          else =>
            img = $scope.image.img["img/mad/hysteria#mod.png"]
          @ctx.drawImage img, mx, my, mw, mh
        if $scope.dialog.show =>
          img1 = $scope.image.img["img/tutorial/#{$scope.dialog.idx}.png"]
          img2 = $scope.image.img["img/tutorial/doctor.png"]
          if $scope.dialog.type == \mini
            @ctx.drawImage img1, 386.1, 263.2, 514.8, 263.853
          else
            @ctx.drawImage img1, 81.9, 85.54, 702, 490.249
            @ctx.drawImage img2, 819, 111.86, 234, 433.45
        if $scope.game.state == 5 =>
          img = $scope.image.img["img/countdown/#{($scope.game.countdown.value - 1) or \go}.png"]
          @ctx.drawImage img, 409.5, 148.5, 351, 351
        if $scope.dialog.finger.isOn =>
          ts = parseInt(new Date!getTime! / 100)
          mod = ( ts % 2 ) + 1
          f = $scope.dialog.finger
          if f.small =>
            img = $scope.image.img["img/mad/click-#mod.png"]
            @ctx.drawImage img, f.x, f.y, 70.2, 114.426
          else
            img = $scope.image.img["img/tutorial/finger#mod.png"]
            @ctx.drawImage img, f.x, f.y, 292.5, 292.5

    $scope.usedom = false

    $scope.share = (rank, score) ->
      title = <[見習醫生 實習醫生 住院醫生 總住院醫生 研究醫生 主治醫生 醫龍]>
      obj = do
        method: \feed
        link: \http://0media.tw/p/ergame/
        name: "我在急診人生救了 #{score} 個人，獲得「#{title[rank]}」稱號！"
        caption: "急診人生 - 三分鐘的急診室醫師人生 / 報導者 x 0media"
        picture: "http://0media.tw/p/ergame/rank/s#{score}.png"
        description: "一款富含真實情境的經典急診室經營夢幻之作，為台灣第一個急診室新聞遊戲。遊戲背景鎖定在台灣的一間大型醫學中心，面對健保體制的崩壞、沒膽改革的政府以及愛跑大醫院看病的人民，擁有拯救急診室命運能力的鍵盤醫師，將在一次又一次的真實的醫療突發狀況中突圍，試圖拯救病患的生命。你，將在人類的極限體力、醫生的使命和病患的生命中作出抉擇，準備好了嗎？"
      FB.ui obj, (->)

window.ctrl = do
  _s: null
  scope: ->
    if @_s => return that
    @_s = angular.element(\body).scope!
  wrap: (is-touch, callback) ->
    if !is-touch and touchflag => return
    @scope!$apply ~> callback!

  next: (is-touch = false) -> @wrap is-touch, ~>
    @scope!dialog.next!
    @scope!audio.click!

  skip: (is-touch = false, event, hold = true) -> @wrap is-touch, ~>
    @scope!dialog.skip hold
    @scope!audio.click!
    event.prevent-default!

  pause: (is-touch = false, event) -> @wrap is-touch, ~>
    @scope!game.pause!
    @scope!audio.click!
    event.prevent-default!

  mute: (is-touch = false, event) -> @wrap is-touch, ~>
    @scope!audio.toggle-mute!
    event.prevent-default!
    event.cancelBubble = true

  replay: (is-touch = false, event) -> @wrap is-touch, ~>
    @scope!game.reset!
    @scope!audio.click!

  resettutorial: (is-touch = false, event) -> @wrap is-touch, ~>
    @scope!game.reset!
    @scope!game.tutorial!
    @scope!audio.click!

  tutorial: (is-touch = false, event) -> @wrap is-touch, ~>
    @scope!game.tutorial!
    @scope!audio.click!

  cont: (is-touch = false, event) -> @wrap is-touch, ~>
    @scope!audio.click!
    @scope!game.resume!

  share: (is-touch = false, event) -> @wrap is-touch, ~>
    @scope!audio.click!
    @scope!share @scope!doctor.rank, @scope!doctor.score.value

  sharegame: (is-touch = false, event) -> @wrap is-touch, ~>
    @scope!audio.click!
    obj = do
      method: \feed
      link: \http://0media.tw/p/ergame/
      name: "急診人生 - 三分鐘的急診室醫師人生 / 報導者 x 0media"
      caption: "twreporter.atavist.com"
      picture: "http://0media.tw/p/ergame/img/thumbnail.jpg"
      description: "一款富含真實情境的經典急診室經營夢幻之作，為台灣第一個急診室新聞遊戲。遊戲背景鎖定在台灣的一間大型醫學中心，面對健保體制的崩壞、沒膽改革的政府以及愛跑大醫院看病的人民，擁有拯救急診室命運能力的鍵盤醫師，將在一次又一次的真實的醫療突發狀況中突圍，試圖拯救病患的生命。你，將在人類的極限體力、醫生的使命和病患的生命中作出抉擇，準備好了嗎？"
    FB.ui obj, (->)


touchflag = false
audioinit = false
#TODO: android browser long press cause problem ( can't slide, popup menu )
window.touch = touch = do
  down: (e) ->
    touchflag := true
    angular.element(\#wrapper).scope().mouse.down(e,true)
    # prevent default eats slide-up action, which is needed for ios to enter minimal-view.
    # only prevent default when it's in minimal view.
    if angular.element(\#wrapper).scope().is-min => e.prevent-default!
  up: (e) ->
    touchflag := true
    angular.element(\#wrapper).scope().mouse.up(e,true)
    # force play a no sound everytime touchend in case iphone doesn't play sound...
    if !audioinit => if angular.element(\#wrapper).scope().audio.noop => that!
  move: (e) ->
    angular.element(\#wrapper).scope().mouse.move(e,true)

