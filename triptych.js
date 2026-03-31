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
  init("c1", {
    setup: function (W, H) {
      var streams = [],
        collected = [];
      for (var i = 0; i < 12; i++) {
        var y = H * 0.12 + i * ((H * 0.55) / 12),
          dots = [];
        for (var j = 0; j < Math.floor(Math.random() * 10) + 6; j++)
          dots.push({
            x: Math.random() * W * 0.65,
            speed: 0.25 + Math.random() * 0.65,
            size: 1 + Math.random() * 1.2,
            alpha: 0.12 + Math.random() * 0.3,
          });
        streams.push({
          y: y,
          dots: dots,
          baseAlpha: 0.025 + Math.random() * 0.035,
        });
      }
      return { streams: streams, collected: collected };
    },
    draw: function (ctx, W, H, s) {
      var cx = W * 0.8;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < s.streams.length; i++) {
        var st = s.streams[i];
        ctx.strokeStyle = "rgba(255,255,255," + st.baseAlpha + ")";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, st.y);
        ctx.lineTo(cx, st.y);
        ctx.stroke();
        for (var j = 0; j < st.dots.length; j++) {
          var d = st.dots[j];
          d.x += d.speed;
          if (d.x > cx - 4) {
            d.x = Math.random() * -50 - 10;
            s.collected.push({
              x: cx,
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
      ctx.moveTo(cx, H * 0.08);
      ctx.lineTo(cx, H * 0.72);
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
  init("c2", {
    setup: function (W, H) {
      var nodes = [],
        cl = [
          { x: W * 0.3, y: H * 0.3 },
          { x: W * 0.65, y: H * 0.45 },
          { x: W * 0.4, y: H * 0.6 },
        ];
      for (var i = 0; i < 35; i++) {
        var c = cl[Math.floor(Math.random() * cl.length)],
          a = Math.random() * Math.PI * 2,
          dist = 18 + Math.random() * 70;
        nodes.push({
          x: c.x + Math.cos(a) * dist,
          y: c.y + Math.sin(a) * dist,
          tx: c.x + Math.cos(a) * (12 + Math.random() * 35),
          ty: c.y + Math.sin(a) * (12 + Math.random() * 35),
          ox: c.x + Math.cos(a) * dist,
          oy: c.y + Math.sin(a) * dist,
          size: 1 + Math.random() * 1.8,
          alpha: 0.12 + Math.random() * 0.35,
          cluster: cl.indexOf(c),
          phase: Math.random() * Math.PI * 2,
          speed: 0.003 + Math.random() * 0.005,
        });
      }
      return { nodes: nodes, clusters: cl, t: 0 };
    },
    draw: function (ctx, W, H, s) {
      s.t++;
      ctx.clearRect(0, 0, W, H);
      var pr = Math.min(1, Math.sin(s.t * 0.007) * 0.5 + 0.5);
      for (var i = 0; i < s.nodes.length; i++) {
        var n = s.nodes[i];
        n.x =
          n.ox + (n.tx - n.ox) * pr + Math.sin(s.t * n.speed + n.phase) * 2.5;
        n.y =
          n.oy +
          (n.ty - n.oy) * pr +
          Math.cos(s.t * n.speed * 0.7 + n.phase) * 1.5;
      }
      for (var i = 0; i < s.nodes.length; i++)
        for (var j = i + 1; j < s.nodes.length; j++) {
          var a = s.nodes[i],
            b = s.nodes[j];
          if (a.cluster !== b.cluster) continue;
          var d = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
          if (d < 55) {
            ctx.strokeStyle =
              "rgba(255,255,255," + (1 - d / 55) * 0.1 * pr + ")";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      for (var ci = 0; ci < s.clusters.length; ci++)
        for (var cj = ci + 1; cj < s.clusters.length; cj++) {
          var mD = Infinity,
            bA,
            bB;
          for (var i = 0; i < s.nodes.length; i++) {
            if (s.nodes[i].cluster !== ci) continue;
            for (var j = 0; j < s.nodes.length; j++) {
              if (s.nodes[j].cluster !== cj) continue;
              var dd = Math.sqrt(
                (s.nodes[i].x - s.nodes[j].x) ** 2 +
                  (s.nodes[i].y - s.nodes[j].y) ** 2,
              );
              if (dd < mD) {
                mD = dd;
                bA = s.nodes[i];
                bB = s.nodes[j];
              }
            }
          }
          if (bA && bB && pr > 0.3) {
            ctx.strokeStyle =
              "rgba(224,96,0," + ((pr - 0.3) / 0.7) * 0.06 + ")";
            ctx.lineWidth = 0.8;
            ctx.setLineDash([3, 4]);
            ctx.beginPath();
            ctx.moveTo(bA.x, bA.y);
            ctx.lineTo(bB.x, bB.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      for (var i = 0; i < s.nodes.length; i++) {
        var n = s.nodes[i];
        ctx.fillStyle = "rgba(255,255,255," + (n.alpha * 0.5 + pr * 0.12) + ")";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  });
  init("c3", {
    setup: function (W, H) {
      var beams = [];
      for (var i = 0; i < 6; i++)
        beams.push({
          angle: -Math.PI * 0.32 + i * ((Math.PI * 0.64) / 5),
          length: 0,
          maxLength: W * 0.72,
          alpha: 0,
        });
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
        var r = s.rings[i];
        r.r += 0.35;
        r.alpha -= 0.0025;
        if (r.alpha <= 0) {
          s.rings.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = "rgba(255,255,255," + r.alpha + ")";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(ox, oy, r.r, 0, Math.PI * 2);
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
        b.length +=
          (b.maxLength * (0.55 + Math.sin(s.t * 0.011 + i * 0.9) * 0.4) -
            b.length) *
          0.018;
        b.alpha = 0.035 + Math.sin(s.t * 0.014 + i * 1.1) * 0.018;
        ctx.strokeStyle = "rgba(255,255,255," + b.alpha + ")";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(
          ox + Math.cos(b.angle) * b.length,
          oy + Math.sin(b.angle) * b.length,
        );
        ctx.stroke();
        if (s.t % 3 === 0 && Math.random() > 0.45) {
          var sp = (Math.random() - 0.5) * 0.05,
            spd = 1.2 + Math.random() * 1.8;
          s.particles.push({
            x: ox,
            y: oy,
            vx: Math.cos(b.angle + sp) * spd,
            vy: Math.sin(b.angle + sp) * spd,
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
