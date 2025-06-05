/**
 * Extrai o ID do vídeo de uma URL do YouTube e retorna a URL de incorporação correta
 * Suporta vários formatos de URL do YouTube:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://youtube.com/shorts/VIDEO_ID
 * @param {string} url - URL do vídeo do YouTube
 * @returns {string} URL formatada para incorporação
 */
export const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  
  try {
    // Se já for uma URL de incorporação, retorna ela mesma
    if (url.includes('youtube.com/embed/')) {
      return url;
    }

    // Extrai o ID do vídeo de diferentes formatos de URL
    let videoId = '';
    
    // Formato watch?v=
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\s]+)/);
    if (watchMatch) {
      videoId = watchMatch[1];
    }

    // Se não encontrou o ID, retorna string vazia
    if (!videoId) {
      return '';
    }

    // Retorna a URL de incorporação formatada
    return `https://www.youtube.com/embed/${videoId}`;
  } catch (error) {
    console.error('Erro ao processar URL do YouTube:', error);
    return '';
  }
}; 