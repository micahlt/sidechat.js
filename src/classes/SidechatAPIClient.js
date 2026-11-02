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
   * @static
   * @constant
   */
  defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "App-Version": "6.0.0",
    Dnt: 1,
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
   * Set an identifier for this device, which will be sent with every request in the `X-Device-ID` header.  Should be stable across sessions on the same device.
   * @method
   * @param {String} deviceIdentifier - stable identifier for this device
   * @since 2.7.0
   */
  setDeviceIdentifier = (deviceIdentifier) => {
    this.defaultHeaders["X-Device-ID"] = deviceIdentifier;
  };

  /**
   * Run an arbitrary API request using the current client's authentication
   * @method
   * @param {String} endpoint - API endpoint to request (e.g. "/v1/posts")
   * @param {"GET"|"POST"|"PUT"|"DELETE"|"PATCH"|"OPTIONS"} [method] - HTTP method to use
   * @param {Object} [body] - body to send with the request
   * @param {Object} [headers] - custom headers to send with the request
   * @param {Boolean} [stripHeaders] - remove the default headers from the request
   * @since 2.4.9
   */
  sendRequest = (
    endpoint,
    method = "GET",
    body = undefined,
    headers = {},
    stripHeaders = false,
  ) => {
    let requestHeaders = this.defaultHeaders;
    if (stripHeaders) {
      headers = {};
    }
    requestHeaders = { ...requestHeaders, ...headers };
    return fetch(`${this.apiRoot}${endpoint}`, {
      headers: { Authorization: `Bearer ${this.userToken}`, ...requestHeaders },
      body: body,
      method: method,
    });
  };

  /**
   * Initiate the login process with a phone number.  Should be followed up with verifySMSCode().  If the response has an `error_code` of `"captcha_required"`, the server wants a captcha solved before it will send a code, and the request should be repeated with a captcha response.  I haven't been able to recreate this yet, so I honestly don't know what captcha provider they want.
   * @method
   * @since 1.0.0
   * @param {Number} phoneNumber - US phone number (WITHOUT +1) to send verification code to
   * @param {Boolean} [useFallback] - send the code through the backup SMS route, which the official app offers when a code doesn't arrive
   * @param {String} [captchaMethod] - type of captcha being answered
   * @param {String} [captchaResponse] - solved captcha token
   */
  loginViaSMS = async (
    phoneNumber,
    useFallback = false,
    captchaMethod = undefined,
    captchaResponse = undefined,
  ) => {
    try {
      const endpoint = useFallback
        ? "/v1/login_register_sms_fallback"
        : "/v1/login_register";
      const res = await fetch(`${this.apiRoot}${endpoint}`, {
        method: "POST",
        headers: this.defaultHeaders,
        body: JSON.stringify({
          phone_number: `+1${phoneNumber}`,
          version: 3,
          captcha_method: captchaMethod,
          captcha_response: captchaResponse,
        }),
      });
      const json = await res.json();
      return json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError("Failed to request SMS verification.");
    }
  };

  /**
   * Verify the code sent via SMS with loginViaSMS().  If this function succeeds, the user will be authenticated for future requests.
   * @method
   * @since 1.0.0
   * @param {Number} phoneNumber - US phone number (WITHOUT +1) that verification code was sent to
   * @param {String} code  - the verification code
   */
  verifySMSCode = async (phoneNumber, code) => {
    try {
      const res = await fetch(`${this.apiRoot}/v1/verify_phone_number`, {
        method: "POST",
        headers: this.defaultHeaders,
        body: JSON.stringify({
          phone_number: `+1${phoneNumber}`,
          code: code.toUpperCase(),
        }),
      });
      const json = await res.json();
      if (json?.logged_in_user?.token) {
        this.userToken = json.logged_in_user.token;
      }
      return json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError("Failed verify this code.");
    }
  };

  /**
   * Set the user's age.  If this function succeeds, the user will be authenticated for future requests.
   * @method
   * @since 1.0.0
   * @param {Number} age - user's age in years
   * @param {String} registrationID  - the registration ID generated by verifySMSCode()
   * @param {String} [timeZone] - time zone of the user (e.g. "America/Chicago").  Falls back to the system time zone.
   * @param {String} [inviteLinkURL] - group invite link that the user signed up through
   */
  setAge = async (
    age,
    registrationID,
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
    inviteLinkURL = undefined,
  ) => {
    if (age < 13) {
      throw new SidechatAPIError("You're too young to use Offsides.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/complete_registration`, {
        method: "POST",
        headers: this.defaultHeaders,
        body: JSON.stringify({
          age: Number(age),
          registration_id: registrationID,
          time_zone: timeZone,
          invite_link_url: inviteLinkURL,
          device_id: this.defaultHeaders["X-Device-ID"],
        }),
      });
      const json = await res.json();
      if (json.token) {
        this.userToken = json.token;
      }
      return json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError("Failed verify this code.");
    }
  };

  /**
   * Initiate the email setup process.  Should be followed up with checkEmailVerification().
   * @method
   * @since 1.0.0
   * @param {String} email - school email address to send verification code to
   * @tutorial Email Registration
   */
  registerEmail = async (email) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v2/users/register_email`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      const json = await res.json();
      if (json.message) {
        throw new SidechatAPIError(json.message);
      }
      return json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError("Failed to request email verification.");
    }
  };

  /**
   * Check is the user's email is verified.
   * @method
   * @since 1.0.0
   */
  checkEmailVerification = async () => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/users/check_email_verified`, {
        method: "GET",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
      });
      const json = await res.json();
      if (json.verified_email_updates_response) {
        return json.verified_email_updates_response;
      } else if (json.changing_phone_number_verified_email_user) {
        return json.changing_phone_number_verified_email_user;
      } else {
        throw new SidechatAPIError(json?.message || "Email is not verified.");
      }
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError("Email is not verified.");
    }
  };

  /**
   * Set the device ID of the current user
   * @method
   * @since 1.0.0
   * @param {String} deviceId - the device ID to set
   * @param {"com.flowerave.sidechat"|"com.flowerave.yikyak"} [bundleID] - bundle ID of the app the push token belongs to
   */
  setDeviceID = async (deviceID, bundleID = "com.flowerave.sidechat") => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/register_device_token`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({
          build_type: "release",
          bundle_id: bundleID,
          device_token: deviceID,
        }),
      });
      const json = await res.json();
      return json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError("Failed verify this code.");
    }
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
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `${this.apiRoot}/v1/updates?group_id=${groupID}`,
        {
          method: "GET",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
        },
      );
      const json = await res.json();
      return json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get posts from group.`);
    }
  };

  /**
   * Fetches posts from the specified category in a group
   * @method
   * @since 1.0.0
   * @param {String} groupID - group ID
   * @param {"hot"|"recent"|"top"} category - category to filter posts
   * @param {types.SidechatCursorString} [cursor] - cursor string
   * @param {"day"|"week"|"month"|"year"|"all_time"} [period] - time period to pull top posts from (only if category is "top")
   * @returns {Promise<types.SidechatPostsAndCursor>} List of posts and cursor
   */
  getGroupPosts = async (groupID, category = "hot", cursor, period) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `${this.apiRoot}/v1/posts?${
          cursor ? "cursor=" + encodeURIComponent(cursor) + "&" : ""
        }${
          period ? "period=" + period + "&" : ""
        }group_id=${groupID}&type=${category}&cacheBust=${Date.now()}`,
        {
          method: "GET",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
        },
      );
      const json = await res.json();
      return json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get posts from group.`);
    }
  };

  /**
   * Upvote or downvote, or unvote a post
   * @method
   * @since 2.0.0-alpha.0
   * @param {String} postID - post ID to vote on
   * @param {types.SidechatVoteString} action - whether to upvote, downvote, or reset vote
   */
  setVote = async (postID, action) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/posts/set_vote`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({
          post_id: postID,
          vote_status: action,
        }),
      });
      const json = await res.json();
      return json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to change the vote on post.`);
    }
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
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `${this.apiRoot}/v1/posts/get?include_deleted=${includeDeleted}&post_id=${postID}&cacheBust=${Date.now()}`,
        {
          method: "GET",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
        },
      );
      const json = await res.json();
      return json.post;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get post from ID.`);
    }
  };

  /**
   * Fetches the posts or comments that the user has created
   * @method
   * @since 2.3.5
   * @param {"posts"|"comments"} contentType - type of user content to fetch
   * @returns {Promise<types.SidechatPostOrComment[]>} post object
   */
  getUserContent = async (contentType) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    if (contentType == "posts") {
      contentType = "my_posts";
    } else if (contentType == "comments") {
      contentType = "my_comments";
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/posts?type=${contentType}`, {
        method: "GET",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
      });
      const json = await res.json();
      return json.posts;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get content from user.`);
    }
  };

  /**
   * Get all the commments on a post
   * @method
   * @since 2.0.0-alpha.0
   * @param {String} postID - post ID to get comments for
   * @returns {Promise<types.SidechatPostOrComment[]>} list of comments
   */
  getPostComments = async (postID) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `${this.apiRoot}/v1/posts/comments/?post_id=${postID}&cacheBust=${Date.now()}`,
        {
          method: "GET",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
        },
      );
      const json = await res.json();
      // Function to preprocess the comments and organize them into a nested structure
      function preprocessComments(apiComments) {
        // Map to store comments by their IDs for efficient lookup
        const commentMap = new Map();
        // List to store top-level comments
        const topLevelComments = [];

        // Iterate through the API comments
        apiComments.forEach((comment) => {
          // Store the comment in the map with its ID as the key
          commentMap.set(comment.id, comment);
          // Get the parent comment using the reply_post_id
          const parentComment = commentMap.get(comment.reply_post_id);
          // Check if the comment is a top-level comment
          if (
            !parentComment ||
            comment.reply_post_id === comment.parent_post_id
          ) {
            // If it's a top-level comment, push it to the topLevelComments array
            topLevelComments.push(comment);
          } else {
            // If it's a reply, add it to the parent comment's replies array
            if (!parentComment.replies) parentComment.replies = [];
            parentComment.replies.push(comment);
          }
        });

        // Flatten the nested structure and return a single list of comments
        return flattenComments(topLevelComments);
      }

      // Function to flatten nested comments into a single list
      function flattenComments(comments) {
        // Use reduce to flatten the nested comments array into a single list
        return comments.reduce((flatComments, comment) => {
          // Push the current comment to the flatComments array
          flatComments.push(comment);
          // If the current comment has replies, recursively flatten them and push to the flatComments array
          if (comment.replies)
            flatComments.push(...flattenComments(comment.replies));
          // Return the flatComments array
          return flatComments;
        }, []);
      }

      const sortedComments = preprocessComments(json.posts);
      return sortedComments;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get comments on post.`);
    }
  };

  /**
   * Gets groups to be displayed on the "Explore Groups" page
   * @method
   * @since 2.0.0-alpha.0
   * @param {Boolean} onePage - whether or not results should be returned as a single page
   * @returns {Promise<types.SidechatGroup[]>}
   */
  getAvailableGroups = async (onePage = true) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/groups/explore`, {
        method: "GET",
        headers: {
          ...this.defaultHeaders,
          "App-Version": onePage ? "0" : this.defaultHeaders["App-Version"],
          Authorization: `Bearer ${this.userToken}`,
        },
      });
      const json = await res.json();
      return await json.groups;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get groups from explore.`);
    }
  };

  /**
   * Searches for new groups based on a query keyword
   * @method
   * @since 2.6.0
   * @param {String} query - the string to search for.  This will be encoded, so strings with spaces and special characters are okay.
   * @returns {Promise<types.SidechatGroup[]>}
   */
  searchAvailableGroups = async (query) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `${this.apiRoot}/v1/groups/explore/search?term=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
        },
      );
      const json = await res.json();
      return await json.results;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to search groups.`);
    }
  };

  /**
   * Retrieves the entire accessible asset library.  Be warned that as of the time of this documentation, it's a 1.5MB JSON download and this request is very expensive.
   * @method
   * @since 2.0.6
   * @returns {Promise<types.SidechatLibraryAsset[]>}
   */
  getAssetLibrary = async () => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/assets/library`, {
        method: "GET",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
      });
      const json = await res.json();
      return await json.items;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get asset library.`);
    }
  };

  /**
   * Gets the current authenticated user and a list of the groups of which they are members.
   * @method
   * @since 2.1.0
   * @returns {Promise<types.SidechatCurrentUser>}
   */
  getCurrentUser = async () => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/users/me`, {
        method: "GET",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
      });
      const json = await res.json();
      return await json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get asset library.`);
    }
  };

  /**
   * Gets the metadata of a group from its ID
   * @method
   * @since 2.1.0
   * @param {String} [groupID] - alphanumeric ID of a group to get.  Falls back to user's primary group.
   * @returns {Promise<types.SidechatGroup>}
   */
  getGroupMetadata = async (groupID = "") => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/groups/${groupID}`, {
        method: "GET",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
      });
      const json = await res.json();
      return await json.group;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get group metadata.`);
    }
  };

  /**
   * Joins or leaves a group
   * @method
   * @param {String} groupID - alphanumeric ID of group to join or leave
   * @param {Boolean} isMember - whether or not the user should be a member of the group
   * @since 2.3.8
   */
  setGroupMembership = async (groupID, isMember) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      // Joining moved to the v2 endpoint, which takes a list of IDs.  Leave still sends group_id by itself, no list.
      const res = await fetch(
        `${this.apiRoot}${isMember ? "/v2/groups/join" : "/v1/groups/leave"}`,
        {
          method: "POST",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
          body: JSON.stringify({
            group_id: isMember ? undefined : groupID,
            group_ids: [groupID],
          }),
        },
      );
      const json = await res.json();
      return await json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to modify group membership.`);
    }
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
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/posts`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({
          type: "comment",
          assets: assetList,
          group_ids: [groupID],
          text: text,
          reply_post_id: topLevelReplyID || replyCommentID || parentPostID,
          reply_comment_post_id: replyCommentID || parentPostID,
          parent_post_id: parentPostID,
          dms_disabled: disableDMs,
          using_identity: !anonymous,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new SidechatAPIError(json.message);
      return await json.comment;
    } catch (err) {
      console.error(err);
      if (err instanceof SidechatAPIError && err.message) throw err;
      throw new SidechatAPIError(`Failed to post comment.`);
    }
  };

  /**
   * Creates a new post in the specified group.  Users can only make two posts a minute; if a post is rejected, the thrown error contains the reason from the server.
   * @method
   * @since 2.2.0
   * @param {String} text - text content of comment
   * @param {String} groupID - alphanumeric ID of group in which the parent post resides
   * @param {types.SidechatSimpleAsset[]} [assetList] - list of assets to attach.
   * @param {Boolean} [disableDMs] - prevent direct messages from being sent to post's author
   * @param {Boolean} [disableComments] - whether or not comments should be disabled on post
   * @param {Boolean} [anonymous] - whether or not to hide user's name and icon on post
   * @param {Array<String>} [pollOptions] - List of poll options.  If provided, a poll will be created with these options.
   * @param {Array<String>} [attachmentIDs] - IDs of link attachments created with createLinkAttachment()
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
    attachmentIDs = [],
  ) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      // Build the request body
      const body = {
        type: "post",
        assets: assetList,
        group_ids: [groupID],
        text: text,
        attachments: attachmentIDs,
        dms_disabled: disableDMs,
        comments_disabled: disableComments,
        using_identity: !anonymous,
        quote_post_id: repostId,
      };
      // If pollOptions is provided and is a non-empty array, add poll_request
      if (Array.isArray(pollOptions) && pollOptions.length > 0) {
        body.poll_request = {
          allows_view_results: true,
          choices: pollOptions,
        };
      }
      const res = await fetch(`${this.apiRoot}/v1/posts`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new SidechatAPIError(json.message);
      return await json.posts[0];
    } catch (err) {
      console.error(err);
      if (err instanceof SidechatAPIError && err.message) throw err;
      throw new SidechatAPIError(`Failed to make post.`);
    }
  };

  /**
   * Deletes a post or comment that the user created
   * @method
   * @since 2.2.0
   * @param {String} postOrCommentID - alphanumeric ID of post to delete
   */
  deletePostOrComment = async (postOrCommentID) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/posts/delete`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({
          post_id: postOrCommentID,
        }),
      });
      const json = await res.json();
      return await json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to delete post.`);
    }
  };

  /**
   * Votes on a poll attached to a post
   * @method
   * @param {String} pollId - alphanumeric ID of poll to vote on
   * @param {Number} choiceIndex - index of the choice to vote on
   * @since 2.5.4
   */
  voteOnPoll = async (pollId, choiceIndex) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/polls/vote`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({
          poll_id: pollId,
          choice: choiceIndex,
        }),
      });
      const json = await res.json();
      return await json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to vote on poll`);
    }
  };

  /**
   * Marks that the user has viewed results on a poll.  Note that this does not actually return the results of the poll.
   * @method
   * @param {String} pollId - alphanumeric ID of poll to vote on
   * @since 2.5.4
   */
  viewPollResults = async (pollId) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `${this.apiRoot}/v1/polls/view_results?cacheBust=${Date.now()}`,
        {
          method: "POST",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
          body: JSON.stringify({
            poll_id: pollId,
          }),
        },
      );
      const json = await res.json();
      return await json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to mark poll results as viewed.`);
    }
  };

  /**
   * Uploads an asset to AWS S3 for use in posts and comments.  Supports images and videos (videos must be under 50MB and are processed after upload)
   * @method
   * @param {String} uri - URI of the asset to upload
   * @param {String} mimeType - mimetype of the asset (e.g. "image/png" or "video/mp4")
   * @param {String} [name] - filename of the asset
   * @param {"post"|"post_vod_source"|"chat"|"chat_icon"|"group_icon"|"profile_picture_icon"} [context] - where the asset will be used.  Videos default to "post_vod_source", which is required for them to be processed into a playable stream.
   * @returns {Promise<String>} URL of the uploaded asset
   * @since 2.5.1
   */
  uploadAsset = async (uri, mimeType, name = "", context = undefined) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }

    let imageType = mimeType.split("/")[1];
    if (imageType == "quicktime") imageType = "mov";
    if (!["png", "jpeg", "gif", "webp", "mp4", "mov"].includes(imageType)) {
      throw new SidechatAPIError("Unsupported file format.");
    }
    if (!context && ["mp4", "mov"].includes(imageType)) {
      context = "post_vod_source";
    }

    const data = new FormData();
    data.append("image", {
      name: name,
      type: mimeType,
      uri: uri,
    });

    const urlReq = await this.sendRequest(
      `/v1/assets/upload_url?content_type=${imageType}${
        context ? "&context=" + context : ""
      }`,
    );
    const urlJson = await urlReq.json();

    try {
      const uploadReq = await fetch(urlJson.upload_url, {
        body: data.getAll("image")[0],
        method: "PUT",
        headers: {
          "Content-Type": mimeType,
        },
      });
      if (uploadReq.status == 200) {
        return `${this.apiRoot}/v1/assets/library/${urlJson.asset_id}`;
      } else {
        throw new SidechatAPIError(
          `Couldn't upload image - error ${uploadReq.status}`,
        );
      }
    } catch (e) {
      throw new SidechatAPIError(e.message);
    }
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
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/users/${userID}`, {
        method: "PATCH",
        headers: {
          ...this.defaultHeaders,
          "App-Version": "0",
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({
          conversation_icon: {
            emoji: emoji,
            secondary_color: secondaryColor,
            is_migrated: true,
            color: primaryColor,
          },
        }),
      });
      const json = await res.json();
      return await json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to set icon.`);
    }
  };

  /**
   * Sets the bio text of a user
   * @method
   * @since 2.5.6
   * @param {String} userID - alphanumeric ID of user
   * @param {String} bio - text to set as bio
   */
  setUserBio = async (userID, bio) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/users/${userID}`, {
        method: "PATCH",
        headers: {
          ...this.defaultHeaders,
          "App-Version": "5.4.22",
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({
          bio: bio,
        }),
      });
      const json = await res.json();
      return await json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to set bio.`);
    }
  };

  /**
   * Checks if user can set their username to a string
   * @method
   * @since 2.3.6
   * @param {String} username - string to check
   * @returns {Promise<Boolean>} whether or not username is valid and unused
   */
  checkUsername = async (username) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `${this.apiRoot}/v1/users/username?username=${username}`,
        {
          method: "GET",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
        },
      );
      if (res?.status == 200 || res?.status == 204) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to check username.`);
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
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/users/${userID}`, {
        method: "PATCH",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({
          username: username,
        }),
      });
      const json = await res.json();
      return await json.user;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to set icon.`);
    }
  };

  /**
   * Fetches a public user profile
   * @method
   * @since 2.6.0
   * @param {String} username - username of the user to fetch
   * @returns {Promise<types.SidechatProfile>}
   */
  getUserProfile = async (username) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `${this.apiRoot}/v1/groups/username?username=${username}&cacheBust=${Date.now()}`,
        {
          method: "GET",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
        },
      );
      const json = await res.json();
      return await json.group;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to set icon.`);
    }
  };

  /**
   * Fetches a public user's posts
   * @method
   * @since 2.6.0
   * @param {String} username - username of the user to fetch
   * @returns {Promise<types.SidechatPostOrComment[]>}
   */
  getUserPosts = async (username) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `${this.apiRoot}/v1/users/posts?username=${username}`,
        {
          method: "GET",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
        },
      );
      const json = await res.json();
      return await json.posts;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to set icon.`);
    }
  };

  /**
   * Marks an activity item as read
   * @method
   * @since 2.3.2
   * @param {String} activityID - alphanumeric ID of activity object
   */
  readActivity = async (activityID) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/activity/seen`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({
          ids: [activityID],
        }),
      });
      const json = await res.json();
      return await json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to mark activity as read.`);
    }
  };

  /**
   * Retrieves joinable group chats
   * @method
   * @since 2.3.5
   */
  getGroupChats = async () => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `${this.apiRoot}/v1/chats/explore?cacheBust=${Date.now()}`,
        {
          method: "GET",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
        },
      );
      const json = await res.json();
      return await json.chats;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get groupchats.`);
    }
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
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/chats/groups/join`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({
          chat_id: groupChatID,
          identity: {
            display_name: displayName,
            emoji: emoji,
            secondary_color: secondaryColor,
            color: primaryColor,
          },
        }),
      });
      const json = await res.json();
      return await json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to join groupchat.`);
    }
  };

  /**
   * Gets a list of the user's direct messages
   * @method
   * @param {types.SidechatCursorString} [cursor] - cursor string
   * @returns {Promise<types.SidechatDirectThread[]>}
   * @since 2.4.4
   */
  getDMs = async (cursor) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `${this.apiRoot}/v1/chats${
          cursor ? "?cursor=" + encodeURIComponent(cursor) : ""
        }`,
        {
          method: "GET",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
        },
      );
      const json = await res.json();
      const list = await json.chats;
      let r = [];
      list.forEach((o) => {
        r.push(o.chat);
      });
      return await r;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to fetch DMs.`);
    }
  };

  /**
   * Gets a single direct message thread
   * @method
   * @param {String} id - alphanumeric ID of the chat to fetch
   * @returns {Promise<types.SidechatDirectThread>}
   * @since 2.4.4
   */
  getDMThread = async (id) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `${this.apiRoot}/v1/chats/messages?chat_id=${id}`,
        {
          method: "GET",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
        },
      );
      const json = await res.json();
      return await json.chat;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to fetch DM thread.`);
    }
  };

  /**
   * Sends a message to an existing direct message thread - note that you must first use startDM() to start a thread.
   * @method
   * @param {String} chatID - alphanumeric ID of the chat to send to
   * @param {String} text - text content of message
   * @param {String} clientID - alphanumeric device ID
   * @param {types.SidechatAsset[]} assets - array of assets to send
   * @param {Boolean} anonymous - whether the DM should be sent anonymously
   * @since 2.4.4
   */
  sendDM = async (chatID, text, clientID, assets = [], anonymous = false) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/chats/send`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({
          chat_id: chatID,
          text: text,
          client_id: clientID,
          anonymous: anonymous,
          assets: assets,
        }),
      });
      const json = await res.json();
      return await json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to send message.`);
    }
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
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/chats/start`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({
          text: text,
          client_id: clientID,
          post_id: postID,
          anonymous: anonymous,
          post_context: postContext,
        }),
      });
      const json = await res.json();
      return await json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to start DM.`);
    }
  };

  /**
   * Hides posts from user
   * @method
   * @param {String} postID - alphanumeric ID of post to hide
   * @since 2.6.2
   * @deprecated since 2.7.0.  Please use `blockUser` instead!
   */
  hidePostsFromUser = async (postID) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/posts/hide_posts_from_user`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({
          post_id: postID,
          post_context: "feed",
          report: false,
        }),
      });
      const json = await res.json();
      return await json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to hide post.`);
    }
  };

  /**
   * Unhides all posts from all users
   * @method
   * @since 2.6.2
   * @deprecated since 2.7.0.  No longer used by the official app and may stop working.
   */
  unhidePostsFromAllUsers = async () => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/users/unhide_all`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      return await json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to unhide post.`);
    }
  };

  /**
   * Fetches the home feed, which mixes posts from all of the user's groups
   * @method
   * @param {"for_you"|"hot"|"recent"} [type] - how the feed should be sorted
   * @param {String} [schoolGroupID] - alphanumeric ID of the user's school group
   * @param {types.SidechatCursorString} [cursor] - cursor string
   * @returns {Promise<types.SidechatFeed>} feed items and cursor
   * @since 2.7.0
   */
  getHomeFeed = async (type = "for_you", schoolGroupID, cursor) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const params = new URLSearchParams({ type: type });
      if (schoolGroupID) params.set("school_group_id", schoolGroupID);
      if (cursor) params.set("cursor", cursor);
      const res = await this.sendRequest(`/v1/posts/home?${params}`);
      return await res.json();
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get home feed.`);
    }
  };

  /**
   * Follows or unfollows a post.  Followed posts send activity notifications when they get new comments.
   * @method
   * @param {String} postID - alphanumeric ID of post
   * @param {Boolean} following - whether or not the user should follow the post
   * @returns {Promise<{post: types.SidechatPostOrComment}>} the updated post
   * @since 2.7.0
   */
  setPostFollowing = async (postID, following) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await this.sendRequest(
        `/v1/posts/${following ? "follow" : "unfollow"}`,
        "POST",
        JSON.stringify({ post_id: postID }),
      );
      return await res.json();
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to change post follow status.`);
    }
  };

  /**
   * Reports a post or comment to the group's moderators
   * @method
   * @param {String} postID - alphanumeric ID of post or comment to report
   * @param {types.SidechatReportReason} reason - why the content is being reported
   * @param {String} [note] - explanation to send along with the report
   * @since 2.7.0
   */
  flagPost = async (postID, reason, note = undefined) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await this.sendRequest(
        "/v1/posts/flag",
        "POST",
        JSON.stringify({ post_id: postID, reason: reason, note: note }),
      );
      return await res.json();
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to report post.`);
    }
  };

  /**
   * Blocks the author of a post or comment, hiding all of their content from the user.  Replaces `hidePostsFromUser`.
   * @method
   * @param {String} postID - alphanumeric ID of a post or comment by the user to block
   * @param {Boolean} [report] - whether or not to also report the content
   * @param {"feed"|"chat"} [postContext] - where the content was seen
   * @since 2.7.0
   */
  blockUser = async (postID, report = false, postContext = "feed") => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await this.sendRequest(
        "/v1/posts/block_user",
        "POST",
        JSON.stringify({
          post_id: postID,
          post_context: postContext,
          report: report,
        }),
      );
      return await res.json();
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to block user.`);
    }
  };

  /**
   * Creates a link attachment that can be added to a post with createPost().  YouTube links are recognized and shown as embedded videos.
   * @method
   * @param {String} url - URL to attach
   * @returns {Promise<types.SidechatAttachment>} the created attachment
   * @since 2.7.0
   */
  createLinkAttachment = async (url) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await this.sendRequest(
        "/v1/attachments/upload_link",
        "POST",
        JSON.stringify({ link_url: url }),
      );
      return await res.json();
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to create link attachment.`);
    }
  };

  /**
   * Gets the user's activity feed (notifications for comments, votes, followers, etc.)
   * @method
   * @param {types.SidechatCursorString} [cursor] - cursor string
   * @returns {Promise<types.SidechatActivityList>} activity items and cursor
   * @since 2.7.0
   */
  getActivity = async (cursor) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await this.sendRequest(
        `/v1/activity${cursor ? "?cursor=" + encodeURIComponent(cursor) : ""}`,
      );
      return await res.json();
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get activity.`);
    }
  };

  /**
   * Gets the groups the user is a member of
   * @method
   * @returns {Promise<types.SidechatGroup[]>}
   * @since 2.7.0
   */
  getGroups = async () => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await this.sendRequest("/v1/groups");
      const json = await res.json();
      return json.groups;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get groups.`);
    }
  };

  /**
   * Gets groups suggested for the user to join
   * @method
   * @param {Number} [limit] - maximum number of groups to return
   * @returns {Promise<types.SidechatGroup[]>}
   * @since 2.7.0
   */
  getSuggestedGroups = async (limit = 10) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await this.sendRequest(
        `/v1/groups/suggestions?limit=${limit}`,
      );
      const json = await res.json();
      return json.groups;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get suggested groups.`);
    }
  };

  /**
   * Gets a shareable invite link for a group.  School groups don't have invite links and will throw an error.
   * @method
   * @param {String} groupID - alphanumeric ID of group
   * @returns {Promise<String>} invite link URL
   * @since 2.7.0
   */
  getGroupInviteLink = async (groupID) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await this.sendRequest(
        `/v1/groups/invite_link?group_id=${groupID}`,
      );
      const json = await res.json();
      return json.link;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get invite link.`);
    }
  };

  /**
   * Gets the yakarma leaderboard for a group, along with the user's own karma
   * @method
   * @param {String} groupID - alphanumeric ID of group
   * @returns {Promise<types.SidechatLeaderboard>}
   * @since 2.7.0
   */
  getLeaderboard = async (groupID) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await this.sendRequest(`/v1/leaderboard?group_id=${groupID}`);
      return await res.json();
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get leaderboard.`);
    }
  };

  /**
   * Gets the existing direct message thread for a post or comment.  Returns undefined if the user hasn't started one.
   * @method
   * @param {String} postID - alphanumeric ID of post or comment
   * @returns {Promise<types.SidechatDirectThread>}
   * @since 2.7.0
   */
  getDMForPost = async (postID) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await this.sendRequest(`/v1/chats/by_post?post_id=${postID}`);
      const json = await res.json();
      return json.chat;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get DM thread for post.`);
    }
  };

  /**
   * Reports a direct message thread
   * @method
   * @param {String} chatID - alphanumeric ID of the thread to report
   * @param {types.SidechatReportReason} reason - why the thread is being reported
   * @since 2.7.0
   */
  reportDM = async (chatID, reason) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await this.sendRequest(
        "/v1/chats/report",
        "POST",
        JSON.stringify({ chat_id: chatID, reason: reason }),
      );
      return await res.json();
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to report DM.`);
    }
  };

  /**
   * Sets which push notifications the user receives
   * @method
   * @param {types.SidechatNotificationPreferences} preferences - notification types to enable or disable
   * @since 2.7.0
   */
  setNotificationPreferences = async (preferences) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await this.sendRequest(
        "/v1/users/set_notification_preferences",
        "POST",
        JSON.stringify({ notification_preferences: preferences }),
      );
      return await res.json();
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to set notification preferences.`);
    }
  };

  /**
   * Verifies the user's school email by signing in with Google or Microsoft instead of clicking an emailed link.  Returns the same object as checkEmailVerification().  This was discovered from me decompiling the new Android app, I haven't tested this but based on the implementation it should work fine and might resolve the problem that a lot of people have with their accounts not being associated with their school automatically.
   * @method
   * @param {String} authToken - token from the Google or Microsoft sign-in
   * @param {"google"|"microsoft"} authType - provider the token came from
   * @param {Boolean} [isIncomingFreshman] - whether or not the user is an incoming freshman
   * @since 2.7.0
   * @tutorial Email Registration
   */
  verifyEmailWithThirdParty = async (
    authToken,
    authType,
    isIncomingFreshman = false,
  ) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await this.sendRequest(
        "/v1/users/third_party_email_verified",
        "POST",
        JSON.stringify({
          auth: authToken,
          auth_type: authType,
          is_incoming_freshman: isIncomingFreshman,
        }),
      );
      const json = await res.json();
      if (json.verified_email_updates_response) {
        return json.verified_email_updates_response;
      } else {
        throw new SidechatAPIError(json?.message || "Email is not verified.");
      }
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError("Failed to verify email.");
    }
  };

  /**
   * Authorizes a realtime (Pusher) connection to subscribe to a private channel, such as `private-chat-<chatID>` for live direct messages.  Pass the result to your Pusher client's channel authorizer.  This hasn't been tested, and is mostly theoretical.
   * @method
   * @param {String} socketID - socket ID assigned by Pusher
   * @param {String} channelName - name of the private channel to subscribe to
   * @returns {Promise<{auth: String}>} signed channel authorization
   * @since 2.7.0
   */
  authorizeRealtimeChannel = async (socketID, channelName) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await this.sendRequest(
        "/pusher/auth",
        "POST",
        JSON.stringify({ socket_id: socketID, channel_name: channelName }),
      );
      return await res.json();
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to authorize realtime channel.`);
    }
  };

  /**
   * Permanently deletes the current user's account.  This cannot be undone!
   * @method
   * @since 2.7.0
   */
  deleteAccount = async () => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await this.sendRequest(
        "/v1/users/delete",
        "POST",
        JSON.stringify({}),
      );
      return await res.json();
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to delete account.`);
    }
  };
}

export default SidechatAPIClient;
