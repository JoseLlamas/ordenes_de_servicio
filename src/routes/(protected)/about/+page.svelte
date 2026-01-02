<script>
  const equipo = [
    { nombre: 'Juan José Hernández Llamas', rol: 'Desarrollador' },
    { nombre: 'Oscar Luna Hernández', rol: 'J.U.D. De Desarrollo de Sistemas' }
  ];
</script>

<div class="px-6 py-12">
  <div class="max-w-4xl mx-auto space-y-8">
    <h1 class="text-4xl font-bold tracking-tight">Acerca de</h1>

    <p class="text-lg leading-relaxed">
      Este sistema fue creado con el objetivo de facilitar la gestión de ordenes de servicio.
      Nuestra misión es ofrecer una solución intuitiva, robusta y flexible para entornos administrativos y logísticos.
    </p>

    <div class="space-y-4">
      <h2 class="text-2xl font-semibold">Nuestro equipo</h2>
      <ul class="grid gap-4 sm:grid-cols-2">
        {#each equipo as miembro, i(i)}
          <li class="p-4 rounded-xl bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100 shadow">
            <p class="font-semibold">{miembro.nombre}</p>
            <p class="text-sm text-zinc-600 dark:text-zinc-400">{miembro.rol}</p>
          </li>
        {/each}
      </ul>
    </div>

    <div>
      <h2 class="text-2xl font-semibold">Tecnologías utilizadas</h2>
      <ul class="list-disc list-inside mt-2 space-y-1">
        <li>SvelteKit</li>
        <li>Tailwind CSS 4</li>
        <li>Drizzle ORM + MySQL</li>
        <li>Docker</li>
      </ul>
    </div>
  </div>
</div>
