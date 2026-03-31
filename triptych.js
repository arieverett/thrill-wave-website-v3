/* ============================================
   TRIPTYCH CANVAS ANIMATIONS
   Shared by index.html and sitrep.html
   ============================================ */
(function () {
  function init(id, drawFn) {
    var c = document.getElementById(id);
    if (!c) return;
    var ctx = c.getContext("2d");
    var W, H, dpr;
    function resize() {
      dpr = window.devicePixelRatio || 1;
      var r = c.parentElement.getBoundingClientRect();
      W = r.width;
      H = r.height;
      c.width = W * dpr;
      c.height = H * dpr;
      c.style.width = W + "px";
      c.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);
    var state = drawFn.setup(W, H);
    (function loop() {
      resize();
      drawFn.draw(ctx, W, H, state);
      requestAnimationFrame(loop);
    })();
  }

  /* --- INGEST --- */
  init("c1", {
    setup: function (W, H) {
      var streams = [],
        collected = [],
        num = 12;
      for (var i = 0; i < num; i++) {
        var y = H * 0.12 + i * ((H * 0.55) / num),
          dots = [];
        for (var j = 0; j < Math.floor(Math.random() * 10) + 6; j++) {
          dots.push({
            x: Math.random() * W * 0.65,
            speed: 0.25 + Math.random() * 0.65,
            size: 1 + Math.random() * 1.2,
            alpha: 0.12 + Math.random() * 0.3,
          });
        }
        streams.push({
          y: y,
          dots: dots,
          baseAlpha: 0.025 + Math.random() * 0.035,
        });
      }
      return { streams: streams, collected: collected };
    },
    draw: function (ctx, W, H, s) {
      var collectX = W * 0.8;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < s.streams.length; i++) {
        var st = s.streams[i];
        ctx.strokeStyle = "rgba(255,255,255," + st.baseAlpha + ")";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, st.y);
        ctx.lineTo(collectX, st.y);
        ctx.stroke();
        for (var j = 0; j < st.dots.length; j++) {
          var d = st.dots[j];
          d.x += d.speed;
          if (d.x > collectX - 4) {
            d.x = Math.random() * -50 - 10;
            s.collected.push({
              x: collectX,
              y: st.y,
              vy: (Math.random() - 0.5) * 0.4,
              alpha: 0.5,
              size: d.size,
            });
          }
          ctx.fillStyle = "rgba(255,255,255," + d.alpha + ")";
          ctx.fillRect(d.x, st.y - d.size / 2, d.size * 2.2, d.size);
        }
      }
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(collectX, H * 0.08);
      ctx.lineTo(collectX, H * 0.72);
      ctx.stroke();
      for (var k = s.collected.length - 1; k >= 0; k--) {
        var p = s.collected[k];
        p.x += 0.25;
        p.y += p.vy;
        p.alpha -= 0.01;
        if (p.alpha <= 0) {
          s.collected.splice(k, 1);
          continue;
        }
        ctx.fillStyle = "rgba(255,255,255," + p.alpha + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  });

  /* --- SYNTHESIZE --- */
  init("c2", {
    setup: function (W, H) {
      var nodes = [],
        clusters = [
          { x: W * 0.3, y: H * 0.3 },
          { x: W * 0.65, y: H * 0.45 },
          { x: W * 0.4, y: H * 0.6 },
        ];
      for (var i = 0; i < 35; i++) {
        var cl = clusters[Math.floor(Math.random() * clusters.length)];
        var angle = Math.random() * Math.PI * 2,
          dist = 18 + Math.random() * 70;
        nodes.push({
          x: cl.x + Math.cos(angle) * dist,
          y: cl.y + Math.sin(angle) * dist,
          tx: cl.x + Math.cos(angle) * (12 + Math.random() * 35),
          ty: cl.y + Math.sin(angle) * (12 + Math.random() * 35),
          ox: cl.x + Math.cos(angle) * dist,
          oy: cl.y + Math.sin(angle) * dist,
          size: 1 + Math.random() * 1.8,
          alpha: 0.12 + Math.random() * 0.35,
          cluster: clusters.indexOf(cl),
          phase: Math.random() * Math.PI * 2,
          speed: 0.003 + Math.random() * 0.005,
        });
      }
      return { nodes: nodes, clusters: clusters, t: 0 };
    },
    draw: function (ctx, W, H, s) {
      s.t++;
      ctx.clearRect(0, 0, W, H);
      var progress = Math.min(1, Math.sin(s.t * 0.007) * 0.5 + 0.5);
      for (var i = 0; i < s.nodes.length; i++) {
        var n = s.nodes[i],
          drift = Math.sin(s.t * n.speed + n.phase) * 2.5;
        n.x = n.ox + (n.tx - n.ox) * progress + drift;
        n.y =
          n.oy +
          (n.ty - n.oy) * progress +
          Math.cos(s.t * n.speed * 0.7 + n.phase) * 1.5;
      }
      for (var i = 0; i < s.nodes.length; i++) {
        for (var j = i + 1; j < s.nodes.length; j++) {
          var a = s.nodes[i],
            b = s.nodes[j];
          if (a.cluster !== b.cluster) continue;
          var dx = a.x - b.x,
            dy = a.y - b.y,
            dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 55) {
            ctx.strokeStyle =
              "rgba(255,255,255," + (1 - dist / 55) * 0.1 * progress + ")";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (var ci = 0; ci < s.clusters.length; ci++) {
        for (var cj = ci + 1; cj < s.clusters.length; cj++) {
          var minD = Infinity,
            bA = null,
            bB = null;
          for (var i = 0; i < s.nodes.length; i++) {
            if (s.nodes[i].cluster !== ci) continue;
            for (var j = 0; j < s.nodes.length; j++) {
              if (s.nodes[j].cluster !== cj) continue;
              var dx = s.nodes[i].x - s.nodes[j].x,
                dy = s.nodes[i].y - s.nodes[j].y;
              var dd = Math.sqrt(dx * dx + dy * dy);
              if (dd < minD) {
                minD = dd;
                bA = s.nodes[i];
                bB = s.nodes[j];
              }
            }
          }
          if (bA && bB && progress > 0.3) {
            ctx.strokeStyle =
              "rgba(224,96,0," + ((progress - 0.3) / 0.7) * 0.06 + ")";
            ctx.lineWidth = 0.8;
            ctx.setLineDash([3, 4]);
            ctx.beginPath();
            ctx.moveTo(bA.x, bA.y);
            ctx.lineTo(bB.x, bB.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }
      for (var i = 0; i < s.nodes.length; i++) {
        var n = s.nodes[i];
        ctx.fillStyle =
          "rgba(255,255,255," + (n.alpha * 0.5 + progress * 0.12) + ")";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  });

  /* --- EXECUTE --- */
  init("c3", {
    setup: function (W, H) {
      var beams = [],
        numBeams = 6;
      for (var i = 0; i < numBeams; i++) {
        var angle = -Math.PI * 0.32 + i * ((Math.PI * 0.64) / (numBeams - 1));
        beams.push({ angle: angle, length: 0, maxLength: W * 0.72, alpha: 0 });
      }
      return { beams: beams, rings: [], particles: [], t: 0, ringTimer: 0 };
    },
    draw: function (ctx, W, H, s) {
      s.t++;
      s.ringTimer++;
      var ox = W * 0.2,
        oy = H * 0.42;
      ctx.clearRect(0, 0, W, H);
      if (s.ringTimer > 50) {
        s.ringTimer = 0;
        s.rings.push({ r: 7, alpha: 0.2 });
      }
      for (var i = s.rings.length - 1; i >= 0; i--) {
        var ring = s.rings[i];
        ring.r += 0.35;
        ring.alpha -= 0.0025;
        if (ring.alpha <= 0) {
          s.rings.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = "rgba(255,255,255," + ring.alpha + ")";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(ox, oy, ring.r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(224,96,0,0.07)";
      ctx.beginPath();
      ctx.arc(ox, oy, 5.5 + Math.sin(s.t * 0.05) * 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.beginPath();
      ctx.arc(ox, oy, 2.2, 0, Math.PI * 2);
      ctx.fill();
      for (var i = 0; i < s.beams.length; i++) {
        var b = s.beams[i];
        var tl = b.maxLength * (0.55 + Math.sin(s.t * 0.011 + i * 0.9) * 0.4);
        b.length += (tl - b.length) * 0.018;
        b.alpha = 0.035 + Math.sin(s.t * 0.014 + i * 1.1) * 0.018;
        var ex = ox + Math.cos(b.angle) * b.length,
          ey = oy + Math.sin(b.angle) * b.length;
        ctx.strokeStyle = "rgba(255,255,255," + b.alpha + ")";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        if (s.t % 3 === 0 && Math.random() > 0.45) {
          var spread = (Math.random() - 0.5) * 0.05,
            speed = 1.2 + Math.random() * 1.8;
          s.particles.push({
            x: ox,
            y: oy,
            vx: Math.cos(b.angle + spread) * speed,
            vy: Math.sin(b.angle + spread) * speed,
            alpha: 0.25 + Math.random() * 0.25,
            size: 0.7 + Math.random(),
            life: 1,
          });
        }
      }
      for (var i = s.particles.length - 1; i >= 0; i--) {
        var p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.007;
        p.alpha = p.life * 0.35;
        if (p.life <= 0) {
          s.particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = "rgba(255,255,255," + p.alpha + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  });
})();
