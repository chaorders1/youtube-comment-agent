/**
 * Utility functions for YouTube feature
 */
export const YouTubeUtils = {
  /**
   * Extract video ID from YouTube URL
   * @param {string} url - YouTube video URL
   * @returns {string|null} Video ID or null if invalid URL
   */
  extractVideoId(url) {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      } else if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Validate YouTube video ID
   * @param {string} videoId - YouTube video ID to validate
   * @returns {boolean} Whether the video ID is valid
   */
  isValidVideoId(videoId) {
    return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
  }
}; 