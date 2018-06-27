function randomPoint(o) {
  return {x: Math.random() - o, y: Math.random() - o};
}

function dist2(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return dx*dx + dy*dy;
}

function start() {
  const canvas = document.getElementById('target');
  const ctx = canvas.getContext('2d');

  const points = [];
  for (var i = 0; i < 200; i++) {
    points.push({p: randomPoint(0), v: randomPoint(0.5)});
  }

  canvas.onmousemove = function(event) {
    const r = 0.1;
    const m = {
      x: event.clientX / canvas.width,
      y: event.clientY / canvas.height};
    for (var i = 0; i < points.length; i++) {
      const p = points[i].p;
      const dx = p.x - m.x;
      const dy = p.y - m.y;
      const d2 = dx*dx + dy*dy;
      if (d2 < r*r) {
        const l = Math.sqrt(d2);
        p.x += r*r * dx / l;
        p.y += r*r * dy / l;
      }
    }
  };
  
  var tp = null;
  function animate(t) {
    //step
    const dt = t - tp;
    tp = t;
    
    const v = 0.00006;
    for (var i = 0; i < points.length; i++) {
      const point = points[i];
      point.p.x += v * point.v.x * dt;
      point.p.y += v * point.v.y * dt;
      point.p.x %= 1;
      point.p.y %= 1;
    }
    const lines = [];
    for (var i = 0; i < points.length; i++) {
      for (var j = i+1; j < points.length; j++) {
        const pi = points[i].p;
        const pj = points[j].p;
        const r2 = dist2(pi, pj);
        //console.log(r2);
        if (r2 < 0.02) {
          lines.push(i, j);
        }
      }
    }
    
    // draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#888";
    for (var i = 0; i < points.length; i++) {
      const p = points[i].p;
      const x = p.x
      const y = p.y;
      ctx.fillRect(x * canvas.width, y * canvas.height, 2, 2);
    }

    ctx.strokeStyle="#8883";

    for (var i = 0; i < lines.length; i+=2) {
      ctx.beginPath();
      const pa = points[lines[i+0]].p;
      const pb = points[lines[i+1]].p;
      ctx.moveTo(pa.x * canvas.width, pa.y * canvas.height);
      ctx.lineTo(pb.x * canvas.width, pb.y * canvas.height);
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

function ready() {
  start();
}
document.addEventListener('DOMContentLoaded', ready);
