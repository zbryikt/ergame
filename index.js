function import$(t,e){var n={}.hasOwnProperty;for(var i in e)n.call(e,i)&&(t[i]=e[i]);return t}var ref$,w,h,patw,path,of1x,of1y,dpw,dph,x$,touchflag,audioinit,touch;ref$=[1170,658],w=ref$[0],h=ref$[1],ref$=[193,278],patw=ref$[0],path=ref$[1],ref$=[298,273],of1x=ref$[0],of1y=ref$[1],ref$=[59,20],dpw=ref$[0],dph=ref$[1],x$=angular.module("ERGame",[]),x$.config(["$compileProvider"].concat(function(t){return t.imgSrcSanitizationWhitelist(/^\s*(blob):|http:\/\/localhost:9998\/|http:\/\/0media.tw\/|http:\/\/reporter.tw\//)})),x$.controller("ERGame",["$scope","$interval","$timeout","$http","$sce"].concat(function(t,e,n,i,r){var a,o,s,u,c,d,h,p,l,f,g,m,y;for(a=[],o=0;12>o;++o)s=o,a.push([s%4,parseInt(s/4)]);return t.list=a,t.danger=!1,t.pixel={scene:{w:1170,h:658},sprite:{size:[{w:0,h:0},{w:101,h:142},{w:108,h:229},{w:108,h:229},{w:291,h:245},{w:316,h:269},{w:105,h:196},{w:146,h:239},{w:98,h:60},{w:306,h:298},{w:191,h:240},{w:104,h:136},{w:238,h:184}],points:[{x:591,y:-19,type:6}].concat([{x:317,y:2,type:5}],[{x:687,y:-36,type:7}],[{x:507,y:54,type:9,variant:1}],[{x:249,y:184,type:11}],function(){var t,e,n=[];for(t=0;3>t;++t)for(u=t,e=0;4>e;++e)c=e,n.push({x:293+59*c+-127*u,y:222+20*c+47*u,type:1,variant:0,active:1});return n}(),[{x:857,y:100,type:4,variant:0,active:1}],[{x:870,y:272,type:12}],function(){var t,e=[];for(t=0;5>t;++t)s=t,e.push({x:749+66*s,y:227+24*s,type:2,variant:0,active:1});return e}(),[{x:623,y:279,type:3,variant:0,active:1},{x:520,y:341,type:10},{x:730,y:387,type:4,variant:0,active:1},{x:335,y:387,type:4,variant:0,active:1},{x:493,y:418,type:3,variant:0,active:1},{x:678,y:418,type:2,variant:0,active:1}])}},t.percent={sprite:{size:function(){var e,n,i,r=[];for(e=0,i=(n=t.pixel.sprite.size).length;i>e;++e)d=n[e],r.push({w:100*d.w/t.pixel.scene.w,h:100*d.h/t.pixel.scene.h});return r}(),points:function(){var e,n,i,r=[];for(e=0,i=(n=t.pixel.sprite.points).length;i>e;++e)d=n[e],r.push({x:100*d.x/t.pixel.scene.w,y:100*d.y/t.pixel.scene.h,type:d.type,variant:d.variant,active:d.active});return r}()}},t.rebuild=function(e){var n,i,r,a=[];for(n=0,r=(i=t.percent.sprite.points).length;r>n;++n)e=i[n],a.push(e.cls=["it-"+e.type+"-"+(e.variant||0)+"-"+(e.active||0)]);return a},t.game={state:0,over:function(){return this.setState(4),n(function(){var e;return e=parseInt(t.doctor.score.value/10),e>=6&&e--,e>=6&&(e=6),t.doctor.rank=e,t.share.updateRank()},500)},setState:function(t){return this.state=t},tutorial:function(){return this.setState(3),t.audio.bkloop(0,!0,!0),t.audio.bk.pause(!0)},lastState:0,pause:function(){return this.state<=1?void 0:(t.audio.bk.pause(),t.audio.bkloop.pause(),this.lastState=this.state,this.setState(1))},resume:function(){return this.setState(this.lastState||2),2===this.lastState&&t.audio.bk(),3===this.lastState?t.audio.bkloop():void 0},start:function(){return this.setState(2),t.audio.bkloop.pause(!0),t.audio.bk()},reset:function(){return $("#wheel").css({display:"none"}),t.danger=!1,t.patient.reset(),t.doctor.reset(),t.supply.reset(),t.mouse.reset(),t.audio.reset(),t.dialog.reset(),t.rebuild(),t.madmax=0,t.dialog.toggle(null,!1),this.state=0},countdown:{handler:null,value:0,count:function(){var e=this;return this.value=this.value-1,this.value>0?(t.audio["count"+(1===this.value?2:1)](),n(function(){return e.count()},650)):(t.game.setState(2),t.audio.bkloop.pause(!0),t.audio.bk(0,!1,!0))},start:function(){return t.game.setState(5),this.value=5,this.count()}}},t.doctor={sprite:t.percent.sprite.points.filter(function(t){return 9===t.type})[0],handler:null,energy:1,faint:!1,demading:0,chance:5,hurting:0,draining:0,rank:0,drain:function(){var e;return e=this,e.energy-=.2,e.energy>=0||(e.energy=0),e.draining=1,t.doctor.energy<=1e-4?(t.doctor.faint=!0,t.doctor.demading=0):void 0},fail:function(){var e;return e=this,e.setMood(7),e.chance-=1,e.chance>=0||(e.chance=0),e.hurting=1,this.chance<=0&&t.game.over(),t.audio.die()},reset:function(){return this.rank=0,this.energy=1,this.faint=!1,this.chance=5,this.hurting=0,this.draining=0,this.handler&&n.cancel(this.handler),this.score.value=0,this.score.digit=[0,0,0,0],this.setMood(1)},score:{digit:[0,0,0,0],value:0},resetLater:function(){var e=this;return this.handler&&n.cancel(this.handler),this.handler=n(function(){return e.setMood(1),e.handler=null,t.rebuild()},1e3)},setMood:function(t){return this.sprite.variant=t,t>1?this.resetLater():void 0}},t.$watch("doctor.score.value",function(){var e,n,i,r=[];for(e=t.doctor.score,n=0;4>n;++n)i=n,r.push(e.digit[3-i]=parseInt(e.value/Math.pow(10,i))%Math.pow(10,i+1));return r}),t.supply={sprite:t.percent.sprite.points.filter(function(t){var e;return 5===(e=t.type)||6===e||7===e}),reset:function(){var t,e,n,i,r=[];for(t=0,n=(e=this.sprite).length;n>t;++t)i=e[t],r.push((i.active=0,i.countdown=-1,i));return r},active:function(t,e){var n,i,r;return null==e&&(e=!0),n=null==t?parseInt(Math.random()*this.sprite.length):t,e?this.sprite[n].active?void 0:(this.sprite[n].active=1,this.sprite[n].countdown=1):(this.sprite[n].active=0,r=(i=this.sprite[n]).countdown,delete i.countdown,r)}},t.patient={urgent:0,updateUrgent:function(){return this.urgent=t.percent.sprite.points.filter(function(t){return 1===t.type&&3===t.variant}).length},reset:function(){var e,n,i,r;for(e=t.percent.sprite.points.filter(function(t){return t.type>=1&&t.type<=4}),n=0,i=e.length;i>n;++n)r=e[n],r.variant=0,r.mad=0,r.life=1;return this.urgent=0},add:function(e,n,i){var r,a,o,s,u,c;return r=t.percent.sprite.points.filter(function(t){return t.type===e&&0===t.variant}),0!==r.length?(a=parseInt(3*Math.random()+1),1===e?(o=Math.random(),a=o<t.config.cur.prob.pat[1]?1:o<t.config.cur.prob.pat[2]?2:3,t.audio.born()):a=parseInt(2*Math.random()+1),e>1&&(2>=a||(a=2)),null!=n&&(a=n),s=null!=i?i:parseInt(Math.random()*r.length),u=r[s],u.variant=a,1===u.type&&3===u.variant&&this.urgent++,1===u.type&&(u.life=1),(2===(c=u.type)||3===c||4===c)&&(u.mad=0),t.rebuild()):void 0}},t.mode="easy",t.config={cur:{prob:{pat:[.05,.6,.95],sup:.01,stay:.1},decay:{life:.001,sup:.001,mad:.001}},mode:{trivial:[{prob:{pat:[0,.6,.95],sup:.01,stay:.1},decay:{life:.001,sup:.001,mad:.001}},{prob:{pat:[0,.6,.95],sup:.01,stay:.1},decay:{life:.001,sup:.001,mad:.001}},{prob:{pat:[0,.6,.95],sup:.01,stay:.1},decay:{life:.001,sup:.001,mad:.001}},{prob:{pat:[0,.6,.95],sup:.01,stay:.1},decay:{life:.001,sup:.001,mad:.001}}],easy:[{prob:{pat:[.02,.6,.95],sup:.01,stay:.1},decay:{life:.001,sup:.005,mad:.001}},{prob:{pat:[.04,.5,.82],sup:.02,stay:.2},decay:{life:.002,sup:.008,mad:.002}},{prob:{pat:[.08,.4,.7],sup:.04,stay:.4},decay:{life:.003,sup:.011,mad:.003}},{prob:{pat:[.12,.3,.6],sup:.1,stay:.5},decay:{life:.006,sup:.014,mad:.006}}],normal:[{prob:{pat:[.02,.45,.95],sup:.01,stay:.1},decay:{life:.002,sup:.005,mad:.001}},{prob:{pat:[.06,.4,.8],sup:.03,stay:.3},decay:{life:.003,sup:.015,mad:.003}},{prob:{pat:[.14,.3,.5],sup:.09,stay:.5},decay:{life:.005,sup:.02,mad:.005}},{prob:{pat:[.22,.1,.2],sup:.15,stay:.6},decay:{life:.006,sup:.025,mad:.007}}],hard:[{prob:{pat:[.02,.1,.95],sup:.25,stay:.6},decay:{life:.006,sup:.025,mad:.007}},{prob:{pat:[.02,.1,.95],sup:.25,stay:.6},decay:{life:.006,sup:.025,mad:.007}},{prob:{pat:[.02,.1,.95],sup:.25,stay:.6},decay:{life:.006,sup:.025,mad:.007}},{prob:{pat:[.02,.1,.95],sup:.25,stay:.6},decay:{life:.006,sup:.025,mad:.007}}]}},t.mouse={x:0,y:0,target:null,reset:function(){return this.target=null},lock:function(){return this.isLocked=!0},unlock:function(){return this.isLocked=!1},timestamp:0,isPalOn:!1,down:function(e,n){var i,r,a,o,s,u,c,d,p,l,f,g,m,y;if(null==n&&(n=!1),(!touchflag||n)&&!h()){if(t.madmax||t.doctor.faint)return t.demad(e);if(!this.isLocked&&!this.isPalOn&&(t.dialog.finger.isOn=!1,i=$("#wrapper").offset(),r=[e.clientX||e.pageX,e.clientY||e.pageY],a=r[0],o=r[1],a||o||(r=[e.touches[0].clientX,e.touches[0].clientY],a=r[0],o=r[1]),r=this.last||(this.last={}),r.x=a,r.y=o,r=[a-i.left,o-i.top],this.x=r[0],this.y=r[1],r=r,s=r[0],u=r[1],c=1024*s/$("#wrapper").width(),d=576*u/$("#wrapper").height(),p=t.hitmask.resolve(c,d))){if(1===p.type){if(0===p.variant)return;for(l=t.percent.sprite.points.filter(function(t){return 1===t.type}),f=0,g=0,m=l.length;m>g;++g)y=l[g],y.variant>f&&(f=y.variant);if(3===f&&p.variant<f)return void(this.target=null)}if(this.target=p,p&&1===p.type)return $("#wheel").css({display:"block",top:u+"px",left:s+"px"}),t.audio.blop(),t.rebuild(),this.timestamp=(new Date).getTime(),this.isPalOn=!0,e.preventDefault()}}},move:function(){},up:function(e,n){var i,r,a,o,s=this;return null==n&&(n=!1),touchflag&&!n||h()||this.isLocked||t.madmax||t.doctor.faint||(i=(new Date).getTime(),r=[e.clientX||e.pageX,e.clientY||e.pageY],a=r[0],o=r[1],a||o||(null!=e.touches&&e.touches.length?(r=[e.touches[0].clientX,e.touches[0].clientY],a=r[0],o=r[1]):null!=e.changedTouches&&e.changedTouches.length&&(r=[e.changedTouches[0].clientX,e.changedTouches[0].clientY],a=r[0],o=r[1])),a||o||(r=[this.last.x,this.last.y],a=r[0],o=r[1]),this.target&&1===this.target.type&&(Math.pow(a-this.last.x,2)+Math.pow(o-this.last.y,2)<72||i-this.timestamp<100))?void 0:setTimeout(function(){var e,n,i,r,u,c,d;return s.isPalOn=!1,$("#wheel").css({display:"none"}),e=$("#wrapper").offset(),n=[a-s.x-e.left,o-s.y-e.top],i=n[0],r=n[1],u=360*Math.acos(i/Math.sqrt(Math.pow(i,2)+Math.pow(r,2)))/(2*Math.PI),r>0&&(u=360-u),(u>=320||10>=u)&&(c=3),u>10&&61>=u&&(c=2),u>61&&112>u&&(c=1),s.target&&(1===s.target.type?(s.target.variant===c?(1===s.target.variant?(d=Math.random()<.5?2:4+parseInt(3*Math.random()),null!=s.forceMood&&(d=s.forceMood),t.doctor.setMood(d),t.audio.dindon(),2===d&&(t.doctor.score.value+=1)):(null==s.forceStay&&Math.random()<t.config.cur.prob.stay?(t.doctor.setMood(3),t.patient.add(parseInt(3*Math.random()+2))):s.forceStay?(t.doctor.setMood(3),t.patient.add(s.forceStayType||4,2,s.forceStayPos||0)):t.doctor.setMood(2),t.audio.dindon(),t.doctor.score.value+=1),3===c&&(s.target.variant=0)):t.doctor.fail(),3===c&&t.patient.updateUrgent(),s.target.variant=0,t.rebuild()):s.target.type>=2&&s.target.type<=4&&s.target.variant?(s.target.mad>.8&&(s.target.mad=.8),(n=s.target).mad<=.8||(n.mad=.8),s.target.mad-=.2,(n=s.target).mad>=0||(n.mad=0),t.audio.click2()):s.target.type>=5&&s.target.type<=8&&s.target.active&&(t.doctor.energy+=.1,(n=t.doctor).energy<=1||(n.energy=1),t.doctor.setMood(2),t.rebuild(),s.target.active=0,s.target.countdown=1,t.audio.click2())),s.target=null},0)}},t.madmax=0,t.demad=function(e){var n,i,r,a,o,s;return t.dialog.finger.isOn=!1,n=100,i=t.percent.sprite.points.filter(function(t){return t.ismad}),i.length||(t.madmax=0),i.length?((r=i[0]).mad<=.8||(r.mad=.8),i[0].mad-=.1,(r=i[0]).mad>=0||(r.mad=0),i[0].mad<=0&&delete i[0].ismad,a=i.map(function(t){return 1-t.mad}).reduce(function(t,e){return t+e},0),o=i.length,n=100*a/o):t.doctor.faint&&(s=t.doctor,s.energy+=.1,s.energy<=1||(s.energy=1),t.doctor.energy>=.9999&&(t.doctor.faint=!1),n=100*t.doctor.energy),e.preventDefault(),t.audio.click2(),t.doctor.demading=n,!1},t.rebuild(),h=function(){return 2!==t.game.state&&3!==t.game.state||t.dialog.show===!0?!0:t.danger?!0:!1},t.madspeed=.002,t.$watch("madmax",function(t){return t?$("#wheel").css({display:"none"}):void 0}),t.hitmask={ready:!1,get:function(t,e){return!this.ready||null==t||null==e||isNaN(t)||isNaN(e)?[0,0,0,0]:this.ctx.getImageData(t,e,1,1).data},resolve:function(e,n){var i,r,a;return i=this.get(e,n),r=i[0],8===r&&(r=5),0===r?null:(a=1===r?4*i[1]+i[2]:i[2],t.percent.sprite.points.filter(function(t){return t.type===r})[a])},init:function(){var t,e=this;return t=this.canvas=document.createElement("canvas"),t.height=576,t.width=1024,this.ctx=this.canvas.getContext("2d"),this.img=new Image,this.img.src="mask.png",this.img.onload=function(){return e.ctx.drawImage(e.img,0,0,1024,576),e.ready=!0}}},t.hitmask.init(),t.dialog={tut:!0,show:!1,idx:0,next:function(){var t=this;return n(function(){return t.main(!0)},200)},type:"",h:{i:[],t:[]},finger:{value:1,isOn:!1},reset:function(){var t,e,n,i,r=[];for(this.tut=!0,this.show=!1,this.idx=0,this.type="",this.finger={value:1,isOn:!1},t=0,n=(e=this.step).length;n>t;++t)i=e[t],i.fired=!1,i.reset&&r.push(i.reset());return r},skip:function(t){var i,r,a,o;for(null==t&&(t=!1),$("#finger-slide").css({display:"none"}),$("#finger-tap").css({display:"none"}),i=0,a=(r=this.h.i).length;a>i;++i)o=r[i],e.cancel(o);for(i=0,a=(r=this.h.t).length;a>i;++i)o=r[i],n.cancel(o);return t||this.clean(),this.idx===this.step.length-2?this.next():(this.type="",t?(this.idx=this.step.length-2,this.toggle(0,!0)):void 0)},interval:function(t,n){var i;return i=e(t,n),this.h.i.push(i),i},timeout:function(t,e){var i;return i=n(t,e),this.h.t.push(i),i},clean:function(){var e,n;return delete t.mouse.forceStay,delete t.mouse.forceMood,t.game.reset(),e=t.dialog,e.tut=!1,e.idx=this.step.length-1,t.mouse.unlock(),$("#score").removeClass("hint"),n=t.doctor,n.chance=5,n.hurting=0,n.faint=!1,n.energy=1,n.setMood(2),t.game.setState(2),t.game.countdown.start()},step:[{},{ready:!1,reset:function(){return this.ready=!1},check:function(){return this.ready||3!==t.game.state||(this.ready=!0),this.ready},fire:function(){return t.mouse.forceStay=!1,t.mouse.forceMood=1,t.mouse.lock(),t.dialog.timeout(function(){return t.patient.add(1,1,0)},800),t.dialog.timeout(function(){return t.patient.add(1,2,0)},1600),t.dialog.timeout(function(){return t.patient.add(1,3,0)},2400)}},{ready:!1,reset:function(){return this.ready=!1},check:function(){var e=this;return this.ready?!0:(t.percent.sprite.points.filter(function(t){return 1===t.type&&3===t.variant}).length>0&&t.dialog.timeout(function(){return e.ready=!0},1e3),!1)}},{check:function(){return!0}},{check:function(){return!0},fire:function(){return $("#finger-slide").css({display:"block",top:"33%",left:"22%"}),setTimeout(function(){return $("#finger-slide").css({display:"none"}),t.mouse.unlock()},3e3)}},{reset:function(){return this.handler=null,this},check:function(){var e,n=this;return t.doctor.chance<5&&($("#oops").css({display:"block"}),t.doctor.chance=5,t.patient.reset(),t.patient.add(1,1,0),t.patient.add(1,2,0),t.patient.add(1,3,0),setTimeout(function(){return $("#oops").css({display:"none"})},1e3)),e=0===t.percent.sprite.points.filter(function(t){return 1===t.type&&0!==t.variant}).length,e&&5===t.doctor.chance&&(t.dialog.type="mini",this.handler=t.dialog.timeout(function(){return t.doctor.hurting=1,n.handler=null},500)),e},fire:function(){var e;return e=t.doctor,e.chance=5,e.hurting=0,this.handler?n.cancel(this.handler):void 0}},{check:function(){return $("#score").addClass("hint"),!0},fire:function(){return $("#score").removeClass("hint")}},{mood:0,reset:function(){return this.handler=null,this.mood=0,this},check:function(){var e=this;return null==this.handler&&(this.handler=t.dialog.interval(function(){return t.doctor.setMood(e.mood+4),t.rebuild(),e.mood=(e.mood+1)%3},500)),!0},fire:function(){return t.doctor.setMood(1),t.rebuild(),e.cancel(this.handler),t.mouse.forceStay=!0,t.patient.add(1,2,0)}},{mood:3,ready:!1,handler:null,moodHandler:null,reset:function(){return this.handler=null,this.moodHandler=null,this.ready=!1,this.mood=3,this},check:function(){var e,n,i=this;return t.doctor.chance<5&&($("#oops").css({display:"block"}),t.doctor.chance=5,t.patient.reset(),setTimeout(function(){return $("#oops").css({display:"none"})},800)),e=t.percent.sprite.points.filter(function(t){return(2===t.type||4===t.type)&&t.variant>0}).length,t.mouse.forceStayType=e?2:4,n=t.percent.sprite.points.filter(function(t){return 1===t.type&&2===t.variant}).length>0,e>1&&null==this.handler&&(this.handler=t.dialog.timeout(function(){return i.ready=!0},1e3)),2>e&&!n&&t.patient.add(1,2,parseInt(1+4*Math.random())),this.ready&&!this.moodHandler&&(this.moodHandler=t.dialog.interval(function(){return t.doctor.setMood(i.mood),t.rebuild(),i.mood=4-i.mood},500)),this.ready},fire:function(){var n;return e.cancel(this.moodHandler),n=t.dialog.finger,n.isOn=!0,n.y=[344,266],n.x=[750,1e3],n.small=!0,t.madspeed=.015,t.dialog.timeout(function(){var e;return e=t.dialog.finger,e.isOn=!1,e.small=!1,e},2300)}},{ready:!1,handler:null,reset:function(){return this.handler=null,this.ready=!1,this},check:function(){var e=this;return.015!==t.madspeed||t.dialog.finger.isOn||this.handler||(this.handler=t.dialog.timeout(function(){return e.ready=!0},1e3)),this.ready},fire:function(){return t.madspeed=.04,t.mouse.lock()}},{ready:!1,reset:function(){return this.ready=!1},check:function(){return t.madmax&&(this.ready=!0),this.ready}},{launched:0,supply:0,ready:!1,reset:function(){return this.launched=0,this.supply=0,this.ready=!1,this.handler=null,this},check:function(){var e,n=this;return t.madmax>=1&&0===this.launched&&(this.launched=1,e=t.dialog.finger,e.isOn=!0,e.y=197.4,e.x=351,t.madspeed=.002),.002===t.madspeed&&t.madmax<1&&1===this.launched&&(this.launched=2,t.percent.sprite.points.filter(function(t){return 4===t.type})[0].mad=0,t.dialog.timeout(function(){return n.handler=t.dialog.interval(function(){return t.supply.active(n.supply,!1),n.supply=(n.supply+1)%3,t.supply.active(n.supply)},500),n.ready=!0},1e3)),this.ready},fire:function(){var n;return e.cancel(this.handler),t.supply.active(0,!1),t.supply.active(1,!0),t.supply.active(2,!1),n=t.dialog.finger,n.isOn=!0,n.y=46.06,n.x=234,t.dialog.timeout(function(){return t.mouse.unlock()},1e3)}},{ready:!1,handler:!1,reset:function(){return this.handler=null,this.ready=!1,this},check:function(){var e=this;return this.handler||(this.handler=t.dialog.timeout(function(){return e.ready=!0,t.supply.active(1,!1),t.doctor.setMood(7),t.rebuild(),t.doctor.energy-=.1},3e3)),this.ready},fire:function(){}},{check:function(){return!0},fire:function(){var e;return t.doctor.energy=0,t.doctor.faint=!0,t.doctor.demading=0,e=t.dialog.finger,e.isOn=!0,e.y=131.6,e.x=351,e}},{ready:!1,reset:function(){return this.ready=!1,this.handler=null,this},check:function(){var e=this;return null==this.handler&&t.doctor.energy>=.999&&t.doctor.faint===!1&&(this.handler=t.dialog.timeout(function(){return t.dialog.type="",e.ready=!0},1e3)),this.ready}},{check:function(){return!0},fire:function(){return t.dialog.clean()}},{check:function(){return!1}}],main:function(t){return null==t&&(t=!1),t&&this.step[this.idx]&&this.step[this.idx].fire&&!this.step[this.idx].fired&&(this.step[this.idx].fire(),this.step[this.idx].fired=!0),!this.show||t?this.step[this.idx+1]&&this.step[this.idx+1].check()?this.toggle(this.idx+1,!0):this.toggle(0,!1):void 0},toggle:function(e,n){var i=this;return e&&(this.idx=e),setTimeout(function(){return i.show=null==n?!i.show:n,i.show?($("#dialog").fadeIn(),t.audio.menu()):$("#dialog").fadeOut()},0)}},t.scream=gajus.Scream({width:{portrait:320,landscape:480}}),t.dimension={update:function(){var e,n,i,r,a,o,s,u,c,d,h;return e=[$(window).width(),$(window).height()],n=e[0],i=e[1],e=[1024,576],r=e[0],a=e[1],e=1024>n?[n,576*n/1024]:[1024,576],o=e[0],s=e[1],e=576>i?[1024*i/576,i]:[1024,576],u=e[0],c=e[1],e=s>i?[u,c]:[o,s],d=e[0],h=e[1],d*=.9,h*=.9,this.w=d,this.h=h,$("#frame").css({width:d+"px",height:h+"px"}),$("#container").css({width:d+"px"}),$("body").css({overflow:"hidden"}),i>n?(this.portrait=!0,2===t.game.state&&t.game.pause()):this.portrait=!1,this.portrait?($("#frame").css({padding:0,position:"absolute",top:0,left:0,height:"100%",width:"100%"}),$("#wrapper").css({width:"100%",height:"100%",top:"0",left:"0"})):110>=i-h?($("#frame").css({padding:"0",position:"fixed",top:(i-h)/2+"px",left:(n-d)/2+"px"}),$("#wrapper").css({width:d+"px",height:h+"px",top:"0",left:"0"}),$("#head").css({display:"none"}),$("#foot").css({display:"none"})):($("#frame").css({padding:"10px",position:"relative",top:"auto",left:"auto",height:h+10+"px"}),$("#wrapper").css({width:d-20+"px",height:h-10+"px",top:"10px",left:"10px"}),$("#head").css({display:"block"}),$("#foot").css({display:"block"})),$("#prehide").css("display","none"),t.canvas&&t.canvas.e?t.canvas.update():void 0},portrait:!1,rotate:function(){}},t.dimension.update(),window.onresize=function(){return t.$apply(function(){return t.dimension.update()})},document.ontouchmove=function(e){return t.isPad||t.ismin?e.preventDefault():void 0},t.progress={value:0,latest:0,use:null,count:{total:0,current:0,update:function(){}},size:{total:0,current:0,group:{},update:function(e,n){var i,r,a,o,s;t.progress.setUse("size"),import$((i=this.group)[e]||(i[e]={}),n),a=[];for(o in i=this.group)s=i[o],a.push(s);return r=a,this.total=r.reduce(function(t,e){return t+e.total},0),this.current=r.reduce(function(t,e){return t+e.current},0)}},setUse:function(t){return this.use=this[t]},handler:null,transition:function(){var e,i,r=this;return this.value>=100&&n(function(){return t.loading=!1},1e3),this.value>=this.latest?this.handler=null:(this.value=(e=this.value+3)<(i=this.latest)?e:i,this.handler=n(function(){return r.transition()},10))},update:function(){return this.latest=parseInt(100*(this.count.current+this.size.current)/(this.count.total+this.size.total)),this.handler?void 0:this.transition()}},t.$watch("progress.count",function(){return t.progress.update()},!0),t.$watch("progress.size",function(){return t.progress.update()},!0),t.debug={d1:0,d2:0},p={spawn:function(){var e,n,i;if(!(t.dialog.tut||1!==(e=t.game.state)&&2!==e&&4!==e||(n=(new Date).getTime()/1e3-t.audio.bkt,t.config.cur=60>=n?t.config.mode[t.mode][0]:98>=n?t.config.mode[t.mode][1]:120>=n?t.config.mode[t.mode][2]:t.config.mode[t.mode][3],t.debug.d2=n,t.debug.d3=t.config.cur.prob.pat[2],n>=98&&101>=n&&2===t.game.state?t.danger=!0:120>=n&&(t.danger=!1),h())))return i=Math.random(),i<t.config.cur.prob.pat[0]&&t.patient.add(1),Math.random()<t.config.cur.prob.sup&&t.supply.active(),0===t.percent.sprite.points.filter(function(t){return 1===t.type&&0!==t.variant}).length&&Math.random()>.8&&t.patient.add(1),t.madspeed=t.config.cur.decay.mad},drain:function(e){var n,i,r,a,o,s,u=[];if(!h()){for(t.doctor.hurting&&(t.doctor.hurting-=.2,(n=t.doctor).hurting>=0||(n.hurting=0)),t.doctor.draining&&(t.doctor.draining-=.2,(n=t.doctor).draining>=0||(n.draining=0)),i=t.percent.sprite.points.filter(function(t){return 1===t.type&&t.variant>0}),r=!1,a=0,o=i.length;o>a;++a)e=i[a],e.life-=t.config.cur.decay.life*e.variant,e.life<=0&&(e.life=0,t.doctor.fail(),e.variant=0,r=!0);for(r&&t.patient.updateUrgent(),i=t.percent.sprite.points.filter(function(t){var e;return(2===(e=t.type)||3===e||4===e)&&t.variant>0}),s=0,a=0,o=i.length;o>a;++a)e=i[a],null==e.mad&&(e.mad=0),e.mad+=t.madspeed,e.mad>=.8&&(e.mad=1,e.ismad=!0,s=1);if(s&&!t.madmax&&(t.madmax=parseInt(2*Math.random()+1),t.doctor.demading=0),!t.doctor.faint){for(i=t.percent.sprite.points.filter(function(t){var e;return(5===(e=t.type)||6===e||7===e||8===e)&&t.active}),a=0,o=i.length;o>a;++a)e=i[a],(null==e.countdown||e.countdown<=0)&&(e.countdown=1),e.countdown-=t.config.cur.decay.sup,e.countdown<=0&&(e.countdown=1,e.active=0,u.push(t.doctor.drain()));return u}}},tweak:function(){var e,n,i,r,a;e=[$(window).width(),$(window).height()],n=e[0],i=e[1],3===t.game.state&&t.dialog.main(),r=/iPad/.exec(navigator.platform)?!0:!1;try{a=t.scream.isMinimalView(),t.debug.d1=a}catch(o){}return!t.ismin||a||r||(document.body.scrollTop=0,$("#minimal-fix").css({display:"block"})),t.ismin=a,t.isPad=r,(n!==this.w||i!==this.h)&&t.dimension.update(),e={w:this.w,h:this.h},e.w=n,e.h=i,e}},e(function(){return p.spawn(),p.drain(),p.tweak()},100),t.loading=!0,t.$watch("loading",function(t){return t?void 0:$("#loading").fadeOut()}),l=document.body,l.ontouchstart=window.touch.down,l.ontouchmove=window.touch.move,l.ontouchend=window.touch.up,t.assets={fetch:function(e,n,i){var r,a,o=this;return r=(new Date).getTime(),t.progress.count.total++,a=new XMLHttpRequest,a.open("GET",e,!0),a.responseType="arraybuffer",a.onprogress=function(n){return t.$apply(function(){return t.progress.size.update(e,{current:n.loaded,total:n.total})})},a.onload=function(){return t.$apply(function(){var s,u,c,d,h,p,l,f;for(s=["",new Zlib.Gunzip(new Uint8Array(a.response)).decompress()],u=s[0],c=s[1],d=0,h=c.length;h>d;++d)p=d,u+=String.fromCharCode(c[p]);return l=o.parse(JSON.parse(u),n),i(l),f=(new Date).getTime(),t.progress.count.current++,console.log("[assets] Process "+e+" spent "+(f-r)+" ms.")})},a.send()},parse:function(t,e){var n,i,a,o,s,u,c,d,h,p;n={url:{},buf:{}};for(i in t){for(a=t[i],o=atob(a),s=new ArrayBuffer(o.length),u=new Uint8Array(s),c=0,d=o.length;d>c;++c)h=c,u[h]=o.charCodeAt(h);p=new Blob([u],{type:e}),n.buf[i]=s,n.url[i]=r.trustAsResourceUrl(URL.createObjectURL(p))}return n}},t.audio={s:{},buf:{},names:["click","count1","count2","blop","die","menu","dindon","born","click2","bkloop","bk","noop"],reset:function(){var t,e,n,i,r;for(t=0,n=(e=this.names).length;n>t;++t)i=e[t],this[i].pause(!0);return this.bkt=0,this.bk?(delete this.bk.pausetime,r=(e=this.bk).starttime,delete e.starttime,r):void 0},n:{},bkt:0,isMute:!1,toggleMute:function(){return this.isMute=!this.isMute,this.gain.gain.value=this.isMute?0:1},player:function(t){var e,n=this;return e=function(i,r,a){var o;return null==r&&(r=!1),null==a&&(a=!1),a?delete e.pausetime:e.pausetime&&(i=e.pausetime-e.starttime,delete e.pausetime),e.starttime=parseInt((new Date).getTime()/1e3)-(null!=i?i:0),"bk"===t&&(n.bkt=e.starttime),n.buf[t]?(n.n[t]&&n.n[t].disconnect(),n.n[t]=o=n.context.createBufferSource(),o.buffer=n.buf[t],o.connect(n.gain),r&&(o.loop=!0),null!=i?o.start(0,i):o.start(0)):void 0},e.pause=function(i){var r;if(null==i&&(i=!1),n.n[t])try{n.n[t].stop(0)}catch(a){r=a}return i?void 0:e.pausetime=parseInt((new Date).getTime()/1e3)},e},init:function(){function e(){}var n,i,r,a,o,s,u=this;if(n=window.AudioContext||window.webkitAudioContext,/Android.+Firefox.+/.exec(navigator.userAgent)&&(n=null),n)return t.progress.count.total+=this.names.length,this.context=new n,this.gain=this.context.createGain(),this.gain.connect(this.context.destination),t.assets.fetch("assets/snd.gz","audio/mpeg",function(e){function n(t){return[t,"snd/"+t+".mp3"]}var i,r,a,o,s,c,d,h,p;for(i=e.url,r=e.buf,a=function(t,e){return u.context.decodeAudioData(r[e],function(e){return u.buf[t]=e},function(){return console.log("fail")})},o=0,c=(s=u.names.map(n)).length;c>o;++o)d=s[o],h=d[0],p=d[1],u[h]=u.player(h),a(h,p);return t.progress.count.current+=u.names.length});for(i=function(t){var e;return e=function(n,i){return null==i&&(i=!1),e.pausetime&&(n=e.pausetime-e.starttime,delete e.pausetime),e.starttime=parseInt((new Date).getTime()/1e3)-(null!=n?n:0),"bk"===t?u.bkt=e.starttime:void 0},e.pause=function(t){return null==t&&(t=!1),t?void 0:e.pausetime=parseInt((new Date).getTime()/1e3)},e},r=0,o=(a=this.names).length;o>r;++r)s=a[r],this[s]=i(s),this.s[s]={pause:e}}},t.image={url:{},img:{},zoom:{},init:function(){var e=this;return t.progress.count.total++,t.progress.update(),t.assets.fetch("assets/img.gz","image/png",function(i){function r(){return t.progress.count.current++}var a,o,s,u,c,d,h,p,l,f,g,m,y;for(e.url=i.url,a=i.buf,o=[$("img.src"),$(".img-bk")],s=o[0],u=o[1],c=0,d=s.length;d>c;++c)h=c,p=$(s[h]),l=p.attr("data-src"),f=e.url[l.replace(/^.+\/img\//,"img/")],null!=f&&p.attr("src",f.toString());for(c=0,d=u.length;d>c;++c)h=c,p=$(u[h]),l=p.attr("data-src"),p.css({"background-image":"url("+e.url[l].toString()+")"});for(g in o=e.url)m=o[g],t.progress.count.total++,e.img[g]=y=new Image,y.src=m.toString(),y.onload=r;return n(function(){return t.progress.count.current++},100),t.$watch("loading",function(){return t.canvas.init()})})}},t.audio.init(),t.image.init(),f=[["hidden","visibilitychange"],["mozHidden","mozvisibilitychange"],["msHidden","msvisibilitychange"],["webkitHidden","webkitvisibilitychange"]].filter(function(t){return null!=document[t[0]]})[0],f&&(document.addEventListener(f[1],function(){return document[f[0]]?t.game.pause():void 0},!1),document.addEventListener("pagehide",function(){return t.game.pause()},!1)),t.canvas={e:null,ctx:null,init:function(){var n=this;return this.e=document.getElementById("main-canvas"),this.ctx=this.e.getContext("2d"),this.ctx.imageSmoothingEnabled=!0,this.ctx.mozImageSmoothingEnabled=!0,this.ctx.webkitImageSmoothingEnabled=!0,this.ctx.msImageSmoothingEnabled=!0,t.usedom?void 0:(this.update(),this.handler?void 0:this.handler=e(function(){return n.draw()},100))},update:function(){var e,n,i;return this.e?(e={w:(e=t.dimension).w,h:e.h},n=e.w,i=e.h,e=[n/100,i/100],n=e[0],i=e[1],this.w!==n||this.h!==i?(e=this.e,e.width=1170,e.height=658,e=this.e.style,e.width=100*n+"px",e.height=100*i+"px",this.w=n,this.h=i,this):void 0):this.init()},draw:function(e){var n,i,r,a,o,s,u,c,d,h,p,l,f,g,m,y,v,w=[];for(this.ctx.fillStyle="rgba(0,0,0,0.0)",this.ctx.fillRect(0,0,1170,658),n=t.image.img["img/scenario.png"],this.ctx.drawImage(n,0,0,1170,658),i=0,a=(r=t.percent.sprite.points).length;a>i;++i)e=r[i],n=t.image.img["img/it-"+e.type+"-"+(e.variant||0)+"-0.png"],o=t.percent.sprite.size[e.type],s={w:11.7*o.w,h:6.58*o.h,x:11.7*e.x,y:6.58*e.y},this.ctx.drawImage(n,s.x,s.y,s.w,s.h),e.active&&(n=t.image.img["img/it-"+e.type+"-"+(e.variant||0)+"-1.png"],1===e.type?e.life<1&&this.ctx.drawImage(n,0,0,n.width,(1-e.life)*n.height,s.x,s.y,s.w,(1-e.life)*s.h):e.type<=4?e.mad>0&&this.ctx.drawImage(n,0,(1-e.mad)*n.height,n.width,e.mad*n.height,s.x,s.y+(1-e.mad)*s.h,s.w,e.mad*s.h):e.type>=5&&this.ctx.drawImage(n,0,0,n.width,n.height,s.x,s.y,s.w,s.h));if((t.doctor.faint||t.madmax||t.dialog.show&&!t.dialog.type||5===t.game.state)&&(this.ctx.fillStyle="rgba(65,65,65,0.7)",this.ctx.fillRect(0,0,1170,658)),t.patient.urgent&&(n=t.image.img["img/urgency.png"],this.ctx.drawImage(n,0,0,1170,658)),(t.doctor.faint||t.madmax)&&(u=parseInt((new Date).getTime()/250),c=u%2+1,r=[11.7*35.5,11.7*35.5],d=r[0],h=r[1],r=[.6*(1170-d),.4*(658-h)],p=r[0],l=r[1],n=t.doctor.faint&&!t.madmax?t.image.img["img/mad/hungry"+c+".png"]:1===t.madmax?t.image.img["img/mad/gangster"+c+".png"]:t.image.img["img/mad/hysteria"+c+".png"],this.ctx.drawImage(n,p,l,d,h)),t.dialog.show&&(f=t.image.img["img/tutorial/"+t.dialog.idx+".png"],g=t.image.img["img/tutorial/doctor.png"],"mini"===t.dialog.type?this.ctx.drawImage(f,386.1,263.2,514.8,263.853):(this.ctx.drawImage(f,81.9,85.54,702,490.249),this.ctx.drawImage(g,819,111.86,234,433.45))),5===t.game.state&&(n=t.image.img["img/countdown/"+(t.game.countdown.value-1||"go")+".png"],this.ctx.drawImage(n,409.5,148.5,351,351)),t.dialog.finger.isOn){if(u=parseInt((new Date).getTime()/100),c=u%2+1,m=t.dialog.finger,m.small){if(n=t.image.img["img/mad/click-"+c+".png"],m.x.length){for(i=0,y=m.x.length;y>i;++i)v=i,w.push(this.ctx.drawImage(n,m.x[v],m.y[v],70.2,114.426));return w}return this.ctx.drawImage(n,m.x,m.y,70.2,114.426)}return n=t.image.img["img/tutorial/finger"+c+".png"],this.ctx.drawImage(n,m.x,m.y,292.5,292.5)}}},t.usedom=!1,g={app_id:"646775858745770",display:"popup",caption:"www.twreporter.org",picture:"http://0media.tw/p/ergame/img/thumbnail.jpg",link:"http://0media.tw/p/ergame/",redirect_uri:"http://0media.tw/p/ergame/",description:"一款富含真實情境的經典急診室經營夢幻之作，為台灣第一個急診室新聞遊戲。遊戲背景鎖定在台灣的一間大型醫學中心，面對健保體制的崩壞、沒膽改革的政府以及愛跑大醫院看病的人民，擁有拯救急診室命運能力的鍵盤醫師，將在一次又一次的真實的醫療突發狀況中突圍，試圖拯救病患的生命。你，將在人類的極限體力、醫生的使命和病患的生命中作出抉擇，準備好了嗎？"},t.share={updateRank:function(){var e,n,i,r,a,o;return e=t.doctor.score.value,n=t.doctor.rank,i=["見習醫生","實習醫生","住院醫生","總住院醫生","研究醫生","主治醫生","醫龍"],r={app_id:"646775858745770",display:"popup",caption:"急診人生 - 三分鐘的急診室醫師人生 / 報導者 x 0media",picture:"http://0media.tw/p/ergame/rank/s"+e+".png",link:"http://0media.tw/p/ergame/",name:"我在急診人生救了 "+e+" 個人，獲得「"+i[n]+"」稱號！",redirect_uri:"http://0media.tw/p/ergame/",description:"一款富含真實情境的經典急診室經營夢幻之作，為台灣第一個急診室新聞遊戲。遊戲背景鎖定在台灣的一間大型醫學中心，面對健保體制的崩壞、沒膽改革的政府以及愛跑大醫院看病的人民，擁有拯救急診室命運能力的鍵盤醫師，將在一次又一次的真實的醫療突發狀況中突圍，試圖拯救病患的生命。你，將在人類的極限體力、醫生的使命和病患的生命中作出抉擇，準備好了嗎？"},this.rank=function(){var t,e=[];for(a in t=r)o=t[a],e.push(a+"="+encodeURIComponent(o));return e}().join("&")},game:function(){var t,e=[];for(m in t=g)y=t[m],e.push(m+"="+encodeURIComponent(y));return e}().join("&"),link:encodeURIComponent("http://0media.tw/p/ergame/"),rank:""}})),window.ctrl={_s:null,scope:function(){var t;return(t=this._s)?t:this._s=angular.element("body").scope()
},wrap:function(t,e){if(t||!touchflag)return this.scope().$apply(function(){return e()})},next:function(t){var e=this;return null==t&&(t=!1),this.wrap(t,function(){return e.scope().dialog.next(),e.scope().audio.click()})},skip:function(t,e,n){var i=this;return null==t&&(t=!1),null==n&&(n=!0),this.wrap(t,function(){return i.scope().dialog.skip(n),i.scope().audio.click(),e.preventDefault()})},pause:function(t,e){var n=this;return null==t&&(t=!1),this.wrap(t,function(){return n.scope().game.pause(),n.scope().audio.click(),e.preventDefault()})},mute:function(t,e){var n=this;return null==t&&(t=!1),this.wrap(t,function(){return n.scope().audio.toggleMute(),e.preventDefault(),e.cancelBubble=!0})},replay:function(t){var e=this;return null==t&&(t=!1),this.wrap(t,function(){return e.scope().game.reset(),e.scope().audio.click()})},resettutorial:function(t){var e=this;return null==t&&(t=!1),this.wrap(t,function(){return e.scope().game.reset(),e.scope().game.tutorial(),e.scope().audio.click()})},tutorial:function(t){var e=this;return null==t&&(t=!1),this.wrap(t,function(){return e.scope().game.tutorial(),e.scope().audio.click()})},cont:function(t){var e=this;return null==t&&(t=!1),this.wrap(t,function(){return e.scope().audio.click(),e.scope().game.resume()})},copy:function(){var t,e;return this.scope().audio.click(),t="#pause-link",e=new Clipboard(t),e.on("success",function(){}),e.on("error",function(){})}},touchflag=!1,audioinit=!1,window.touch=touch={down:function(t){var e;if(touchflag=!0,angular.element("#wrapper").scope().mouse.down(t,!0),e=angular.element("#wrapper").scope(),e.isMin||e.isPad){if(t.target&&"a"===t.target.nodeName.toLowerCase()||t.target.parentNode&&"a"===t.target.parentNode.toLowerCase())return;return t.preventDefault()}},up:function(t){var e;return touchflag=!0,angular.element("#wrapper").scope().mouse.up(t,!0),!audioinit&&(e=angular.element("#wrapper").scope().audio.noop)?e():void 0},move:function(t){return angular.element("#wrapper").scope().mouse.move(t,!0)}};