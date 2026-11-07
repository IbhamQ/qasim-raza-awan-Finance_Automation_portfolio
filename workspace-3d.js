// Fixed orthographic data scenes. Real meshes; no camera drift or organic motion.
const hosts=[...document.querySelectorAll('[data-workspace]')];
if(hosts.length){
 import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js')
 .then(THREE=>hosts.forEach(host=>mount(THREE,host)))
 .catch(()=>{}); // The accessible SVG and register remain visible if WebGL cannot load.
}
function mount(T,host){
 const viewport=host.querySelector('.mesh-viewport');
 let renderer;
 try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.setClearColor(0x182d45,0);
 renderer.domElement.setAttribute('aria-hidden','true');viewport.append(renderer.domElement);
 const company=host.dataset.workspace==='company';
 const scene=new T.Scene(),camera=new T.OrthographicCamera(-8,8,4,-4,.1,100);
 camera.position.set(9,11,17);camera.lookAt(0,0,0);
 scene.add(new T.AmbientLight(0xffffff,2));
 const light=new T.DirectionalLight(0xfff1dc,3);light.position.set(-5,10,8);scene.add(light);
 const geometry=new T.BoxGeometry(1,1,1),edges=new T.EdgesGeometry(geometry),resources=[geometry,edges],materials=[];
 const mat=color=>{const m=new T.MeshStandardMaterial({color,roughness:1,metalness:0,flatShading:true});materials.push(m);return m;};
 const stone=mat(company?0xb8c3c9:0xc6b9bd),copper=mat(company?0xba7953:0x9a4b5f),white=mat(0xe8e0d3),edgeMat=new T.LineBasicMaterial({color:0x667d92});materials.push(edgeMat);
 const grid=new T.GridHelper(18,18,0x597087,0x344c63);grid.position.y=-.04;scene.add(grid);resources.push(grid.geometry);materials.push(grid.material);
 function box(x,z,w,h,d,material){const g=new T.Group(),mesh=new T.Mesh(geometry,material),wire=new T.LineSegments(edges,edgeMat);g.add(mesh,wire);g.scale.set(w,h,d);g.position.set(x,h/2,z);scene.add(g);return g;}
 function path(points){const g=new T.BufferGeometry().setFromPoints(points.map(p=>new T.Vector3(p[0],.08,p[1]))),m=new T.LineBasicMaterial({color:company?0xb9825d:0xaa7180});resources.push(g);materials.push(m);scene.add(new T.Line(g,m));}
 const routes=company?[[[-6,0],[-1,0],[-1,-2.3],[5,-2.3]],[[-1,0],[2,0],[2,2.5],[5,2.5]]]:[[[-6,-2],[-2,-2],[-2,0],[1,0],[1,-2.3],[5,-2.3]],[[-6,2],[-3,2],[-3,0],[1,0],[1,2.5],[5,2.5]]];
 routes.forEach(path);
 if(company){box(-6,0,2.1,1.5,1.8,white);box(-1,0,2.1,2.1,2.1,stone);box(5,-2.3,2.1,1.4,1.8,copper);box(5,2.5,2.1,1.1,1.8,white);}
 else{for(let i=0;i<3;i++){box(-6,-2+i*.7,.95,.45,.48,white);box(-6,1+i*.7,.95,.45,.48,stone);}box(-1,0,2.6,1.2,2.4,stone);for(let i=0;i<3;i++)box(4.7+i*.65,-2.3,.48,.6,.55,white);box(5,2.5,1.5,.6,1,copper);}
 const dots=routes.map((route,i)=>({route,mesh:box(0,0,.22,.22,.22,copper),shift:i*.5}));
 function travel(points,t){const lengths=points.slice(1).map((p,i)=>Math.abs(p[0]-points[i][0])+Math.abs(p[1]-points[i][1]));let distance=t*lengths.reduce((a,b)=>a+b,0);for(let i=0;i<lengths.length;i++){if(distance<=lengths[i]||i===lengths.length-1){const f=Math.min(1,distance/lengths[i]);return [points[i][0]+(points[i+1][0]-points[i][0])*f,points[i][1]+(points[i+1][1]-points[i][1])*f];}distance-=lengths[i];}return points.at(-1);}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let visible=false,frame=0,disposed=false,last=0;
 function draw(time=0){frame=0;if(disposed)return;dots.forEach(d=>{const t=reduced.matches ? .75 : ((time/11000+d.shift)%1),p=travel(d.route,t);d.mesh.position.set(p[0],.23,p[1]);});renderer.render(scene,camera);viewport.dataset.ready='true';if(visible&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(t=>{if(t-last>32){last=t;draw(t);}else frame=requestAnimationFrame(draw);});}
 function stop(){cancelAnimationFrame(frame);frame=0;}
 function start(){stop();if(visible&&!document.hidden)draw(performance.now());}
 function resize(){const w=viewport.clientWidth,h=viewport.clientHeight;if(!w||!h)return;const a=w/h,half=Math.max(4.5,9/a);camera.left=-half*a;camera.right=half*a;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();renderer.setSize(w,h,false);if(visible)draw(performance.now());}
 const ro=new ResizeObserver(()=>{stop();resize();});ro.observe(viewport);
 const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)start();else stop();});io.observe(viewport);
 const change=()=>start();reduced.addEventListener('change',change);document.addEventListener('visibilitychange',change);
 function cleanup(e){if(e.persisted)return;disposed=true;stop();ro.disconnect();io.disconnect();reduced.removeEventListener('change',change);document.removeEventListener('visibilitychange',change);resources.forEach(r=>r.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();window.removeEventListener('pagehide',cleanup);}
 window.addEventListener('pagehide',cleanup);resize();
}
