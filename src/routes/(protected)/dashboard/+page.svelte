<script>
  import TitleMain from '$lib/components/TitleMain.svelte';
  import Line from '$lib/components/Line.svelte';
    import TitleSection from '$lib/components/TitleSection.svelte';

  // Datos falsos para el dashboard
  let userStats = {
    tickets: 120,
    users: 350,
    pending: 45
  };

  let recentActivity = [
    { name: 'Ticket #123', status: 'Pendiente', date: '2025-07-25' },
    { name: 'Ticket #124', status: 'En progreso', date: '2025-07-24' },
    { name: 'Ticket #125', status: 'Resuelto', date: '2025-07-23' }
  ];
</script>

<div class="p-6 ">
  <TitleMain>
    DashBoard
  </TitleMain>

  <Line />
  <br />

  <TitleSection>
    Estadísticas
  </TitleSection>

  <!-- Estadísticas -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Tickets Actuales</h3>
      <p class="text-4xl font-bold text-gray-800 dark:text-white">{userStats.tickets}</p>
    </div>
    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Usuarios Registrados</h3>
      <p class="text-4xl font-bold text-gray-800 dark:text-white">{userStats.users}</p>
    </div>
    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Tickets Pendientes</h3>
      <p class="text-4xl font-bold text-red-500 dark:text-red-400">{userStats.pending}</p>
    </div>
  </div>

  <TitleSection>
    Tickets de hoy
  </TitleSection>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    {#each recentActivity as activity}
      <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">{activity.name}</h3>
        <p class="text-md text-gray-700 dark:text-gray-300 mb-2">
          <strong>Estado:</strong> {activity.status}
        </p>
        <p class="text-md text-gray-700 dark:text-gray-300">
          <strong>Fecha:</strong> {activity.date}
        </p>
      </div>
    {/each}
  </div>


</div>
