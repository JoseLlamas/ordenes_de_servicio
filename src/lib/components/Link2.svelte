<a
  {href}
  class={[
    'bg-[#9b1f3d]',
    'text-white',
    'py-2',
    'px-4',
    'rounded-md',
    'hover:bg-[#7f182f]',
    'transition-colors',
    'cursor-pointer'
  ].concat(...classNames)}
  {...props}
>
  {@render children?.()}
</a>

<script>
  let { href, children, classNames = [], ...props } = $props();
</script>
