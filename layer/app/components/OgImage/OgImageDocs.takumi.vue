<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
  site?: string
}>(), {
  title: 'Documentation',
  description: 'Comprehensive documentation for your project',
  site: 'Docs'
})
</script>

<template>
  <div
    style="font-family: 'Noto Sans SC', sans-serif;"
    class="w-full h-full relative flex flex-col overflow-hidden bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50"
    :style="{
      backgroundImage: `linear-gradient(to bottom right, rgba(34, 197, 94, 0.15), transparent)`
    }"
  >
    <div class="flex flex-col w-full h-full p-15 relative justify-between">
      <div class="flex flex-col gap-8 mb-10" style="text-wrap: pretty;">
        <span class="text-[72px] font-extrabold" style="line-height: 1.1; letter-spacing: -0.04em;">
          {{ title }}
        </span>
        <span
          class="text-[44px] font-normal text-neutral-500 dark:text-neutral-400"
          style="line-height: 1.4; max-width: 95%; letter-spacing: -0.01em; line-clamp: 2; text-overflow: ellipsis; overflow: hidden;"
        >
          {{ description }}
        </span>
      </div>

      <div class="flex items-center gap-7">
        <svg
          class="w-16 h-16"
          width="900"
          height="900"
          viewBox="0 0 900 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M504.908 750H839.476C850.103 750.001 860.542 747.229 869.745 741.963C878.948 736.696 886.589 729.121 891.9 719.999C897.211 710.876 900.005 700.529 900 689.997C899.995 679.465 897.193 669.12 891.873 660.002L667.187 274.289C661.876 265.169 654.237 257.595 645.036 252.329C635.835 247.064 625.398 244.291 614.773 244.291C604.149 244.291 593.711 247.064 584.511 252.329C575.31 257.595 567.67 265.169 562.36 274.289L504.908 372.979L392.581 179.993C387.266 170.874 379.623 163.301 370.42 158.036C361.216 152.772 350.777 150 340.151 150C329.525 150 319.086 152.772 309.883 158.036C300.679 163.301 293.036 170.874 287.721 179.993L8.12649 660.002C2.80743 669.12 0.00462935 679.465 5.72978e-06 689.997C-0.00461789 700.529 2.78909 710.876 8.10015 719.999C13.4112 729.121 21.0523 736.696 30.255 741.963C39.4576 747.229 49.8973 750.001 60.524 750H270.538C353.748 750 415.112 713.775 457.336 643.101L559.849 467.145L614.757 372.979L779.547 655.834H559.849L504.908 750ZM267.114 655.737L120.551 655.704L340.249 278.586L449.87 467.145L376.474 593.175C348.433 639.03 316.577 655.737 267.114 655.737Z" fill="#00DC82" />
        </svg>

        <span class="text-[32px] font-bold" style="letter-spacing: -0.02em; opacity: 0.9;">
          {{ site }}
        </span>
        <div style="flex-grow: 1;" />
        <div
          :style="{
            height: '4px',
            width: '60px',
            backgroundColor: '#00C16A',
            borderRadius: '2px'
          }"
        />
        <span
          class="text-[22px] font-bold uppercase"
          :style="{
            letterSpacing: '0.2em',
            color: '#00c16a',
            opacity: 0.8
          }"
        >
          Documentation
        </span>
      </div>
    </div>
  </div>
</template>
