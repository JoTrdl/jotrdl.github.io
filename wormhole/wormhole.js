// Request animation frame
// https://gist.github.com/paulirish/1579671
(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback, element) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = window.setTimeout(function() { callback(currTime + timeToCall); },
            timeToCall);
          lastTime = currTime + timeToCall;
          return id;
      };

  if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
          clearTimeout(id);
      };
}());

var Mapper = function(width,height,filter) {
    
    var map = [];
    
    
    this.zoom = function(px,py) {
        return {
            'x': (px+width/2)*0.5,
            'y': (py+height/2)*0.5
        }
    }
    

    this.reflect = function(px,py) {
        if (py<height/2) return {
            'x': px,
            'y': py
        }
        var dx = (py-height/2)*(-px+width/2)/width;
        return {
            'x': px+dx,
            'y': height-py
        }
    }
    
    this.twirl = function(px,py) {
        var x = px-width/2;
        var y = py-height/2;
        var r = Math.sqrt(x*x+y*y);
        var maxr = width/2;
        if (r>maxr) return {'x':px,'y':py}
        var a = Math.atan2(y,x);
        a += 1-r/maxr;
        var dx = Math.cos(a)*r;
        var dy = Math.sin(a)*r;
        return {
            'x': dx+width/2,
            'y': dy+height/2
        }
    }
    
    this.spherize = function(px,py) {
        var x = px-width/2;
        var y = py-height/2;
        var r = Math.sqrt(x*x+y*y);
        var maxr = width/2;
        if (r>maxr) return {'x':px,'y':py}
        var a = Math.atan2(y,x);
        var k = (r/maxr)*(r/maxr)*0.5+0.5;
        var dx = Math.cos(a)*r*k;
        var dy = Math.sin(a)*r*k;
        return {
            'x': dx+width/2,
            'y': dy+height/2
        }
    }
    

    this.exec = function(bitmap, texture) {
        var height = bitmap.height;
        var width = bitmap.width;
        var colorat = function(x,y,channel) {
            return texture.data[(x+y*height)*4+channel];
        }
        for (var j=0; j<height; j++) {
            for (var i=0; i<width; i++) {
                var u = map[(i+j*height)*2];
                var v = map[(i+j*height)*2+1];
                var x = Math.floor(u);
                var y = Math.floor(v);
                var kx = u-x;
                var ky = v-y;
                for (var c=0; c<4; c++) {
                    bitmap.data[(i+j*height)*4+c] =
                        (colorat(x,y  ,c)*(1-kx) + colorat(x+1,y  ,c)*kx) * (1-ky) +
                        (colorat(x,y+1,c)*(1-kx) + colorat(x+1,y+1,c)*kx) * (ky);
                }
            }
        }
    };
    
    this.setTranslate = function(translator) {
        if (typeof translator === 'string') translator = this[translator];
        for (var y=0; y<height; y++) {
            for (var x=0; x<width; x++) {
                var t = this.spherize(x,y);
                t = this.twirl(t.x,t.y);
                //t = this.reflect(t.x,t.y);
                map[(x+y*height)*2+0] = Math.max(Math.min(t.x,width-1),0);
                map[(x+y*height)*2+1] = Math.max(Math.min(t.y,height-1),0);
            }
        }
    }
    
    this.setTranslate(filter);
}

var Wormhole = function(canvas) {

  var ctx = canvas.getContext('2d');
  var tmpCanvas, tmpCtx;
  var background;

  var _init = function() {
    // the the canvas width/height
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Draw the background
    background = new Image();
    background.src = './stars.jpg';
    background.onload = function() {
      ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas.width, canvas.height);
    };

    // Create the tmp canvas
    tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = tmpCanvas.height = 254;
    tmpCtx = tmpCanvas.getContext('2d');
  };

  var _render = function() {
    //console.log('render')
  };

  var _start = function() {
    (function animloop(){
      requestAnimationFrame(animloop);
      _render();
    })();
  };

  _init();
  //_start();
  

  // testing
  

  var bitmap = tmpCtx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);
  var mapper = new Mapper(bitmap.width,bitmap.height,'spherize');
  var locked = false;
  canvas.onmousemove = function(e) {
    if (locked) return;
        locked = true;
    var texture = ctx.getImageData(e.clientX-Math.ceil(bitmap.width/2),e.clientY-Math.ceil(bitmap.height/2),bitmap.width,bitmap.height+1);

    var x = e.clientX; //-Math.floor(tmpCanvas.width/2)+'px';
    var y = e.clientY; //-(Math.floor(tmpCanvas.height/2))+'px';


    mapper.exec(bitmap,texture);
    ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, canvas.width, canvas.height);
    ctx.putImageData(bitmap,x,y);

    locked = false;
  };
};