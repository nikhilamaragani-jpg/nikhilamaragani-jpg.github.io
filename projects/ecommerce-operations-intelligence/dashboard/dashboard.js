const money=new Intl.NumberFormat("en-US",{style:"currency",currency:"BRL",maximumFractionDigits:0});const number=new Intl.NumberFormat("en-US");const pct=new Intl.NumberFormat("en-US",{maximumFractionDigits:1});async function load(){const r=await fetch("data/summary.json");if(!r.ok)throw new Error("Analytics data has not been generated yet. Run the GitHub Actions workflow.");return r.json()}function setKpis(d){for(const [k,v] of Object.entries(d.kpis)){const e=document.querySelector('[data-kpi="'+k+'"]');if(!e)continue;if(["revenue","aov","freight_value"].includes(k))e.textContent=money.format(v);else if(k.endsWith("_pct"))e.textContent=pct.format(v)+"%";else if(k==="avg_review_score")e.textContent=Number(v).toFixed(2)+"/5";else e.textContent=number.format(v)}}function plot(id,t,l){Plotly.newPlot(id,[t],Object.assign({paper_bgcolor:"transparent",plot_bgcolor:"transparent",font:{color:"#33463d"},margin:{l:55,r:20,t:40,b:50}},l),{responsive:true,displayModeBar:false})}function renderCharts(d){plot("monthlyChart",{x:d.monthly.map(x=>x.month),y:d.monthly.map(x=>x.revenue),type:"scatter",mode:"lines",fill:"tozeroy",line:{color:"#176a52",width:3},fillcolor:"rgba(23,106,82,.13)"},{title:{text:"Monthly merchandise revenue",font:{size:18}},xaxis:{title:"Month"},yaxis:{title:"BRL"}});const cats=d.categories.slice(0,8).reverse();plot("categoryChart",{x:cats.map(x=>x.revenue),y:cats.map(x=>x.category),type:"bar",orientation:"h",marker:{color:"#176a52"}},{title:{text:"Top product categories by revenue",font:{size:18}},xaxis:{title:"BRL"},yaxis:{automargin:true}});const states=d.states.slice(0,10).reverse();plot("stateChart",{x:states.map(x=>x.revenue),y:states.map(x=>x.state),type:"bar",orientation:"h",marker:{color:"#7cab62"}},{title:{text:"Top customer states by revenue",font:{size:18}},xaxis:{title:"BRL"},yaxis:{automargin:true}});const r=d.rfm_segments;plot("rfmChart",{labels:r.map(x=>x.segment),values:r.map(x=>x.customers),type:"pie",hole:.58},{title:{text:"Observed customer segments",font:{size:18}},showlegend:true})}function renderInsights(d){document.getElementById("insightsList").innerHTML=d.insights.map(x=>"<li>"+x+"</li>").join("");document.getElementById("recommendations").innerHTML=d.recommendations.map((x,i)=>'<article class="recommendation"><span>RECOMMENDATION '+String(i+1).padStart(2,"0")+'</span><h3>Investigation priority</h3><p>'+x+'</p></article>').join("");const rows=d.review_delivery.map(x=>'<tr><td>'+x.delay_group+'</td><td>'+number.format(x.orders)+'</td><td>'+Number(x.avg_review).toFixed(2)+'</td></tr>').join("");document.getElementById("reviewTable").innerHTML='<table class="review-table"><thead><tr><th>Delivery group</th><th>Orders</th><th>Avg review</th></tr></thead><tbody>'+rows+"</tbody></table>"}function init3D(d){
  const el=document.getElementById("threeContainer");
  const detailState=document.getElementById("threeDetailState");
  const detailRevenue=document.getElementById("detailRevenue");
  const detailOrders=document.getElementById("detailOrders");
  const detailOnTime=document.getElementById("detailOnTime");
  const detailReview=document.getElementById("detailReview");
  const metricButtons=[...document.querySelectorAll("[data-3d-metric]")];

  const W=Math.max(el.clientWidth,320), H=Math.max(el.clientHeight,460);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(38,W/H,.1,1000);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setSize(W,H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  if("outputColorSpace" in renderer) renderer.outputColorSpace=THREE.SRGBColorSpace;
  el.innerHTML="";
  el.appendChild(renderer.domElement);

  const group=new THREE.Group();
  scene.add(group);

  const pts=d.states.filter(x=>Number.isFinite(x.lat)&&Number.isFinite(x.lon)&&x.revenue>0);
  const refLat=pts.reduce((sum,p)=>sum+p.lat,0)/pts.length;
  const cosRef=Math.cos(refLat*Math.PI/180);
  const geoPts=pts.map(p=>({...p,x:p.lon*cosRef,z:-p.lat}));

  const minX=Math.min(...geoPts.map(p=>p.x)), maxX=Math.max(...geoPts.map(p=>p.x));
  const minZ=Math.min(...geoPts.map(p=>p.z)), maxZ=Math.max(...geoPts.map(p=>p.z));
  const geoW=Math.max(maxX-minX,1), geoH=Math.max(maxZ-minZ,1);
  const targetH=26;
  const targetW=Math.max(22,targetH*(geoW/geoH));
  const sx=targetW/geoW, sz=targetH/geoH;
  const maxValues={
    revenue:Math.max(...geoPts.map(p=>p.revenue)),
    orders:Math.max(...geoPts.map(p=>p.orders)),
    on_time_rate_pct:100,
    avg_review:5
  };

  const floor=new THREE.Mesh(
    new THREE.PlaneGeometry(targetW+3,targetH+3),
    new THREE.MeshStandardMaterial({color:0x17382f,roughness:.92,metalness:.03})
  );
  floor.rotation.x=-Math.PI/2;
  floor.position.y=-2.25;
  group.add(floor);

  const grid=new THREE.GridHelper(Math.max(targetW,targetH)+3,18,0x365a4f,0x25483f);
  grid.scale.set(targetW/(Math.max(targetW,targetH)+3),1,targetH/(Math.max(targetW,targetH)+3));
  grid.position.y=-2.2;
  group.add(grid);

  const bars=[];
  const labels=[];

  geoPts.forEach(p=>{
    const px=(p.x-(minX+maxX)/2)*sx;
    const pz=(p.z-(minZ+maxZ)/2)*sz;
    const geo=new THREE.BoxGeometry(.74,1,.74);
    const mat=new THREE.MeshStandardMaterial({
      color:0xc7f27c,
      emissive:0x163d2d,
      emissiveIntensity:.22,
      roughness:.55
    });
    const mesh=new THREE.Mesh(geo,mat);
    mesh.position.set(px,-1.7,pz);
    mesh.userData=p;
    group.add(mesh);
    bars.push(mesh);

    const canvas=document.createElement("canvas");
    canvas.width=256; canvas.height=64;
    const ctx=canvas.getContext("2d");
    ctx.font="600 30px Arial";
    ctx.textAlign="center";
    ctx.fillStyle="rgba(232,244,235,.9)";
    ctx.fillText(p.state,128,42);
    const texture=new THREE.CanvasTexture(canvas);
    const spriteMat=new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false});
    const sprite=new THREE.Sprite(spriteMat);
    sprite.scale.set(2.8,.7,1);
    sprite.position.set(px,-1.15,pz);
    sprite.visible=false;
    group.add(sprite);
    labels.push(sprite);
  });

  scene.add(new THREE.HemisphereLight(0xe2eee5,0x10261f,1.35));
  const key=new THREE.DirectionalLight(0xffffff,1.9);
  key.position.set(10,25,10);
  scene.add(key);

  const cameraTarget=new THREE.Vector3(0,0,0);
  let currentMetric="revenue";
  let dragging=false,lastX=0,lastY=0;

  function metricValue(p){ return Number(p[currentMetric]||0); }
  function metricLabel(){
    return currentMetric==="revenue" ? "REVENUE" :
      currentMetric==="orders" ? "ORDERS" :
      currentMetric==="on_time_rate_pct" ? "ON-TIME DELIVERY" : "REVIEW SCORE";
  }
  function formatMetric(p){
    const v=metricValue(p);
    if(currentMetric==="revenue") return money.format(v);
    if(currentMetric==="orders") return number.format(v);
    if(currentMetric==="on_time_rate_pct") return Number(v).toFixed(1)+"%";
    return Number(v).toFixed(2)+"/5";
  }
  function updateDetail(p){
    if(!p) return;
    detailState.textContent=p.state;
    detailRevenue.textContent=money.format(p.revenue);
    detailOrders.textContent=number.format(p.orders);
    detailOnTime.textContent=Number(p.on_time_rate_pct).toFixed(1)+"%";
    detailReview.textContent=p.avg_review==null?"—":Number(p.avg_review).toFixed(2)+"/5";
  }
  function updateScene(){
    const maxV=maxValues[currentMetric];
    bars.forEach((bar,i)=>{
      const p=bar.userData;
      const norm=Math.max(0,Math.min(1,metricValue(p)/(maxV||1)));
      const h=1.25+Math.sqrt(norm)*8.8;
      bar.scale.y=h;
      bar.position.y=-2.1+h/2;
      labels[i].position.y=-2.1+h+.9;
      labels[i].visible=norm>.58;
      bar.material.emissiveIntensity=.22;
    });
    document.getElementById("threeLegend").innerHTML=
      "<span>3D GEOGRAPHIC EXPLORER</span><strong>Height = "+metricLabel()+"</strong><small>27 Brazilian states · Hover for data · Drag to rotate</small>";
  }
  function setMetric(metric){
    currentMetric=metric;
    metricButtons.forEach(b=>b.classList.toggle("active",b.dataset["3dMetric"]===metric));
    updateScene();
  }
  metricButtons.forEach(b=>b.addEventListener("click",()=>setMetric(b.dataset["3dMetric"])));

  el.addEventListener("pointerdown",e=>{
    dragging=true;lastX=e.clientX;lastY=e.clientY;
    el.setPointerCapture?.(e.pointerId);
  });
  el.addEventListener("pointerup",e=>{
    dragging=false;el.releasePointerCapture?.(e.pointerId);
  });
  el.addEventListener("pointerleave",()=>dragging=false);

  const raycaster=new THREE.Raycaster();
  el.addEventListener("pointermove",e=>{
    if(dragging){
      group.rotation.y+=(e.clientX-lastX)*.006;
      group.rotation.x=Math.max(-.14,Math.min(.12,group.rotation.x+(e.clientY-lastY)*.003));
      lastX=e.clientX;lastY=e.clientY;
      return;
    }
    const rect=el.getBoundingClientRect();
    const mouse=new THREE.Vector2(
      ((e.clientX-rect.left)/rect.width)*2-1,
      -((e.clientY-rect.top)/rect.height)*2+1
    );
    raycaster.setFromCamera(mouse,camera);
    const hit=raycaster.intersectObjects(bars,false)[0];
    if(hit){
      updateDetail(hit.object.userData);
      bars.forEach(b=>b.material.emissiveIntensity=b===hit.object ? .55 : .22);
    }else{
      bars.forEach(b=>b.material.emissiveIntensity=.22);
    }
  });

  // Keep the full map centered and framed at load/resize.
  camera.position.set(0,20.5,34);
  camera.lookAt(cameraTarget);
  group.rotation.x=-.035;

  updateDetail(pts.slice().sort((a,b)=>b.revenue-a.revenue)[0]);
  updateScene();

  function animate(){
    requestAnimationFrame(animate);
    if(!dragging)group.rotation.y+=.00045;
    renderer.render(scene,camera);
  }
  animate();

  const resize=()=>{
    const w=Math.max(el.clientWidth,320),h=Math.max(el.clientHeight,460);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
    camera.lookAt(cameraTarget);
    renderer.setSize(w,h);
  };
  window.addEventListener("resize",resize);
}load().then(d=>{setKpis(d);renderCharts(d);renderInsights(d);init3D(d)}).catch(err=>{document.body.innerHTML='<main style="padding:5rem;font-family:system-ui"><h1>Project build pending</h1><p>'+err.message+'</p><p>Once the GitHub Actions pipeline completes, reload this page.</p></main>'});