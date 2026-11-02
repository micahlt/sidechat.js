> You'll need to be [authenticated as a user](tutorial-Authentication.html) and a member of the group you're posting in.

### Text posts

The simplest post just needs some text and a group ID:

```javascript
const groupID = /* ID of the group to post in */;
const post = await API.createPost("hello world", groupID);
```

`createPost` has a few more optional parameters, in this order: a list of assets, whether DMs are disabled, whether comments are disabled, whether the post is anonymous, the ID of a post to repost, a list of poll options, and a list of link attachment IDs.  So an anonymous poll looks like this:

```javascript
await API.createPost("best dining hall?", groupID, [], false, false, true, undefined, [
  "North",
  "South",
]);
```

Users can only make two posts a minute.  If a post gets rejected, `createPost` throws a `SidechatAPIError` with the server's explanation as its message, so it's a good idea to show that message to the user.

### Comments

Commenting on a post works similarly:

```javascript
await API.createComment(post.id, "first", groupID);
```

Replies are where it gets a little confusing.  To reply to a top-level comment, pass its ID as the fourth parameter.  To reply to a reply, pass the reply's ID as the fourth parameter and the ID of the top-level comment it lives under as the fifth.

### Images and videos

Uploading media takes two steps: upload the file with `uploadAsset`, then attach it to a post.  `uploadAsset` is built for React Native, so it expects a local file URI:

```javascript
const url = await API.uploadAsset(/* local file URI */, "image/jpeg", "photo.jpg");
const assetID = url.split("/").pop();
```

Then pass an asset object to `createPost`.  The width and height should be the image's real dimensions:

```javascript
await API.createPost("look at this", groupID, [
  { id: assetID, type: "image", content_type: "jpeg", width: 1080, height: 1350 },
]);
```

Videos work the same way, with a `type` of `"video"` and a `content_type` of `"mp4"` or `"mov"`.  They have to be under 50MB.  After posting, the server processes the video, which usually takes a few seconds.  You can tell where it's at from the asset's `vod_status`, which goes from `not_started` to `ingest` to `complete`.  Once it's complete, the asset's `url` points to an HLS stream (an `.m3u8` file), so you'll need a video player that supports HLS to play it.

### Links

Links are added as attachments.  Create the attachment first, then pass its ID to `createPost`:

```javascript
const attachment = await API.createLinkAttachment("https://github.com/micahlt/sidechat.js");
await API.createPost("cool library", groupID, [], false, false, false, undefined, undefined, [
  attachment.id,
]);
```

The attachment comes back with a title, a shortened `display_url`, and a preview image, so you can show the user a preview before they post.  YouTube links get a `type` of `"youtube"` instead of `"link"`.