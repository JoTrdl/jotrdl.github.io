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



PIXI.EyeFishFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

console.log(this)
    // set the uniforms
    this.uniforms = {
        lensSize: {type: '1f', value:0.4},
        position: {type: '2f', value:{x:50, y:100}},
        iResolution : {type: '2f', value:{x:window.innerWidth, y:window.innerHeight}},
        iMouse : {type: '2f', value:{x:window.innerWidth/2, y:window.innerHeight/2}},
        iGlobalTime: {type: '1f', value:0.4},
        //dimensions : {type: '4f', value:[]},
    };

    /*this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform vec4 dimensions;',
        'uniform sampler2D uSampler;',

        'uniform float radius;',
        'uniform float angle;',
        'uniform vec2 offset;',

        'void main(void) {',
        '   vec2 coord = vTextureCoord - offset;',
        '   float distance = length(coord);',

        '   if (distance < radius) {',
        '       float ratio = (radius - distance) / radius;',
        '       float angleMod = ratio * ratio * angle;',
        '       float s = sin(angleMod);',
        '       float c = cos(angleMod);',
        '       coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);',
        '   }',

        '   gl_FragColor = texture2D(uSampler, coord+offset);',
        '}'
    ];*/

    //this.fragmentSrc = [
      /*'precision mediump float;',
      'uniform sampler2D tex0;',
      
      'varying vec2 vTextureCoord;',

      'uniform vec2 position;',
      'uniform float lensSize;',
      'uniform vec2 resolution;',

      'void main(void) {',
        'vec2 p = gl_FragCoord.xy / resolution.xy;',
        'vec2 m = position.xy / resolution.xy;',
        'vec2 d = p - m;',

        'float r = sqrt(dot(d, d)); ',
        'vec2 uv;',

        'vec3 col = vec3(0.0, 0.0, 0.0);',
        'if (r > lensSize+0.01) {',
          'uv = p;',
          'col = texture2D(tex0, vec2(uv.x, -uv.y)).xyz;',
        '} else if (r < lensSize-0.01) {',
          'uv = m + d * r;',
          'col = texture2D(tex0, vec2(uv.x, -uv.y)).xyz;',
        '}',
        'gl_FragColor = vec4(col, 1.0);',
      '}'*/
      /*'precision mediump float;',
      'uniform vec2      iResolution;           // viewport resolution (in pixels)',
'uniform vec2      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click',
'uniform sampler2D iChannel0;          // input channel. XX = 2D/Cube',
'',
'#define pi 3.141592653589793238462643383279',
'',
'float atan2(float y, float x){',
'  if(x>0.) return atan(y/x);',
'  if(y>=0. && x<0.) return atan(y/x) + pi; ',
'  if(y<0. && x<0.) return atan(y/x) - pi; ',
'  if(y>0. && x==0.) return pi/2.;',
'  if(y<0. && x==0.) return -pi/2.;',
'  if(y==0. && x==0.) return pi/2.; // undefined usually',
'  return pi/2.;',
'}',
'',
'vec2 uv_polar(vec2 uv, vec2 center){',
'  vec2 c = uv - center;',
'  float rad = length(c);',
'  float ang = atan2(c.x,c.y);',
'  return vec2(ang, rad);',
'}',
'',
'vec2 uv_lens_half_sphere(vec2 uv, vec2 position, float radius, float refractivity){',
'  vec2 polar = uv_polar(uv, position);',
'  float cone = clamp(1.-polar.y/radius, 0., 1.);',
'  float halfsphere = sqrt(1.-pow(cone-1.,2.));',
'  float w = atan2(1.-cone, halfsphere);',
'  float refrac_w = w-asin(sin(w)/refractivity);',
'  float refrac_d = 1.-cone - sin(refrac_w)*halfsphere/cos(refrac_w);',
'  vec2 refrac_uv = position + vec2(sin(polar.x),cos(polar.x))*refrac_d*radius;',
'  return mix(uv, refrac_uv, float(length(uv-position)<radius));',
'}',
'',
'void main(void)',
'{',
'  // domain map',
'  vec2 uv = gl_FragCoord.xy / iResolution.xy;',
'  ',
'  // aspect-ratio correction',
'  vec2 aspect = vec2(1.,iResolution.y/iResolution.x);',
'  vec2 uv_correct = 0.5 + (uv -0.5)* aspect;',
'  vec2 mouse_correct = 0.5 + ( iMouse.xy / iResolution.xy - 0.5) * aspect;',
'',
'  vec2 pos = vec2(0.5);',
'  //pos = mouse_correct;',
'  ',
'  vec2 uv_lense_distorted = uv_lens_half_sphere(uv_correct, pos, 0.166, 1.575);',
'  ',
'  uv_lense_distorted = 0.5 + (uv_lense_distorted - 0.5) / aspect;',
'  ',
'  gl_FragColor = texture2D(iChannel0, uv_lense_distorted);',
'',
'}',
    ];*/

     this.fragmentSrc = shader;
};

PIXI.EyeFishFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.EyeFishFilter.prototype.constructor = PIXI.EyeFishFilter;
Object.defineProperty(PIXI.EyeFishFilter.prototype, 'lensSize', {
    get: function() {
        return this.uniforms.lensSize.value;
    },
    set: function(value) {
        this.dirty = true;
        this.uniforms.lensSize.value = value;
    }
});
Object.defineProperty(PIXI.EyeFishFilter.prototype, 'position', {
    get: function() {
        return this.uniforms.position.value;
    },
    set: function(value) {
        this.dirty = true;
        this.uniforms.position.value = value;
    }
});
Object.defineProperty(PIXI.EyeFishFilter.prototype, 'iResolution', {
    get: function() {
        return this.uniforms.position.value;
    },
    set: function(value) {
        this.dirty = true;
        this.uniforms.position.value = value;
    }
});
Object.defineProperty(PIXI.EyeFishFilter.prototype, 'iMouse', {
    get: function() {
        return this.uniforms.position.value;
    },
    set: function(value) {
        this.dirty = true;
        this.uniforms.position.value = value;
    }
});
Object.defineProperty(PIXI.EyeFishFilter.prototype, 'iGlobalTime', {
    get: function() {
        return this.uniforms.position.value;
    },
    set: function(value) {
        this.dirty = true;
        this.uniforms.position.value = value;
    }
});



var Wormhole = function(canvas) {

  var _init = function() {
    // the the canvas width/height
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.stage = new PIXI.Stage(0x000000);
    this.renderer = PIXI.autoDetectRenderer(
      canvas.width,
      canvas.height,
      {
        view:canvas,
        resolution:1
      }
    );

    var spaceTexture = PIXI.Texture.fromImage("./stars.png");
    this.space = new PIXI.TilingSprite(spaceTexture, canvas.width*2, canvas.width*2);
    this.space.position.x = canvas.width/2;
    this.space.position.y = canvas.height/2;

    this.space.tilePosition.x = canvas.width/2;
    this.space.tilePosition.y = canvas.height/2;

    this.space.anchor.x = 0.5;
    this.space.anchor.y = 0.5;

    this.stage.addChild(this.space);
    //this.twistFilter = new PIXI.EyeFishFilter();
    //this.space.filters = [new PIXI.EyeFishFilter()];



    this.wormhole = new PIXI.DisplayObjectContainer();

    var wormholeTexture = PIXI.Texture.fromImage("./supernova.jpg");
    this.sprite = new PIXI.TilingSprite(wormholeTexture, 1024,1024);
    sprite.position.x = 256;
    sprite.position.y = 256;
    sprite.width = 512;
    sprite.height = 512;
    //sprite.scale.x = 1;
   // sprite.scale.y = 1;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;

    this.sprite = sprite;

    this.wormhole.addChild(sprite);

    var mask = new PIXI.Graphics();
    mask.beginFill(0xFFFF0B, 0.5);
    mask.drawCircle(256,256, 256);
    this.wormhole.addChild(mask);

    this.wormhole.position.x = canvas.width/2 -256;
    this.wormhole.position.y = canvas.height/2 -256;
    
    this.wormhole.mask = mask;

    this.wormhole.filters = [new PIXI.EyeFishFilter()];
    this.wormhole.filters[0].uniforms.iGlobalTime = 0;
    
    this.stage.addChild(this.wormhole);

    /*var wormholeTexture = PIXI.Texture.fromImage("./galaxy-sphere-texture.png");
    this.wormhole = new PIXI.Sprite(wormholeTexture);
    this.wormhole.position.x = canvas.width/2;
    this.wormhole.position.y = canvas.height/2 ;

    this.wormhole.width = 512;
    this.wormhole.height = 512;

    this.wormhole.anchor.x = 0.5;
    this.wormhole.anchor.y = 0.5;

    //var filter = new PIXI.EyeFishFilter();
    var twist = new PIXI.TwistFilter();
    twist.offset.x = twist.offset.y = 0.5;
    this.wormhole.filters = [twist];
    this.stage.addChild(this.wormhole);*/
  };

  var _render = function() {
    
    //this.sprite.tilePosition.x += 1;
    //this.sprite.rotation += 0.01;
    //this.sprite.anchor.x += 0.01;
    //this.wormhole.filters[0].uniforms.iGlobalTime += 16;
    //this.sprite.filters[0].dirty = true;

    this.space.tilePosition.x -= 0.1;
    this.space.rotation += 0.0001;
    
    this.renderer.render(this.stage);
  };

  var _start = function() {
    (function animloop(){
      requestAnimationFrame(animloop);
      _render();
    })();
  };

  _init();
  _start();

};