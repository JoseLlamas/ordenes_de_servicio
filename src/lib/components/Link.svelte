<script>
  /** @type {{
   *   href: string;
   *   variant?: 'primary' | 'secondary' | 'ghost' | 'gradient' | 'underline';
   *   size?: 'sm' | 'md' | 'lg';
   *   external?: boolean;
   *   class?: string;
   *   children: any
   * }}
   */
  let {
    href,
    variant = 'primary',
    size = 'md',
    external = false,
    class: className = '',
    children,
    ...restProps
  } = $props();

  const baseStyles = `
    inline-flex items-center justify-center gap-2 font-medium transition-all duration-200
    focus:outline-none focus:ring-4
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      rounded-xl shadow-lg
      bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500
      text-white
      shadow-blue-500/25 dark:shadow-blue-500/20
      hover:shadow-xl hover:shadow-blue-500/30 dark:hover:shadow-blue-500/25
      hover:scale-[1.02]
      active:scale-[0.98]
      focus:ring-blue-500/50
    `,
    secondary: `
      rounded-xl border-2
      bg-white dark:bg-gray-800
      border-gray-300 dark:border-gray-600
      text-gray-700 dark:text-gray-200
      hover:border-gray-400 dark:hover:border-gray-500
      hover:shadow-md
      hover:scale-[1.01]
      active:scale-[0.99]
      focus:ring-gray-400/50
    `,
    ghost: `
      rounded-xl
      text-gray-700 dark:text-gray-200
      hover:bg-gray-100 dark:hover:bg-gray-800
      hover:scale-[1.02]
      active:scale-[0.98]
      focus:ring-gray-400/50
    `,
    gradient: `
      relative rounded-xl overflow-hidden
      bg-gradient-to-r from-purple-600 via-pink-600 to-red-600
      text-white shadow-lg shadow-purple-500/30
      hover:shadow-xl hover:shadow-purple-500/40
      hover:scale-[1.02]
      active:scale-[0.98]
      focus:ring-purple-500/50
    `,
    underline: `
      relative
      text-blue-600 dark:text-blue-400
      hover:text-blue-700 dark:hover:text-blue-300
      after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0
      after:bg-current after:transition-all after:duration-200
      hover:after:w-full
      focus:ring-blue-500/50 focus:rounded
    `
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  let classes = $derived(`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim());
</script>

<a
  {href}
  class={classes}
  target={external ? '_blank' : undefined}
  rel={external ? 'noopener noreferrer' : undefined}
  {...restProps}
>
  {@render children?.()}
  {#if external}
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  {/if}
</a>
