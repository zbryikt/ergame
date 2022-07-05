var ref$, w, h, patw, path, of1x, of1y, dpw, dph, x$, touchflag, audioinit, touch;
ref$ = [1170, 658], w = ref$[0], h = ref$[1];
ref$ = [193, 278], patw = ref$[0], path = ref$[1];
ref$ = [298, 273], of1x = ref$[0], of1y = ref$[1];
ref$ = [59, 20], dpw = ref$[0], dph = ref$[1];
x$ = angular.module('ERGame', []);
x$.config(['$compileProvider'].concat(function($compileProvider){
  return $compileProvider.imgSrcSanitizationWhitelist(/^\s*(blob):|http:\/\/localhost:9998\/|http:\/\/0media.tw\/|http:\/\/reporter.tw\//);
}));
x$.controller('ERGame', ['$scope', '$interval', '$timeout', '$http', '$sce'].concat(function($scope, $interval, $timeout, $http, $sce){
  var res$, i$, i, r, c, p, isHalt, interval, x$, vizchange, args, k, v;
  res$ = [];
  for (i$ = 0; i$ < 12; ++i$) {
    i = i$;
    res$.push([i % 4, parseInt(i / 4)]);
  }
  $scope.list = res$;
  $scope.danger = false;
  $scope.pixel = {
    scene: {
      w: 1170,
      h: 658
    },
    sprite: {
      size: [
        {
          w: 0,
          h: 0
        }, {
          w: 101,
          h: 142
        }, {
          w: 108,
          h: 229
        }, {
          w: 108,
          h: 229
        }, {
          w: 291,
          h: 245
        }, {
          w: 316,
          h: 269
        }, {
          w: 105,
          h: 196
        }, {
          w: 146,
          h: 239
        }, {
          w: 98,
          h: 60
        }, {
          w: 306,
          h: 298
        }, {
          w: 191,
          h: 240
        }, {
          w: 104,
          h: 136
        }, {
          w: 238,
          h: 184
        }
      ],
      points: [{
        x: 591,
        y: -19,
        type: 6
      }].concat([{
        x: 317,
        y: 2,
        type: 5
      }], [{
        x: 687,
        y: -36,
        type: 7
      }], [{
        x: 507,
        y: 54,
        type: 9,
        variant: 1
      }], [{
        x: 249,
        y: 184,
        type: 11
      }], (function(){
        var i$, j$, results$ = [];
        for (i$ = 0; i$ < 3; ++i$) {
          r = i$;
          for (j$ = 0; j$ < 4; ++j$) {
            c = j$;
            results$.push({
              x: 293 + c * 59 + r * -127,
              y: 222 + c * 20 + r * 47,
              type: 1,
              variant: 0,
              active: 1
            });
          }
        }
        return results$;
      }()), [{
        x: 857,
        y: 100,
        type: 4,
        variant: 0,
        active: 1
      }], [{
        x: 870,
        y: 272,
        type: 12
      }], (function(){
        var i$, results$ = [];
        for (i$ = 0; i$ < 5; ++i$) {
          i = i$;
          results$.push({
            x: 749 + i * 66,
            y: 227 + i * 24,
            type: 2,
            variant: 0,
            active: 1
          });
        }
        return results$;
      }()), [
        {
          x: 623,
          y: 279,
          type: 3,
          variant: 0,
          active: 1
        }, {
          x: 520,
          y: 341,
          type: 10
        }, {
          x: 730,
          y: 387,
          type: 4,
          variant: 0,
          active: 1
        }, {
          x: 335,
          y: 387,
          type: 4,
          variant: 0,
          active: 1
        }, {
          x: 493,
          y: 418,
          type: 3,
          variant: 0,
          active: 1
        }, {
          x: 678,
          y: 418,
          type: 2,
          variant: 0,
          active: 1
        }
      ])
    }
  };
  $scope.percent = {
    sprite: {
      size: (function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = $scope.pixel.sprite.size).length; i$ < len$; ++i$) {
          p = ref$[i$];
          results$.push({
            w: 100 * p.w / $scope.pixel.scene.w,
            h: 100 * p.h / $scope.pixel.scene.h
          });
        }
        return results$;
      }()),
      points: (function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = $scope.pixel.sprite.points).length; i$ < len$; ++i$) {
          p = ref$[i$];
          results$.push({
            x: 100 * p.x / $scope.pixel.scene.w,
            y: 100 * p.y / $scope.pixel.scene.h,
            type: p.type,
            variant: p.variant,
            active: p.active
          });
        }
        return results$;
      }())
    }
  };
  $scope.rebuild = function(it){
    var i$, ref$, len$, results$ = [];
    for (i$ = 0, len$ = (ref$ = $scope.percent.sprite.points).length; i$ < len$; ++i$) {
      it = ref$[i$];
      results$.push(it.cls = ["it-" + it.type + "-" + (it.variant || 0) + "-" + (it.active || 0)]);
    }
    return results$;
  };
  $scope.game = {
    state: 0,
    over: function(){
      this.setState(4);
      return $timeout(function(){
        var r;
        r = parseInt($scope.doctor.score.value / 10);
        if (r >= 6) {
          r--;
        }
        if (r >= 6) {
          r = 6;
        }
        $scope.doctor.rank = r;
        return $scope.share.updateRank();
      }, 500);
    },
    setState: function(it){
      return this.state = it;
    },
    tutorial: function(){
      this.setState(3);
      $scope.audio.bkloop(0, true, true);
      return $scope.audio.bk.pause(true);
    },
    lastState: 0,
    pause: function(){
      if (this.state <= 1) {
        return;
      }
      $scope.audio.bk.pause();
      $scope.audio.bkloop.pause();
      this.lastState = this.state;
      return this.setState(1);
    },
    resume: function(){
      this.setState(this.lastState || 2);
      if (this.lastState === 2) {
        $scope.audio.bk();
      }
      if (this.lastState === 3) {
        return $scope.audio.bkloop();
      }
    },
    start: function(){
      this.setState(2);
      $scope.audio.bkloop.pause(true);
      return $scope.audio.bk();
    },
    reset: function(){
      $('#wheel').css({
        display: 'none'
      });
      $scope.danger = false;
      $scope.patient.reset();
      $scope.doctor.reset();
      $scope.supply.reset();
      $scope.mouse.reset();
      $scope.audio.reset();
      $scope.dialog.reset();
      $scope.rebuild();
      $scope.madmax = 0;
      $scope.dialog.toggle(null, false);
      return this.state = 0;
    },
    countdown: {
      handler: null,
      value: 0,
      count: function(){
        var this$ = this;
        this.value = this.value - 1;
        if (this.value > 0) {
          $scope.audio["count" + (this.value === 1 ? 2 : 1)]();
          return $timeout(function(){
            return this$.count();
          }, 650);
        } else {
          $scope.game.setState(2);
          $scope.audio.bkloop.pause(true);
          return $scope.audio.bk(0, false, true);
        }
      },
      start: function(){
        $scope.game.setState(5);
        this.value = 5;
        return this.count();
      }
    }
  };
  $scope.doctor = {
    sprite: $scope.percent.sprite.points.filter(function(it){
      return it.type === 9;
    })[0],
    handler: null,
    energy: 1,
    faint: false,
    demading: 0,
    chance: 5,
    hurting: 0,
    draining: 0,
    rank: 0,
    drain: function(){
      var x$;
      x$ = this;
      x$.energy -= 0.2;
      x$.energy >= 0 || (x$.energy = 0);
      x$.draining = 1;
      if ($scope.doctor.energy <= 0.0001) {
        $scope.doctor.faint = true;
        return $scope.doctor.demading = 0;
      }
    },
    fail: function(){
      var x$;
      x$ = this;
      x$.setMood(7);
      x$.chance -= 1;
      x$.chance >= 0 || (x$.chance = 0);
      x$.hurting = 1;
      if (this.chance <= 0) {
        $scope.game.over();
      }
      return $scope.audio.die();
    },
    reset: function(){
      this.rank = 0;
      this.energy = 1;
      this.faint = false;
      this.chance = 5;
      this.hurting = 0;
      this.draining = 0;
      if (this.handler) {
        $timeout.cancel(this.handler);
      }
      this.score.value = 0;
      this.score.digit = [0, 0, 0, 0];
      return this.setMood(1);
    },
    score: {
      digit: [0, 0, 0, 0],
      value: 0
    },
    resetLater: function(){
      var this$ = this;
      if (this.handler) {
        $timeout.cancel(this.handler);
      }
      return this.handler = $timeout(function(){
        this$.setMood(1);
        this$.handler = null;
        return $scope.rebuild();
      }, 1000);
    },
    setMood: function(it){
      this.sprite.variant = it;
      if (it > 1) {
        return this.resetLater();
      }
    }
  };
  $scope.$watch('doctor.score.value', function(){
    var score, i$, i, results$ = [];
    score = $scope.doctor.score;
    for (i$ = 0; i$ < 4; ++i$) {
      i = i$;
      results$.push(score.digit[3 - i] = parseInt(score.value / Math.pow(10, i)) % Math.pow(10, i + 1));
    }
    return results$;
  });
  $scope.supply = {
    sprite: $scope.percent.sprite.points.filter(function(it){
      var ref$;
      return (ref$ = it.type) === 5 || ref$ === 6 || ref$ === 7;
    }),
    reset: function(){
      var i$, ref$, len$, item, results$ = [];
      for (i$ = 0, len$ = (ref$ = this.sprite).length; i$ < len$; ++i$) {
        item = ref$[i$];
        results$.push((item.active = 0, item.countdown = -1, item));
      }
      return results$;
    },
    active: function(defidx, isOn){
      var idx, ref$, ref1$;
      isOn == null && (isOn = true);
      if (defidx == null) {
        idx = parseInt(Math.random() * this.sprite.length);
      } else {
        idx = defidx;
      }
      if (!isOn) {
        this.sprite[idx].active = 0;
        return ref1$ = (ref$ = this.sprite[idx]).countdown, delete ref$.countdown, ref1$;
      } else if (!this.sprite[idx].active) {
        this.sprite[idx].active = 1;
        return this.sprite[idx].countdown = 1;
      }
    }
  };
  $scope.patient = {
    urgent: 0,
    updateUrgent: function(){
      return this.urgent = $scope.percent.sprite.points.filter(function(it){
        return it.type === 1 && it.variant === 3;
      }).length;
    },
    reset: function(){
      var remains, i$, len$, item;
      remains = $scope.percent.sprite.points.filter(function(it){
        return it.type >= 1 && it.type <= 4;
      });
      for (i$ = 0, len$ = remains.length; i$ < len$; ++i$) {
        item = remains[i$];
        item.variant = 0;
        item.mad = 0;
        item.life = 1;
      }
      return this.urgent = 0;
    },
    add: function(area, defvar, defpos){
      var remains, variant, dice, idx, des, ref$;
      remains = $scope.percent.sprite.points.filter(function(it){
        return it.type === area && it.variant === 0;
      });
      if (remains.length === 0) {
        return;
      }
      variant = parseInt(Math.random() * 3 + 1);
      if (area === 1) {
        dice = Math.random();
        if (dice < $scope.config.cur.prob.pat[1]) {
          variant = 1;
        } else if (dice < $scope.config.cur.prob.pat[2]) {
          variant = 2;
        } else {
          variant = 3;
        }
        $scope.audio.born();
      } else {
        variant = parseInt(Math.random() * 2 + 1);
      }
      if (area > 1) {
        variant <= 2 || (variant = 2);
      }
      if (defvar != null) {
        variant = defvar;
      }
      idx = defpos != null
        ? defpos
        : parseInt(Math.random() * remains.length);
      des = remains[idx];
      des.variant = variant;
      if (des.type === 1 && des.variant === 3) {
        this.urgent++;
      }
      if (des.type === 1) {
        des.life = 1;
      }
      if ((ref$ = des.type) === 2 || ref$ === 3 || ref$ === 4) {
        des.mad = 0;
      }
      return $scope.rebuild();
    }
  };
  $scope.mode = 'easy';
  $scope.config = {
    cur: {
      prob: {
        pat: [0.05, 0.60, 0.95],
        sup: 0.01,
        stay: 0.1
      },
      decay: {
        life: 0.001,
        sup: 0.001,
        mad: 0.001
      }
    },
    mode: {
      trivial: [
        {
          prob: {
            pat: [0.00, 0.60, 0.95],
            sup: 0.01,
            stay: 0.1
          },
          decay: {
            life: 0.001,
            sup: 0.001,
            mad: 0.001
          }
        }, {
          prob: {
            pat: [0.00, 0.60, 0.95],
            sup: 0.01,
            stay: 0.1
          },
          decay: {
            life: 0.001,
            sup: 0.001,
            mad: 0.001
          }
        }, {
          prob: {
            pat: [0.00, 0.60, 0.95],
            sup: 0.01,
            stay: 0.1
          },
          decay: {
            life: 0.001,
            sup: 0.001,
            mad: 0.001
          }
        }, {
          prob: {
            pat: [0.00, 0.60, 0.95],
            sup: 0.01,
            stay: 0.1
          },
          decay: {
            life: 0.001,
            sup: 0.001,
            mad: 0.001
          }
        }
      ],
      easy: [
        {
          prob: {
            pat: [0.02, 0.60, 0.95],
            sup: 0.01,
            stay: 0.1
          },
          decay: {
            life: 0.001,
            sup: 0.005,
            mad: 0.001
          }
        }, {
          prob: {
            pat: [0.04, 0.50, 0.82],
            sup: 0.02,
            stay: 0.2
          },
          decay: {
            life: 0.002,
            sup: 0.008,
            mad: 0.002
          }
        }, {
          prob: {
            pat: [0.08, 0.40, 0.70],
            sup: 0.04,
            stay: 0.4
          },
          decay: {
            life: 0.003,
            sup: 0.011,
            mad: 0.003
          }
        }, {
          prob: {
            pat: [0.12, 0.30, 0.60],
            sup: 0.10,
            stay: 0.5
          },
          decay: {
            life: 0.006,
            sup: 0.014,
            mad: 0.006
          }
        }
      ],
      normal: [
        {
          prob: {
            pat: [0.02, 0.45, 0.95],
            sup: 0.01,
            stay: 0.1
          },
          decay: {
            life: 0.002,
            sup: 0.005,
            mad: 0.001
          }
        }, {
          prob: {
            pat: [0.06, 0.40, 0.80],
            sup: 0.03,
            stay: 0.3
          },
          decay: {
            life: 0.003,
            sup: 0.015,
            mad: 0.003
          }
        }, {
          prob: {
            pat: [0.14, 0.30, 0.50],
            sup: 0.09,
            stay: 0.5
          },
          decay: {
            life: 0.005,
            sup: 0.020,
            mad: 0.005
          }
        }, {
          prob: {
            pat: [0.22, 0.10, 0.20],
            sup: 0.15,
            stay: 0.6
          },
          decay: {
            life: 0.006,
            sup: 0.025,
            mad: 0.007
          }
        }
      ],
      hard: [
        {
          prob: {
            pat: [0.02, 0.10, 0.95],
            sup: 0.25,
            stay: 0.6
          },
          decay: {
            life: 0.006,
            sup: 0.025,
            mad: 0.007
          }
        }, {
          prob: {
            pat: [0.02, 0.10, 0.95],
            sup: 0.25,
            stay: 0.6
          },
          decay: {
            life: 0.006,
            sup: 0.025,
            mad: 0.007
          }
        }, {
          prob: {
            pat: [0.02, 0.10, 0.95],
            sup: 0.25,
            stay: 0.6
          },
          decay: {
            life: 0.006,
            sup: 0.025,
            mad: 0.007
          }
        }, {
          prob: {
            pat: [0.02, 0.10, 0.95],
            sup: 0.25,
            stay: 0.6
          },
          decay: {
            life: 0.006,
            sup: 0.025,
            mad: 0.007
          }
        }
      ]
    }
  };
  $scope.mouse = {
    x: 0,
    y: 0,
    target: null,
    reset: function(){
      return this.target = null;
    },
    lock: function(){
      return this.isLocked = true;
    },
    unlock: function(){
      return this.isLocked = false;
    },
    timestamp: 0,
    isPalOn: false,
    down: function(e, touch){
      var offset, ref$, ex, ey, x, y, xp, yp, target, pat, max, i$, len$, item;
      touch == null && (touch = false);
      if (touchflag && !touch) {
        return;
      }
      if (isHalt()) {
        return;
      }
      if ($scope.madmax || $scope.doctor.faint) {
        return $scope.demad(e);
      }
      if (this.isLocked) {
        return;
      }
      if (this.isPalOn) {
        return;
      }
      $scope.dialog.finger.isOn = false;
      offset = $('#wrapper').offset();
      ref$ = [e.clientX || e.pageX, e.clientY || e.pageY], ex = ref$[0], ey = ref$[1];
      if (!ex && !ey) {
        ref$ = [e.touches[0].clientX, e.touches[0].clientY], ex = ref$[0], ey = ref$[1];
      }
      ref$ = this.last || (this.last = {});
      ref$.x = ex;
      ref$.y = ey;
      ref$ = (ref$ = [ex - offset.left, ey - offset.top], this.x = ref$[0], this.y = ref$[1], ref$), x = ref$[0], y = ref$[1];
      xp = x * 1024 / $('#wrapper').width();
      yp = y * 576 / $('#wrapper').height();
      target = $scope.hitmask.resolve(xp, yp);
      if (!target) {
        return;
      }
      if (target.type === 1) {
        if (target.variant === 0) {
          return;
        }
        pat = $scope.percent.sprite.points.filter(function(it){
          return it.type === 1;
        });
        max = 0;
        for (i$ = 0, len$ = pat.length; i$ < len$; ++i$) {
          item = pat[i$];
          if (item.variant > max) {
            max = item.variant;
          }
        }
        if (max === 3 && target.variant < max) {
          this.target = null;
          return;
        }
      }
      this.target = target;
      if (!target || target.type !== 1) {
        return;
      }
      $('#wheel').css({
        display: "block",
        top: y + "px",
        left: x + "px"
      });
      $scope.audio.blop();
      $scope.rebuild();
      this.timestamp = new Date().getTime();
      this.isPalOn = true;
      return e.preventDefault();
    },
    move: function(e){},
    up: function(e, touch){
      var now, ref$, ex, ey, this$ = this;
      touch == null && (touch = false);
      if (touchflag && !touch) {
        return;
      }
      if (isHalt()) {
        return;
      }
      if (this.isLocked || $scope.madmax || $scope.doctor.faint) {
        return;
      }
      now = new Date().getTime();
      ref$ = [e.clientX || e.pageX, e.clientY || e.pageY], ex = ref$[0], ey = ref$[1];
      if (!ex && !ey) {
        if (e.touches != null && e.touches.length) {
          ref$ = [e.touches[0].clientX, e.touches[0].clientY], ex = ref$[0], ey = ref$[1];
        } else if (e.changedTouches != null && e.changedTouches.length) {
          ref$ = [e.changedTouches[0].clientX, e.changedTouches[0].clientY], ex = ref$[0], ey = ref$[1];
        }
      }
      if (!ex && !ey) {
        ref$ = [this.last.x, this.last.y], ex = ref$[0], ey = ref$[1];
      }
      if (this.target && this.target.type === 1 && (Math.pow(ex - this.last.x, 2) + Math.pow(ey - this.last.y, 2) < 72 || now - this.timestamp < 100)) {
        return;
      }
      return setTimeout(function(){
        var offset, ref$, dx, dy, angle, type, mood;
        this$.isPalOn = false;
        $('#wheel').css({
          display: "none"
        });
        offset = $('#wrapper').offset();
        ref$ = [ex - this$.x - offset.left, ey - this$.y - offset.top], dx = ref$[0], dy = ref$[1];
        angle = Math.acos(dx / Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))) * 360 / (Math.PI * 2);
        if (dy > 0) {
          angle = 360 - angle;
        }
        if (angle >= 320 || angle <= 10) {
          type = 3;
        }
        if (angle > 10 && angle <= 61) {
          type = 2;
        }
        if (angle > 61 && angle < 112) {
          type = 1;
        }
        if (this$.target) {
          if (this$.target.type === 1) {
            if (this$.target.variant === type) {
              if (this$.target.variant === 1) {
                mood = Math.random() < 0.5
                  ? 2
                  : 4 + parseInt(Math.random() * 3);
                if (this$.forceMood != null) {
                  mood = this$.forceMood;
                }
                $scope.doctor.setMood(mood);
                $scope.audio.dindon();
                if (mood === 2) {
                  $scope.doctor.score.value += 1;
                }
              } else {
                if (!(this$.forceStay != null) && Math.random() < $scope.config.cur.prob.stay) {
                  $scope.doctor.setMood(3);
                  $scope.patient.add(parseInt(3 * Math.random() + 2));
                } else if (this$.forceStay) {
                  $scope.doctor.setMood(3);
                  $scope.patient.add(this$.forceStayType || 4, 2, this$.forceStayPos || 0);
                } else {
                  $scope.doctor.setMood(2);
                }
                $scope.audio.dindon();
                $scope.doctor.score.value += 1;
              }
              if (type === 3) {
                this$.target.variant = 0;
              }
            } else {
              $scope.doctor.fail();
            }
            if (type === 3) {
              $scope.patient.updateUrgent();
            }
            this$.target.variant = 0;
            $scope.rebuild();
          } else if (this$.target.type >= 2 && this$.target.type <= 4 && this$.target.variant) {
            if (this$.target.mad > 0.8) {
              this$.target.mad = 0.8;
            }
            (ref$ = this$.target).mad <= 0.8 || (ref$.mad = 0.8);
            this$.target.mad -= 0.2;
            (ref$ = this$.target).mad >= 0 || (ref$.mad = 0);
            $scope.audio.click2();
          } else if (this$.target.type >= 5 && this$.target.type <= 8 && this$.target.active) {
            $scope.doctor.energy += 0.1;
            (ref$ = $scope.doctor).energy <= 1 || (ref$.energy = 1);
            $scope.doctor.setMood(2);
            $scope.rebuild();
            this$.target.active = 0;
            this$.target.countdown = 1;
            $scope.audio.click2();
          }
        }
        return this$.target = null;
      }, 0);
    }
  };
  $scope.madmax = 0;
  $scope.demad = function(e){
    var prog, madmax, ref$, cur, sum, x$;
    $scope.dialog.finger.isOn = false;
    prog = 100;
    madmax = $scope.percent.sprite.points.filter(function(it){
      return it.ismad;
    });
    if (!madmax.length) {
      $scope.madmax = 0;
    }
    if (madmax.length) {
      (ref$ = madmax[0]).mad <= 0.8 || (ref$.mad = 0.8);
      madmax[0].mad -= 0.1;
      (ref$ = madmax[0]).mad >= 0 || (ref$.mad = 0);
      if (madmax[0].mad <= 0) {
        delete madmax[0].ismad;
      }
      cur = madmax.map(function(it){
        return 1 - it.mad;
      }).reduce(function(a, b){
        return a + b;
      }, 0);
      sum = madmax.length;
      prog = 100 * cur / sum;
    } else if ($scope.doctor.faint) {
      x$ = $scope.doctor;
      x$.energy += 0.1;
      x$.energy <= 1 || (x$.energy = 1);
      if ($scope.doctor.energy >= 0.9999) {
        $scope.doctor.faint = false;
      }
      prog = $scope.doctor.energy * 100;
    }
    e.preventDefault();
    $scope.audio.click2();
    $scope.doctor.demading = prog;
    return false;
  };
  $scope.rebuild();
  isHalt = function(){
    if (($scope.game.state !== 2 && $scope.game.state !== 3) || $scope.dialog.show === true) {
      return true;
    }
    if ($scope.danger) {
      return true;
    }
    return false;
  };
  $scope.madspeed = 0.002;
  $scope.$watch('madmax', function(it){
    if (it) {
      return $('#wheel').css({
        display: "none"
      });
    }
  });
  $scope.hitmask = {
    ready: false,
    get: function(x, y){
      if (!this.ready || !(x != null && y != null) || (isNaN(x) || isNaN(y))) {
        return [0, 0, 0, 0];
      }
      return this.ctx.getImageData(x, y, 1, 1).data;
    },
    resolve: function(x, y){
      var color, type, order;
      color = this.get(x, y);
      type = color[0];
      if (type === 8) {
        type = 5;
      }
      if (type === 0) {
        return null;
      } else if (type === 1) {
        order = color[1] * 4 + color[2];
      } else {
        order = color[2];
      }
      return $scope.percent.sprite.points.filter(function(it){
        return it.type === type;
      })[order];
    },
    init: function(){
      var x$, this$ = this;
      x$ = this.canvas = document.createElement("canvas");
      x$.height = 576;
      x$.width = 1024;
      this.ctx = this.canvas.getContext('2d');
      this.img = new Image();
      this.img.src = 'assets/img/mask.png';
      return this.img.onload = function(){
        this$.ctx.drawImage(this$.img, 0, 0, 1024, 576);
        return this$.ready = true;
      };
    }
  };
  $scope.hitmask.init();
  $scope.dialog = {
    tut: true,
    show: false,
    idx: 0,
    next: function(){
      var this$ = this;
      return $timeout(function(){
        return this$.main(true);
      }, 200);
    },
    type: "",
    h: {
      i: [],
      t: []
    },
    finger: {
      value: 1,
      isOn: false
    },
    reset: function(){
      var i$, ref$, len$, step, results$ = [];
      this.tut = true;
      this.show = false;
      this.idx = 0;
      this.type = "";
      this.finger = {
        value: 1,
        isOn: false
      };
      for (i$ = 0, len$ = (ref$ = this.step).length; i$ < len$; ++i$) {
        step = ref$[i$];
        step.fired = false;
        if (step.reset) {
          results$.push(step.reset());
        }
      }
      return results$;
    },
    skip: function(hold){
      var i$, ref$, len$, item;
      hold == null && (hold = false);
      $('#finger-slide').css({
        display: 'none'
      });
      $('#finger-tap').css({
        display: 'none'
      });
      for (i$ = 0, len$ = (ref$ = this.h.i).length; i$ < len$; ++i$) {
        item = ref$[i$];
        $interval.cancel(item);
      }
      for (i$ = 0, len$ = (ref$ = this.h.t).length; i$ < len$; ++i$) {
        item = ref$[i$];
        $timeout.cancel(item);
      }
      if (!hold) {
        this.clean();
      }
      if (this.idx === this.step.length - 2) {
        return this.next();
      } else {
        this.type = "";
        if (hold) {
          this.idx = this.step.length - 2;
          return this.toggle(0, true);
        }
      }
    },
    interval: function(func, delay){
      var ret;
      ret = $interval(func, delay);
      this.h.i.push(ret);
      return ret;
    },
    timeout: function(func, delay){
      var ret;
      ret = $timeout(func, delay);
      this.h.t.push(ret);
      return ret;
    },
    clean: function(){
      var ref$, x$;
      delete $scope.mouse.forceStay;
      delete $scope.mouse.forceMood;
      $scope.game.reset();
      ref$ = $scope.dialog;
      ref$.tut = false;
      ref$.idx = this.step.length - 1;
      $scope.mouse.unlock();
      $('#score').removeClass('hint');
      x$ = $scope.doctor;
      x$.chance = 5;
      x$.hurting = 0;
      x$.faint = false;
      x$.energy = 1;
      x$.setMood(2);
      $scope.game.setState(2);
      return $scope.game.countdown.start();
    },
    step: [
      {}, {
        ready: false,
        reset: function(){
          return this.ready = false;
        },
        check: function(){
          if (!this.ready && $scope.game.state === 3) {
            this.ready = true;
          }
          return this.ready;
        },
        fire: function(){
          $scope.mouse.forceStay = false;
          $scope.mouse.forceMood = 1;
          $scope.mouse.lock();
          $scope.dialog.timeout(function(){
            return $scope.patient.add(1, 1, 0);
          }, 800);
          $scope.dialog.timeout(function(){
            return $scope.patient.add(1, 2, 0);
          }, 1600);
          return $scope.dialog.timeout(function(){
            return $scope.patient.add(1, 3, 0);
          }, 2400);
        }
      }, {
        ready: false,
        reset: function(){
          return this.ready = false;
        },
        check: function(){
          var this$ = this;
          if (this.ready) {
            return true;
          }
          if ($scope.percent.sprite.points.filter(function(it){
            return it.type === 1 && it.variant === 3;
          }).length > 0) {
            $scope.dialog.timeout(function(){
              return this$.ready = true;
            }, 1000);
          }
          return false;
        }
      }, {
        check: function(){
          return true;
        }
      }, {
        check: function(){
          return true;
        },
        fire: function(){
          $('#finger-slide').css({
            display: 'block',
            top: '33%',
            left: '22%'
          });
          return setTimeout(function(){
            $('#finger-slide').css({
              display: 'none'
            });
            return $scope.mouse.unlock();
          }, 3000);
        }
      }, {
        reset: function(){
          return this.handler = null, this;
        },
        check: function(){
          var ret, this$ = this;
          if ($scope.doctor.chance < 5) {
            $('#oops').css({
              display: 'block'
            });
            $scope.doctor.chance = 5;
            $scope.patient.reset();
            $scope.patient.add(1, 1, 0);
            $scope.patient.add(1, 2, 0);
            $scope.patient.add(1, 3, 0);
            setTimeout(function(){
              return $('#oops').css({
                display: 'none'
              });
            }, 1000);
          }
          ret = $scope.percent.sprite.points.filter(function(it){
            return it.type === 1 && it.variant !== 0;
          }).length === 0;
          if (ret && $scope.doctor.chance === 5) {
            $scope.dialog.type = 'mini';
            this.handler = $scope.dialog.timeout(function(){
              $scope.doctor.hurting = 1;
              return this$.handler = null;
            }, 500);
          }
          return ret;
        },
        fire: function(){
          var ref$;
          ref$ = $scope.doctor;
          ref$.chance = 5;
          ref$.hurting = 0;
          if (this.handler) {
            return $timeout.cancel(this.handler);
          }
        }
      }, {
        check: function(){
          $('#score').addClass('hint');
          return true;
        },
        fire: function(){
          return $('#score').removeClass('hint');
        }
      }, {
        mood: 0,
        reset: function(){
          return this.handler = null, this.mood = 0, this;
        },
        check: function(){
          var this$ = this;
          if (!(this.handler != null)) {
            this.handler = $scope.dialog.interval(function(){
              $scope.doctor.setMood(this$.mood + 4);
              $scope.rebuild();
              return this$.mood = (this$.mood + 1) % 3;
            }, 500);
          }
          return true;
        },
        fire: function(){
          $scope.doctor.setMood(1);
          $scope.rebuild();
          $interval.cancel(this.handler);
          $scope.mouse.forceStay = true;
          return $scope.patient.add(1, 2, 0);
        }
      }, {
        mood: 3,
        ready: false,
        handler: null,
        moodHandler: null,
        reset: function(){
          return this.handler = null, this.moodHandler = null, this.ready = false, this.mood = 3, this;
        },
        check: function(){
          var hasPat2, hasPat1, this$ = this;
          if ($scope.doctor.chance < 5) {
            $('#oops').css({
              display: 'block'
            });
            $scope.doctor.chance = 5;
            $scope.patient.reset();
            setTimeout(function(){
              return $('#oops').css({
                display: 'none'
              });
            }, 800);
          }
          hasPat2 = $scope.percent.sprite.points.filter(function(it){
            return (it.type === 2 || it.type === 4) && it.variant > 0;
          }).length;
          $scope.mouse.forceStayType = hasPat2 ? 2 : 4;
          hasPat1 = $scope.percent.sprite.points.filter(function(it){
            return it.type === 1 && it.variant === 2;
          }).length > 0;
          if (hasPat2 > 1 && this.handler == null) {
            this.handler = $scope.dialog.timeout(function(){
              return this$.ready = true;
            }, 1000);
          }
          if (hasPat2 < 2 && !hasPat1) {
            $scope.patient.add(1, 2, parseInt(1 + Math.random() * 4));
          }
          if (this.ready && !this.moodHandler) {
            this.moodHandler = $scope.dialog.interval(function(){
              $scope.doctor.setMood(this$.mood);
              $scope.rebuild();
              return this$.mood = 4 - this$.mood;
            }, 500);
          }
          return this.ready;
        },
        fire: function(){
          var ref$;
          $interval.cancel(this.moodHandler);
          ref$ = $scope.dialog.finger;
          ref$.isOn = true;
          ref$.y = [344, 266];
          ref$.x = [750, 1000];
          ref$.small = true;
          $scope.madspeed = 0.015;
          return $scope.dialog.timeout(function(){
            var ref$;
            return ref$ = $scope.dialog.finger, ref$.isOn = false, ref$.small = false, ref$;
          }, 2300);
        }
      }, {
        ready: false,
        handler: null,
        reset: function(){
          return this.handler = null, this.ready = false, this;
        },
        check: function(){
          var this$ = this;
          if ($scope.madspeed === 0.015 && !$scope.dialog.finger.isOn && !this.handler) {
            this.handler = $scope.dialog.timeout(function(){
              return this$.ready = true;
            }, 1000);
          }
          return this.ready;
        },
        fire: function(){
          $scope.madspeed = 0.04;
          return $scope.mouse.lock();
        }
      }, {
        ready: false,
        reset: function(){
          return this.ready = false;
        },
        check: function(){
          if ($scope.madmax) {
            this.ready = true;
          }
          return this.ready;
        }
      }, {
        launched: 0,
        supply: 0,
        ready: false,
        reset: function(){
          return this.launched = 0, this.supply = 0, this.ready = false, this.handler = null, this;
        },
        check: function(){
          var ref$, this$ = this;
          if ($scope.madmax >= 1 && this.launched === 0) {
            this.launched = 1;
            ref$ = $scope.dialog.finger;
            ref$.isOn = true;
            ref$.y = 197.4;
            ref$.x = 351;
            $scope.madspeed = 0.002;
          }
          if ($scope.madspeed === 0.002 && $scope.madmax < 1 && this.launched === 1) {
            this.launched = 2;
            $scope.percent.sprite.points.filter(function(it){
              return it.type === 4;
            })[0].mad = 0;
            $scope.dialog.timeout(function(){
              this$.handler = $scope.dialog.interval(function(){
                $scope.supply.active(this$.supply, false);
                this$.supply = (this$.supply + 1) % 3;
                return $scope.supply.active(this$.supply);
              }, 500);
              return this$.ready = true;
            }, 1000);
          }
          return this.ready;
        },
        fire: function(){
          var ref$;
          $interval.cancel(this.handler);
          $scope.supply.active(0, false);
          $scope.supply.active(1, true);
          $scope.supply.active(2, false);
          ref$ = $scope.dialog.finger;
          ref$.isOn = true;
          ref$.y = 46.06;
          ref$.x = 234;
          return $scope.dialog.timeout(function(){
            return $scope.mouse.unlock();
          }, 1000);
        }
      }, {
        ready: false,
        handler: false,
        reset: function(){
          return this.handler = null, this.ready = false, this;
        },
        check: function(){
          var this$ = this;
          if (!this.handler) {
            this.handler = $scope.dialog.timeout(function(){
              this$.ready = true;
              $scope.supply.active(1, false);
              $scope.doctor.setMood(7);
              $scope.rebuild();
              return $scope.doctor.energy -= 0.1;
            }, 3000);
          }
          return this.ready;
        },
        fire: function(){}
      }, {
        check: function(){
          return true;
        },
        fire: function(){
          var ref$;
          $scope.doctor.energy = 0;
          $scope.doctor.faint = true;
          $scope.doctor.demading = 0;
          return ref$ = $scope.dialog.finger, ref$.isOn = true, ref$.y = 131.6, ref$.x = 351, ref$;
        }
      }, {
        ready: false,
        reset: function(){
          return this.ready = false, this.handler = null, this;
        },
        check: function(){
          var this$ = this;
          if (this.handler == null && $scope.doctor.energy >= 0.999 && $scope.doctor.faint === false) {
            this.handler = $scope.dialog.timeout(function(){
              $scope.dialog.type = "";
              return this$.ready = true;
            }, 1000);
          }
          return this.ready;
        }
      }, {
        check: function(){
          return true;
        },
        fire: function(){
          return $scope.dialog.clean();
        }
      }, {
        check: function(){
          return false;
        }
      }
    ],
    main: function(force){
      force == null && (force = false);
      if (force && this.step[this.idx] && this.step[this.idx].fire && !this.step[this.idx].fired) {
        this.step[this.idx].fire();
        this.step[this.idx].fired = true;
      }
      if (this.show && !force) {
        return;
      }
      if (this.step[this.idx + 1] && this.step[this.idx + 1].check()) {
        return this.toggle(this.idx + 1, true);
      } else {
        return this.toggle(0, false);
      }
    },
    toggle: function(idx, isOn){
      var this$ = this;
      if (idx) {
        this.idx = idx;
      }
      return setTimeout(function(){
        if (!(isOn != null)) {
          this$.show = !this$.show;
        } else {
          this$.show = isOn;
        }
        if (this$.show) {
          $('#dialog').fadeIn();
          return $scope.audio.menu();
        } else {
          return $('#dialog').fadeOut();
        }
      }, 0);
    }
  };
  $scope.scream = gajus.Scream({
    width: {
      portrait: 320,
      landscape: 480
    }
  });
  $scope.dimension = {
    update: function(){
      var ref$, docW, docH, cvsW, cvsH, w1, h1, w2, h2, w, h;
      ref$ = [$(window).width(), $(window).height()], docW = ref$[0], docH = ref$[1];
      ref$ = [1024, 576], cvsW = ref$[0], cvsH = ref$[1];
      ref$ = docW < 1024
        ? [docW, docW * 576 / 1024]
        : [1024, 576], w1 = ref$[0], h1 = ref$[1];
      ref$ = docH < 576
        ? [docH * 1024 / 576, docH]
        : [1024, 576], w2 = ref$[0], h2 = ref$[1];
      ref$ = h1 > docH
        ? [w2, h2]
        : [w1, h1], w = ref$[0], h = ref$[1];
      w *= 0.9;
      h *= 0.9;
      this.w = w;
      this.h = h;
      $('#frame').css({
        width: w + "px",
        height: h + "px"
      });
      $('#container').css({
        width: w + "px"
      });
      $('body').css({
        overflow: 'hidden'
      });
      if (docW < docH) {
        this.portrait = true;
        if ($scope.game.state === 2) {
          $scope.game.pause();
        }
      } else {
        this.portrait = false;
      }
      if (this.portrait) {
        $('#frame').css({
          padding: 0,
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%'
        });
        $('#wrapper').css({
          width: '100%',
          height: '100%',
          top: '0',
          left: '0'
        });
      } else {
        if (docH - h <= 110) {
          $('#frame').css({
            padding: '0',
            position: 'fixed',
            top: (docH - h) / 2 + "px",
            left: (docW - w) / 2 + "px"
          });
          $('#wrapper').css({
            width: w + "px",
            height: h + "px",
            top: '0',
            left: '0'
          });
          $('#head').css({
            display: 'none'
          });
          $('#foot').css({
            display: 'none'
          });
        } else {
          $('#frame').css({
            padding: '10px',
            position: 'relative',
            top: 'auto',
            left: 'auto',
            height: (h + 10) + "px"
          });
          $('#wrapper').css({
            width: (w - 20) + "px",
            height: (h - 10) + "px",
            top: '10px',
            left: '10px'
          });
          $('#head').css({
            display: 'block'
          });
          $('#foot').css({
            display: 'block'
          });
        }
      }
      $('#prehide').css('display', 'none');
      if ($scope.canvas && $scope.canvas.e) {
        return $scope.canvas.update();
      }
    },
    portrait: false,
    rotate: function(){}
  };
  $scope.dimension.update();
  window.onresize = function(){
    return $scope.$apply(function(){
      return $scope.dimension.update();
    });
  };
  document.ontouchmove = function(e){
    if ($scope.isPad || $scope.ismin) {
      return e.preventDefault();
    }
  };
  $scope.progress = {
    value: 0,
    latest: 0,
    use: null,
    count: {
      total: 0,
      current: 0,
      update: function(){}
    },
    size: {
      total: 0,
      current: 0,
      group: {},
      update: function(name, value){
        var ref$, list, res$, k, v;
        $scope.progress.setUse('size');
        import$((ref$ = this.group)[name] || (ref$[name] = {}), value);
        res$ = [];
        for (k in ref$ = this.group) {
          v = ref$[k];
          res$.push(v);
        }
        list = res$;
        this.total = list.reduce(function(a, b){
          return a + b.total;
        }, 0);
        return this.current = list.reduce(function(a, b){
          return a + b.current;
        }, 0);
      }
    },
    setUse: function(it){
      return this.use = this[it];
    },
    handler: null,
    transition: function(){
      var ref$, ref1$, this$ = this;
      if (this.value >= 100) {
        $timeout(function(){
          return $scope.loading = false;
        }, 1000);
      }
      if (this.value >= this.latest) {
        return this.handler = null;
      }
      this.value = (ref$ = this.value + 3) < (ref1$ = this.latest) ? ref$ : ref1$;
      return this.handler = $timeout(function(){
        return this$.transition();
      }, 10);
    },
    update: function(){
      this.latest = parseInt(100 * (this.count.current + this.size.current) / (this.count.total + this.size.total));
      if (!this.handler) {
        return this.transition();
      }
    }
  };
  $scope.$watch('progress.count', function(){
    return $scope.progress.update();
  }, true);
  $scope.$watch('progress.size', function(){
    return $scope.progress.update();
  }, true);
  $scope.debug = {
    d1: 0,
    d2: 0
  };
  interval = {
    spawn: function(){
      var ref$, time, r;
      if ($scope.dialog.tut || !((ref$ = $scope.game.state) === 1 || ref$ === 2 || ref$ === 4)) {
        return;
      }
      time = new Date().getTime() / 1000 - $scope.audio.bkt;
      if (time <= 60) {
        $scope.config.cur = $scope.config.mode[$scope.mode][0];
      } else if (time <= 98) {
        $scope.config.cur = $scope.config.mode[$scope.mode][1];
      } else if (time <= 120) {
        $scope.config.cur = $scope.config.mode[$scope.mode][2];
      } else {
        $scope.config.cur = $scope.config.mode[$scope.mode][3];
      }
      $scope.debug.d2 = time;
      $scope.debug.d3 = $scope.config.cur.prob.pat[2];
      if (time >= 98 && time <= 101 && $scope.game.state === 2) {
        $scope.danger = true;
      } else if (time <= 120) {
        $scope.danger = false;
      }
      if (isHalt()) {
        return;
      }
      r = Math.random();
      if (r < $scope.config.cur.prob.pat[0]) {
        $scope.patient.add(1);
      }
      if (Math.random() < $scope.config.cur.prob.sup) {
        $scope.supply.active();
      }
      if ($scope.percent.sprite.points.filter(function(it){
        return it.type === 1 && it.variant !== 0;
      }).length === 0 && Math.random() > 0.8) {
        $scope.patient.add(1);
      }
      return $scope.madspeed = $scope.config.cur.decay.mad;
    },
    drain: function(it){
      var ref$, inqueue, die, i$, len$, madmax, results$ = [];
      if (isHalt()) {
        return;
      }
      if ($scope.doctor.hurting) {
        $scope.doctor.hurting -= 0.2;
        (ref$ = $scope.doctor).hurting >= 0 || (ref$.hurting = 0);
      }
      if ($scope.doctor.draining) {
        $scope.doctor.draining -= 0.2;
        (ref$ = $scope.doctor).draining >= 0 || (ref$.draining = 0);
      }
      inqueue = $scope.percent.sprite.points.filter(function(it){
        return it.type === 1 && it.variant > 0;
      });
      die = false;
      for (i$ = 0, len$ = inqueue.length; i$ < len$; ++i$) {
        it = inqueue[i$];
        it.life -= $scope.config.cur.decay.life * it.variant;
        if (it.life <= 0) {
          it.life = 0;
          $scope.doctor.fail();
          it.variant = 0;
          die = true;
        }
      }
      if (die) {
        $scope.patient.updateUrgent();
      }
      inqueue = $scope.percent.sprite.points.filter(function(it){
        var ref$;
        return ((ref$ = it.type) === 2 || ref$ === 3 || ref$ === 4) && it.variant > 0;
      });
      madmax = 0;
      for (i$ = 0, len$ = inqueue.length; i$ < len$; ++i$) {
        it = inqueue[i$];
        if (!(it.mad != null)) {
          it.mad = 0;
        }
        it.mad += $scope.madspeed;
        if (it.mad >= 0.8) {
          it.mad = 1;
          it.ismad = true;
          madmax = 1;
        }
      }
      if (madmax && !$scope.madmax) {
        $scope.madmax = parseInt(Math.random() * 2 + 1);
        $scope.doctor.demading = 0;
      }
      if (!$scope.doctor.faint) {
        inqueue = $scope.percent.sprite.points.filter(function(it){
          var ref$;
          return ((ref$ = it.type) === 5 || ref$ === 6 || ref$ === 7 || ref$ === 8) && it.active;
        });
        for (i$ = 0, len$ = inqueue.length; i$ < len$; ++i$) {
          it = inqueue[i$];
          if (!(it.countdown != null) || it.countdown <= 0) {
            it.countdown = 1;
          }
          it.countdown -= $scope.config.cur.decay.sup;
          if (it.countdown <= 0) {
            it.countdown = 1;
            it.active = 0;
            results$.push($scope.doctor.drain());
          }
        }
        return results$;
      }
    },
    tweak: function(){
      var ref$, w, h, isPad, ismin;
      ref$ = [$(window).width(), $(window).height()], w = ref$[0], h = ref$[1];
      if ($scope.game.state === 3) {
        $scope.dialog.main();
      }
      isPad = /iPad/.exec(navigator.platform) ? true : false;
      try {
        ismin = $scope.scream.isMinimalView();
        $scope.debug.d1 = ismin;
      } catch (e$) {}
      if ($scope.ismin && !ismin && !isPad) {
        document.body.scrollTop = 0;
        $('#minimal-fix').css({
          display: 'block'
        });
      }
      $scope.ismin = ismin;
      $scope.isPad = isPad;
      if (w !== this.w || h !== this.h) {
        $scope.dimension.update();
      }
      return ref$ = {
        w: this.w,
        h: this.h
      }, ref$.w = w, ref$.h = h, ref$;
    }
  };
  $interval(function(){
    interval.spawn();
    interval.drain();
    return interval.tweak();
  }, 100);
  $scope.loading = true;
  $scope.$watch('loading', function(it){
    if (!it) {
      return $('#loading').fadeOut();
    }
  });
  x$ = document.body;
  x$.ontouchstart = window.touch.down;
  x$.ontouchmove = window.touch.move;
  x$.ontouchend = window.touch.up;
  $scope.assets = {
    fetch: function(url, type, cb){
      var t1, request, this$ = this;
      t1 = new Date().getTime();
      $scope.progress.count.total++;
      request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.onprogress = function(e){
        return $scope.$apply(function(){
          return $scope.progress.size.update(url, {
            current: e.loaded,
            total: e.total
          });
        });
      };
      request.onload = function(){
        return $scope.$apply(function(){
          var ref$, str, buf, i$, to$, i, ret, t2;
          ref$ = ["", new Zlib.Gunzip(new Uint8Array(request.response)).decompress()], str = ref$[0], buf = ref$[1];
          for (i$ = 0, to$ = buf.length; i$ < to$; ++i$) {
            i = i$;
            str += String.fromCharCode(buf[i]);
          }
          ret = this$.parse(JSON.parse(str), type);
          cb(ret);
          t2 = new Date().getTime();
          $scope.progress.count.current++;
          return console.log("[assets] Process " + url + " spent " + (t2 - t1) + " ms.");
        });
      };
      return request.send();
    },
    parse: function(d, type){
      var ret, k, v, data, buf, array, i$, to$, i, blob;
      ret = {
        url: {},
        buf: {}
      };
      for (k in d) {
        v = d[k];
        data = atob(v);
        buf = new ArrayBuffer(data.length);
        array = new Uint8Array(buf);
        for (i$ = 0, to$ = data.length; i$ < to$; ++i$) {
          i = i$;
          array[i] = data.charCodeAt(i);
        }
        blob = new Blob([array], {
          type: type
        });
        ret.buf[k] = buf;
        ret.url[k] = $sce.trustAsResourceUrl(URL.createObjectURL(blob));
      }
      return ret;
    }
  };
  $scope.audio = {
    s: {},
    buf: {},
    names: ['click', 'count1', 'count2', 'blop', 'die', 'menu', 'dindon', 'born', 'click2', 'bkloop', 'bk', 'noop'],
    reset: function(){
      var i$, ref$, len$, item, ref1$;
      for (i$ = 0, len$ = (ref$ = this.names).length; i$ < len$; ++i$) {
        item = ref$[i$];
        this[item].pause(true);
      }
      this.bkt = 0;
      if (this.bk) {
        delete this.bk.pausetime;
        return ref1$ = (ref$ = this.bk).starttime, delete ref$.starttime, ref1$;
      }
    },
    n: {},
    bkt: 0,
    isMute: false,
    toggleMute: function(){
      this.isMute = !this.isMute;
      return this.gain.gain.value = this.isMute ? 0 : 1;
    },
    player: function(name){
      var ret, this$ = this;
      ret = function(offset, looping, reset){
        var src;
        looping == null && (looping = false);
        reset == null && (reset = false);
        if (reset) {
          delete ret.pausetime;
        } else if (ret.pausetime) {
          offset = ret.pausetime - ret.starttime;
          delete ret.pausetime;
        }
        ret.starttime = parseInt(new Date().getTime() / 1000) - (offset != null ? offset : 0);
        if (name === 'bk') {
          this$.bkt = ret.starttime;
        }
        if (!this$.buf[name]) {
          return;
        }
        if (this$.n[name]) {
          this$.n[name].disconnect();
        }
        this$.n[name] = src = this$.context.createBufferSource();
        src.buffer = this$.buf[name];
        src.connect(this$.gain);
        if (looping) {
          src.loop = true;
        }
        if (offset != null) {
          return src.start(0, offset);
        } else {
          return src.start(0);
        }
      };
      ret.pause = function(reset){
        var e;
        reset == null && (reset = false);
        if (this$.n[name]) {
          try {
            this$.n[name].stop(0);
          } catch (e$) {
            e = e$;
          }
        }
        if (!reset) {
          return ret.pausetime = parseInt(new Date().getTime() / 1000);
        }
      };
      return ret;
    },
    init: function(){
      var AudioContext, dummy, i$, ref$, len$, item, this$ = this;
      AudioContext = window.AudioContext || window.webkitAudioContext;
      if (/Android.+Firefox.+/.exec(navigator.userAgent)) {
        AudioContext = null;
      }
      if (!AudioContext) {
        dummy = function(name){
          var ret;
          ret = function(offset, looping){
            looping == null && (looping = false);
            if (ret.pausetime) {
              offset = ret.pausetime - ret.starttime;
              delete ret.pausetime;
            }
            ret.starttime = parseInt(new Date().getTime() / 1000) - (offset != null ? offset : 0);
            if (name === 'bk') {
              return this$.bkt = ret.starttime;
            }
          };
          ret.pause = function(reset){
            reset == null && (reset = false);
            if (!reset) {
              return ret.pausetime = parseInt(new Date().getTime() / 1000);
            }
          };
          return ret;
        };
        for (i$ = 0, len$ = (ref$ = this.names).length; i$ < len$; ++i$) {
          item = ref$[i$];
          this[item] = dummy(item);
          this.s[item] = {
            pause: fn$
          };
        }
        return;
      }
      $scope.progress.count.total += this.names.length;
      this.context = new AudioContext();
      this.gain = this.context.createGain();
      this.gain.connect(this.context.destination);
      return $scope.assets.fetch('assets/snd/snd.gz', 'audio/mpeg', function(arg$){
        var url, buf, decode, i$, ref$, len$, ref1$, name, key;
        url = arg$.url, buf = arg$.buf;
        decode = function(name, key){
          return this$.context.decodeAudioData(buf[key], function(ret){
            return this$.buf[name] = ret;
          }, function(){
            return console.log('fail');
          });
        };
        for (i$ = 0, len$ = (ref$ = this$.names.map(fn$)).length; i$ < len$; ++i$) {
          ref1$ = ref$[i$], name = ref1$[0], key = ref1$[1];
          this$[name] = this$.player(name);
          decode(name, key);
        }
        return $scope.progress.count.current += this$.names.length;
        function fn$(it){
          return [it, "snd/" + it + ".mp3"];
        }
      });
      function fn$(){}
    }
  };
  $scope.image = {
    url: {},
    img: {},
    zoom: {},
    init: function(){
      var isEn, imgAssets, this$ = this;
      $scope.progress.count.total++;
      $scope.progress.update();
      isEn = /en/.exec(window.location.search || (navigator.languages || [])[0] || navigator.language || "en");
      if (/zh/.exec(window.location.search)) {
        isEn = false;
      }
      imgAssets = isEn ? 'assets/img/img-en.gz' : 'assets/img/img-zh.gz';
      return $scope.assets.fetch(imgAssets, 'image/png', function(arg$){
        var url, buf, ref$, imgs, bks, k, v, i$, to$, idx, item, src, des, img;
        url = arg$.url, buf = arg$.buf;
        ref$ = [$('img.src'), $('.img-bk')], imgs = ref$[0], bks = ref$[1];
        this$.url = {};
        for (k in url) {
          v = url[k];
          this$.url["assets/" + k] = v;
        }
        for (i$ = 0, to$ = imgs.length; i$ < to$; ++i$) {
          idx = i$;
          item = $(imgs[idx]);
          src = item.attr('data-src');
          des = this$.url[src];
          if (des != null) {
            item.attr('src', des.toString());
          }
        }
        for (i$ = 0, to$ = bks.length; i$ < to$; ++i$) {
          idx = i$;
          item = $(bks[idx]);
          src = item.attr('data-src');
          item.css({
            "background-image": "url(" + this$.url[src].toString() + ")"
          });
        }
        for (k in ref$ = this$.url) {
          v = ref$[k];
          $scope.progress.count.total++;
          this$.img[k] = img = new Image();
          img.src = v.toString();
          img.onload = fn$;
        }
        $timeout(function(){
          return $scope.progress.count.current++;
        }, 100);
        return $scope.$watch('loading', function(){
          return $scope.canvas.init();
        });
        function fn$(){
          return $scope.progress.count.current++;
        }
      });
    }
  };
  $scope.audio.init();
  $scope.image.init();
  vizchange = [['hidden', 'visibilitychange'], ['mozHidden', 'mozvisibilitychange'], ['msHidden', 'msvisibilitychange'], ['webkitHidden', 'webkitvisibilitychange']].filter(function(it){
    return document[it[0]] != null;
  })[0];
  if (vizchange) {
    document.addEventListener(vizchange[1], function(){
      if (document[vizchange[0]]) {
        return $scope.game.pause();
      }
    }, false);
    document.addEventListener('pagehide', function(){
      return $scope.game.pause();
    }, false);
  }
  $scope.canvas = {
    e: null,
    ctx: null,
    init: function(){
      var this$ = this;
      this.e = document.getElementById('main-canvas');
      this.ctx = this.e.getContext('2d');
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.mozImageSmoothingEnabled = true;
      this.ctx.webkitImageSmoothingEnabled = true;
      this.ctx.msImageSmoothingEnabled = true;
      if ($scope.usedom) {
        return;
      }
      this.update();
      if (!this.handler) {
        return this.handler = $interval(function(){
          return this$.draw();
        }, 100);
      }
    },
    update: function(){
      var ref$, w, h;
      if (!this.e) {
        return this.init();
      }
      ref$ = {
        w: (ref$ = $scope.dimension).w,
        h: ref$.h
      }, w = ref$.w, h = ref$.h;
      ref$ = [w / 100, h / 100], w = ref$[0], h = ref$[1];
      if (this.w === w && this.h === h) {
        return;
      }
      ref$ = this.e;
      ref$.width = 1170;
      ref$.height = 658;
      ref$ = this.e.style;
      ref$.width = w * 100 + "px";
      ref$.height = h * 100 + "px";
      return this.w = w, this.h = h, this;
    },
    draw: function(it){
      var img, i$, ref$, len$, dim, des, ts, mod, mw, mh, mx, my, img1, img2, f, to$, i, results$ = [];
      this.ctx.fillStyle = "rgba(0,0,0,0.0)";
      this.ctx.fillRect(0, 0, 1170, 658);
      img = $scope.image.img["assets/img/scenario.png"];
      this.ctx.drawImage(img, 0, 0, 1170, 658);
      for (i$ = 0, len$ = (ref$ = $scope.percent.sprite.points).length; i$ < len$; ++i$) {
        it = ref$[i$];
        img = $scope.image.img["assets/img/it-" + it.type + "-" + (it.variant || 0) + "-0.png"];
        dim = $scope.percent.sprite.size[it.type];
        des = {
          w: dim.w * 11.70,
          h: dim.h * 6.58,
          x: it.x * 11.70,
          y: it.y * 6.58
        };
        this.ctx.drawImage(img, des.x, des.y, des.w, des.h);
        if (it.active) {
          img = $scope.image.img["assets/img/it-" + it.type + "-" + (it.variant || 0) + "-1.png"];
          if (it.type === 1) {
            if (it.life < 1) {
              this.ctx.drawImage(img, 0, 0, img.width, (1 - it.life) * img.height, des.x, des.y, des.w, (1 - it.life) * des.h);
            }
          } else if (it.type <= 4) {
            if (it.mad > 0) {
              this.ctx.drawImage(img, 0, (1 - it.mad) * img.height, img.width, it.mad * img.height, des.x, des.y + (1 - it.mad) * des.h, des.w, it.mad * des.h);
            }
          } else if (it.type >= 5) {
            this.ctx.drawImage(img, 0, 0, img.width, img.height, des.x, des.y, des.w, des.h);
          }
        }
      }
      if ($scope.doctor.faint || $scope.madmax || ($scope.dialog.show && !$scope.dialog.type) || $scope.game.state === 5) {
        this.ctx.fillStyle = "rgba(65,65,65,0.7)";
        this.ctx.fillRect(0, 0, 1170, 658);
      }
      if ($scope.patient.urgent) {
        img = $scope.image.img["assets/img/urgency.png"];
        this.ctx.drawImage(img, 0, 0, 1170, 658);
      }
      if ($scope.doctor.faint || $scope.madmax) {
        ts = parseInt(new Date().getTime() / 250);
        mod = ts % 2 + 1;
        ref$ = [11.70 * 35.5, 11.70 * 35.5], mw = ref$[0], mh = ref$[1];
        ref$ = [(1170 - mw) * 0.6, (658 - mh) * 0.4], mx = ref$[0], my = ref$[1];
        if ($scope.doctor.faint && !$scope.madmax) {
          img = $scope.image.img["assets/img/mad/hungry" + mod + ".png"];
        } else if ($scope.madmax === 1) {
          img = $scope.image.img["assets/img/mad/gangster" + mod + ".png"];
        } else {
          img = $scope.image.img["assets/img/mad/hysteria" + mod + ".png"];
        }
        this.ctx.drawImage(img, mx, my, mw, mh);
      }
      if ($scope.dialog.show) {
        img1 = $scope.image.img["assets/img/tutorial/" + $scope.dialog.idx + ".png"];
        img2 = $scope.image.img["assets/img/tutorial/doctor.png"];
        if ($scope.dialog.type === 'mini') {
          this.ctx.drawImage(img1, 386.1, 263.2, 514.8, 263.853);
        } else {
          this.ctx.drawImage(img1, 81.9, 85.54, 702, 490.249);
          this.ctx.drawImage(img2, 819, 111.86, 234, 433.45);
        }
      }
      if ($scope.game.state === 5) {
        img = $scope.image.img["assets/img/countdown/" + ($scope.game.countdown.value - 1 || 'go') + ".png"];
        this.ctx.drawImage(img, 409.5, 148.5, 351, 351);
      }
      if ($scope.dialog.finger.isOn) {
        ts = parseInt(new Date().getTime() / 100);
        mod = ts % 2 + 1;
        f = $scope.dialog.finger;
        if (f.small) {
          img = $scope.image.img["assets/img/mad/click-" + mod + ".png"];
          if (f.x.length) {
            for (i$ = 0, to$ = f.x.length; i$ < to$; ++i$) {
              i = i$;
              results$.push(this.ctx.drawImage(img, f.x[i], f.y[i], 70.2, 114.426));
            }
            return results$;
          } else {
            return this.ctx.drawImage(img, f.x, f.y, 70.2, 114.426);
          }
        } else {
          img = $scope.image.img["assets/img/tutorial/finger" + mod + ".png"];
          return this.ctx.drawImage(img, f.x, f.y, 292.5, 292.5);
        }
      }
    }
  };
  $scope.usedom = false;
  args = {
    app_id: '646775858745770',
    display: 'popup',
    caption: 'www.twreporter.org',
    picture: 'http://0media.tw/p/ergame/assets/img/thumbnail.jpg',
    link: 'http://0media.tw/p/ergame/',
    redirect_uri: 'http://0media.tw/p/ergame/',
    description: "一款富含真實情境的經典急診室經營夢幻之作，為台灣第一個急診室新聞遊戲。遊戲背景鎖定在台灣的一間大型醫學中心，面對健保體制的崩壞、沒膽改革的政府以及愛跑大醫院看病的人民，擁有拯救急診室命運能力的鍵盤醫師，將在一次又一次的真實的醫療突發狀況中突圍，試圖拯救病患的生命。你，將在人類的極限體力、醫生的使命和病患的生命中作出抉擇，準備好了嗎？"
  };
  return $scope.share = {
    updateRank: function(){
      var score, rank, title, obj, k, v;
      score = $scope.doctor.score.value;
      rank = $scope.doctor.rank;
      title = ['見習醫生', '實習醫生', '住院醫生', '總住院醫生', '研究醫生', '主治醫生', '醫龍'];
      obj = {
        app_id: '646775858745770',
        display: 'popup',
        caption: "急診人生 - 三分鐘的急診室醫師人生 / 報導者 x 0media",
        picture: "http://0media.tw/p/ergame/rank/s" + score + ".png",
        link: 'http://0media.tw/p/ergame/',
        name: "我在急診人生救了 " + score + " 個人，獲得「" + title[rank] + "」稱號！",
        redirect_uri: 'http://0media.tw/p/ergame/',
        description: "一款富含真實情境的經典急診室經營夢幻之作，為台灣第一個急診室新聞遊戲。遊戲背景鎖定在台灣的一間大型醫學中心，面對健保體制的崩壞、沒膽改革的政府以及愛跑大醫院看病的人民，擁有拯救急診室命運能力的鍵盤醫師，將在一次又一次的真實的醫療突發狀況中突圍，試圖拯救病患的生命。你，將在人類的極限體力、醫生的使命和病患的生命中作出抉擇，準備好了嗎？"
      };
      return this.rank = (function(){
        var ref$, results$ = [];
        for (k in ref$ = obj) {
          v = ref$[k];
          results$.push(k + "=" + encodeURIComponent(v));
        }
        return results$;
      }()).join('&');
    },
    game: (function(){
      var ref$, results$ = [];
      for (k in ref$ = args) {
        v = ref$[k];
        results$.push(k + "=" + encodeURIComponent(v));
      }
      return results$;
    }()).join('&'),
    link: encodeURIComponent('http://0media.tw/p/ergame/'),
    rank: ""
  };
}));
window.ctrl = {
  _s: null,
  scope: function(){
    var that;
    if (that = this._s) {
      return that;
    }
    return this._s = angular.element('body').scope();
  },
  wrap: function(isTouch, callback){
    if (!isTouch && touchflag) {
      return;
    }
    return this.scope().$apply(function(){
      return callback();
    });
  },
  next: function(isTouch){
    var this$ = this;
    isTouch == null && (isTouch = false);
    return this.wrap(isTouch, function(){
      this$.scope().dialog.next();
      return this$.scope().audio.click();
    });
  },
  skip: function(isTouch, event, hold){
    var this$ = this;
    isTouch == null && (isTouch = false);
    hold == null && (hold = true);
    return this.wrap(isTouch, function(){
      this$.scope().dialog.skip(hold);
      this$.scope().audio.click();
      return event.preventDefault();
    });
  },
  pause: function(isTouch, event){
    var this$ = this;
    isTouch == null && (isTouch = false);
    return this.wrap(isTouch, function(){
      this$.scope().game.pause();
      this$.scope().audio.click();
      return event.preventDefault();
    });
  },
  mute: function(isTouch, event){
    var this$ = this;
    isTouch == null && (isTouch = false);
    return this.wrap(isTouch, function(){
      this$.scope().audio.toggleMute();
      event.preventDefault();
      return event.cancelBubble = true;
    });
  },
  replay: function(isTouch, event){
    var this$ = this;
    isTouch == null && (isTouch = false);
    return this.wrap(isTouch, function(){
      this$.scope().game.reset();
      return this$.scope().audio.click();
    });
  },
  resettutorial: function(isTouch, event){
    var this$ = this;
    isTouch == null && (isTouch = false);
    return this.wrap(isTouch, function(){
      this$.scope().game.reset();
      this$.scope().game.tutorial();
      return this$.scope().audio.click();
    });
  },
  tutorial: function(isTouch, event){
    var this$ = this;
    isTouch == null && (isTouch = false);
    return this.wrap(isTouch, function(){
      this$.scope().game.tutorial();
      return this$.scope().audio.click();
    });
  },
  cont: function(isTouch, event){
    var this$ = this;
    isTouch == null && (isTouch = false);
    return this.wrap(isTouch, function(){
      this$.scope().audio.click();
      return this$.scope().game.resume();
    });
  },
  copy: function(){
    var copybtn, clipboard;
    this.scope().audio.click();
    copybtn = '#pause-link';
    clipboard = new Clipboard(copybtn);
    clipboard.on('success', function(){});
    return clipboard.on('error', function(){});
  }
};
touchflag = false;
audioinit = false;
window.touch = touch = {
  down: function(e){
    var s;
    touchflag = true;
    angular.element('#wrapper').scope().mouse.down(e, true);
    s = angular.element('#wrapper').scope();
    if (s.isMin || s.isPad) {
      if ((e.target && e.target.nodeName.toLowerCase() === "a") || (e.target.parentNode && e.target.parentNode.toLowerCase() === "a")) {
        return;
      }
      return e.preventDefault();
    }
  },
  up: function(e){
    var that;
    touchflag = true;
    angular.element('#wrapper').scope().mouse.up(e, true);
    if (!audioinit) {
      if (that = angular.element('#wrapper').scope().audio.noop) {
        return that();
      }
    }
  },
  move: function(e){
    return angular.element('#wrapper').scope().mouse.move(e, true);
  }
};
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}