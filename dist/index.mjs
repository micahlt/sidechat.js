/**
 * A user-created post or comment, depending on the "type" prop
 * @typedef {Object} SidechatPostOrComment
 * @prop {"post"|"comment"} type - whether this object represents a post or a comment on a post
 * @prop {String} id - alphanumeric ID of post or comment
 * @prop {Boolean} authored_by_user - undocumented
 * @prop {String} alias - post creator's name in-app
 * @prop {String} group_id - alphanumeric ID of group
 * @prop {SidechatGroup} group - group in which post or comment was created
 * @prop {String} text - text content of post or comment
 * @prop {String} created_at - date string of post or comment creation time
 * @prop {Number} vote_total - sum of upvotes and downvotes
 * @prop {SidechatVoteString} vote_status - current user's vote on post or comment
 * @prop {SidechatSimpleAsset[]} assets - array of simple assets attached to post or comment
 * @prop {Array} attachments - undocumented
 * @prop {Boolean} dms_disabled - whether or not you can send a DM to creator of post
 * @prop {String[]} tags - undocumented
 * @prop {SidechatIdentity} identity - creator's identity information
 * @prop {Boolean} pinned - undocumented
 * @prop {Boolean} is_saved - undocumented
 * @prop {"following"|"not_following"} follow_status - undocumented
 * @prop {"group"} [destination] - undocumented
 * @prop {Number} [comment_count] - number of comments on post (only if type=post)
 * @prop {Boolean} [comments_disabled] - whether or not you can comment on post (only if type=post)
 * @prop {SidechatPoll} [poll] - poll attached to post (only if the post has a poll)
 * @prop {String} [parent_post_id] - alphanumeric ID of parent post (only if type=comment)
 * @prop {String} [reply_post_id] - alphanumeric ID of comment being replied to, falls back to parent_post_id (only if type=comment)
 * @prop {String} [context] - text content of comment being replied to, falls back to text (only if type=comment)
 */

/**
 * A group object, containing metadata about a group as well as its join conditions and states.  Some properties vary based on the endpoint the object came from.
 * @typedef {Object} SidechatGroup
 * @prop {String} id - alphanumeric ID of group
 * @prop {String} name - human-readable name of group
 * @prop {String} analytics_name - name to file group under
 * @prop {"non_member"|"member"} membership_type - whether or not current user is a member of group
 * @prop {String} color -  group's theme color as hex code (e.g., #FFFFFF)
 * @prop {"open"|"closed"|"email_domain"} group_join_type - basis on which group accepts new members
 * @prop {"private"|"public_to_all"|"public_to_schools"} group_visibility - group's visibility setting
 * @prop {"show"|"hide"} asset_library_visibility - whether or not group's asset library is visible
 * @prop {Array} [roles] - undocumented
 * @prop {String} [description] - description of group
 * @prop {SidechatPrivateAssetURL} [icon_url] - image URL for group icon
 * @prop {Number} [member_count] - number of users in group
 * @prop {Boolean} [should_show_leaderboard] - undocumented
 */

/**
 * An asset object, containing information about an image within a post or comment
 * @typedef {Object} SidechatSimpleAsset
 * @prop {String} id - alphanumeric ID of asset
 * @prop {"image"} type - undocumented
 * @prop {"jpeg"|"png"|"gif"} content_type - file type of asset
 * @prop {Number} width - width of asset
 * @prop {Number} height - height of asset
 * @prop {SidechatPrivateAssetURL} [url] - URL string of asset's location
 */

/**
 * An asset object, containing information about an image from the asset library
 * @typedef {Object} SidechatLibraryAsset
 * @prop {String} id - alphanumeric ID of asset
 * @prop {String} created_at - date string of asset creation time
 * @prop {SidechatAssetMetadata} metadata - metadata associated with asset
 * @prop {SidechatPrivateAssetURL} url - URL string of asset's location
 */

/**
 * An asset object, containing information about an image from the asset library
 * @typedef {Object} SidechatAssetMetadata
 * @prop {Number} width - width of asset
 * @prop {Number} height - height of asset
 * @prop {"image"} type - undocumented
 * @prop {"jpeg"|"png"|"gif"} content_type - file type of asset
 */

/**
 * A user's anonymous identity information
 * @typedef {Object} SidechatIdentity
 * @prop {String} name - representation of user's name (varies across app)
 * @prop {Boolean} posted_with_username - undocumented
 */

/**
 * The current user's information
 * @typedef {Object} SidechatCurrentUser
 * @prop {String} id - alphanumeric ID of current user
 * @prop {String} hashedVerifiedEmail - verified email of current user in an unreadable hashed form
 * @prop {Boolean} isGlobalModerator - whether or not user is a moderator
 * @prop {Boolean} isGlobalAdmin - whether or not user is an admin
 * @prop {SidechatMembership[]} memberships
 * @prop {Array} roles - undocumented
 * @prop {String} emailDomain - domain of verified email address on account
 * @prop {String} wildcardEmailDomain - domain of verified email address on account, preceeded by *. to support subdomains
 */

/**
 * Representation of a group membership
 * @typedef {Object} SidechatMembership
 * @prop {String} groupId - alphanumeric ID of group
 * @prop {String} type - role of current user in group
 */

/**
 * An asset URL that can only be accessed by making a request with a user's bearer token attached in the Authorization header
 * @typedef {String} SidechatPrivateAssetURL
 */

/**
 * A cursor for paginating through post lists
 * @typedef {String} SidechatCursorString
 */

/**
 * A vote on a comment or post
 * @typedef {"upvote"|"downvote"|"none"} SidechatVoteString
 */

/**
 * A user's bearer authentication token needed for most requests
 * @typedef {String} SidechatAuthToken
 */

/**
 * A list of posts and the associated cursor
 * @typedef {Object} SidechatPostsAndCursor
 * @prop {SidechatPostOrComment[]} posts
 * @prop {SidechatCursorString} cursor
 */

var SidechatTypes = {};

/**
 * A direct message thread
 * @typedef {Object} SidechatDirectThread
 * @prop {String} id - alphanumeric ID of thread
 * @prop {String} group_id - alphanumeric ID of group in which the thread exists
 * @prop {String} updated_at - date string of when the last message in the chat was sent
 * @prop {String} post_id - post or comment from which the thread was originally sent
 * @prop {String} post_context - the context of the DM thread (only "feed" is known at the moment)
 * @prop {"accepted"} accept_status - whether or not the other user has accepted this DM
 * @prop {"post"|"comment"} type - the type of the content from which the DM was originally sent
 * @prop {SidechatDirectMessage[]} messages - array of direct message objects
 */

/**
 * A single direct message
 * @typedef {Object} SidechatDirectMessage
 * @prop {String} created_at - time at which the message was sent
 * @prop {String} client_id - alphanumeric ID of the device the message was sent on
 * @prop {String} obfuscatedUserId - obfuscated version of the sender's alphanumeric ID
 * @prop {String} text - body text of the message
 * @prop {String} id - alphanumeric ID of the message
 * @prop {String} chat_id - alphanumeric ID of the thread in which the message resides
 * @prop {Boolean} authored_by_user - whether or not the current user sent the message
 * @prop {"message"} type - undocumented
 */

/**
 * Represents a poll with choices
 * @typedef {Object} SidechatPoll
 * @prop {String} id - alphanumeric ID of poll
 * @prop {String} post_id - alphanumeric ID of post to which poll is attached
 * @prop {SidechatPollChoice[]} choices - array of poll choices
 * @prop {Boolean} allows_view_results - whether or not poll results are publicly visible
 * @prop {Number} view_results_count - number of users who have viewed poll results
 * @prop {Boolean} participated - whether or not current user has voted in poll
 */

/**
 * Represents a poll choice
 * @typedef {Object} SidechatPollChoice
 * @prop {Number} count - number of votes for choice
 * @prop {String} text - user-visible text of choice
 * @prop {Boolean} selected - whether or not current user has voted for choice
 */

/**
 * Throwable error caused by the Sidechat API
 * @class
 * @extends Error
 */
class SidechatAPIError extends Error {
  constructor(message) {
    super(message);
    this.name = "SidechatAPIError";
  }
}

/**
 * API client class for making requests to Sidechat's private API.  You'll need to [authenticate]{@tutorial Authentication} before using most of the methods.
 * @class
 * @since 2.0.0-alpha.0
 */
class SidechatAPIClient {
  /**
   * User bearer token
   * @type {SidechatAuthToken}
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
   * @param {SidechatAuthToken} [token] - user bearer token
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
   * @param {SidechatAuthToken} token - user bearer token
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
    stripHeaders = false
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
   * Initiate the login process with a phone number.  Should be followed up with verifySMSCode().
   * @method
   * @since 1.0.0
   * @param {Number} phoneNumber - US phone number (WITHOUT +1) to send verification code to
   */
  loginViaSMS = async (phoneNumber) => {
    try {
      const res = await fetch(`${this.apiRoot}/v1/login_register`, {
        method: "POST",
        headers: this.defaultHeaders,
        body: JSON.stringify({
          phone_number: `+1${phoneNumber}`,
          version: 3,
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
   */
  setAge = async (age, registrationID) => {
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
   */
  setDeviceID = async (deviceID) => {
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
          bundle_id: "com.flowerave.sidechat",
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
        }
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
   * @param {SidechatCursorString} [cursor] - cursor string
   * @returns {SidechatPostsAndCursor} List of posts and cursor
   */
  getGroupPosts = async (groupID, category = "hot", cursor) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `${this.apiRoot}/v1/posts?${cursor ? "cursor=" + encodeURIComponent(cursor) + "&" : ""
        }group_id=${groupID}&type=${category}`,
        {
          method: "GET",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
        }
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
   * @param {SidechatVoteString} action - whether to upvote, downvote, or reset vote
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
   * @returns {SidechatPostOrComment} post object
   */
  getPost = async (postID, includeDeleted = false) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `${this.apiRoot}/v1/posts/get?include_deleted=${includeDeleted}&post_id=${postID}`,
        {
          method: "GET",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
        }
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
   * @returns {SidechatPostOrComment[]} post object
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
      const res = await fetch(`${this.apiRoot}/v1/posts&type=${contentType}`, {
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
   * @returns {SidechatPostOrComment[]} list of comments
   */
  getPostComments = async (postID) => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(
        `${this.apiRoot}/v1/posts/comments/?post_id=${postID}`,
        {
          method: "GET",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
        }
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
   * @returns {SidechatGroup[]}
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
   * Retrieves the entire accessible asset library.  Be warned that as of the time of this documentation, it's a 1.5MB JSON download and this request is very expensive.
   * @method
   * @since 2.0.6
   * @returns {SidechatLibraryAsset[]}
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
   * @returns {SidechatCurrentUser}
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
   * @returns {SidechatGroup}
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
      const res = await fetch(
        `${this.apiRoot}/v1/groups/${isMember ? "join" : "leave"}`,
        {
          method: "POST",
          headers: {
            ...this.defaultHeaders,
            Authorization: `Bearer ${this.userToken}`,
          },
          body: JSON.stringify({
            group_id: groupID,
          }),
        }
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
   * @param {SidechatSimpleAsset[]} [assetList] - list of assets to attach
   * @param {Boolean} [disableDMs] - prevent direct messages being sent to comment's author
   * @param {Boolean} [anonymous] - whether or not to hide user's name and icon on comment
   * @returns {SidechatPostOrComment} created comment
   */
  createComment = async (
    parentPostID,
    text,
    groupID,
    replyCommentID,
    topLevelReplyID,
    assetList = [],
    disableDMs = false,
    anonymous = false
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
      return await json.comment;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to post comment.`);
    }
  };

  /**
   * Creates a new post in the specified group
   * @method
   * @since 2.2.0
   * @param {String} text - text content of comment
   * @param {String} groupID - alphanumeric ID of group in which the parent post resides
   * @param {SidechatSimpleAsset[]} [assetList] - list of assets to attach.
   * @param {Boolean} [disableDMs] - prevent direct messages from being sent to post's author
   * @param {Boolean} [disableComments] - whether or not comments should be disabled on post
   * @param {Boolean} [anonymous] - whether or not to hide user's name and icon on post
   * @returns {SidechatPostOrComment} the created post
   */
  createPost = async (
    text,
    groupID,
    assetList = [],
    disableDMs = false,
    disableComments = false,
    anonymous = false
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
          type: "post",
          assets: assetList,
          group_ids: [groupID],
          text: text,
          attachments: [],
          dms_disabled: disableDMs,
          comments_disabled: disableComments,
          using_identity: !anonymous,
        }),
      });
      const json = await res.json();
      return await json.posts[0];
    } catch (err) {
      console.error(err);
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
      const res = await fetch(`${this.apiRoot}/v1/polls/view_results`, {
        method: "POST",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
        body: JSON.stringify({
          poll_id: pollId,
        }),
      });
      const json = await res.json();
      return await json;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to mark poll results as viewed.`);
    }
  };

  /**
   * Uploads an asset to AWS S3 for use in posts and comments.  Currently photos only
   * @method
   * @param {String} uri - URI of the asset to upload
   * @param {String} mimeType - mimetype of the asset (e.g. "image/png")
   * @param {String} [name] - filename of the asset
   * @returns {String} URL of the uploaded asset
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

    const urlReq = await this.sendRequest(`/v1/assets/upload_url?content_type=${imageType}`);
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
          `Couldn't upload image - error ${uploadReq.status}`
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
          bio: bio
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
   * @returns {Boolean} whether or not username is valid and unused
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
        }
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
      const res = await fetch(`${this.apiRoot}/v1/chats/explore`, {
        method: "GET",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
      });
      const json = await res.json();
      return await json.chats;
    } catch (err) {
      console.error(err);
      throw new SidechatAPIError(`Failed to get groupchats.`);
    }
  };

  /**
   * Joins a group chat
   * @method
   * @since 2.3.5
   */
  joinGroupChat = async (
    groupChatID,
    displayName,
    emoji,
    primaryColor,
    secondaryColor
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
   * @returns {SidechatDirectThread[]}
   * @since 2.4.4
   */
  getDMs = async () => {
    if (!this.userToken) {
      throw new SidechatAPIError("User is not authenticated.");
    }
    try {
      const res = await fetch(`${this.apiRoot}/v1/chats`, {
        method: "GET",
        headers: {
          ...this.defaultHeaders,
          Authorization: `Bearer ${this.userToken}`,
        },
      });
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
   * @returns {SidechatDirectThread}
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
        }
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
   * @param {SidechatAsset[]} assets - array of assets to send
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
    postContext = "feed"
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
}

/**
 * @typedef SidechatColor
 * @prop {String} primary - hex code of primary color
 * @prop {String} secondary - hex code of secondary color
 */

/**
 * List of colors compatible with user conversation icons
 * @prop {SidechatColor[]} colors - list of color themes for user icons
 */
class SidechatColorList {
  colors = [
    {
      primary: "#74DEEE",
      secondary: "#239EAB",
    },
    {
      primary: "#15FF46",
      secondary: "#3FC0FF",
    },
    {
      primary: "#D9FB8A",
      secondary: "#B1FD00",
    },
    {
      primary: "#FC40FF",
      secondary: "#0DD5B2",
    },
    {
      primary: "#3E973C",
      secondary: "#0F430E",
    },
    {
      primary: "#FFD305",
      secondary: "#F4B320",
    },
    {
      primary: "#8483FF",
      secondary: "#5857FF",
    },
    {
      primary: "#FA81FF",
      secondary: "#722DFF",
    },
    {
      primary: "#00CBFE",
      secondary: "#0D13D5",
    },
    {
      primary: "#FF7B51",
      secondary: "#B2431F",
    },
    {
      primary: "#FF47CC",
      secondary: "#69004C",
    },
    {
      primary: "#00EE6E",
      secondary: "#0C75E6",
    },
    {
      primary: "#FF1885",
      secondary: "#FA81FF",
    },
    {
      primary: "#D8DC44",
      secondary: "#228B3F",
    },
    {
      primary: "#0968E5",
      secondary: "#091970",
    },
  ];
}

export { SidechatAPIClient, SidechatAPIError, SidechatColorList, SidechatTypes };
