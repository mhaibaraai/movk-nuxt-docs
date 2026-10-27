<template>
  <section class="py-24 lg:py-32">
    <UContainer>
      <p class="font-display text-5xl sm:text-7xl font-bold tracking-tight leading-[1.02] text-balance text-highlighted max-w-4xl">
        <slot name="title" mdc-unwrap="p" />
      </p>

      <div class="mt-10 flex flex-wrap gap-3">
        <slot name="links" />
      </div>
    </UContainer>
  </section>
</template>
