<div class="w-full h-1 bg-gray-200 dark:bg-gray-800 overflow-hidden rounded">
  <div class="h-full bg-blue-600 dark:bg-blue-400 animate-loading-bar"></div>
</div>

<style>
  @keyframes loading-bar {
    0% {
      transform: translateX(-100%);
      width: 40%;
    }
    50% {
      transform: translateX(60%);
      width: 60%;
    }
    100% {
      transform: translateX(100%);
      width: 40%;
    }
  }

  .animate-loading-bar {
    animation: loading-bar 1.2s ease-in-out infinite;
  }
</style>
