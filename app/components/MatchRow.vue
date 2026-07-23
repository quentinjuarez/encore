<script setup lang="ts">
const props = defineProps<{ match: TrackMatch; provider: Provider }>();
const included = defineModel<boolean>({ default: true });
const emit = defineEmits<{ assign: [track: TrackCandidate] }>();
const toast = useToast();

const providerName = computed(() => (props.provider === 'deezer' ? 'Deezer' : 'Spotify'));

const editing = ref(false);
const query = ref('');
const results = ref<TrackCandidate[]>([]);
const searching = ref(false);
const searched = ref(false);

function toggleEditor() {
  if (editing.value) {
    editing.value = false;
    return;
  }
  editing.value = true;
  searched.value = false;
  results.value = [];
  if (!query.value) query.value = props.match.song;
  search();
}

async function search() {
  const q = query.value.trim();
  if (!q) return;
  searching.value = true;
  try {
    const res = await $fetch('/api/search', { query: { q, provider: props.provider } });
    results.value = res.tracks;
    searched.value = true;
  } catch {
    toast.error(`${providerName.value} search failed. Try again.`);
  } finally {
    searching.value = false;
  }
}

function select(track: TrackCandidate) {
  emit('assign', track);
  editing.value = false;
}
</script>

<template>
  <li class="border-t border-sand py-2 first:border-t-0">
    <div class="flex items-center gap-3">
      <input
        v-if="match.matched"
        v-model="included"
        type="checkbox"
        class="h-5 w-5 shrink-0 accent-[var(--color-teal)]"
        :aria-label="`Include ${match.song}`"
      />
      <span v-else class="grid h-5 w-5 shrink-0 place-items-center text-burnt" aria-hidden="true">
        <Icon name="ph:x-bold" size="14" />
      </span>

      <img
        v-if="match.albumArt"
        :src="match.albumArt"
        alt=""
        width="44"
        height="44"
        class="h-11 w-11 shrink-0 rounded-lg border-2 border-espresso object-cover"
      />
      <span
        v-else
        class="grid h-11 w-11 shrink-0 place-items-center rounded-lg border-2 border-espresso bg-cream"
      >
        <Icon name="ph:music-notes" size="20" class="text-cocoa" />
      </span>

      <span class="min-w-0 flex-1">
        <span class="block truncate font-medium text-espresso">{{ match.song }}</span>
        <a
          v-if="match.matched && match.url"
          :href="match.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1 text-sm text-cocoa hover:text-espresso"
          :title="`Open ${match.title} on ${providerName}`"
        >
          <span class="truncate">{{ match.title }} · {{ match.artist }}</span>
          <SpotifyMark v-if="provider === 'spotify'" :size="12" class="shrink-0 text-[#1db954]" />
          <DeezerMark v-else :size="12" class="shrink-0 text-[#a238ff]" />
        </a>
        <span v-else-if="match.matched" class="block truncate text-sm text-cocoa"
          >{{ match.title }} · {{ match.artist }}</span
        >
        <span v-else class="block truncate text-sm text-burnt">No confident match</span>
      </span>

      <span v-if="match.isCover" class="badge shrink-0">cover</span>
      <button
        type="button"
        class="shrink-0 rounded-full border-2 border-espresso px-2.5 py-1 text-xs font-bold text-espresso transition-transform hover:-translate-y-0.5"
        @click="toggleEditor"
      >
        {{ editing ? 'Close' : match.matched ? 'Change' : 'Find it' }}
      </button>
    </div>

    <!-- Manual search -->
    <div v-if="editing" class="mt-2 rounded-xl border-2 border-espresso bg-cream p-2">
      <div class="flex items-center gap-2">
        <input
          v-model="query"
          type="search"
          :aria-label="`Search ${providerName} for ${match.song}`"
          class="min-w-0 flex-1 rounded-full border-2 border-espresso bg-paper px-3 py-1.5 text-sm text-espresso outline-none"
          :placeholder="`Search ${providerName}`"
          @keyup.enter="search"
        />
        <button
          type="button"
          class="shrink-0 rounded-full border-2 border-espresso bg-burnt px-3 py-1.5 text-xs font-bold text-paper"
          @click="search"
        >
          Go
        </button>
      </div>

      <div v-if="searching" class="flex justify-center py-3 text-burnt">
        <UiSpinner :size="22" />
      </div>
      <ul v-else-if="results.length" class="mt-2 max-h-56 overflow-y-auto">
        <li v-for="t in results" :key="t.id">
          <button
            type="button"
            class="flex w-full items-center gap-2 rounded-lg px-1 py-1.5 text-left hover:bg-sand/60"
            @click="select(t)"
          >
            <img
              v-if="t.albumArt"
              :src="t.albumArt"
              alt=""
              width="36"
              height="36"
              class="h-9 w-9 shrink-0 rounded border border-espresso object-cover"
            />
            <span
              v-else
              class="grid h-9 w-9 shrink-0 place-items-center rounded border border-espresso bg-paper"
            >
              <Icon name="ph:music-notes" size="16" class="text-cocoa" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-medium text-espresso">{{ t.title }}</span>
              <span class="block truncate text-xs text-cocoa">{{ t.artist }}</span>
            </span>
          </button>
        </li>
      </ul>
      <p v-else-if="searched" class="py-3 text-center text-sm text-cocoa">
        No tracks found. Try different words.
      </p>
    </div>
  </li>
</template>
