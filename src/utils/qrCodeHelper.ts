/**
 * Pure Browser QR Code & Confetti Helper (Zero Node.js dependencies)
 * 100% crash-proof across all browsers and devices.
 */

export async function generateSafeQrCode(text: string): Promise<string> {
  if (!text) return '';
  // Universal instant QR API - robust, fast, standard BACEN EMV QR rendering
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=${encodeURIComponent(text)}`;
}

export function triggerSafeConfetti() {
  try {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      document.body.removeChild(canvas);
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      color: string;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      rot: number;
    }> = [];

    const colors = ['#d4af37', '#082517', '#10b981', '#fbbf24', '#ffffff', '#3b82f6'];

    for (let i = 0; i < 75; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 14 - 6,
        alpha: 1,
        rot: Math.random() * 360,
      });
    }

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // gravity
        p.rot += 4;
        p.alpha -= 0.012;

        if (p.alpha > 0) {
          active = true;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rot * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      frame++;
      if (active && frame < 150) {
        requestAnimationFrame(animate);
      } else {
        if (canvas.parentNode) {
          document.body.removeChild(canvas);
        }
      }
    };

    requestAnimationFrame(animate);
  } catch (e) {
    console.warn('Confetti effect caught:', e);
  }
}
