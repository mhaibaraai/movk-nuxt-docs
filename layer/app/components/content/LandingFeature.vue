<template>
  <div class="group border-e border-b border-default p-6 lg:p-7 transition-colors hover:bg-muted">
    <span data-index class="font-mono text-[11px] tracking-[0.12em] text-primary" />

    <h3 class="mt-3 text-base font-semibold text-highlighted">
      <slot name="title" mdc-unwrap="p" />
    </h3>

    <p class="mt-2 text-sm/relaxed text-muted">
      <slot name="description" mdc-unwrap="p" />
    </p>
  </div>
</template>
