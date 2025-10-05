export const playPlaylist = async (token: string, playlistId: string) => {
  await fetch("https://api.spotify.com/v1/me/player/play", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ context_uri: `spotify:playlist:${playlistId}` }),
  })
}
