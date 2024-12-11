const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");
const Posts = require("../models/posts");
const Comments = require("../models/comments");
const Community = require("../models/communities");

let server;

describe("Post Deletion Endpoint", () => {
  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect("mongodb://localhost:27017/testDB");

    // Start the test server
    server = app.listen(8001, () => console.log("Test server running on port 8001"));
  });

  afterAll(async () => {
    // Drop the test database and close connections
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.connection.close();

    if (server) {
      server.close();
    }
  });

  it("should delete a post and all its associated comments and update the community", async () => {
    // Create test data
    const community = await Community.create({
      name: "Test Community",
      description: "A test community description",
      creator: "Test Creator",
      members: ["Test Creator"],
      postIDs: []
    });

    const post = await Posts.create({
      title: "Test Post",
      content: "Test Content",
      postedBy: "Test Creator",
      commentIDs: []
    });

    const comment1 = await Comments.create({
      content: "Comment 1",
      commentedBy: "Test User",
      commentIDs: []
    });

    const reply1 = await Comments.create({
      content: "Reply to Comment 1",
      commentedBy: "Test User",
      commentIDs: []
    });

    post.commentIDs.push(comment1._id);
    community.postIDs.push(post._id);
    comment1.commentIDs.push(reply1._id);

    await post.save();
    await community.save();
    await comment1.save();

    // Ensure data exists
    expect(await Posts.findById(post._id)).not.toBeNull();
    expect(await Comments.findById(comment1._id)).not.toBeNull();
    expect(await Comments.findById(reply1._id)).not.toBeNull();

    // Call the delete endpoint
    const response = await request(app).delete(`/delete-post/${post._id}`);
    expect(response.status).toBe(200);

    // Verify deletion
    expect(await Posts.findById(post._id)).toBeNull();
    expect(await Comments.findById(comment1._id)).toBeNull();
    expect(await Comments.findById(reply1._id)).toBeNull();

    const updatedCommunity = await Community.findById(community._id);
    expect(updatedCommunity.postIDs).not.toContain(post._id);
  });
});
