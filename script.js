
        /* ─── LOADER ─── */
        const lf = document.getElementById('lf');
        const lpct = document.getElementById('lpct');
        const loader = document.getElementById('loader');
        let p = 0;
        const li = setInterval(() => {
          p += Math.random() * 22;
          if (p >= 100) { p = 100; clearInterval(li); }
          lf.style.width = p + '%';
          lpct.textContent = Math.floor(p) + '%';
          if (p === 100) setTimeout(() => loader.classList.add('out'), 350);
        }, 90);

        /* ─── STARFIELD + SHOOTING STARS ─── */
        const cvs = document.getElementById('cvs');
        const ctx = cvs.getContext('2d');
        let W, H, stars = [], meteors = [];

        function resize() { W = cvs.width = innerWidth; H = cvs.height = innerHeight; }
        resize(); addEventListener('resize', resize);

        for (let i = 0; i < 240; i++) stars.push({
          x: Math.random() * 2000, y: Math.random() * 2000,
          r: Math.random() * 1.15,
          vy: 0.03 + Math.random() * 0.1,
          o: 0.12 + Math.random() * 0.55,
          tw: Math.random() * Math.PI * 2
        });

        function spawnMeteor() {
          meteors.push({
            x: Math.random() * W, y: -20,
            len: 100 + Math.random() * 160,
            spd: 7 + Math.random() * 9,
            ang: Math.PI / 5.5,
            op: 1
          });
        }
        setInterval(spawnMeteor, 3500);

        function render() {
          ctx.clearRect(0, 0, W, H);
          const t = Date.now() * .001;
          stars.forEach(s => {
            s.y += s.vy; if (s.y > H) { s.y = -2; s.x = Math.random() * W; }
            const tw = .45 + .55 * Math.sin(t * 1.6 + s.tw);
            ctx.beginPath(); ctx.arc(s.x % W, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200,215,255,${s.o * tw})`; ctx.fill();
          });
          meteors.forEach((m, i) => {
            m.x += Math.cos(m.ang) * m.spd;
            m.y += Math.sin(m.ang) * m.spd;
            m.op -= .016;
            const g = ctx.createLinearGradient(m.x, m.y, m.x - Math.cos(m.ang) * m.len, m.y - Math.sin(m.ang) * m.len);
            g.addColorStop(0, `rgba(167,139,250,${m.op})`);
            g.addColorStop(1, 'rgba(167,139,250,0)');
            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(m.x - Math.cos(m.ang) * m.len, m.y - Math.sin(m.ang) * m.len);
            ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke();
            if (m.op <= 0) meteors.splice(i, 1);
          });
          requestAnimationFrame(render);
        }
        render();

        /* ─── ORB PARALLAX ─── */
        addEventListener('mousemove', e => {
          const ox = (e.clientX / innerWidth - .5) * 45;
          const oy = (e.clientY / innerHeight - .5) * 45;
          document.querySelector('.orb-a').style.transform = `translate(${ox}px,${oy}px)`;
          document.querySelector('.orb-b').style.transform = `translate(${-ox * .55}px,${-oy * .55}px)`;
          document.querySelector('.orb-c').style.transform = `translate(${ox * .3}px,${-oy * .3}px)`;
        });

        /* ─── SKILL CARD 3D TILT + GLOW ─── */
        document.querySelectorAll('.sk-card').forEach(card => {
          const glow = card.querySelector('.sk-card-glow');
          card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const cx = e.clientX - r.left, cy = e.clientY - r.top;
            const rx2 = (cy / r.height - .5) * 12;
            const ry2 = (.5 - cx / r.width) * 12;
            card.style.transform = `perspective(700px) rotateX(${rx2}deg) rotateY(${ry2}deg) scale(1.02)`;
            glow.style.left = cx + 'px'; glow.style.top = cy + 'px';
          });
          card.addEventListener('mouseleave', () => {
            card.style.transform = '';
          });
        });

        /* ─── TYPEWRITER ─── */
        const phrases = [
          'Building Android apps with Java',
          'Designing clean & functional UI',
          'Crafting responsive web tools with HTML & CSS',
          'Managing code & projects with Git/GitHub',
          'Turning practical ideas into software',
          'Working towards tech entrepreneurship',
          'Aspiring Digital Nomad, InshaAllah',
          'Focusing on independent deep work',
          'Learning and building every single day',
        ];
        let pi = 0, ci = 0, del = false;
        const tw = document.getElementById('twText');
        function type() {
          const ph = phrases[pi];
          if (!del) {
            tw.textContent = ph.slice(0, ++ci);
            if (ci === ph.length) { del = true; setTimeout(type, 1600); return; }
            setTimeout(type, 52);
          } else {
            tw.textContent = ph.slice(0, --ci);
            if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
            setTimeout(type, del ? 28 : 52);
          }
        }
        setTimeout(type, 2000);

        /* ─── SCROLL PROGRESS + NAV COMPACT ─── */
        const prog = document.getElementById('sprogress');
        const nav = document.getElementById('nav');
        addEventListener('scroll', () => {
          prog.style.width = (scrollY / (document.body.scrollHeight - innerHeight) * 100) + '%';
          nav.classList.toggle('compact', scrollY > 60);
        });

        /* ─── INTERSECTION OBSERVER ─── */
        function countUp(el, target) {
          let s = null, dur = 1800;
          const step = ts => {
            if (!s) s = ts;
            const pr = Math.min((ts - s) / dur, 1);
            const e = 1 - Math.pow(1 - pr, 3);
            el.textContent = Math.floor(e * target) + (target === 100 ? '%' : '+');
            if (pr < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }

        const io = new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            if (el.dataset.to) countUp(el, +el.dataset.to);
            el.classList.add('on');
            // skill bars
            el.querySelectorAll && el.querySelectorAll('.sb-fill').forEach(b => {
              b.style.width = b.dataset.w + '%';
            });
            io.unobserve(el);
          });
        }, { threshold: 0.15 });

        document.querySelectorAll('[data-to], .sk-card, .proj-card, .t-item, .reveal, .sb-fill').forEach(el => io.observe(el));

        /* ─── CLICK PARTICLE BURST ─── */
        document.addEventListener('click', e => {
          const colors = ['#6366f1', '#a78bfa', '#f472b6', '#34d399', '#22d3ee'];
          for (let i = 0; i < 10; i++) {
            const s = document.createElement('div');
            s.className = 'spark';
            s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;background:${colors[i % colors.length]};`;
            const angle = (i / 10) * Math.PI * 2;
            const dist = 40 + Math.random() * 60;
            s.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
            s.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
            document.body.appendChild(s);
            setTimeout(() => s.remove(), 650);
          }
        });
  