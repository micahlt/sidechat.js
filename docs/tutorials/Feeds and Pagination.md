> You'll need to be [authenticated as a user](tutorial-Authentication.html) before fetching any posts.

There are two kinds of feeds: the home feed, which mixes posts from every group the user is in, and group feeds, which only show posts from one group.

### Home feed

The home feed can be sorted by `"for_you"`, `"hot"`, or `"recent"`:

```javascript
const feed = await API.getHomeFeed("for_you");
```

The official YikYak app also passes the ID of the user's school group as the second parameter.  That's the group with a `group_join_type` of `"email_domain"`, which you can find with `getGroups()`.

Not everything in the home feed is a post.  Each item in `feed.feed_items` has an `item_type`, and some of them are things like group suggestions instead of posts.  If you only care about posts, filter the rest out:

```javascript
const posts = feed.feed_items.filter((i) => i.item_type == "post").map((i) => i.post);
```

### Group feeds

Group feeds can be sorted by `"hot"`, `"recent"`, or `"top"`:

```javascript
const groupID = /* ID of a group */;
const { posts } = await API.getGroupPosts(groupID, "hot");
```

Top posts can also be narrowed down to a time period of `"day"`, `"week"`, `"month"`, `"year"`, or `"all_time"`:

```javascript
await API.getGroupPosts(groupID, "top", undefined, "week");
```

### Loading more

Feeds come back one page at a time along with a `cursor`.  To get the next page, pass that cursor back into the same function:

```javascript
const firstPage = await API.getGroupPosts(groupID, "recent");
const secondPage = await API.getGroupPosts(groupID, "recent", firstPage.cursor);
```

The home feed (`getHomeFeed`) and activity (`getActivity`) work the same way.
