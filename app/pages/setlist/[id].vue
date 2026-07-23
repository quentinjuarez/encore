<script setup lang="ts">
const route = useRoute();
const { session } = useUserSession();
const toast = useToast();

const {
  data: setlist,
  pending,
  error,
} = await useFetch<Setlist>(() => `/api/setlist/${route.params.id}`);

// Continuous song numbering across the main set and any encores.
const numberedSets = computed(() => {
  let n = 0;
  return (setlist.value?.sets?.set || []).map((set) => {
    const start = n;
    n += set.song?.length || 0;
    return { set, start };
  });
});
const total = computed(() => (setlist.value ? countSongs(setlist.value) : 0));

useSeoMeta({
  title: () =>
    setlist.value
      ? `${setlist.value.artist.name} at ${setlist.value.venue?.name || 'live'} - Encore`
      : 'Setlist - Encore',
  robots: 'noindex',
});

// ---- Provider selection ----
// Only offer providers configured on the server. Deezer is the open path and is
// preferred when available; Spotify is invite-only (developer mode).
const { data: providers } = await useFetch('/api/providers');
const available = computed<Provider[]>(() => {
  const list: Provider[] = [];
  if (providers.value?.deezer) list.push('deezer');
  if (providers.value?.spotify) list.push('spotify');
  return list.length ? list : ['spotify'];
});

function pickDefault(): Provider {
  const av = available.value;
  if (session.value?.deezer && av.includes('deezer')) return 'deezer';
  if (session.value?.spotify && av.includes('spotify')) return 'spotify';
  return av[0] ?? 'spotify';
}
const provider = ref<Provider>(pickDefault());

const providerName = computed(() => (provider.value === 'deezer' ? 'Deezer' : 'Spotify'));
const connected = computed(() =>
  provider.value === 'deezer' ? Boolean(session.value?.deezer) : Boolean(session.value?.spotify),
);

// ---- Add-to-playlist flow ----
type Phase = 'ready' | 'resolving' | 'preview' | 'creating' | 'done';
const phase = ref<Phase>('ready');
const matches = ref<TrackMatch[]>([]);
const included = ref<boolean[]>([]);
const playlistUrl = ref('');

// Switching provider starts the flow over (matches are provider-specific).
watch(provider, () => {
  phase.value = 'ready';
  matches.value = [];
  included.value = [];
  playlistUrl.value = '';
});

const matchedCount = computed(() => matches.value.filter((m) => m.matched).length);
const selectedIds = computed(() =>
  matches.value.filter((m, i) => m.matched && included.value[i] && m.id).map((m) => m.id as string),
);

function connect() {
  useCookie('encore_redirect', { path: '/', maxAge: 600 }).value = route.fullPath;
  return navigateTo(`/auth/${provider.value}`, { external: true });
}

async function resolve() {
  if (!setlist.value) return;
  const songs = allSongs(setlist.value);
  if (!songs.length) {
    toast.error('This show has no songs listed to match.');
    return;
  }
  phase.value = 'resolving';
  try {
    const res = await $fetch('/api/resolve', {
      method: 'POST',
      body: { provider: provider.value, artist: setlist.value.artist.name, songs },
    });
    matches.value = res.matches;
    included.value = res.matches.map((m) => m.matched);
    phase.value = 'preview';
  } catch (err) {
    phase.value = 'ready';
    reportError(err);
  }
}

async function create() {
  if (!setlist.value || selectedIds.value.length === 0) return;
  const s = setlist.value;
  phase.value = 'creating';
  const name =
    `${s.artist.name} - ${s.venue?.name || 'Live'} ${formatSetlistDate(s.eventDate)}`.slice(0, 100);
  try {
    const res = await $fetch('/api/create-playlist', {
      method: 'POST',
      body: {
        provider: provider.value,
        name,
        description: `Setlist from ${s.venue?.name || 'the show'} on ${formatSetlistDate(s.eventDate)}. Built with Encore.`,
        ids: selectedIds.value,
      },
    });
    playlistUrl.value = res.url;
    phase.value = 'done';
    toast.success(`Playlist saved to your ${providerName.value}.`);
  } catch (err) {
    phase.value = 'preview';
    reportError(err);
  }
}

// Manual pick from MatchRow's search: mark it matched and include it.
function assign(i: number, track: TrackCandidate) {
  const m = matches.value[i];
  if (!m) return;
  matches.value[i] = {
    ...m,
    matched: true,
    id: track.id,
    title: track.title,
    artist: track.artist,
    albumArt: track.albumArt,
    url: track.url,
  };
  included.value[i] = true;
}

function reportError(err: unknown) {
  const body = err as {
    statusCode?: number;
    data?: { statusCode?: number; data?: { reason?: string } };
  };
  const status = body?.data?.statusCode ?? body?.statusCode;
  const reason = body?.data?.data?.reason;

  if (status === 401) {
    toast.error(`Your ${providerName.value} session expired. Sign out and reconnect.`);
  } else if (reason) {
    toast.error(`${providerName.value}: ${reason}`);
  } else if (status === 403) {
    toast.error(`${providerName.value} refused this. Sign out and reconnect to refresh access.`);
  } else {
    toast.error(`Something went wrong talking to ${providerName.value}. Try again.`);
  }
}
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-10">
    <NuxtLink
      :to="setlist ? `/artist/${setlist.artist.mbid}` : '/'"
      class="inline-flex items-center gap-1 text-sm font-semibold text-cocoa hover:text-espresso"
    >
      <Icon name="ph:arrow-left-bold" size="16" /> {{ setlist ? 'Back to shows' : 'New search' }}
    </NuxtLink>

    <div v-if="pending" class="flex justify-center py-24 text-burnt">
      <UiSpinner :size="40" label="Loading setlist" />
    </div>

    <EmptyState
      v-else-if="error || !setlist"
      icon="ph:warning-bold"
      title="Setlist not found"
      message="This setlist may have been removed, or setlist.fm is unreachable."
    >
      <UiButton to="/">Back to search</UiButton>
    </EmptyState>

    <div v-else class="mt-4 grid gap-8 lg:grid-cols-[1fr_340px]">
      <!-- The setlist sheet -->
      <article>
        <header>
          <p class="font-mono text-sm text-burnt">{{ formatSetlistDate(setlist.eventDate) }}</p>
          <h1 class="mt-1 font-display text-3xl font-bold leading-tight text-espresso sm:text-4xl">
            {{ setlist.artist.name }}
          </h1>
          <p class="mt-1 text-cocoa">
            {{ setlist.venue?.name
            }}<template v-if="setlist.venue?.city?.name">, {{ setlist.venue.city.name }}</template>
            <template v-if="setlist.venue?.city?.country?.name"
              >, {{ setlist.venue.city.country.name }}</template
            >
          </p>
          <p v-if="setlist.tour?.name" class="mt-2">
            <span class="badge">{{ setlist.tour.name }}</span>
          </p>
        </header>

        <div class="setlist-sheet mt-6 rounded-2xl p-6 sm:p-8">
          <div v-if="total === 0" class="py-6 text-cocoa">
            No songs were logged for this show, so there's nothing to add yet.
          </div>
          <div v-for="({ set, start }, si) in numberedSets" v-else :key="si" class="mb-4 last:mb-0">
            <p
              v-if="set.encore || set.name"
              class="mb-1 font-mono text-xs uppercase tracking-widest text-teal"
            >
              {{ set.encore ? `Encore ${set.encore}` : set.name }}
            </p>
            <ol>
              <SongRow
                v-for="(song, i) in set.song"
                :key="`${si}-${i}`"
                :index="start + i + 1"
                :song="song"
              />
            </ol>
          </div>
          <p class="mt-4 border-t border-sand pt-3 font-mono text-xs text-cocoa">
            {{ total }} songs · source
            <a :href="setlist.url" class="underline decoration-mustard underline-offset-2"
              >setlist.fm</a
            >
          </p>
        </div>
      </article>

      <!-- Add-to-playlist panel -->
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <UiCard>
          <div class="p-6">
            <h2 class="font-display text-xl font-semibold text-espresso">Save as a playlist</h2>

            <!-- Provider chooser (only when more than one is configured). Deezer
                 is primary when available; Spotify is invite-only. -->
            <div
              v-if="available.length > 1"
              class="mt-3 flex gap-1 rounded-full border-2 border-espresso p-1"
            >
              <button
                v-for="p in available"
                :key="p"
                type="button"
                class="flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-colors"
                :class="provider === p ? 'bg-burnt text-paper' : 'text-espresso'"
                @click="provider = p"
              >
                <DeezerMark v-if="p === 'deezer'" :size="15" />
                <SpotifyMark v-else :size="15" />
                {{ p === 'deezer' ? 'Deezer' : 'Spotify' }}
              </button>
            </div>

            <!-- Not connected -->
            <template v-if="phase === 'ready' && !connected">
              <p class="mt-3 text-sm text-cocoa">
                <template v-if="provider === 'deezer'"
                  >Connect any Deezer account to build this set as a playlist.</template
                >
                <template v-else>Connect Spotify to build this set as a playlist.</template>
              </p>
              <UiButton block class="mt-3" @click="connect">
                <SpotifyMark v-if="provider === 'spotify'" :size="20" />
                <DeezerMark v-else :size="20" />
                Connect {{ providerName }}
              </UiButton>
              <p v-if="provider === 'spotify'" class="mt-2 text-xs text-cocoa/70">
                Spotify is invite-only here (developer mode), only accounts the owner has added can
                connect. Deezer is open to everyone.
              </p>
            </template>

            <!-- Connected, ready to match -->
            <template v-else-if="phase === 'ready'">
              <p class="mt-3 text-sm text-cocoa">
                We'll find each of these {{ total }} songs on {{ providerName }} first.
              </p>
              <UiButton block class="mt-3" :disabled="total === 0" @click="resolve">
                <Icon name="ph:magic-wand-bold" size="20" /> Match this set
              </UiButton>
            </template>

            <!-- Resolving -->
            <div
              v-else-if="phase === 'resolving'"
              class="mt-6 flex flex-col items-center gap-3 py-4 text-burnt"
            >
              <UiSpinner :size="34" />
              <p class="text-sm text-cocoa">Finding tracks on {{ providerName }}...</p>
            </div>

            <!-- Preview matches -->
            <template v-else-if="phase === 'preview'">
              <p class="mt-3 text-sm text-cocoa">
                Matched <strong class="text-espresso">{{ matchedCount }}</strong> of
                {{ matches.length }}. Untick a wrong one, or fix a miss with Find it.
              </p>
              <p class="mt-2 flex items-center gap-1.5 text-xs text-cocoa">
                <SpotifyMark v-if="provider === 'spotify'" :size="14" class="text-[#1db954]" />
                <DeezerMark v-else :size="14" class="text-[#a238ff]" />
                Matches from {{ providerName }}
              </p>
              <ul class="mt-2 max-h-[46vh] overflow-y-auto pr-1">
                <MatchRow
                  v-for="(m, i) in matches"
                  :key="i"
                  v-model="included[i]"
                  :match="m"
                  :provider="provider"
                  @assign="assign(i, $event)"
                />
              </ul>
              <UiButton block class="mt-4" :disabled="selectedIds.length === 0" @click="create">
                Create playlist ({{ selectedIds.length }})
              </UiButton>
            </template>

            <!-- Creating -->
            <div
              v-else-if="phase === 'creating'"
              class="mt-6 flex flex-col items-center gap-3 py-4 text-burnt"
            >
              <UiSpinner :size="34" />
              <p class="text-sm text-cocoa">Saving to your {{ providerName }}...</p>
            </div>

            <!-- Done -->
            <template v-else-if="phase === 'done'">
              <div class="mt-3 flex flex-col items-center gap-2 py-2 text-center">
                <span
                  class="grid h-14 w-14 place-items-center rounded-full border-2 border-espresso bg-teal text-paper"
                >
                  <Icon name="ph:check-bold" size="26" />
                </span>
                <p class="font-display text-lg font-semibold text-espresso">Playlist saved</p>
                <p class="text-sm text-cocoa">
                  {{ selectedIds.length }} tracks are waiting in your {{ providerName }}.
                </p>
              </div>
              <UiButton block class="mt-3" :href="playlistUrl">
                <SpotifyMark v-if="provider === 'spotify'" :size="20" />
                <DeezerMark v-else :size="20" />
                Open {{ providerName }}
              </UiButton>
              <UiButton variant="ghost" block class="mt-1" @click="phase = 'ready'"
                >Build another</UiButton
              >
            </template>
          </div>
        </UiCard>
      </aside>
    </div>
  </div>
</template>
