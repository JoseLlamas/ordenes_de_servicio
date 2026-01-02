<script>
    import { formatearFecha } from '$lib/utils/formateador_fecha';

  let { ticket, usuario } = $props();
</script>

<div class="bg-white dark:bg-zinc-900 shadow rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center transition hover:shadow-lg">
  <div class="space-y-1">
    <div class="flex gap-4">
      <h2 class="text-lg font-semibold text-zinc-800 dark:text-zinc-100">#{ticket.id}</h2>
      <span class="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">{ticket.estado.descripcion}</span>
    </div>
    <p class="text-sm text-zinc-500 dark:text-zinc-400">Fecha creación {formatearFecha(ticket.fechaCreacion)}</p>
    <p class="text-sm text-zinc-500 dark:text-zinc-400">Area asignada: {ticket.areaAsignada.nombre}</p>
    <p class="text-sm text-zinc-500 dark:text-zinc-400">Area solicitante: {ticket.areaSolicitante.nombre}</p>
    <p class="text-sm text-zinc-500 dark:text-zinc-400">Categoria: {ticket.categoria.descripcion}</p>
    <p class="text-sm text-zinc-500 dark:text-zinc-400">Entrada: {ticket.entrada.descripcion}</p>
    <p class="text-sm text-zinc-500 dark:text-zinc-400">Entrada: {ticket.numeroOficio ?? 'No disponible'}</p>
    <p class="text-sm text-zinc-500 dark:text-zinc-400">Descripcion: {ticket.descripcion}</p>
    <p class="text-sm text-zinc-500 dark:text-zinc-400 pt-2">
      {#if ticket.capturista.id === usuario.id}
        <span class="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-800/20 dark:text-green-300">
          Capturista
        </span>
      {/if}
      {#if ticket.solicitante.id === usuario.empleado.id}
        <span class="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-800/20 dark:text-green-300">
          Solicitante
        </span>
      {/if}
      {#if ticket.agentes.map((agente) => agente.id).includes(usuario.id)}
        <span class="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-800/20 dark:text-green-300">
          Agente
        </span>
      {/if}
    </p>
  </div>
  <a
    class="mt-2 md:mt-0 inline-block bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
    href={`/tickets/${ticket.id}`}
  >
    Ver más
  </a>
</div>
