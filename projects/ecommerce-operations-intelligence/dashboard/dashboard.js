const money=new Intl.NumberFormat("en-US",{style:"currency",currency:"BRL",maximumFractionDigits:0});const number=new Intl.NumberFormat("en-US");const pct=new Intl.NumberFormat("en-US",{maximumFractionDigits:1});async function load(){const r=await fetch("data/summary.json");if(!r.ok)throw new Error("Analytics data has not been generated yet. Run the GitHub Actions workflow.");return r.json()}function setKpis(d){for(const [k,v] of Object.entries(d.kpis)){const e=document.querySelector('[data-kpi="'+k+'"]');if(!e)continue;if(["revenue","aov","freight_value"].includes(k))e.textContent=money.format(v);else if(k.endsWith("_pct"))e.textContent=pct.format(v)+"%";else if(k==="avg_review_score")e.textContent=Number(v).toFixed(2)+"/5";else e.textContent=number.format(v)}}function plot(id,t,l){Plotly.newPlot(id,[t],Object.assign({paper_bgcolor:"transparent",plot_bgcolor:"transparent",font:{color:"#33463d"},margin:{l:55,r:20,t:40,b:50}},l),{responsive:true,displayModeBar:false})}function renderCharts(d){plot("monthlyChart",{x:d.monthly.map(x=>x.month),y:d.monthly.map(x=>x.revenue),type:"scatter",mode:"lines",fill:"tozeroy",line:{color:"#176a52",width:3},fillcolor:"rgba(23,106,82,.13)"},{title:{text:"Monthly merchandise revenue",font:{size:18}},xaxis:{title:"Month"},yaxis:{title:"BRL"}});const cats=d.categories.slice(0,8).reverse();plot("categoryChart",{x:cats.map(x=>x.revenue),y:cats.map(x=>x.category),type:"bar",orientation:"h",marker:{color:"#176a52"}},{title:{text:"Top product categories by revenue",font:{size:18}},xaxis:{title:"BRL"},yaxis:{automargin:true}});const states=d.states.slice(0,10).reverse();plot("stateChart",{x:states.map(x=>x.revenue),y:states.map(x=>x.state),type:"bar",orientation:"h",marker:{color:"#7cab62"}},{title:{text:"Top customer states by revenue",font:{size:18}},xaxis:{title:"BRL"},yaxis:{automargin:true}});const r=d.rfm_segments;plot("rfmChart",{labels:r.map(x=>x.segment),values:r.map(x=>x.customers),type:"pie",hole:.58},{title:{text:"Observed customer segments",font:{size:18}},showlegend:true})}function renderInsights(d){document.getElementById("insightsList").innerHTML=d.insights.map(x=>"<li>"+x+"</li>").join("");document.getElementById("recommendations").innerHTML=d.recommendations.map((x,i)=>'<article class="recommendation"><span>RECOMMENDATION '+String(i+1).padStart(2,"0")+'</span><h3>Investigation priority</h3><p>'+x+'</p></article>').join("");const rows=d.review_delivery.map(x=>'<tr><td>'+x.delay_group+'</td><td>'+number.format(x.orders)+'</td><td>'+Number(x.avg_review).toFixed(2)+'</td></tr>').join("");document.getElementById("reviewTable").innerHTML='<table class="review-table"><thead><tr><th>Delivery group</th><th>Orders</th><th>Avg review</th></tr></thead><tbody>'+rows+"</tbody></table>"}function init3D(d){
  const el=document.getElementById("threeContainer");
  const tooltip=document.getElementById("threeTooltip");
  const W=Math.max(el.clientWidth,320), H=Math.max(el.clientHeight,500);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(38,W/H,.1,1000);
  camera.position.set(0,24,38);

  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setSize(W,H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  el.innerHTML="";
  el.appendChild(renderer.domElement);

  const group=new THREE.Group();
  scene.add(group);

  const pts=d.states.filter(x=>Number.isFinite(x.lat)&&Number.isFinite(x.lon)&&x.revenue>0);
  const refLat=pts.reduce((sum,p)=>sum+p.lat,0)/pts.length;
  const cosRef=Math.cos(refLat*Math.PI/180);

  const geoPts=pts.map(p=>({
    ...p,
    x:p.lon*cosRef,
    z:-p.lat
  }));

  const minX=Math.min(...geoPts.map(p=>p.x)), maxX=Math.max(...geoPts.map(p=>p.x));
  const minZ=Math.min(...geoPts.map(p=>p.z)), maxZ=Math.max(...geoPts.map(p=>p.z));
  const geoW=Math.max(maxX-minX,1), geoH=Math.max(maxZ-minZ,1);
  const targetH=30;
  const targetW=Math.max(24,targetH*(geoW/geoH));
  const sx=targetW/geoW, sz=targetH/geoH;
  const maxRev=Math.max(...geoPts.map(p=>p.revenue));

  const floor=new THREE.Mesh(
    new THREE.PlaneGeometry(targetW+4,targetH+4),
    new THREE.MeshStandardMaterial({color:0x17382f,roughness:.92,metalness:.04})
  );
  floor.rotation.x=-Math.PI/2;
  floor.position.y=-2.2;
  group.add(floor);

  const grid=new THREE.GridHelper(
    Math.max(targetW,targetH)+4,
    16,0x365a4f,0x25483f
  );
  grid.scale.set(
    targetW/(Math.max(targetW,targetH)+4),
    1,
    targetH/(Math.max(targetW,targetH)+4)
  );
  grid.position.y=-2.15;
  group.add(grid);

  const bars=[];
  geoPts.forEach(p=>{
    const px=(p.x-(minX+maxX)/2)*sx;
    const pz=(p.z-(minZ+maxZ)/2)*sz;
    const h=1.2+Math.sqrt(p.revenue/maxRev)*9.5;
    const geo=new THREE.BoxGeometry(0.78,h,0.78);
    const mat=new THREE.MeshStandardMaterial({
      color:0xc7f27c,
      emissive:0x163d2d,
      emissiveIntensity:.3,
      roughness:.55
    });
    const mesh=new THREE.Mesh(geo,mat);
    mesh.position.set(px,h/2-2.1,pz);
    mesh.userData=p;
    group.add(mesh);
    bars.push(mesh);
  });

  scene.add(new THREE.HemisphereLight(0xddeee3,0x10261f,1.35));
  const key=new THREE.DirectionalLight(0xffffff,1.8);
  key.position.set(8,24,12);
  scene.add(key);

  // Critical framing fix: aim the camera at the analytical scene, not horizontally past it.
  const cameraTarget=new THREE.Vector3(0,2.0,0);
  camera.lookAt(cameraTarget);

  let dragging=false,lastX=0,lastY=0;
  el.addEventListener("pointerdown",e=>{
    dragging=true;
    lastX=e.clientX; lastY=e.clientY;
    el.setPointerCapture?.(e.pointerId);
  });
  el.addEventListener("pointerup",e=>{
    dragging=false;
    el.releasePointerCapture?.(e.pointerId);
  });
  el.addEventListener("pointerleave",()=>dragging=false);
  el.addEventListener("pointermove",e=>{
    if(dragging){
      group.rotation.y+=(e.clientX-lastX)*.006;
      group.rotation.x=Math.max(-0.18,Math.min(0.12,group.rotation.x+(e.clientY-lastY)*.003));
      lastX=e.clientX; lastY=e.clientY;
    }

    // Recruiter-friendly analytical tooltip.
    if(tooltip){
      const rect=el.getBoundingClientRect();
      const mouse=new THREE.Vector2(
        ((e.clientX-rect.left)/rect.width)*2-1,
        -((e.clientY-rect.top)/rect.height)*2+1
      );
      const raycaster=new THREE.Raycaster();
      raycaster.setFromCamera(mouse,camera);
      const hit=raycaster.intersectObjects(bars,false)[0];
      if(hit){
        const p=hit.object.userData;
        tooltip.style.display="block";
        tooltip.style.left=(e.clientX-rect.left+14)+"px";
        tooltip.style.top=(e.clientY-rect.top+14)+"px";
        tooltip.innerHTML="<strong>"+p.state+"</strong><span>Revenue "+money.format(p.revenue)+"</span><span>Orders "+number.format(p.orders)+"</span><span>On-time "+Number(p.on_time_rate_pct).toFixed(1)+"%</span>";
        bars.forEach(b=>b.material.emissiveIntensity=b===hit.object?.35:.3);
      }else{
        tooltip.style.display="none";
        bars.forEach(b=>b.material.emissiveIntensity=.3);
      }
    }
  });

  group.rotation.x=-0.05;

  function animate(){
    requestAnimationFrame(animate);
    if(!dragging)group.rotation.y+=0.0007;
    renderer.render(scene,camera);
  }
  animate();

  document.getElementById("threeLegend").innerHTML=
    "<span>3D GEOGRAPHIC VIEW</span><strong>Column height = revenue</strong><small>All state points shown · Drag to rotate · Hover a bar for details</small>";

  const resize=()=>{
    const w=Math.max(el.clientWidth,320),h=Math.max(el.clientHeight,500);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
    camera.lookAt(cameraTarget);
    renderer.setSize(w,h);
  };
  window.addEventListener("resize",resize);
}load().then(d=>{setKpis(d);renderCharts(d);renderInsights(d);init3D(d)}).catch(err=>{document.body.innerHTML='<main style="padding:5rem;font-family:system-ui"><h1>Project build pending</h1><p>'+err.message+'</p><p>Once the GitHub Actions pipeline completes, reload this page.</p></main>'});