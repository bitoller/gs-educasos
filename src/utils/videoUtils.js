export const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";

  try {
    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    let videoId = "";

    const watchMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\s]+)/
    );
    if (watchMatch) {
      videoId = watchMatch[1];
    }

    if (!videoId) {
      return "";
    }

    return `https://www.youtube.com/embed/${videoId}`;
  } catch (error) {
    console.error("Erro ao processar URL do YouTube:", error);
    return "";
  }
};
