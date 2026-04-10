import { createClient } from "redis";

class RedisService {
  private static instance: RedisService;
  private client;

  private constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    this.client.on("error", (err) => {
      console.error("❌ Redis Error:", err);
    });

    this.client.on("connect", () => {
      console.log("🟢 Redis Connected");
    });
  }

  static getInstance() {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  getClient() {
    return this.client;
  }
}

export default RedisService;
