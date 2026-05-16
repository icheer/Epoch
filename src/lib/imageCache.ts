type CacheEntry = {
  imageUrl: string;
  timestamp: number;
};

class ImageCache {
  private cache: Map<string, CacheEntry> = new Map();
  private pendingRequests: Map<string, Promise<string | null>> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  async getImage(query: string): Promise<string | null> {
    if (!query || query.trim().length < 3) {
      return null;
    }

    const normalizedQuery = query.trim().toLowerCase();

    // Check cache first
    const cached = this.cache.get(normalizedQuery);
    if (cached) {
      const age = Date.now() - cached.timestamp;
      if (age < this.CACHE_DURATION) {
        return cached.imageUrl;
      }
      // Cache expired, remove it
      this.cache.delete(normalizedQuery);
    }

    // Check if there's already a pending request for this query
    const pending = this.pendingRequests.get(normalizedQuery);
    if (pending) {
      return pending;
    }

    // Create new request
    const requestPromise = this.fetchImage(normalizedQuery);
    this.pendingRequests.set(normalizedQuery, requestPromise);

    try {
      const imageUrl = await requestPromise;
      return imageUrl;
    } finally {
      this.pendingRequests.delete(normalizedQuery);
    }
  }

  private async fetchImage(query: string): Promise<string | null> {
    try {
      const res = await fetch("/api/search-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (data.imageUrl) {
        // Cache the result
        this.cache.set(query, {
          imageUrl: data.imageUrl,
          timestamp: Date.now(),
        });
        return data.imageUrl;
      }

      return null;
    } catch (err) {
      console.error("Failed to fetch image:", err);
      return null;
    }
  }

  clearCache() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  getCacheSize() {
    return this.cache.size;
  }
}

// Export singleton instance
export const imageCache = new ImageCache();
