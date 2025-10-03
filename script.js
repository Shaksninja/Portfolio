// Utility: seeded random for reproducible decorative charts
function rng(seed){ let x = Math.sin(seed) * 10000; return x - Math.floor(x); }
function series(n, amp, seed){
  const out=[]; let v=amp/2;
  for(let i=0;i<n;i++){ v += (rng(seed+i)-0.5)*amp*0.25; v=Math.max(amp*0.1, Math.min(amp*0.9, v)); out.push(v); }
  return out;
}

// Simple line painter on canvas (no libs)
function drawLine(canvas, data, color1='#7b5cff', color2='#4aa3ff'){
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = w*dpr; canvas.height = h*dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,w,h);

  const g = ctx.createLinearGradient(0,0,w,0);
  g.addColorStop(0,color2); g.addColorStop(1,color1);
  ctx.lineWidth = 2; ctx.strokeStyle = g;

  const max = Math.max(...data), min = Math.min(...data);
  const pad = 8;
  ctx.beginPath();
  data.forEach((v,i)=>{
    const x = pad + (w-2*pad) * (i/(data.length-1));
    const y = h - pad - ( (v-min)/(max-min+1e-6) ) * (h-2*pad);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();

  // subtle glow dots
  ctx.fillStyle = '#b7a6ff';
  data.forEach((v,i)=>{
    const x = pad + (w-2*pad) * (i/(data.length-1));
    const y = h - pad - ( (v-min)/(max-min+1e-6) ) * (h-2*pad);
    ctx.globalAlpha = 0.15; ctx.beginPath(); ctx.arc(x,y,6,0,Math.PI*2); ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawBars(container, seed){
  container.innerHTML = '';
  const months = 6;
  for(let i=0;i<months;i++){
    const bar = document.createElement('div');
    bar.className = 'bar';
    const fill = document.createElement('div');
    fill.className = 'fill';
    const h = 20 + Math.floor(rng(seed+i)*70);
    fill.style.height = h + '%';
    bar.appendChild(fill);
    container.appendChild(bar);
  }
}

function drawDonut(canvas, seed){
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = w*dpr; canvas.height = h*dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr,dpr);
  const cx=w/2, cy=h/2, r=Math.min(w,h)/2 - 8;

  const parts = [0.42,0.36,0.22].map((v,i)=>v*(0.8 + rng(seed+i)*0.4));
  const colors = ['#7b5cff','#4aa3ff','#ff9d4d'];

  let start = -Math.PI/2;
  parts.forEach((p,i)=>{
    const end = start + p*2*Math.PI;
    ctx.beginPath(); ctx.arc(cx,cy,r,start,end); ctx.strokeStyle=colors[i]; ctx.lineWidth=14; ctx.stroke();
    start = end + 0.08; // gap
  });

  // inner ring
  ctx.beginPath(); ctx.arc(cx,cy,r-20,0,Math.PI*2);
  ctx.strokeStyle='#232a44'; ctx.lineWidth=6; ctx.stroke();
}

function drawRadial(canvas, seed){
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = w*dpr; canvas.height = h*dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,w,h);

  const cx = 90, cy = h/2+20;
  const rings = 6, bars = 24;
  for(let r=0;r<rings;r++){
    ctx.strokeStyle = '#1e2438'; ctx.beginPath(); ctx.arc(cx,cy,30+r*16,0,Math.PI*2); ctx.stroke();
  }
  for(let i=0;i<bars;i++){
    const ang = (-Math.PI/2) + i*(Math.PI*1.6/(bars-1));
    const len = 20 + rng(seed+i)*70;
    const r0 = 30, r1 = r0+len;
    const x0 = cx + r0*Math.cos(ang), y0 = cy + r0*Math.sin(ang);
    const x1 = cx + r1*Math.cos(ang), y1 = cy + r1*Math.sin(ang);
    const g = ctx.createLinearGradient(x0,y0,x1,y1);
    g.addColorStop(0,'#3844ff'); g.addColorStop(1,'#7b5cff');
    ctx.strokeStyle = g; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
  }
}

function drawWave(canvas, seed){
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = w*dpr; canvas.height = h*dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr,dpr);

  ctx.strokeStyle = '#586099'; ctx.lineWidth = 2;
  ctx.beginPath();
  for(let x=0;x<w;x++){
    const y = h/2 + Math.sin((x/28) + seed)*10 + Math.sin((x/7)+seed*2)*2;
    if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();
}

function init(){
  document.querySelectorAll('.spark').forEach(c=>{
    const seed = Number(c.dataset.seed||1);
    drawLine(c, series(28, 100, seed));
  });
  document.querySelectorAll('.mini-line').forEach(c=>{
    const seed = Number(c.dataset.seed||2);
    drawLine(c, series(18, 80, seed), '#4aa3ff', '#7b5cff');
  });
  document.querySelectorAll('.line').forEach(c=>{
    const seed = Number(c.dataset.seed||3);
    drawLine(c, series(14, 120, seed));
  });
  document.querySelectorAll('.bar-group').forEach((el,i)=>drawBars(el, Number(el.dataset.seed||5)+i));
  document.querySelectorAll('.donut-canvas').forEach((c,i)=>drawDonut(c, Number(c.dataset.seed||6)+i));
  document.querySelectorAll('.radial-canvas').forEach((c,i)=>drawRadial(c, Number(c.dataset.seed||7)+i));
  document.querySelectorAll('.wave').forEach((c,i)=>drawWave(c, Number(c.dataset.seed||8)+i));
}

window.addEventListener('load', init);
window.addEventListener('resize', init);
