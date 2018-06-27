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
    const rect = event.target.getBoundingClientRect();
    const m = {
      x: (event.clientX - rect.left) / canvas.width,
      y: (event.clientY - rect.top) / canvas.height};
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
      if (point.p.x < 0) point.p.x += 1;
      point.p.y %= 1;
      if (point.p.y < 0) point.p.y += 1;
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

    const radius = 0.14;
    for (var i = 0; i < points.length; i++) {
      for (var j = i+1; j < points.length; j++) {
        const pi = points[i].p;
        const pj = points[j].p;
        const r2 = dist2(pi, pj);
        if (r2 < radius*radius) {
          const alpha = 1 - r2 / (radius*radius);
          ctx.strokeStyle="rgba(200, 200, 200, " + alpha + ")";
          ctx.beginPath();
          ctx.moveTo(pi.x * canvas.width, pi.y * canvas.height);
          ctx.lineTo(pj.x * canvas.width, pj.y * canvas.height);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

function ready() {
  start();
}
document.addEventListener('DOMContentLoaded', ready);
