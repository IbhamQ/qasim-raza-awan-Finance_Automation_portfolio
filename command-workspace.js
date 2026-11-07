// One fixed-camera scene, two connected streams; SVG remains if WebGL is unavailable.
const hosts=[...document.querySelectorAll('[data-workspace]')];
function status(host,text){const el=host.querySelector('.scene-load-status');if(el&&el.textContent!==text){el.textContent=text;el.dataset.state='ready';}}
if(hosts.length)import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js').then(T=>hosts.forEach(h=>mount(T,h))).catch(()=>hosts.forEach(h=>status(h,'Animated workflow illustration · example connections')));
function mount(T,host){
 const viewport=host.querySelector('.mesh-viewport');let renderer;
 try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{status(host,'Animated workflow illustration · example connections');return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.setClearColor(0x080c14,0);renderer.domElement.setAttribute('aria-hidden','true');viewport.append(renderer.domElement);
 const scene=new T.Scene(),camera=new T.OrthographicCamera(-10,10,6,-6,.1,100);camera.position.set(4.5,8,15);camera.lookAt(0,1.1,0);
 scene.add(new T.AmbientLight(0xd4e8ff,1.9));const key=new T.DirectionalLight(0xffffff,2.8);key.position.set(-5,10,6);scene.add(key);
 const resources=[],materials=[],textures=[];function mat(color,emissive=0){const m=new T.MeshStandardMaterial({color,roughness:.65,metalness:.22,emissive,emissiveIntensity:.25});materials.push(m);return m;}
 const surface=mat(0x183144),bronze=mat(0x8c5639),cyan=mat(0x3b9ba8,0x007d87),copper=mat(0xc87a4b,0x6a3011),green=mat(0x38b97d,0x12542f);
 const geo=new T.BoxGeometry(1,1,1),edgeGeo=new T.EdgesGeometry(geo);resources.push(geo,edgeGeo);const edgeMat=new T.LineBasicMaterial({color:0x63849b});materials.push(edgeMat);
 const grid=new T.GridHelper(14,20,0x315c72,0x1a3549);grid.position.y=-.04;scene.add(grid);resources.push(grid.geometry);materials.push(grid.material);
 function mesh(x,z,w,h,d,m){const g=new T.Group();g.add(new T.Mesh(geo,m),new T.LineSegments(edgeGeo,edgeMat));g.scale.set(w,h,d);g.position.set(x,h/2,z);scene.add(g);return g;}
 function label(text,x,z,y){const c=document.createElement('canvas');c.width=512;c.height=80;const ctx=c.getContext('2d');ctx.clearRect(0,0,512,80);ctx.fillStyle='#cddbe6';ctx.font='500 27px monospace';ctx.textAlign='center';ctx.fillText(text,256,49);const tx=new T.CanvasTexture(c);tx.colorSpace=T.SRGBColorSpace;textures.push(tx);const m=new T.SpriteMaterial({map:tx,transparent:true,depthTest:false});materials.push(m);const sprite=new T.Sprite(m);sprite.scale.set(3.1,.49,1);sprite.position.set(x,y,z);scene.add(sprite);}

 const asset=name=>new URL('./brand-assets/'+name+'.svg',import.meta.url).href;
 const loaders=new T.TextureLoader();
 function artwork(url,x,z,w,h,standing=false){
  const planeGeo=new T.PlaneGeometry(w,h);resources.push(planeGeo);
  const material=new T.MeshBasicMaterial({color:0xffffff,transparent:true,side:T.DoubleSide});materials.push(material);
  const plane=new T.Mesh(planeGeo,material);plane.position.set(x,standing?2.2:.65,z);if(!standing)plane.rotation.x=-Math.PI/2;
  scene.add(plane);loaders.load(url,texture=>{texture.colorSpace=T.SRGBColorSpace;textures.push(texture);material.map=texture;material.needsUpdate=true;start();},undefined,()=>{});return plane;
 }
 // Brand tiles are rendered as CSS 3D artwork in the same scene panel.
 // Their images stay readable regardless of GPU SVG-texture support.
 // A dimensional spreadsheet with actual synthetic rows, rather than a blank block.
 const c=document.createElement('canvas');c.width=768;c.height=480;const ctx=c.getContext('2d');
 ctx.fillStyle='#e8eeed';ctx.fillRect(0,0,768,480);ctx.fillStyle='#21423e';ctx.fillRect(0,0,768,64);ctx.fillStyle='#ffffff';ctx.font='500 25px monospace';ctx.fillText('FINANCE CONTROL / SOURCE',28,41);
 const rows=[['REFERENCE','BOOKED','BILLED'],['INV-1042','1,200.00','1,200.00'],['INV-1043','750.00','725.00'],['INV-1044','480.00','480.00'],['CONTROL','2,430.00','2,405.00']];
 rows.forEach((row,i)=>{ctx.fillStyle=i===2?'#ead4c0':i%2?'#eef3f0':'#d4dfda';ctx.fillRect(20,82+i*70,728,68);ctx.fillStyle='#1b3540';ctx.font=i===0?'500 22px monospace':'22px monospace';row.forEach((t,j)=>ctx.fillText(t,32+j*242,125+i*70));});
 const sheetTexture=new T.CanvasTexture(c);sheetTexture.colorSpace=T.SRGBColorSpace;textures.push(sheetTexture);const sheetGeometry=new T.PlaneGeometry(5.1,3.2);resources.push(sheetGeometry);const sheetMaterial=new T.MeshBasicMaterial({map:sheetTexture,side:T.DoubleSide});materials.push(sheetMaterial);const sheet=new T.Mesh(sheetGeometry,sheetMaterial);sheet.position.set(-4.1,2.2,0);sheet.rotation.y=.08;scene.add(sheet);
 mesh(0,0,2.3,1.65,2.1,surface);mesh(0,0,1.65,1.83,1.4,bronze);
 artwork(new URL('./finnovative/logo.png',import.meta.url).href,0,-.05,1.15,.93,true);
 label('API / CONTROL ENGINE',0,.6,3.1);
 const dbGeo=new T.CylinderGeometry(1.05,1.05,2.2,32),dbMat=mat(0x164052);resources.push(dbGeo);const db=new T.Mesh(dbGeo,dbMat);db.position.set(5,1.1,.1);scene.add(db);
 const ringMat=new T.MeshBasicMaterial({color:0x719daf});materials.push(ringMat);for(let i=0;i<4;i++){const g=new T.TorusGeometry(1.06,.018,5,40);resources.push(g);const ring=new T.Mesh(g,ringMat);ring.rotation.x=Math.PI/2;ring.position.set(5,.15+i*.64,.1);scene.add(ring);}label('LEDGER / DATABASE',5,.1,3.1);
 const routes=[[[-4.1,0],[0,0],[5,0]],[[-4.1,1.6],[-2,1.6],[-2,0],[0,0]],[[0,0],[0,2.3],[5,2.3],[5,0]]];
 function pipeline(points,color){for(let i=1;i<points.length;i++){const a=new T.Vector3(points[i-1][0],.18,points[i-1][1]),b=new T.Vector3(points[i][0],.18,points[i][1]);if(a.distanceTo(b)<.01)continue;const cylinder=new T.CylinderGeometry(.04,.04,a.distanceTo(b),6);resources.push(cylinder);const tube=new T.Mesh(cylinder,color);tube.position.copy(a).add(b).multiplyScalar(.5);tube.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());scene.add(tube);}}
 routes.forEach((r,i)=>pipeline(r,i%2?cyan:copper));
 const packets=routes.map((route,i)=>({route,phase:i/3,mesh:mesh(0,0,.14,.14,.14,i%2?cyan:copper)}));
 function point(route,t){const spans=route.slice(1).map((v,i)=>Math.abs(v[0]-route[i][0])+Math.abs(v[1]-route[i][1]));let distance=t*spans.reduce((a,v)=>a+v,0);for(let i=0;i<spans.length;i++){if(distance<=spans[i]||i===spans.length-1){const f=Math.min(1,distance/spans[i]);return [route[i][0]+(route[i+1][0]-route[i][0])*f,route[i][1]+(route[i+1][1]-route[i][1])*f];}distance-=spans[i];}return route.at(-1);}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let visible=false,frame=0,disposed=false,last=0;
 function render(time){packets.forEach(p=>{const t=reduced.matches ? .65 : (time/11000+p.phase)%1,[x,z]=point(p.route,t);p.mesh.position.set(x,.28,z);});renderer.render(scene,camera);viewport.dataset.ready='true';status(host,'3D workflow preview · example connections');}
 function tick(time){frame=0;if(disposed||!visible||document.hidden)return;if(time-last>=33){render(time);last=time;}if(!reduced.matches)frame=requestAnimationFrame(tick);}
 function start(){cancelAnimationFrame(frame);frame=0;if(visible&&!document.hidden){render(performance.now());if(!reduced.matches)frame=requestAnimationFrame(tick);}}
 function resize(){
  const w=viewport.clientWidth,h=viewport.clientHeight;if(!w||!h)return;
  camera.updateMatrixWorld(true);
  const xs=[],ys=[];
  // Fit the hardware, not the decorative floor. This avoids the distant-grid view.
  for(const x of [-6.9,6.2])for(const y of [0,4.0])for(const z of [-1.5,2.6]){
   const v=new T.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse);xs.push(v.x);ys.push(v.y);
  }
  const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),aspect=w/h;
  let width=(maxX-minX)*1.08,height=(maxY-minY)*1.08;
  if(width/height<aspect)width=height*aspect;else height=width/aspect;
  const cx=(minX+maxX)/2,cy=(minY+maxY)/2;
  camera.left=cx-width/2;camera.right=cx+width/2;camera.top=cy+height/2;camera.bottom=cy-height/2;
  camera.updateProjectionMatrix();renderer.setSize(w,h,false);start();
 }
 const ro=new ResizeObserver(resize);ro.observe(viewport);const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;start();});io.observe(viewport);reduced.addEventListener('change',start);document.addEventListener('visibilitychange',start);
 function cleanup(e){if(e.persisted)return;disposed=true;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();reduced.removeEventListener('change',start);document.removeEventListener('visibilitychange',start);resources.forEach(r=>r.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();window.removeEventListener('pagehide',cleanup);}
 window.addEventListener('pagehide',cleanup);resize();
}
