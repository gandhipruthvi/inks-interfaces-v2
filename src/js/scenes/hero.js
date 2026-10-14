// Home hero: a coral ink drop falls, splashes (ripples + droplets + crown jet),
// then blooms like ink in still water. The cursor gently stirs it.
// One fragment shader, no three.js, so it loads with the page.
import { createShaderCanvas } from '../webgl/shaderCanvas.js';

const INK = `
uniform float uTime; uniform float uIntro; uniform vec2 uRes; uniform vec2 uMouse;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);
  for(int i=0;i<5;i++){v+=a*noise(p);p=r*p*2.02;a*=.5;}return v;}

void main(){
  float asp=uRes.x/uRes.y;
  vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec2 C=vec2(min(asp*.24,.44),-.02);           // impact point, right of the headline
  if(asp<1.){C=vec2(0.,.12);}                    // portrait: centre-top
  float s=uIntro, t=uTime*.04;

  vec3 ink=vec3(.043), deep=vec3(.25,.075,.065), coral=vec3(.949,.357,.329), pale=vec3(.984,.757,.745);

  // cursor stir: a soft swirl that never jerks
  vec2 m=(uMouse-.5)*vec2(asp,1.);
  vec2 dm=p-m; float fm=exp(-dot(dm,dm)*7.);
  vec2 q=p+vec2(-dm.y,dm.x)*fm*.45;

  // domain-warped ink
  vec2 w1=vec2(fbm(q*1.5+t),fbm(q*1.5-t+3.1));
  vec2 w2=vec2(fbm(q*2.1+w1*1.9+t*1.3+7.2),fbm(q*2.1+w1*1.9-t+1.7));
  float f=fbm(q*1.25+w2*1.7);

  float b=max(s-.95,0.);
  float R=.46*(1.-exp(-b*.6))*(asp<1.?.62:1.);                 // bloom grows fast, then settles
  vec2 dc=(q-C)*vec2(.8,1.1);
  float d=length(dc)+((f-.5)*.6+(w2.x-.5)*.3)*min(1.,R*2.5);   // edges get organic as it grows
  float dens=R>.001?smoothstep(R,R*.1,d):0.;   // equal smoothstep edges are undefined
  dens*=.86+.14*sin(uTime*.35+f*6.);

  vec3 col=ink;
  col=mix(col,deep,smoothstep(0.,.3,dens));
  col=mix(col,coral,smoothstep(.28,.9,dens)*(.5+.5*f));
  float fil=smoothstep(.022,0.,abs(f-.56))*smoothstep(.15,.7,dens);
  col=mix(col,pale,fil*.7);

  float ti=s-.9;
  if(ti>0.){
    // ripples, squashed so they read as a water surface seen at an angle
    float de=length((p-C)*vec2(1.,2.8));
    for(int k=0;k<4;k++){
      float rk=(ti-float(k)*.2)*.42;
      if(rk>0.) col+=pale*smoothstep(.006,0.,abs(de-rk))*exp(-ti*.9)*(1.-float(k)*.2);
    }
    // crown droplets on parabolas
    float tt=min(ti,1.4);
    for(int i=0;i<12;i++){
      float fi=float(i);
      float vx=(hash(vec2(fi,1.))-.5)*.75;
      float vy=.45+hash(vec2(fi,2.))*.5;
      vec2 pos=C+vec2(vx*tt,vy*tt-1.15*tt*tt);
      float r=.011*(1.-tt/1.4)*(.6+hash(vec2(fi,3.)));
      if(pos.y>C.y-.01) col=mix(col,coral,smoothstep(r,r-.003,length(p-pos)));
    }
    // central jet rising then sinking back
    float hj=max(0.,.55*tt-.9*tt*tt);
    vec2 jp=(p-(C+vec2(0.,hj*.55)))*vec2(1.,.45);
    col=mix(col,coral,smoothstep(.016,.012,length(jp))*step(.001,hj));
  } else {
    // the falling drop, with a highlight and a faint trail
    float k=clamp(s/.9,0.,1.);
    float y=mix(.62,C.y,k*k);
    vec2 dd=(p-vec2(C.x,y))*vec2(1.,.72);
    float drop=smoothstep(.024,.02,length(dd));
    col=mix(col,coral,drop);
    col+=pale*smoothstep(.007,0.,length(dd-vec2(-.008,.009)))*drop*.8;
    float trail=smoothstep(.004,0.,abs(p.x-C.x))*smoothstep(y+.12,y,p.y)*step(y,p.y)*k;
    col+=coral*trail*.25;
  }

  // keep the headline side calm, vignette, grain
  if(asp>1.) col*=mix(.32,1.,smoothstep(-asp*.25,.2,p.x));
  col*=1.-.4*dot(p*vec2(.55,1.),p*vec2(.55,1.));
  col+=(hash(gl_FragCoord.xy+fract(uTime))-.5)*.03;
  gl_FragColor=vec4(col,1.);
}`;

export function initHeroScene({ container }) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let introStart = null;
  const begin = () => { introStart ??= performance.now(); };
  window.addEventListener('ii:loaded', begin, { once: true });
  if (document.documentElement.classList.contains('is-loaded')) begin();

  createShaderCanvas(container, INK, {
    dpr: 1.25,
    stillTime: 12,
    uniforms: { uIntro: 0 },
    onFrame: (state) => {
      // ponytail: hold the drop just above the impact frame until the loader lifts
      state.uniforms.uIntro = reduced ? 30 : introStart ?(performance.now() - introStart) / 1000 - 0.25 : -1;
    }
  });
}
