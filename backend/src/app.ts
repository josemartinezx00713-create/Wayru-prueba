import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import prisma from './prisma';

const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.get('/health', (ctx) => {
  ctx.body = { status: 'ok' };
});

router.get('/tasks', async (ctx) => {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
  });
  ctx.body = tasks;
});

router.get('/tasks/:id', async (ctx) => {
  const id = Number(ctx.params.id);

  if (Number.isNaN(id)) {
    ctx.status = 400;
    ctx.body = { error: 'ID inválido' };
    return;
  }

  const task = await prisma.task.findUnique({ where: { id } });

  if (!task) {
    ctx.status = 404;
    ctx.body = { error: 'Tarea no encontrada' };
    return;
  }

  ctx.body = task;
});

router.post('/tasks', async (ctx) => {
  const { title } = ctx.request.body as { title?: string };

  if (!title || title.trim() === '') {
    ctx.status = 400;
    ctx.body = { error: 'El título es obligatorio' };
    return;
  }

  const task = await prisma.task.create({
    data: { title: title.trim() },
  });

  ctx.status = 201;
  ctx.body = task;
});

router.put('/tasks/:id', async (ctx) => {
  const id = Number(ctx.params.id);

  if (Number.isNaN(id)) {
    ctx.status = 400;
    ctx.body = { error: 'ID inválido' };
    return;
  }

  const task = await prisma.task.findUnique({ where: { id } });

  if (!task) {
    ctx.status = 404;
    ctx.body = { error: 'Tarea no encontrada' };
    return;
  }

  if (task.completed) {
    ctx.status = 400;
    ctx.body = { error: 'La tarea ya está completada y no se puede revertir' };
    return;
  }

  const updated = await prisma.task.update({
    where: { id },
    data: { completed: true },
  });

  ctx.body = updated;
});


router.delete('/tasks/:id', async (ctx) => {
  const id = Number(ctx.params.id);

  if (Number.isNaN(id)) {
    ctx.status = 400;
    ctx.body = { error: 'ID inválido' };
    return;
  }

  const task = await prisma.task.findUnique({ where: { id } });

  if (!task) {
    ctx.status = 404;
    ctx.body = { error: 'Tarea no encontrada' };
    return;
  }

  await prisma.task.delete({ where: { id } });

  ctx.status = 204; 
});


app.use(router.routes()).use(router.allowedMethods());

export default app;
