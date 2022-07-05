var ref$, w, h, patw, path, of1x, of1y, dpw, dph, x$;
ref$ = [1170, 658], w = ref$[0], h = ref$[1];
ref$ = [193, 278], patw = ref$[0], path = ref$[1];
ref$ = [298, 273], of1x = ref$[0], of1y = ref$[1];
ref$ = [59, 20], dpw = ref$[0], dph = ref$[1];
x$ = angular.module('ERGame', []);
x$.controller('ERGame', ['$scope', '$interval', '$timeout'].concat(function($scope, $interval, $timeout){
  var res$, i$, i, r, c, p, isHalt;
  res$ = [];
  for (i$ = 0; i$ < 12; ++i$) {
    i = i$;
    res$.push([i % 4, parseInt(i / 4)]);
  }
  $scope.list = res$;
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
        y: -3,
        type: 5
      }], [{
        x: 687,
        y: -36,
        type: 7
      }], [{
        x: 503,
        y: 65,
        type: 8
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
      results$.push(it.cls = (it.active
        ? ['active']
        : []).concat(["it-" + it.type + "-" + (it.variant || 0) + "-" + (it.active || 0)]));
    }
    return results$;
  };
  $scope.game = {
    state: 0,
    setState: function(it){
      return this.state = it;
    },
    start: function(){
      this.setState(5);
      return this.countdown.start();
    },
    reset: function(){
      $scope.patient.reset();
      $scope.doctor.reset();
      $scope.supply.reset();
      $scope.mouse.reset();
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
        if (this.value) {
          return $timeout(function(){
            return this$.count();
          }, 650);
        } else {
          return $scope.game.setState(2);
        }
      },
      start: function(){
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
    chance: 5,
    hurting: 0,
    fail: function(){
      var x$;
      x$ = this;
      x$.setMood(7);
      x$.chance -= 1;
      x$.chance >= 0 || (x$.chance = 0);
      x$.hurting = 1;
      if (this.chance <= 0) {
        return $scope.game.setState(4);
      }
    },
    reset: function(){
      this.energy = 1;
      this.faint = false;
      this.chance = 5;
      this.hurting = 0;
      if (this.handler) {
        $timeout.cancel(this.handler);
      }
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
      return (ref$ = it.type) === 5 || ref$ === 6 || ref$ === 7 || ref$ === 8;
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
      } else {
        this.sprite[idx].active = 1;
        return this.sprite[idx].countdown = 1;
      }
    }
  };
  $scope.patient = {
    lvprob: [[0.6, 0.9], [0.4, 0.8], [0.3, 0.3]],
    reset: function(){
      var remains, i$, len$, item, results$ = [];
      remains = $scope.percent.sprite.points.filter(function(it){
        return it.type >= 1 && it.type <= 4;
      });
      for (i$ = 0, len$ = remains.length; i$ < len$; ++i$) {
        item = remains[i$];
        results$.push((item.variant = 0, item.mad = 0, item.life = 1, item));
      }
      return results$;
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
        if (dice < this.lvprob[0][0]) {
          variant = 1;
        } else if (dice < this.lvprob[0][1]) {
          variant = 2;
        } else {
          variant = 3;
        }
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
      if (des.type === 1) {
        des.life = 1;
      }
      if ((ref$ = des.type) === 2 || ref$ === 3 || ref$ === 4) {
        des.mad = 0;
      }
      return $scope.rebuild();
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
    down: function(e, target){
      var offset, ref$, x, y, pat, max, i$, len$, item;
      if (isHalt()) {
        return;
      }
      if (this.isLocked || $scope.madmax || $scope.doctor.faint) {
        return;
      }
      offset = $('#wrapper').offset();
      ref$ = (ref$ = [e.clientX - offset.left, e.clientY - offset.top], this.x = ref$[0], this.y = ref$[1], ref$), x = ref$[0], y = ref$[1];
      target = $scope.hitmask.resolve(x, y);
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
      return $scope.rebuild();
    },
    up: function(e){
      var this$ = this;
      if (isHalt()) {
        return;
      }
      if (this.isLocked || $scope.madmax || $scope.doctor.faint) {
        return;
      }
      return setTimeout(function(){
        var offset, ref$, dx, dy, angle, type, mood;
        $('#wheel').css({
          display: "none"
        });
        offset = $('#wrapper').offset();
        ref$ = [e.clientX - this$.x - offset.left, e.clientY - this$.y - offset.top], dx = ref$[0], dy = ref$[1];
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
                if (mood === 2) {
                  $scope.doctor.score.value += 1;
                }
              } else {
                if (!(this$.forceStay != null) && Math.random() > 0.5) {
                  $scope.doctor.setMood(3);
                  $scope.patient.add(parseInt(3 * Math.random() + 2));
                } else if (this$.forceStay) {
                  $scope.doctor.setMood(3);
                  $scope.patient.add(4, 2, 0);
                } else {
                  $scope.doctor.setMood(2);
                }
                $scope.doctor.score.value += 1;
              }
            } else {
              $scope.doctor.fail();
            }
            this$.target.variant = 0;
            $scope.rebuild();
          } else if (this$.target.type >= 2 && this$.target.type <= 4) {
            if (this$.target.mad > 0.8) {
              this$.target.mad = 0.8;
            }
            (ref$ = this$.target).mad <= 0.8 || (ref$.mad = 0.8);
            this$.target.mad -= 0.2;
            (ref$ = this$.target).mad >= 0 || (ref$.mad = 0);
          } else if (this$.target.type >= 5 && this$.target.type <= 8 && this$.target.active) {
            $scope.doctor.energy += 0.1;
            (ref$ = $scope.doctor).energy <= 1 || (ref$.energy = 1);
            $scope.doctor.setMood(2);
            $scope.rebuild();
            this$.target.active = 0;
            this$.target.countdown = 1;
          }
        }
        return this$.target = null;
      }, 0);
    }
  };
  $scope.madmax = 0;
  $scope.demad = function(e){
    var madmax, ref$, x$;
    madmax = $scope.percent.sprite.points.filter(function(it){
      return it.mad != null && it.mad >= 1;
    });
    if (!madmax.length) {
      $scope.madmax = 0;
    }
    if (madmax.length) {
      (ref$ = madmax[0]).mad <= 0.8 || (ref$.mad = 0.8);
      madmax[0].mad -= 0.1;
      (ref$ = madmax[0]).mad >= 0 || (ref$.mad = 0);
    } else if ($scope.doctor.faint) {
      x$ = $scope.doctor;
      x$.energy += 0.1;
      x$.energy <= 1 || (x$.energy = 1);
      if ($scope.doctor.energy === 1) {
        $scope.doctor.faint = false;
      }
    }
    e.preventDefault();
    return false;
  };
  $scope.rebuild();
  isHalt = function(){
    if (($scope.game.state !== 2 && $scope.game.state !== 3) || $scope.dialog.show === true) {
      return true;
    }
    return false;
  };
  $interval(function(){
    if (isHalt()) {
      return;
    }
    if ($scope.dialog.tut) {
      return;
    }
    if (Math.random() < 0.1) {
      $scope.patient.add(1);
    }
    if (Math.random() < 0.1) {
      return $scope.supply.active();
    }
  }, 100);
  $scope.madspeed = 0.002;
  $interval(function(it){
    var ref$, inqueue, i$, len$, madmax, results$ = [];
    if (isHalt()) {
      return;
    }
    if ($scope.doctor.hurting) {
      $scope.doctor.hurting -= 0.2;
      (ref$ = $scope.doctor).hurting >= 0 || (ref$.hurting = 0);
    }
    inqueue = $scope.percent.sprite.points.filter(function(it){
      return it.type === 1 && it.variant > 0;
    });
    for (i$ = 0, len$ = inqueue.length; i$ < len$; ++i$) {
      it = inqueue[i$];
      it.life -= 0.004 * it.variant;
      if (it.life <= 0) {
        it.life = 0;
        $scope.doctor.fail();
        it.variant = 0;
      }
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
        madmax = 1;
      }
    }
    if (madmax && !$scope.madmax) {
      $scope.madmax = parseInt(Math.random() * 2 + 1);
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
        it.countdown -= 0.025;
        if (it.countdown <= 0) {
          it.countdown = 1;
          it.active = 0;
          $scope.doctor.energy -= 0.2;
          (ref$ = $scope.doctor).energy >= 0 || (ref$.energy = 0);
          if ($scope.doctor.energy === 0) {
            results$.push($scope.doctor.faint = true);
          }
        }
      }
      return results$;
    }
  }, 100);
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
      if (!this.ready) {
        return [0, 0, 0, 0];
      }
      return this.ctx.getImageData(x, y, 1, 1).data;
    },
    resolve: function(x, y){
      var color, type, order;
      color = this.get(x, y);
      type = color[0];
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
    skip: function(){
      var i$, ref$, len$, item;
      for (i$ = 0, len$ = (ref$ = this.h.i).length; i$ < len$; ++i$) {
        item = ref$[i$];
        $interval.cancel(item);
      }
      for (i$ = 0, len$ = (ref$ = this.h.t).length; i$ < len$; ++i$) {
        item = ref$[i$];
        $timeout.cancel(item);
      }
      this.idx = this.step.length - 2;
      return this.toggle(0, true);
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
      var x$;
      delete $scope.mouse.forceStay;
      delete $scope.mouse.forceMood;
      $scope.dialog.tut = false;
      $scope.mouse.unlock();
      $('#score').removeClass('hint');
      x$ = $scope.doctor;
      x$.chance = 5;
      x$.hurting = 0;
      x$.faint = false;
      x$.energy = 1;
      x$.setMood(2);
      return $scope.game.setState(2);
    },
    step: [
      {}, {
        ready: false,
        check: function(){
          if (!this.ready && $scope.game.state === 2) {
            $scope.game.state = 3;
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
          }, 1000);
          $scope.dialog.timeout(function(){
            return $scope.patient.add(1, 2, 0);
          }, 2000);
          return $scope.dialog.timeout(function(){
            return $scope.patient.add(1, 3, 0);
          }, 3000);
        }
      }, {
        ready: false,
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
        check: function(){
          var ret, this$ = this;
          ret = $scope.percent.sprite.points.filter(function(it){
            return it.type === 1 && it.variant !== 0;
          }).length === 0;
          if (ret) {
            $scope.dialog.type = 'mini';
            this.handler = $scope.dialog.timeout(function(){
              $scope.doctor.fail();
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
        check: function(){
          var hasPat2, hasPat1, this$ = this;
          hasPat2 = $scope.percent.sprite.points.filter(function(it){
            return it.type === 4 && it.variant > 0;
          }).length > 0;
          hasPat1 = $scope.percent.sprite.points.filter(function(it){
            return it.type === 1 && it.variant === 2;
          }).length > 0;
          if (hasPat2 && this.handler == null) {
            this.handler = $scope.dialog.timeout(function(){
              return this$.ready = true;
            }, 1000);
          }
          if (!hasPat2 && !hasPat1) {
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
          $interval.cancel(this.moodHandler);
          $('#finger-tap').css({
            display: 'block',
            top: '22%',
            left: '68%'
          });
          $scope.madspeed = 0.02;
          return $scope.dialog.timeout(function(){
            return $('#finger-tap').css({
              display: 'none'
            });
          }, 1300);
        }
      }, {
        ready: false,
        handler: null,
        check: function(){
          var this$ = this;
          if ($scope.madspeed === 0.02 && $('#finger-tap').css('display') === 'none' && !this.handler) {
            this.handler = $scope.dialog.timeout(function(){
              return this$.ready = true;
            }, 2000);
          }
          return this.ready;
        },
        fire: function(){
          return $scope.mouse.lock();
        }
      }, {
        launched: 0,
        supply: 0,
        ready: false,
        check: function(){
          var this$ = this;
          if ($scope.madmax >= 1 && this.launched === 0) {
            this.launched = 1;
            $('#finger-tap').css({
              display: 'block',
              top: '30%',
              left: '30%'
            });
            $scope.madspeed = 0.002;
            $scope.dialog.timeout(function(){
              return $('#finger-tap').css({
                display: 'none'
              });
            }, 1000);
          }
          if ($scope.madspeed === 0.002 && $scope.madmax < 1 && this.launched === 1) {
            this.launched = 2;
            $scope.percent.sprite.points.filter(function(it){
              return it.type === 4;
            })[0].mad = 0;
            $scope.dialog.timeout(function(){
              this$.handler = $scope.dialog.interval(function(){
                $scope.supply.active(this$.supply, false);
                this$.supply = (this$.supply + 1) % 4;
                return $scope.supply.active(this$.supply);
              }, 500);
              $('#arrow').css({
                display: 'block',
                top: '25%',
                left: '35%'
              });
              return this$.ready = true;
            }, 1000);
          }
          return this.ready;
        },
        fire: function(){
          $interval.cancel(this.handler);
          $scope.supply.active(0, false);
          $scope.supply.active(1, true);
          $scope.supply.active(2, false);
          $scope.supply.active(3, false);
          $('#arrow').css({
            display: 'none'
          });
          $('#finger-tap').css({
            display: 'block',
            top: '7%',
            left: '20%'
          });
          return $scope.dialog.timeout(function(){
            return $('#finger-tap').css({
              display: 'none'
            });
          }, 1000);
        }
      }, {
        ready: false,
        handler: false,
        check: function(){
          var this$ = this;
          if (!this.handler) {
            this.handler = $scope.dialog.timeout(function(){
              this$.ready = true;
              $scope.supply.active(1, false);
              $scope.doctor.setMood(7);
              $scope.rebuild();
              $scope.doctor.energy -= 0.1;
              return $('#arrow').css({
                display: 'block',
                top: '10%',
                left: '31%'
              });
            }, 3000);
          }
          return this.ready;
        },
        fire: function(){
          $('#arrow').css({
            display: 'none'
          });
          $scope.doctor.energy = 0;
          $scope.doctor.faint = true;
          $('#finger-tap').css({
            display: 'block',
            top: '20%',
            left: '30%'
          });
          return $scope.dialog.timeout(function(){
            return $('#finger-tap').css({
              display: 'none'
            });
          }, 1000);
        }
      }, {
        ready: false,
        check: function(){
          var this$ = this;
          console.log('hit');
          if (this.handler == null && $scope.doctor.energy === 1 && $scope.doctor.faint === false) {
            this.handler = $scope.dialog.timeout(function(){
              this$.ready = true;
              return $scope.dialog.type = "";
            }, 1000);
          }
          return this.ready;
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
          return $('#dialog').fadeIn();
        } else {
          return $('#dialog').fadeOut();
        }
      }, 0);
    }
  };
  return $interval(function(){
    return $scope.dialog.main();
  }, 100);
}));