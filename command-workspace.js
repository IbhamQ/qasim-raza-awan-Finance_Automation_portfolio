// One fixed-camera scene, two connected streams; SVG remains if WebGL is unavailable.
const hosts=[...document.querySelectorAll('[data-workspace]')];
if(hosts.length)import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js').then(T=>hosts.forEach(h=>mount(T,h))).catch(()=>{});
function mount(T,host){
 const viewport=host.querySelector('.mesh-viewport');let renderer;
 try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.setClearColor(0x080c14,0);renderer.domElement.setAttribute('aria-hidden','true');viewport.append(renderer.domElement);
 const scene=new T.Scene(),camera=new T.OrthographicCamera(-10,10,6,-6,.1,100);camera.position.set(9,13,17);camera.lookAt(0,0,0);
 scene.add(new T.AmbientLight(0xd4e8ff,1.9));const key=new T.DirectionalLight(0xffffff,2.8);key.position.set(-5,10,6);scene.add(key);
 const resources=[],materials=[],textures=[];function mat(color,emissive=0){const m=new T.MeshStandardMaterial({color,roughness:.65,metalness:.22,emissive,emissiveIntensity:.25});materials.push(m);return m;}
 const surface=mat(0x183144),bronze=mat(0x8c5639),cyan=mat(0x3b9ba8,0x007d87),copper=mat(0xc87a4b,0x6a3011),green=mat(0x38b97d,0x12542f);
 const geo=new T.BoxGeometry(1,1,1),edgeGeo=new T.EdgesGeometry(geo);resources.push(geo,edgeGeo);const edgeMat=new T.LineBasicMaterial({color:0x63849b});materials.push(edgeMat);
 const grid=new T.GridHelper(19,24,0x315c72,0x1a3549);grid.position.y=-.04;scene.add(grid);resources.push(grid.geometry);materials.push(grid.material);
 function mesh(x,z,w,h,d,m){const g=new T.Group();g.add(new T.Mesh(geo,m),new T.LineSegments(edgeGeo,edgeMat));g.scale.set(w,h,d);g.position.set(x,h/2,z);scene.add(g);return g;}
 function label(text,x,z,y){const c=document.createElement('canvas');c.width=512;c.height=80;const ctx=c.getContext('2d');ctx.clearRect(0,0,512,80);ctx.fillStyle='#cddbe6';ctx.font='500 27px monospace';ctx.textAlign='center';ctx.fillText(text,256,49);const tx=new T.CanvasTexture(c);tx.colorSpace=T.SRGBColorSpace;textures.push(tx);const m=new T.SpriteMaterial({map:tx,transparent:true,depthTest:false});materials.push(m);const sprite=new T.Sprite(m);sprite.scale.set(3.1,.49,1);sprite.position.set(x,y,z);scene.add(sprite);}
 const nodes=[[-6,-2.4,'VOICE / WHATSAPP',.9,cyan],[-.8,-2.4,'AVAILABILITY',1.3,surface],[4.6,-2.4,'BOOKING / CRM',1.1,green],[-6,2.5,'INVOICE DATA',.85,bronze],[-.8,2.5,'RECONCILIATION',1.5,surface],[4.6,2.5,'POWER BI REPORT',1.1,copper]];
 nodes.forEach(([x,z,name,h,m],i)=>{mesh(x,z,1.85,h,1.55,m);label(name,x,z,h+.6);if(i===5)for(let b=0;b<3;b++)mesh(x-.5+b*.45,z,.22,.2+b*.18,.3,copper);});
 const routes=[[[-6,-2.4],[-.8,-2.4],[4.6,-2.4]],[[-6,2.5],[-.8,2.5],[4.6,2.5]],[[-.8,-2.4],[-.8,2.5]]];
 function pipeline(points,color){for(let i=1;i<points.length;i++){const a=new T.Vector3(points[i-1][0],.18,points[i-1][1]),b=new T.Vector3(points[i][0],.18,points[i][1]);const cylinder=new T.CylinderGeometry(.045,.045,a.distanceTo(b),6);resources.push(cylinder);const tube=new T.Mesh(cylinder,color);tube.position.copy(a).add(b).multiplyScalar(.5);tube.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());scene.add(tube);}}
 routes.forEach((r,i)=>pipeline(r,i===0?cyan:copper));
 const packets=[];routes.forEach((route,i)=>{for(let n=0;n<3;n++)packets.push({route,phase:n/3+i*.11,mesh:mesh(0,0,.16,.16,.16,i===0?cyan:copper)});});
 function point(route,t){const spans=route.slice(1).map((v,i)=>Math.abs(v[0]-route[i][0])+Math.abs(v[1]-route[i][1]));let distance=t*spans.reduce((a,v)=>a+v,0);for(let i=0;i<spans.length;i++){if(distance<=spans[i]||i===spans.length-1){const f=Math.min(1,distance/spans[i]);return [route[i][0]+(route[i+1][0]-route[i][0])*f,route[i][1]+(route[i+1][1]-route[i][1])*f];}distance-=spans[i];}return route.at(-1);}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let visible=false,frame=0,disposed=false,last=0;
 function render(time){packets.forEach(p=>{const t=reduced.matches ? .65 : (time/11000+p.phase)%1,[x,z]=point(p.route,t);p.mesh.position.set(x,.28,z);});renderer.render(scene,camera);viewport.dataset.ready='true';}
 function tick(time){frame=0;if(disposed||!visible||document.hidden)return;if(time-last>=33){render(time);last=time;}if(!reduced.matches)frame=requestAnimationFrame(tick);}
 function start(){cancelAnimationFrame(frame);frame=0;if(visible&&!document.hidden){render(performance.now());if(!reduced.matches)frame=requestAnimationFrame(tick);}}
 function resize(){const w=viewport.clientWidth,h=viewport.clientHeight;if(!w||!h)return;const a=w/h,half=Math.max(5.7,9.6/a);camera.left=-half*a;camera.right=half*a;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();renderer.setSize(w,h,false);start();}
 const ro=new ResizeObserver(resize);ro.observe(viewport);const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;start();});io.observe(viewport);reduced.addEventListener('change',start);document.addEventListener('visibilitychange',start);
 function cleanup(e){if(e.persisted)return;disposed=true;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();reduced.removeEventListener('change',start);document.removeEventListener('visibilitychange',start);resources.forEach(r=>r.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();window.removeEventListener('pagehide',cleanup);}
 window.addEventListener('pagehide',cleanup);resize();
}
