/**
 * YouTube Comment Extraction Module
 * Handles fetching and processing YouTube comments through YouTube's internal API
 */
export class YouTubeCommentExtractor {
  constructor() {
    this.processors = new Map();
    this.registerProcessors();
  }

  /**
   * Register all data processors
   * @private
   */
  registerProcessors() {
    // Register processor to get API key from YouTube page
    this.registerProcessor('getApiKey', async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) throw new Error('No active tab found');
      
      const result = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.ytcfg?.data_?.INNERTUBE_API_KEY
      });
      
      return result[0].result;
    });

    // Register processor to fetch comments
    this.registerProcessor('fetchComments', this.fetchComments.bind(this));
    
    // Register processor to process raw comment data
    this.registerProcessor('processComments', this.processComments.bind(this));
  }

  /**
   * Register a new data processor
   * @param {string} type - Processor type
   * @param {Function} processor - Processing function
   */
  registerProcessor(type, processor) {
    this.processors.set(type, processor);
  }

  /**
   * Fetch comments for a YouTube video
   * @param {Object} params - Parameters for fetching comments
   * @param {string} params.videoId - YouTube video ID
   * @param {string|null} params.continuation - Continuation token for pagination
   * @param {string} params.apiKey - YouTube's internal API key
   * @returns {Promise<Object>} Processed comments and continuation token
   */
  async fetchComments({ videoId, continuation = null, apiKey }) {
    try {
      // Add rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const params = {
        headers: {
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: '1',
              clientVersion: '2.20240304.00.00'
            }
          },
          videoId,
          continuation
        }),
        method: 'POST',
        credentials: 'include'
      };

      const response = await fetch(
        `https://www.youtube.com/youtubei/v1/next?key=${apiKey}`,
        params
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error('Error fetching comments:', err);
      throw new Error(`Failed to fetch comments: ${err.message}`);
    }
  }

  /**
   * Process raw comment data from YouTube API
   * @param {Object} data - Raw comment data from YouTube API
   * @returns {Object} Processed comments and continuation token
   */
  processComments(data) {
    const comments = [];
    const items = data?.continuationContents?.itemSectionContinuation?.contents;

    if (!items) return null;

    for (const item of items) {
      const comment = item?.commentThreadRenderer?.comment?.commentRenderer;
      if (!comment) continue;

      comments.push({
        id: comment.commentId,
        author: {
          name: comment?.authorText?.simpleText,
          channelId: comment?.authorEndpoint?.browseEndpoint?.browseId,
          isChannelOwner: comment?.authorIsChannelOwner
        },
        content: comment?.contentText?.runs?.map(r => r.text).join('') || '',
        publishedAt: comment?.publishedTimeText?.simpleText,
        likeCount: comment?.likeCount?.simpleText,
        replyCount: comment?.replyCount
      });
    }

    const continuation = data?.continuationContents?.itemSectionContinuation
      ?.continuations?.[0]?.nextContinuationData?.continuation;

    return {
      comments,
      continuation
    };
  }

  /**
   * Get all comments for a video
   * @param {string} videoId - YouTube video ID
   * @param {number} [maxComments] - Maximum number of comments to fetch (optional)
   * @returns {Promise<Array>} Array of processed comments
   */
  async getAllComments(videoId, maxComments = Infinity) {
    try {
      if (!videoId) {
        throw new Error('Video ID is required');
      }

      const apiKey = await this.processors.get('getApiKey')();
      if (!apiKey) {
        throw new Error('Failed to get YouTube API key');
      }

      let allComments = [];
      let continuation = null;
      let retryCount = 0;
      const MAX_RETRIES = 3;

      do {
        try {
          const rawData = await this.processors.get('fetchComments')({
            videoId,
            continuation,
            apiKey
          });

          const result = this.processors.get('processComments')(rawData);
          if (!result) break;

          allComments = allComments.concat(result.comments);
          continuation = result.continuation;
        } catch (error) {
          retryCount++;
          if (retryCount >= MAX_RETRIES) {
            throw error;
          }
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
        }
      } while (continuation && allComments.length < maxComments);

      return allComments.slice(0, maxComments);
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  }
} 