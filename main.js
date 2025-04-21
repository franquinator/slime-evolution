import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x333333
});
document.body.appendChild(app.canvas);

const createCircle = (radius, color, x, y) => {
  const circle = new PIXI.Graphics();
  circle.beginFill(color);
  circle.drawCircle(0, 0, radius);
  circle.endFill();
  circle.x = x;
  circle.y = y;
  return circle;
};

const slime = createCircle(30, 0x00FF00, 400, 300);
app.stage.addChild(slime);

const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

const corazones = Array.from({ length: 3 }, (_, i) => {
  const corazon = createCircle(10, 0xFF0000, 20 + i * 30, 20);
  app.stage.addChild(corazon);
  return corazon;
});

let vidas = 3;

const enemigos = Array.from({ length: 5 }, () => {
  const enemigo = createCircle(20, 0x000000, Math.random() * 800, Math.random() * 600);
  enemigo.vx = (Math.random() - 0.5) * 4;
  enemigo.vy = (Math.random() - 0.5) * 4;
  app.stage.addChild(enemigo);
  return enemigo;
});

app.ticker.add(() => {
  if (keys["ArrowLeft"]) slime.x -= 5;
  if (keys["ArrowRight"]) slime.x += 5;
  if (keys["ArrowUp"]) slime.y -= 5;
  if (keys["ArrowDown"]) slime.y += 5;

  slime.x = Math.max(30, Math.min(app.screen.width - 30, slime.x));
  slime.y = Math.max(30, Math.min(app.screen.height - 30, slime.y));

  enemigos.forEach(enemigo => {
    enemigo.x += enemigo.vx;
    enemigo.y += enemigo.vy;

    if (enemigo.x < 0 || enemigo.x > app.screen.width) enemigo.vx *= -1;
    if (enemigo.y < 0 || enemigo.y > app.screen.height) enemigo.vy *= -1;

    const dx = enemigo.x - slime.x;
    const dy = enemigo.y - slime.y;
    const distancia = Math.hypot(dx, dy);

    if (distancia < 50 && enemigo.visible) {
      enemigo.visible = false;
      if (--vidas >= 0) corazones[vidas].visible = false;
      if (vidas === 0) {
        alert("¡Perdiste!");
        app.stop();
      }
    }
  });
});
