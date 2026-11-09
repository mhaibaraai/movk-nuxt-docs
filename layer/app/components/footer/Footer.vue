<template>
  <UFooter
    :ui="{
      root: 'mt-16 border-t-[3px] border-double border-(--ui-text-strong)',
      left: 'font-mono text-[11px] uppercase tracking-[0.12em] text-muted'
    }"
  >
    <template #left>
      <FooterLeft />
    </template>

    <template #right>
      <FooterRight />
    </template>
  </UFooter>
</template>
