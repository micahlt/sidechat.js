/**
 * Offline unit tests for SidechatAPIClient.
 *
 * These stub the global fetch and assert on exactly what the client sends
 * (URL, method, body, headers) without a real token or network access.
 * Run with: npm test
 */
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { SidechatAPIClient } from "../../index.js";

const ROOT = "https://mock.local";
const TOKEN = "TEST_TOKEN";

let calls;
let realFetch;
let realConsoleError;

/** Stub fetch to record every call and respond with a fixed status + JSON. */
function stubFetch(status = 200, json = {}) {
  globalThis.fetch = async (url, opts = {}) => {
    calls.push({
      url: String(url),
      method: opts.method ?? "GET",
      headers: opts.headers ?? {},
      body: opts.body,
    });
    return {
      status,
      ok: status >= 200 && status < 300,
      json: async () => json,
    };
  };
}

/** Return the single recorded call, asserting exactly one was made. */
function onlyCall() {
  assert.equal(calls.length, 1, `expected 1 fetch call, got ${calls.length}`);
  return calls[0];
}

/** Split a recorded URL into pathname and a plain object of query params. */
function parse(url) {
  const u = new URL(url);
  return { path: u.pathname, query: Object.fromEntries(u.searchParams) };
}

beforeEach(() => {
  calls = [];
  realFetch = globalThis.fetch;
  realConsoleError = console.error;
  console.error = () => {}; // the client logs every caught error; keep output clean
});

afterEach(() => {
  globalThis.fetch = realFetch;
  console.error = realConsoleError;
});

const client = () => new SidechatAPIClient(TOKEN, ROOT);

// ---------------------------------------------------------------------------
// Constructor / config
// ---------------------------------------------------------------------------

test("constructor applies token and root URL", () => {
  const api = client();
  assert.equal(api.userToken, TOKEN);
  assert.equal(api.apiRoot, ROOT);
});

test("constructor keeps default root when none given", () => {
  const api = new SidechatAPIClient(TOKEN);
  assert.equal(api.apiRoot, "https://api.sidechat.lol");
});

test("authenticated methods throw before fetching when there is no token", async () => {
  stubFetch();
  const api = new SidechatAPIClient("", ROOT);
  await assert.rejects(() => api.getUpdates(), { name: "SidechatAPIError" });
  await assert.rejects(() => api.getPost("x"), { name: "SidechatAPIError" });
  await assert.rejects(() => api.getDMs(), { name: "SidechatAPIError" });
  assert.equal(calls.length, 0);
});

// ---------------------------------------------------------------------------
// Query-string construction (regression tests for the "&" vs "?" bug)
// ---------------------------------------------------------------------------

test("getUserContent builds a valid query string", async () => {
  stubFetch(200, { posts: [] });
  await client().getUserContent("posts");
  const { path, query } = parse(onlyCall().url);
  assert.equal(path, "/v1/posts");
  assert.equal(query.type, "my_posts");
});

test("getUserContent maps 'comments' to my_comments", async () => {
  stubFetch(200, { posts: [] });
  await client().getUserContent("comments");
  assert.equal(parse(onlyCall().url).query.type, "my_comments");
});

test("viewPollResults builds a valid query string", async () => {
  stubFetch(200, {});
  await client().viewPollResults("poll1");
  const c = onlyCall();
  const { path, query } = parse(c.url);
  assert.equal(path, "/v1/polls/view_results");
  assert.ok("cacheBust" in query);
  assert.equal(c.method, "POST");
  assert.deepEqual(JSON.parse(c.body), { poll_id: "poll1" });
});

test("getGroupChats builds a valid query string", async () => {
  stubFetch(200, { chats: [] });
  await client().getGroupChats();
  const { path, query } = parse(onlyCall().url);
  assert.equal(path, "/v1/chats/explore");
  assert.ok("cacheBust" in query);
});

test("no request path contains a literal '&' before the first '?'", async () => {
  // Exercise every GET/POST method that takes only simple args and check
  // that none of them produce a path like /v1/foo&bar=baz.
  stubFetch(200, { posts: [], chats: [], groups: [], items: [], results: [] });
  const api = client();
  await api.getUpdates("g1");
  await api.getGroupPosts("g1", "hot", "cursor value");
  await api.getPost("p1");
  await api.getPostComments("p1");
  await api.getAvailableGroups();
  await api.searchAvailableGroups("hello world");
  await api.getAssetLibrary();
  await api.getCurrentUser();
  await api.getGroupMetadata("g1");
  await api.checkUsername("bob");
  await api.getUserProfile("bob");
  await api.getUserPosts("bob");
  await api.getDMs();
  await api.getDMThread("c1");
  for (const c of calls) {
    const { path } = parse(c.url);
    assert.ok(!path.includes("&"), `malformed path in ${c.url}`);
  }
});

// ---------------------------------------------------------------------------
// Request shape for the core happy paths
// ---------------------------------------------------------------------------

test("every authenticated request sends the bearer token and default headers", async () => {
  stubFetch(200, { post: {} });
  await client().getPost("p1");
  const h = onlyCall().headers;
  assert.equal(h.Authorization, `Bearer ${TOKEN}`);
  assert.equal(h.Accept, "application/json");
  assert.equal(h["Content-Type"], "application/json");
  assert.equal(h["App-Version"], "6.0.0");
});

test("getGroupPosts encodes the cursor and includes group and type", async () => {
  stubFetch(200, { posts: [], cursor: "next" });
  const out = await client().getGroupPosts("g1", "recent", "a b&c");
  const { path, query } = parse(onlyCall().url);
  assert.equal(path, "/v1/posts");
  assert.equal(query.cursor, "a b&c");
  assert.equal(query.group_id, "g1");
  assert.equal(query.type, "recent");
  assert.deepEqual(out, { posts: [], cursor: "next" });
});

test("getPost returns the inner post object", async () => {
  stubFetch(200, { post: { id: "p1" } });
  const post = await client().getPost("p1", true);
  assert.deepEqual(post, { id: "p1" });
  const { query } = parse(onlyCall().url);
  assert.equal(query.post_id, "p1");
  assert.equal(query.include_deleted, "true");
});

test("setVote posts the expected body", async () => {
  stubFetch(200, {});
  await client().setVote("p1", "upvote");
  const c = onlyCall();
  assert.equal(parse(c.url).path, "/v1/posts/set_vote");
  assert.equal(c.method, "POST");
  assert.deepEqual(JSON.parse(c.body), { post_id: "p1", vote_status: "upvote" });
});

test("createPost sends the expected body and returns the first post", async () => {
  stubFetch(200, { posts: [{ id: "new" }] });
  const post = await client().createPost("hello", "g1", [], true, false, true);
  const c = onlyCall();
  assert.equal(parse(c.url).path, "/v1/posts");
  assert.equal(c.method, "POST");
  const body = JSON.parse(c.body);
  assert.equal(body.type, "post");
  assert.equal(body.text, "hello");
  assert.deepEqual(body.group_ids, ["g1"]);
  assert.equal(body.dms_disabled, true);
  assert.equal(body.comments_disabled, false);
  assert.equal(body.using_identity, false);
  assert.equal("poll_request" in body, false);
  assert.deepEqual(post, { id: "new" });
});

test("createPost attaches a poll when pollOptions is a non-empty array", async () => {
  stubFetch(200, { posts: [{ id: "new" }] });
  await client().createPost("q?", "g1", [], false, false, false, undefined, ["a", "b"]);
  const body = JSON.parse(onlyCall().body);
  assert.deepEqual(body.poll_request, { allows_view_results: true, choices: ["a", "b"] });
});

test("createComment resolves reply IDs with the documented fallbacks", async () => {
  stubFetch(200, { comment: { id: "c" } });
  const api = client();

  await api.createComment("post", "hi", "g1");
  let body = JSON.parse(calls[0].body);
  assert.equal(body.type, "comment");
  assert.equal(body.parent_post_id, "post");
  assert.equal(body.reply_post_id, "post");
  assert.equal(body.reply_comment_post_id, "post");

  await api.createComment("post", "hi", "g1", "reply", "top");
  body = JSON.parse(calls[1].body);
  assert.equal(body.reply_post_id, "top");
  assert.equal(body.reply_comment_post_id, "reply");
});

test("setGroupMembership picks join or leave", async () => {
  stubFetch(200, {});
  const api = client();
  await api.setGroupMembership("g1", true);
  await api.setGroupMembership("g1", false);
  assert.equal(parse(calls[0].url).path, "/v1/groups/join");
  assert.equal(parse(calls[1].url).path, "/v1/groups/leave");
});

test("getDMs unwraps each chat object", async () => {
  stubFetch(200, { chats: [{ chat: { id: "a" } }, { chat: { id: "b" } }] });
  const dms = await client().getDMs();
  assert.deepEqual(dms, [{ id: "a" }, { id: "b" }]);
});

test("verifySMSCode stores the returned token and uppercases the code", async () => {
  stubFetch(200, { logged_in_user: { token: "NEW" } });
  const api = new SidechatAPIClient("", ROOT);
  await api.verifySMSCode("5555555555", "abc1");
  assert.equal(api.userToken, "NEW");
  const body = JSON.parse(onlyCall().body);
  assert.equal(body.phone_number, "+15555555555");
  assert.equal(body.code, "ABC1");
});

test("setAge rejects users under 13 without a request", async () => {
  stubFetch();
  await assert.rejects(() => client().setAge(12, "reg"), { name: "SidechatAPIError" });
  assert.equal(calls.length, 0);
});

// ---------------------------------------------------------------------------
// Comment tree ordering
// ---------------------------------------------------------------------------

test("getPostComments flattens replies directly after their parent", async () => {
  const P = "post";
  stubFetch(200, {
    posts: [
      { id: "c1", parent_post_id: P, reply_post_id: P },
      { id: "c2", parent_post_id: P, reply_post_id: P },
      { id: "c1a", parent_post_id: P, reply_post_id: "c1" },
    ],
  });
  const out = await client().getPostComments(P);
  assert.deepEqual(out.map((c) => c.id), ["c1", "c1a", "c2"]);
});

// ---------------------------------------------------------------------------
// Error handling. This documents current behaviour so a later change to a
// shared request helper can flip it to the intended behaviour deliberately.
// ---------------------------------------------------------------------------

test("[current behaviour] HTTP errors are not surfaced with the server message", async () => {
  stubFetch(401, { message: "Unauthorized" });
  const api = client();
  assert.equal(await api.getPost("p1"), undefined);
  await assert.rejects(() => api.getDMs(), { message: "Failed to fetch DMs." });
  await assert.rejects(() => api.createPost("x", "g"), { message: "Failed to make post." });
});
