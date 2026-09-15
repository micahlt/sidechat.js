import SidechatAPIError from "../classes/SidechatAPIError.js";

/** @import * as types from "../types/SidechatTypes.js"  */

/**
 * API client class for making requests to Sidechat's private API.  You'll need to [authenticate]{@tutorial Authentication} before using most of the methods.
 * @class
 * @since 2.0.0-alpha.0
 */
class SidechatAPIClient {
  /**
   * User bearer token
   * @type {types.SidechatAuthToken}
   * */
  userToken;

  /**
   * Default headers for every API request
   * @type {Object}
   */
  defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "App-Version": "6.0.0",
    Dnt: "1",
  };

  /**
   * Root URL for every API request
   * @type {String}
   * @default "https://api.sidechat.lol"
   */
  apiRoot = "https://api.sidechat.lol";

  /**
   * Create a new instance of the API client
   * @param {types.SidechatAuthToken} [token] - user bearer token
   * @param {String} rootUrl - custom API root URL for mocking or using other server
   */
  constructor(token = "", rootUrl = "") {
    if (token) {
      this.userToken = token;
    }
    if (rootUrl) {
      this.apiRoot = rootUrl;
    }
  }

  /**
   * Manually set the currently signed in user's token.  Generally try to avoid this and instead either pass a token to the constructor or login automatically through the auth functions
   * @method
   * @param {types.SidechatAuthToken} token - user bearer token
   */
  setToken = (token) => {
    this.userToken = token;
  };

  /**
   * Manually set the root URL for all API requests.  This can be used for mocking requests or redirecting them to a different server
   * @method
   * @param {String} url - new root URL to set
   * @since 2.3.9
   */
  setAPIRoot = (url) => {
    this.apiRoot = url;
  };

  /**
   * Build a full request URL from an endpoint path and optional query parameters.
   * Parameters whose value is undefined or null are omitted; everything else is URL-encoded.
   * @param {String} endpoint - path relative to apiRoot (e.g. "/v1/posts")
   * @param {Object} [query] - query parameters to append
   * @returns {String}
   * @private
   */
  #buildUrl(endpoint, query) {
    const params = new URLSearchParams();
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      }
    }
    const qs = params.toString();
    return `${this.apiRoot}${endpoint}${qs ? `?${qs}` : ""}`;
  }

  /**
   * Perform a request against the API and return the parsed JSON body.
   * Throws a SidechatAPIError carrying the server's message (and the HTTP status) on a non-2xx response,
   * and a SidechatAPIError wrapping the underlying error if the request itself fails.
   * @param {String} endpoint - path relative to apiRoot (e.g. "/v1/posts")
   * @param {Object} [options]
   * @param {"GET"|"POST"|"PUT"|"DELETE"|"PATCH"|"OPTIONS"} [options.method] - HTTP method
   * @param {Object} [options.query] - query parameters
   * @param {Object} [options.body] - JSON body
   * @param {Object} [options.headers] - extra headers merged over the defaults
   * @param {Boolean} [options.auth] - whether the request requires (and sends) the user token
   * @param {String} [options.failure] - message to use when no server message is available
   * @returns {Promise<any>}
   * @private
   */
  async #request(
    endpoint,
    { method = "GET", query, body, headers = {}, auth = true, failure = "Request failed." } = {},
  ) {
    if (auth && !this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    const url = this.#buildUrl(endpoint, query);
    const requestHeaders = {
      ...this.defaultHeaders,
      ...(auth ? { Authorization: `Bearer ${this.userToken}` } : {}),
      ...headers,
    };
    let res;
    try {
      res = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (err) {
      throw new SidechatAPIError(`${failure} (${err.message})`, { cause: err });
    }
    let json = null;
    try {
      json = await res.json();
    } catch {
      // Empty or non-JSON body (e.g. a 204).  Leave json as null.
    }
    if (!res.ok) {
      const serverMessage =
        (json && (json.message || json.error)) || `${failure} (HTTP ${res.status})`;
      throw new SidechatAPIError(serverMessage, {
        status: res.status,
        response: json,
      });
    }
    return json ?? {};
  }

  /**
   * Run an arbitrary API request using the current client's authentication.  Returns the raw Response so you can inspect status and body yourself.
   * @method
   * @param {String} endpoint - API endpoint to request (e.g. "/v1/posts")
   * @param {"GET"|"POST"|"PUT"|"DELETE"|"PATCH"|"OPTIONS"} [method] - HTTP method to use
   * @param {Object|String} [body] - body to send with the request.  Objects are JSON-encoded; strings are sent as-is.
   * @param {Object} [headers] - custom headers to send with the request
   * @param {Boolean} [stripHeaders] - remove the default headers from the request (custom headers are still sent)
   * @returns {Promise<Response>}
   * @since 2.4.9
   */
  sendRequest = (
    endpoint,
    method = "GET",
    body = undefined,
    headers = {},
    stripHeaders = false,
  ) => {
    const requestHeaders = {
      ...(stripHeaders ? {} : this.defaultHeaders),
      ...headers,
    };
    const encodedBody =
      body !== undefined && typeof body !== "string" ? JSON.stringify(body) : body;
    return fetch(`${this.apiRoot}${endpoint}`, {
      headers: { Authorization: `Bearer ${this.userToken}`, ...requestHeaders },
      body: encodedBody,
      method: method,
    });
  };

  /**
   * Initiate the login process with a phone number.  Should be followed up with verifySMSCode().
   * @method
   * @since 1.0.0
   * @param {Number} phoneNumber - US phone number (WITHOUT +1) to send verification code to
   */
  loginViaSMS = async (phoneNumber) => {
    return this.#request("/v1/login_register", {
      method: "POST",
      auth: false,
      body: {
        phone_number: `+1${phoneNumber}`,
        version: 3,
      },
      failure: "Failed to request SMS verification.",
    });
  };

  /**
   * Verify the code sent via SMS with loginViaSMS().  If this function succeeds, the user will be authenticated for future requests.
   * @method
   * @since 1.0.0
   * @param {Number} phoneNumber - US phone number (WITHOUT +1) that verification code was sent to
   * @param {String} code  - the verification code
   */
  verifySMSCode = async (phoneNumber, code) => {
    const json = await this.#request("/v1/verify_phone_number", {
      method: "POST",
      auth: false,
      body: {
        phone_number: `+1${phoneNumber}`,
        code: String(code).toUpperCase(),
      },
      failure: "Failed to verify this code.",
    });
    if (json?.logged_in_user?.token) {
      this.userToken = json.logged_in_user.token;
    }
    return json;
  };

  /**
   * Set the user's age.  If this function succeeds, the user will be authenticated for future requests.
   * @method
   * @since 1.0.0
   * @param {Number} age - user's age in years
   * @param {String} registrationID  - the registration ID generated by verifySMSCode()
   */
  setAge = async (age, registrationID) => {
    if (age < 13) {
      throw new SidechatAPIError("You're too young to use Sidechat.");
    }
    const json = await this.#request("/v1/complete_registration", {
      method: "POST",
      auth: false,
      body: {
        age: Number(age),
        registration_id: registrationID,
      },
      failure: "Failed to complete registration.",
    });
    if (json.token) {
      this.userToken = json.token;
    }
    return json;
  };

  /**
   * Initiate the email setup process.  Should be followed up with checkEmailVerification().
   * @method
   * @since 1.0.0
   * @param {String} email - school email address to send verification code to
   * @tutorial Email Registration
   */
  registerEmail = async (email) => {
    const json = await this.#request("/v2/users/register_email", {
      method: "POST",
      body: { email: email },
      failure: "Failed to request email verification.",
    });
    if (json.message) {
      throw new SidechatAPIError(json.message, { response: json });
    }
    return json;
  };

  /**
   * Check is the user's email is verified.
   * @method
   * @since 1.0.0
   */
  checkEmailVerification = async () => {
    const json = await this.#request("/v1/users/check_email_verified", {
      failure: "Failed to check email verification.",
    });
    if (json.verified_email_updates_response) {
      return json.verified_email_updates_response;
    } else if (json.changing_phone_number_verified_email_user) {
      return json.changing_phone_number_verified_email_user;
    } else {
      throw new SidechatAPIError(json?.message || "Email is not verified.", {
        response: json,
      });
    }
  };

  /**
   * Set the device ID of the current user
   * @method
   * @since 1.0.0
   * @param {String} deviceID - the device ID to set
   */
  setDeviceID = async (deviceID) => {
    return this.#request("/v1/register_device_token", {
      method: "POST",
      body: {
        build_type: "release",
        bundle_id: "com.flowerave.sidechat",
        device_token: deviceID,
      },
      failure: "Failed to register device.",
    });
  };

  /**
   * Get updated status for user and group
   * @method
   * @since 1.0.0
   * @deprecated since 2.1.0, will be removed by 3.0.0.  Please use `getUpdates` instead!
   * @param {String} [groupID] - ID of a specific group to retrieve info from.  Falls back to user's primary group.
   */
  getUserAndGroup = async (groupID = "") => {
    const json = await this.getUpdates(groupID);
    return json;
  };

  /**
   * Get updated status for user and group
   * @method
   * @since 2.1.0
   * @param {String} [groupID] - ID of a specific group to retrieve info from.  Falls back to user's primary group.
   */
  getUpdates = async (groupID = "") => {
    return this.#request("/v1/updates", {
      query: { group_id: groupID },
      failure: "Failed to get updates.",
    });
  };

  /**
   * Fetches posts from the specified category in a group
   * @method
   * @since 1.0.0
   * @param {String} groupID - group ID
   * @param {"hot"|"recent"|"top"} category - category to filter posts
   * @param {types.SidechatCursorString} [cursor] - cursor string
   * @returns {Promise<types.SidechatPostsAndCursor>} List of posts and cursor
   */
  getGroupPosts = async (groupID, category = "hot", cursor) => {
    return this.#request("/v1/posts", {
      query: {
        cursor: cursor || undefined,
        group_id: groupID,
        type: category,
        cacheBust: Date.now(),
      },
      failure: "Failed to get posts from group.",
    });
  };

  /**
   * Upvote or downvote, or unvote a post
   * @method
   * @since 2.0.0-alpha.0
   * @param {String} postID - post ID to vote on
   * @param {types.SidechatVoteString} action - whether to upvote, downvote, or reset vote
   */
  setVote = async (postID, action) => {
    return this.#request("/v1/posts/set_vote", {
      method: "POST",
      body: {
        post_id: postID,
        vote_status: action,
      },
      failure: "Failed to change the vote on post.",
    });
  };

  /**
   * Fetches a single post with just its ID
   * @method
   * @since 2.3.0
   * @param {String} postID - ID of post to fetch
   * @param {Boolean} includeDeleted - undocumented
   * @returns {Promise<types.SidechatPostOrComment>} post object
   */
  getPost = async (postID, includeDeleted = false) => {
    const json = await this.#request("/v1/posts/get", {
      query: {
        include_deleted: includeDeleted,
        post_id: postID,
        cacheBust: Date.now(),
      },
      failure: "Failed to get post from ID.",
    });
    return json.post;
  };

  /**
   * Fetches the posts or comments that the user has created
   * @method
   * @since 2.3.5
   * @param {"posts"|"comments"} contentType - type of user content to fetch
   * @returns {Promise<types.SidechatPostOrComment[]>} post object
   */
  getUserContent = async (contentType) => {
    if (contentType == "posts") {
      contentType = "my_posts";
    } else if (contentType == "comments") {
      contentType = "my_comments";
    }
    const json = await this.#request("/v1/posts", {
      query: { type: contentType },
      failure: "Failed to get content from user.",
    });
    return json.posts;
  };

  /**
   * Get all the commments on a post.  Replies are placed directly after the comment they reply to, regardless of the order the API returns them in.
   * @method
   * @since 2.0.0-alpha.0
   * @param {String} postID - post ID to get comments for
   * @returns {Promise<types.SidechatPostOrComment[]>} list of comments
   */
  getPostComments = async (postID) => {
    const json = await this.#request("/v1/posts/comments/", {
      query: { post_id: postID, cacheBust: Date.now() },
      failure: "Failed to get comments on post.",
    });
    const apiComments = json.posts || [];

    // First pass: index every comment by ID so replies can find their parent
    // no matter which order the API returned them in.
    const commentMap = new Map();
    for (const comment of apiComments) {
      commentMap.set(comment.id, comment);
    }

    // Second pass: attach replies to their parent, or treat as top-level.
    const topLevelComments = [];
    for (const comment of apiComments) {
      const parentComment = commentMap.get(comment.reply_post_id);
      if (!parentComment || comment.reply_post_id === comment.parent_post_id) {
        topLevelComments.push(comment);
      } else {
        if (!parentComment.replies) parentComment.replies = [];
        parentComment.replies.push(comment);
      }
    }

    // Flatten the tree back into a single list, depth-first.
    const flattenComments = (comments) =>
      comments.reduce((flat, comment) => {
        flat.push(comment);
        if (comment.replies) flat.push(...flattenComments(comment.replies));
        return flat;
      }, []);

    return flattenComments(topLevelComments);
  };

  /**
   * Gets groups to be displayed on the "Explore Groups" page
   * @method
   * @since 2.0.0-alpha.0
   * @param {Boolean} onePage - whether or not results should be returned as a single page
   * @returns {Promise<types.SidechatGroup[]>}
   */
  getAvailableGroups = async (onePage = true) => {
    const json = await this.#request("/v1/groups/explore", {
      headers: onePage ? { "App-Version": "0" } : {},
      failure: "Failed to get groups from explore.",
    });
    return json.groups;
  };

  /**
   * Searches for new groups based on a query keyword
   * @method
   * @since 2.6.0
   * @param {String} query - the string to search for.  This will be encoded, so strings with spaces and special characters are okay.
   * @returns {Promise<types.SidechatGroup[]>}
   */
  searchAvailableGroups = async (query) => {
    const json = await this.#request("/v1/groups/explore/search", {
      query: { term: query },
      failure: "Failed to search groups.",
    });
    return json.results;
  };

  /**
   * Retrieves the entire accessible asset library.  Be warned that as of the time of this documentation, it's a 1.5MB JSON download and this request is very expensive.
   * @method
   * @since 2.0.6
   * @returns {Promise<types.SidechatLibraryAsset[]>}
   */
  getAssetLibrary = async () => {
    const json = await this.#request("/v1/assets/library", {
      failure: "Failed to get asset library.",
    });
    return json.items;
  };

  /**
   * Gets the current authenticated user and a list of the groups of which they are members.
   * @method
   * @since 2.1.0
   * @returns {Promise<types.SidechatCurrentUser>}
   */
  getCurrentUser = async () => {
    return this.#request("/v1/users/me", {
      failure: "Failed to get current user.",
    });
  };

  /**
   * Gets the metadata of a group from its ID
   * @method
   * @since 2.1.0
   * @param {String} [groupID] - alphanumeric ID of a group to get.  Falls back to user's primary group.
   * @returns {Promise<types.SidechatGroup>}
   */
  getGroupMetadata = async (groupID = "") => {
    const json = await this.#request(`/v1/groups/${encodeURIComponent(groupID)}`, {
      failure: "Failed to get group metadata.",
    });
    return json.group;
  };

  /**
   * Joins or leaves a group
   * @method
   * @param {String} groupID - alphanumeric ID of group to join or leave
   * @param {Boolean} isMember - whether or not the user should be a member of the group
   * @since 2.3.8
   */
  setGroupMembership = async (groupID, isMember) => {
    return this.#request(`/v1/groups/${isMember ? "join" : "leave"}`, {
      method: "POST",
      body: { group_id: groupID },
      failure: "Failed to modify group membership.",
    });
  };

  /**
   * Creates a comment on a post
   * @method
   * @since 2.2.0
   * @param {String} parentPostID - alphanumeric ID of post on which this comment is made
   * @param {String} text - text content of comment
   * @param {String} groupID - alphanumeric ID of group in which the parent post resides
   * @param {String} [replyCommentID] - alphanumeric ID of comment to reply to.  Falls back to parentPostID
   * @param {String} [topLevelReplyID] - alphanumeric ID of the top-level comment to reply to.  Used only when replying to replies.  Falls back to parentPostID
   * @param {types.SidechatSimpleAsset[]} [assetList] - list of assets to attach
   * @param {Boolean} [disableDMs] - prevent direct messages being sent to comment's author
   * @param {Boolean} [anonymous] - whether or not to hide user's name and icon on comment
   * @returns {Promise<types.SidechatPostOrComment>} created comment
   */
  createComment = async (
    parentPostID,
    text,
    groupID,
    replyCommentID,
    topLevelReplyID,
    assetList = [],
    disableDMs = false,
    anonymous = false,
  ) => {
    const json = await this.#request("/v1/posts", {
      method: "POST",
      body: {
        type: "comment",
        assets: assetList,
        group_ids: [groupID],
        text: text,
        reply_post_id: topLevelReplyID || replyCommentID || parentPostID,
        reply_comment_post_id: replyCommentID || parentPostID,
        parent_post_id: parentPostID,
        dms_disabled: disableDMs,
        using_identity: !anonymous,
      },
      failure: "Failed to post comment.",
    });
    return json.comment;
  };

  /**
   * Creates a new post in the specified group
   * @method
   * @since 2.2.0
   * @param {String} text - text content of comment
   * @param {String} groupID - alphanumeric ID of group in which the parent post resides
   * @param {types.SidechatSimpleAsset[]} [assetList] - list of assets to attach.
   * @param {Boolean} [disableDMs] - prevent direct messages from being sent to post's author
   * @param {Boolean} [disableComments] - whether or not comments should be disabled on post
   * @param {Boolean} [anonymous] - whether or not to hide user's name and icon on post
   * @param {String} [repostId] - alphanumeric ID of a post to quote/repost.  Omit for a normal post.
   * @param {Array<String>} [pollOptions] - List of poll options.  If provided, a poll will be created with these options.
   * @returns {Promise<types.SidechatPostOrComment>} the created post
   */
  createPost = async (
    text,
    groupID,
    assetList = [],
    disableDMs = false,
    disableComments = false,
    anonymous = false,
    repostId = undefined,
    pollOptions = undefined,
  ) => {
    const body = {
      type: "post",
      assets: assetList,
      group_ids: [groupID],
      text: text,
      attachments: [],
      dms_disabled: disableDMs,
      comments_disabled: disableComments,
      using_identity: !anonymous,
      quote_post_id: repostId,
    };
    if (Array.isArray(pollOptions) && pollOptions.length > 0) {
      body.poll_request = {
        allows_view_results: true,
        choices: pollOptions,
      };
    }
    const json = await this.#request("/v1/posts", {
      method: "POST",
      body,
      failure: "Failed to make post.",
    });
    return json.posts?.[0];
  };

  /**
   * Deletes a post or comment that the user created
   * @method
   * @since 2.2.0
   * @param {String} postOrCommentID - alphanumeric ID of post to delete
   */
  deletePostOrComment = async (postOrCommentID) => {
    return this.#request("/v1/posts/delete", {
      method: "POST",
      body: { post_id: postOrCommentID },
      failure: "Failed to delete post.",
    });
  };

  /**
   * Votes on a poll attached to a post
   * @method
   * @param {String} pollId - alphanumeric ID of poll to vote on
   * @param {Number} choiceIndex - index of the choice to vote on
   * @since 2.5.4
   */
  voteOnPoll = async (pollId, choiceIndex) => {
    return this.#request("/v1/polls/vote", {
      method: "POST",
      body: {
        poll_id: pollId,
        choice: choiceIndex,
      },
      failure: "Failed to vote on poll.",
    });
  };

  /**
   * Marks that the user has viewed results on a poll.  Note that this does not actually return the results of the poll.
   * @method
   * @param {String} pollId - alphanumeric ID of poll to vote on
   * @since 2.5.4
   */
  viewPollResults = async (pollId) => {
    return this.#request("/v1/polls/view_results", {
      method: "POST",
      query: { cacheBust: Date.now() },
      body: { poll_id: pollId },
      failure: "Failed to mark poll results as viewed.",
    });
  };

  /**
   * Uploads an asset to AWS S3 for use in posts and comments.  Currently photos only.
   * Note: the `{ uri, name, type }` FormData shape used here is what React Native's FormData expects; in Node you will need to supply a Blob yourself.
   * @method
   * @param {String} uri - URI of the asset to upload
   * @param {String} mimeType - mimetype of the asset (e.g. "image/png")
   * @param {String} [name] - filename of the asset
   * @returns {Promise<String>} URL of the uploaded asset
   * @since 2.5.1
   */
  uploadAsset = async (uri, mimeType, name = "") => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }

    let imageType = mimeType.split("/")[1];
    if (!["png", "jpeg", "gif"].includes(imageType)) {
      throw new SidechatAPIError("Unsupported image format.");
    }

    const data = new FormData();
    data.append("image", {
      name: name,
      type: mimeType,
      uri: uri,
    });

    const urlJson = await this.#request("/v1/assets/upload_url", {
      query: { content_type: imageType },
      failure: "Failed to get upload URL.",
    });
    if (!urlJson.upload_url || !urlJson.asset_id) {
      throw new SidechatAPIError("Upload URL response was missing upload_url or asset_id.", {
        response: urlJson,
      });
    }

    let uploadReq;
    try {
      uploadReq = await fetch(urlJson.upload_url, {
        body: data.getAll("image")[0],
        method: "PUT",
        headers: {
          "Content-Type": mimeType,
        },
      });
    } catch (e) {
      throw new SidechatAPIError(`Couldn't upload image (${e.message})`, { cause: e });
    }
    if (uploadReq.status == 200) {
      return `${this.apiRoot}/v1/assets/library/${urlJson.asset_id}`;
    }
    throw new SidechatAPIError(`Couldn't upload image - error ${uploadReq.status}`, {
      status: uploadReq.status,
    });
  };

  /**
   * Sets the conversation icon of a user
   * @method
   * @since 2.2.1
   * @param {String} userID - alphanumeric ID of user
   * @param {String} emoji - emoji to set as icon
   * @param {String} primaryColor - hex string (including #) of primary color
   * @param {String} secondaryColor - hex string (including #) of secondary color
   */
  setUserIcon = async (userID, emoji, primaryColor, secondaryColor) => {
    return this.#request(`/v1/users/${encodeURIComponent(userID)}`, {
      method: "PATCH",
      headers: { "App-Version": "0" },
      body: {
        conversation_icon: {
          emoji: emoji,
          secondary_color: secondaryColor,
          is_migrated: true,
          color: primaryColor,
        },
      },
      failure: "Failed to set icon.",
    });
  };

  /**
   * Sets the bio text of a user
   * @method
   * @since 2.5.6
   * @param {String} userID - alphanumeric ID of user
   * @param {String} bio - text to set as bio
   */
  setUserBio = async (userID, bio) => {
    return this.#request(`/v1/users/${encodeURIComponent(userID)}`, {
      method: "PATCH",
      headers: { "App-Version": "5.4.22" },
      body: { bio: bio },
      failure: "Failed to set bio.",
    });
  };

  /**
   * Checks if user can set their username to a string
   * @method
   * @since 2.3.6
   * @param {String} username - string to check
   * @returns {Promise<Boolean>} whether or not username is valid and unused
   */
  checkUsername = async (username) => {
    try {
      await this.#request("/v1/users/username", {
        query: { username: username },
        failure: "Failed to check username.",
      });
      return true;
    } catch (err) {
      // A non-2xx response means the username is taken or invalid.  Anything
      // without a status (no token, network failure) is a real error.
      if (err instanceof SidechatAPIError && err.status) {
        return false;
      }
      throw err;
    }
  };

  /**
   * Changes the username of the current user
   * @method
   * @since 2.3.6
   * @param {String} userID - alphanumeric ID of user
   * @param {String} username - new username to set
   */
  setUsername = async (userID, username) => {
    const json = await this.#request(`/v1/users/${encodeURIComponent(userID)}`, {
      method: "PATCH",
      body: { username: username },
      failure: "Failed to set username.",
    });
    return json.user;
  };

  /**
   * Fetches a public user profile
   * @method
   * @since 2.6.0
   * @param {String} username - username of the user to fetch
   * @returns {Promise<types.SidechatProfile>}
   */
  getUserProfile = async (username) => {
    const json = await this.#request("/v1/groups/username", {
      query: { username: username, cacheBust: Date.now() },
      failure: "Failed to get user profile.",
    });
    return json.group;
  };

  /**
   * Fetches a public user's posts
   * @method
   * @since 2.6.0
   * @param {String} username - username of the user to fetch
   * @returns {Promise<types.SidechatPostOrComment[]>}
   */
  getUserPosts = async (username) => {
    const json = await this.#request("/v1/users/posts", {
      query: { username: username },
      failure: "Failed to get user posts.",
    });
    return json.posts;
  };

  /**
   * Marks an activity item as read
   * @method
   * @since 2.3.2
   * @param {String} activityID - alphanumeric ID of activity object
   */
  readActivity = async (activityID) => {
    return this.#request("/v1/activity/seen", {
      method: "POST",
      body: { ids: [activityID] },
      failure: "Failed to mark activity as read.",
    });
  };

  /**
   * Retrieves joinable group chats
   * @method
   * @since 2.3.5
   */
  getGroupChats = async () => {
    const json = await this.#request("/v1/chats/explore", {
      query: { cacheBust: Date.now() },
      failure: "Failed to get groupchats.",
    });
    return json.chats;
  };

  /**
   * Joins a group chat.  To mimic the official client, use the user's display name and icon by default.
   * @method
   * @param {String} groupChatID - alphanumeric ID of group chat to join
   * @param {String} displayName - display name to use in chat
   * @param {String} emoji - emoji to use as icon
   * @param {String} primaryColor - hex string of primary color
   * @param {String} secondaryColor - hex string of secondary color
   * @since 2.3.5
   */
  joinGroupChat = async (
    groupChatID,
    displayName,
    emoji,
    primaryColor,
    secondaryColor,
  ) => {
    return this.#request("/v1/chats/groups/join", {
      method: "POST",
      body: {
        chat_id: groupChatID,
        identity: {
          display_name: displayName,
          emoji: emoji,
          secondary_color: secondaryColor,
          color: primaryColor,
        },
      },
      failure: "Failed to join groupchat.",
    });
  };

  /**
   * Gets a list of the user's direct messages
   * @method
   * @returns {Promise<types.SidechatDirectThread[]>}
   * @since 2.4.4
   */
  getDMs = async () => {
    const json = await this.#request("/v1/chats", {
      failure: "Failed to fetch DMs.",
    });
    return (json.chats || []).map((o) => o.chat);
  };

  /**
   * Gets a single direct message thread
   * @method
   * @param {String} id - alphanumeric ID of the chat to fetch
   * @returns {Promise<types.SidechatDirectThread>}
   * @since 2.4.4
   */
  getDMThread = async (id) => {
    const json = await this.#request("/v1/chats/messages", {
      query: { chat_id: id },
      failure: "Failed to fetch DM thread.",
    });
    return json.chat;
  };

  /**
   * Sends a message to an existing direct message thread - note that you must first use startDM() to start a thread.
   * @method
   * @param {String} chatID - alphanumeric ID of the chat to send to
   * @param {String} text - text content of message
   * @param {String} clientID - alphanumeric device ID
   * @param {types.SidechatSimpleAsset[]} assets - array of assets to send
   * @param {Boolean} anonymous - whether the DM should be sent anonymously
   * @since 2.4.4
   */
  sendDM = async (chatID, text, clientID, assets = [], anonymous = false) => {
    return this.#request("/v1/chats/send", {
      method: "POST",
      body: {
        chat_id: chatID,
        text: text,
        client_id: clientID,
        anonymous: anonymous,
        assets: assets,
      },
      failure: "Failed to send message.",
    });
  };

  /**
   * Creates a new direct message thread
   * @method
   * @param {String} text - text content of message
   * @param {String} clientID - alphanumeric ID of devide
   * @param {String} postID - alphanumeric ID of post or comment
   * @param {Boolean} anonymous - whether the DM should be sent anonymously
   * @param {"feed"} postContext - context of post (mostly undocumented, defaults to "feed")
   * @since 2.4.4
   */
  startDM = async (
    text,
    clientID,
    postID,
    anonymous = false,
    postContext = "feed",
  ) => {
    return this.#request("/v1/chats/start", {
      method: "POST",
      body: {
        text: text,
        client_id: clientID,
        post_id: postID,
        anonymous: anonymous,
        post_context: postContext,
      },
      failure: "Failed to start DM.",
    });
  };

  /**
   * Hides posts from user
   * @method
   * @param {String} postID - alphanumeric ID of post to hide
   * @since 2.6.2
   */
  hidePostsFromUser = async (postID) => {
    return this.#request("/v1/posts/hide_posts_from_user", {
      method: "POST",
      body: {
        post_id: postID,
        post_context: "feed",
        report: false,
      },
      failure: "Failed to hide post.",
    });
  };

  /**
   * Unhides all posts from all users
   * @method
   * @since 2.6.2
   */
  unhidePostsFromAllUsers = async () => {
    return this.#request("/v1/users/unhide_all", {
      method: "POST",
      body: {},
      failure: "Failed to unhide posts.",
    });
  };
}

export default SidechatAPIClient;
