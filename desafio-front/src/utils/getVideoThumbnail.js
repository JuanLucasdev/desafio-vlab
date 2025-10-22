export const getVideoThumbnail = (url) => {
  const match = url.match(/(?:\?v=|\/embed\/|\/v\/|youtu\.be\/|\/watch\?v=)([^&]+)/);
  const videoId = match ? match[1] : "default";
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
};
