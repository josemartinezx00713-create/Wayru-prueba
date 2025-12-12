'use client';

import { useEffect, useState } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setGlobalError(null);
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) {
        setGlobalError('No se pudieron cargar las tareas. Intenta de nuevo.');
        return;
      }
      const data = await res.json();
      // Ordenar por fecha de creación (más recientes primero)
      const ordered = [...data].sort(
        (a: Task, b: Task) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setTasks(ordered);
    } catch {
      setGlobalError('Ocurrió un error de red al cargar las tareas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {
    const value = title.trim();

    if (!value) {
      setError('Por favor escribe una tarea antes de agregar.');
      return;
    }

    const ok = window.confirm(`¿Deseas agregar la tarea: "${value}"?`);
    if (!ok) return;

    setError(null);
    setGlobalError(null);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: value }),
      });

      if (!res.ok) {
        setGlobalError('No se pudo crear la tarea. Intenta de nuevo.');
        return;
      }

      const newTask: Task = await res.json();
      setTasks((prev) =>
        [newTask, ...prev].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
      );
      setTitle('');
    } catch {
      setGlobalError('Ocurrió un error de red al crear la tarea.');
    }
  };

  const completeTask = async (id: number, completed: boolean) => {
    if (completed) return; // no se puede descompletar

    const task = tasks.find((t) => t.id === id);
    const nombre = task?.title ?? 'esta tarea';

    const ok = window.confirm(
      `¿Deseas marcar como completada "${nombre}"?`
    );
    if (!ok) return;

    setGlobalError(null);

    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'PUT' });
      if (!res.ok) {
        setGlobalError(
          'No se pudo marcar la tarea como completada. Intenta de nuevo.'
        );
        return;
      }

      const updated: Task = await res.json();
      setTasks((prev) =>
        prev
          .map((t) => (t.id === id ? updated : t))
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
      );
    } catch {
      setGlobalError(
        'Ocurrió un error de red al actualizar el estado de la tarea.'
      );
    }
  };

  const deleteTask = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    const nombre = task?.title ?? 'esta tarea';

    const ok = window.confirm(`¿Deseas eliminar "${nombre}"?`);
    if (!ok) return;

    setGlobalError(null);

    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.status !== 204) {
        setGlobalError('No se pudo eliminar la tarea. Intenta de nuevo.');
        return;
      }

      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setGlobalError('Ocurrió un error de red al eliminar la tarea.');
    }
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('es-MX', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

  return (
    <main className="min-h-screen flex items-center justify-center px-3 py-6">
      <section className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-lg p-4 sm:p-6 space-y-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-center tracking-tight">
          Wayru ToDo
        </h1>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nueva tarea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={createTask}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 active:bg-blue-700 transition-colors"
          >
            Agregar
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-400 text-center">{error}</p>
        )}

        {globalError && (
          <p className="text-xs text-amber-300 text-center">
            {globalError}
          </p>
        )}

        <p className="text-sm text-zinc-400 text-center">
          Pendientes:{' '}
          <span className="font-medium text-zinc-100">{pendingCount}</span>
        </p>

        {loading ? (
          <p className="text-center text-sm text-zinc-400">Cargando...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            No hay tareas todavía. Agrega la primera.
          </p>
        ) : (
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            {/* Tareas pendientes */}
            <div>
              <h2 className="text-sm font-semibold text-zinc-200 mb-2">
                Pendientes
              </h2>
              <ul className="space-y-2">
                {tasks.filter((t) => !t.completed).length === 0 ? (
                  <li className="text-xs text-zinc-500">
                    No hay tareas pendientes.
                  </li>
                ) : (
                  tasks
                    .filter((t) => !t.completed)
                    .map((task) => (
                      <li
                        key={task.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2"
                      >
                        <div>
                          <span className="block text-sm text-zinc-100">
                            {task.title}
                          </span>
                          <span className="block text-[11px] text-zinc-500">
                            Creada: {formatDate(task.createdAt)}
                          </span>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() =>
                              completeTask(task.id, task.completed)
                            }
                            className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 transition-colors"
                          >
                            Completar
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="px-3 py-1 rounded-lg text-xs font-medium bg-red-600 text-white hover:bg-red-500 active:bg-red-700 transition-colors"
                          >
                            Borrar
                          </button>
                        </div>
                      </li>
                    ))
                )}
              </ul>
            </div>

            {/* Tareas completadas */}
            <div>
              <h2 className="text-sm font-semibold text-zinc-200 mb-2">
                Completadas
              </h2>
              <ul className="space-y-2">
                {tasks.filter((t) => t.completed).length === 0 ? (
                  <li className="text-xs text-zinc-500">
                    Aún no hay tareas completadas.
                  </li>
                ) : (
                  tasks
                    .filter((t) => t.completed)
                    .map((task) => (
                      <li
                        key={task.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2"
                      >
                        <div>
                          <span className="block text-sm line-through text-zinc-500">
                            {task.title}
                          </span>
                          <span className="block text-[11px] text-zinc-500">
                            Creada: {formatDate(task.createdAt)}
                          </span>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            disabled
                            className="px-3 py-1 rounded-lg text-xs font-medium bg-zinc-700 text-zinc-400 cursor-not-allowed"
                          >
                            Completada
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="px-3 py-1 rounded-lg text-xs font-medium bg-red-600 text-white hover:bg-red-500 active:bg-red-700 transition-colors"
                          >
                            Borrar
                          </button>
                        </div>
                      </li>
                    ))
                )}
              </ul>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
