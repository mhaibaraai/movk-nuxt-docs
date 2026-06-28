<script setup lang="ts">
const { locale, locales, switchLocalePath } = useMovkI18n()

function getEmojiFlag(locale: string): string {
  const languageToCountry: Record<string, string> = {
    ar: 'sa',
    bn: 'bd',
    ca: 'es',
    ckb: 'iq',
    cs: 'cz',
    da: 'dk',
    el: 'gr',
    en: 'gb',
    et: 'ee',
    he: 'il',
    hi: 'in',
    hy: 'am',
    ja: 'jp',
    kk: 'kz',
    km: 'kh',
    ko: 'kr',
    ky: 'kg',
    lb: 'lu',
    ms: 'my',
    nb: 'no',
    sl: 'si',
    sv: 'se',
    uk: 'ua',
    ur: 'pk',
    vi: 'vn',
    es: 'es',
    id: 'id'
  }

  const baseLanguage = locale.split('-')[0]?.toLowerCase() || locale
  const countryCode = languageToCountry[baseLanguage] || locale.replace(/^.*-/, '').slice(0, 2)

  return countryCode.toUpperCase()
    .split('')
    .map(char => String.fromCodePoint(0x1F1A5 + char.charCodeAt(0)))
    .join('')
}
</script>

<template>
  <UPopover :content="{ align: 'end' }">
    <UButton
      color="neutral"
      variant="ghost"
      class="size-8"
    >
      <template #trailing>
        <span class="text-lg">
          {{ getEmojiFlag(locale) }}
        </span>
      </template>
    </UButton>

    <template #content>
      <ul class="flex flex-col">
        <li
          v-for="localeItem in locales"
          :key="localeItem.code"
        >
          <NuxtLink
            class="flex justify-between py-1.5 px-2 gap-1 hover:bg-muted"
            :to="switchLocalePath(localeItem.code) as string"
            :aria-label="localeItem.name"
          >
            <span class="text-sm">
              {{ localeItem.name }}
            </span>
            <span class="size-5 text-center">
              {{ getEmojiFlag(localeItem.code) }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </template>
  </UPopover>
</template>
