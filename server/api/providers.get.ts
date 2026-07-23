// Which providers are actually configured on the server. Lets the UI hide a
// provider (e.g. Deezer while its API app cannot be created) instead of offering
// a connect that would just fail. No secrets are exposed, only booleans.
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event) as unknown as {
    oauth?: { spotify?: { clientId?: string } };
    deezer?: { appId?: string; secret?: string };
  };
  return {
    spotify: Boolean(config.oauth?.spotify?.clientId),
    deezer: Boolean(config.deezer?.appId && config.deezer?.secret),
  };
});
