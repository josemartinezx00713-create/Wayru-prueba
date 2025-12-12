import Koa from 'koa';
import Router from 'koa-router';

const app = new Koa();
const router = new Router();

// Ruta raíz
router.get('/', (ctx) => {
  ctx.body = { msg: 'Hola desde Koa' };
});

// Ruta /health
router.get('/health', (ctx) => {
  ctx.body = { status: 'ok' };
});

// Conecta el router al app
app.use(router.routes()).use(router.allowedMethods());

// Escucha en el puerto
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor mínimo corriendo en http://localhost:${PORT}`);
});
