// Contact hero: a glossy coral ink drop (raymarched metaballs). Satellite droplets
// orbit and merge, one droplet leans toward the cursor, typing in the form makes
// the surface ripple, and sending the form splashes it.
import { createShaderCanvas } from '../webgl/shaderCanvas.js';

const DROP = `
uniform float uTime; uniform float uPulse; uniform float uSplash; uniform vec2 uRes; uniform vec2 uMouse;
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float map(vec3 p){
  float t=uTime*.45;
  float wob=sin(p.x*3.1+t*2.)*sin(p.y*3.3+t*1.6)*sin(p.z*2.7+t*1.2)*(.05+uPulse*.14);
  float R=1.-uSplash*.55;
  float d=length(p*vec3(1.,.94,1.))-R+wob;
  for(int i=0;i<5;i++){
    float fi=float(i);
    float orbit=1.45+uSplash*(1.6+fi*.4);
    vec3 c=vec3(sin(t*.8+fi*1.7)*orbit,cos(t*.6+fi*2.3)*orbit*.72,sin(t*.5+fi)*.5);
    d=smin(d,length(p-c)-(.13+fi*.035)*(1.-uSplash*.3),.5);
  }
  vec3 m=vec3((uMouse.x-.5)*3.4,(uMouse.y-.5)*2.4,.7);
  d=smin(d,length(p-m)-.2,.55);
  return d;
}
vec3 nrm(vec3 p){vec2 e=vec2(.002,0.);return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec3 ro=vec3(0.,0.,5.), rd=normalize(vec3(uv*1.15,-1.6));
  float t=0., md=9.;
  for(int i=0;i<72;i++){
    float d=map(ro+rd*t);
    md=min(md,d);
    if(d<.001||t>9.)break;
    t+=d*.9;
  }
  if(t>9.){gl_FragColor=vec4(0.);return;}
  vec3 p=ro+rd*t, n=nrm(p);
  vec3 L=normalize(vec3(-.55,.75,.6));
  vec3 coral=vec3(.949,.357,.329), deep=vec3(.42,.1,.09), pale=vec3(1.,.86,.84);
  float dif=clamp(dot(n,L),0.,1.);
  float spec=pow(clamp(dot(reflect(-L,n),-rd),0.,1.),70.);
  float fres=pow(1.-clamp(dot(n,-rd),0.,1.),3.);
  vec3 col=mix(deep,coral,dif*.85+.15);
  col+=pale*spec*1.1+coral*fres*.5;
  col+=pale*pow(clamp(dot(reflect(rd,n),normalize(vec3(.6,.4,.7))),0.,1.),24.)*.25; // second softbox
  gl_FragColor=vec4(col,1.);
}`;

export function initInkDrop(host, form) {
  const view = createShaderCanvas(host, DROP, { dpr: 1.5, stillTime: 3, uniforms: { uPulse: 0, uSplash: 0 } });
  if (!view) return { splash() {} };
  const u = view.state.uniforms;
  let pulse = 0, splashTarget = 0;

  // each keystroke adds a little energy that decays slowly
  form?.addEventListener('input', () => { pulse = Math.min(1, pulse + 0.25); });

  const tick = () => {
    pulse *= 0.965;
    u.uPulse += (pulse - u.uPulse) * 0.1;
    u.uSplash += (splashTarget - u.uSplash) * 0.06;
    requestAnimationFrame(tick);
  };
  tick();

  return {
    splash() {
      splashTarget = 1;
      setTimeout(() => { splashTarget = 0; }, 1400);
    }
  };
}
