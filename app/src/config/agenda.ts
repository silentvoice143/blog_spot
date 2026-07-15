import { Agenda } from "agenda";
import { MongoBackend } from "@agendajs/mongo-backend";
import Post from "../models/post.js";

export const agenda = new Agenda({
  backend: new MongoBackend({
    address: process.env.MONGO_URI!,
    collection: "agendaJobs",
  }),
});

agenda.define("publish post", async (job) => {
  const { postId } = job.attrs.data as { postId: string };

  try {
    const post = await Post.findOne({ _id: postId, status: "scheduled" });

    if (!post) {
      console.log(`[Agenda] Post ${postId} not found or no longer scheduled.`);
      return;
    }

    post.status = "published";
    post.publishedAt = new Date();
    post.scheduledFor = null;

    await post.save();

    console.log(`[Agenda] Successfully published post: ${postId}`);
  } catch (error) {
    console.error(`[Agenda] Failed to publish post ${postId}:`, error);
    throw error; // Throwing allows Agenda to mark the job as failed and retry if configured
  }
});
