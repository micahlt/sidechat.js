export default SidechatAPIClient;
/**
 * API client class for making requests to Sidechat's private API.  You'll need to [authenticate]{@tutorial Authentication} before using most of the methods.
 * @class
 * @since 2.0.0-alpha.0
 */
declare class SidechatAPIClient {
    /**
     * Create a new instance of the API client
     * @param {SidechatAuthToken} [token] - user bearer token
     * @param {String} rootUrl - custom API root URL for mocking or using other server
     */
    constructor(token?: SidechatAuthToken, rootUrl?: string);
    /**
     * User bearer token
     * @type {SidechatAuthToken}
     * */
    userToken: SidechatAuthToken;
    /**
     * Default headers for every API request
     * @type {Object}
     * @static
     * @constant
     */
    defaultHeaders: any;
    /**
     * Root URL for every API request
     * @type {String}
     * @default "https://api.sidechat.lol"
     */
    apiRoot: string;
    /**
     * Manually set the currently signed in user's token.  Generally try to avoid this and instead either pass a token to the constructor or login automatically through the auth functions
     * @method
     * @param {SidechatAuthToken} token - user bearer token
     */
    setToken: (token: SidechatAuthToken) => void;
    /**
     * Manually set the root URL for all API requests.  This can be used for mocking requests or redirecting them to a different server
     * @method
     * @param {String} url - new root URL to set
     * @since 2.3.9
     */
    setAPIRoot: (url: string) => void;
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
    sendRequest: (endpoint: string, method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS", body?: any, headers?: any, stripHeaders?: boolean) => Promise<Response>;
    /**
     * Initiate the login process with a phone number.  Should be followed up with verifySMSCode().
     * @method
     * @since 1.0.0
     * @param {Number} phoneNumber - US phone number (WITHOUT +1) to send verification code to
     */
    loginViaSMS: (phoneNumber: number) => Promise<any>;
    /**
     * Verify the code sent via SMS with loginViaSMS().  If this function succeeds, the user will be authenticated for future requests.
     * @method
     * @since 1.0.0
     * @param {Number} phoneNumber - US phone number (WITHOUT +1) that verification code was sent to
     * @param {String} code  - the verification code
     */
    verifySMSCode: (phoneNumber: number, code: string) => Promise<any>;
    /**
     * Set the user's age.  If this function succeeds, the user will be authenticated for future requests.
     * @method
     * @since 1.0.0
     * @param {Number} age - user's age in years
     * @param {String} registrationID  - the registration ID generated by verifySMSCode()
     */
    setAge: (age: number, registrationID: string) => Promise<any>;
    /**
     * Initiate the email setup process.  Should be followed up with checkEmailVerification().
     * @method
     * @since 1.0.0
     * @param {String} email - school email address to send verification code to
     * @tutorial Email Registration
     */
    registerEmail: (email: string) => Promise<any>;
    /**
     * Check is the user's email is verified.
     * @method
     * @since 1.0.0
     */
    checkEmailVerification: () => Promise<any>;
    /**
     * Set the device ID of the current user
     * @method
     * @since 1.0.0
     * @param {String} deviceId - the device ID to set
     */
    setDeviceID: (deviceID: any) => Promise<any>;
    /**
     * Get updated status for user and group
     * @method
     * @since 1.0.0
     * @deprecated since 2.1.0, will be removed by 3.0.0.  Please use `getUpdates` instead!
     * @param {String} [groupID] - ID of a specific group to retrieve info from.  Falls back to user's primary group.
     */
    getUserAndGroup: (groupID?: string) => Promise<any>;
    /**
     * Get updated status for user and group
     * @method
     * @since 2.1.0
     * @param {String} [groupID] - ID of a specific group to retrieve info from.  Falls back to user's primary group.
     */
    getUpdates: (groupID?: string) => Promise<any>;
    /**
     * Fetches posts from the specified category in a group
     * @method
     * @since 1.0.0
     * @param {String} groupID - group ID
     * @param {"hot"|"recent"|"top"} category - category to filter posts
     * @param {SidechatCursorString} [cursor] - cursor string
     * @returns {SidechatPostsAndCursor} List of posts and cursor
     */
    getGroupPosts: (groupID: string, category?: "hot" | "recent" | "top", cursor?: SidechatCursorString) => SidechatPostsAndCursor;
    /**
     * Upvote or downvote, or unvote a post
     * @method
     * @since 2.0.0-alpha.0
     * @param {String} postID - post ID to vote on
     * @param {SidechatVoteString} action - whether to upvote, downvote, or reset vote
     */
    setVote: (postID: string, action: SidechatVoteString) => Promise<any>;
    /**
     * Fetches a single post with just its ID
     * @method
     * @since 2.3.0
     * @param {String} postID - ID of post to fetch
     * @param {Boolean} includeDeleted - undocumented
     * @returns {SidechatPostOrComment} post object
     */
    getPost: (postID: string, includeDeleted?: boolean) => SidechatPostOrComment;
    /**
     * Fetches the posts or comments that the user has created
     * @method
     * @since 2.3.5
     * @param {"posts"|"comments"} contentType - type of user content to fetch
     * @returns {SidechatPostOrComment[]} post object
     */
    getUserContent: (contentType: "posts" | "comments") => SidechatPostOrComment[];
    /**
     * Get all the commments on a post
     * @method
     * @since 2.0.0-alpha.0
     * @param {String} postID - post ID to get comments for
     * @returns {SidechatPostOrComment[]} list of comments
     */
    getPostComments: (postID: string) => SidechatPostOrComment[];
    /**
     * Gets groups to be displayed on the "Explore Groups" page
     * @method
     * @since 2.0.0-alpha.0
     * @param {Boolean} onePage - whether or not results should be returned as a single page
     * @returns {SidechatGroup[]}
     */
    getAvailableGroups: (onePage?: boolean) => SidechatGroup[];
    /**
     * Retrieves the entire accessible asset library.  Be warned that as of the time of this documentation, it's a 1.5MB JSON download and this request is very expensive.
     * @method
     * @since 2.0.6
     * @returns {SidechatLibraryAsset[]}
     */
    getAssetLibrary: () => SidechatLibraryAsset[];
    /**
     * Gets the current authenticated user and a list of the groups of which they are members.
     * @method
     * @since 2.1.0
     * @returns {SidechatCurrentUser}
     */
    getCurrentUser: () => SidechatCurrentUser;
    /**
     * Gets the metadata of a group from its ID
     * @method
     * @since 2.1.0
     * @param {String} [groupID] - alphanumeric ID of a group to get.  Falls back to user's primary group.
     * @returns {SidechatGroup}
     */
    getGroupMetadata: (groupID?: string) => SidechatGroup;
    /**
     * Joins or leaves a group
     * @method
     * @param {String} groupID - alphanumeric ID of group to join or leave
     * @param {Boolean} isMember - whether or not the user should be a member of the group
     * @since 2.3.8
     */
    setGroupMembership: (groupID: string, isMember: boolean) => Promise<any>;
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
    createComment: (parentPostID: string, text: string, groupID: string, replyCommentID?: string, topLevelReplyID?: string, assetList?: SidechatSimpleAsset[], disableDMs?: boolean, anonymous?: boolean) => SidechatPostOrComment;
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
    createPost: (text: string, groupID: string, assetList?: SidechatSimpleAsset[], disableDMs?: boolean, disableComments?: boolean, anonymous?: boolean) => SidechatPostOrComment;
    /**
     * Deletes a post or comment that the user created
     * @method
     * @since 2.2.0
     * @param {String} postOrCommentID - alphanumeric ID of post to delete
     */
    deletePostOrComment: (postOrCommentID: string) => Promise<any>;
    /**
     * Votes on a poll attached to a post
     * @method
     * @param {String} pollId - alphanumeric ID of poll to vote on
     * @param {Number} choiceIndex - index of the choice to vote on
     * @since 2.5.4
     */
    voteOnPoll: (pollId: string, choiceIndex: number) => Promise<any>;
    /**
     * Marks that the user has viewed results on a poll.  Note that this does not actually return the results of the poll.
     * @method
     * @param {String} pollId - alphanumeric ID of poll to vote on
     * @since 2.5.4
     */
    viewPollResults: (pollId: string) => Promise<any>;
    /**
     * Uploads an asset to AWS S3 for use in posts and comments.  Currently photos only
     * @method
     * @param {String} uri - URI of the asset to upload
     * @param {String} mimeType - mimetype of the asset (e.g. "image/png")
     * @param {String} [name] - filename of the asset
     * @returns {String} URL of the uploaded asset
     * @since 2.5.1
     */
    uploadAsset: (uri: string, mimeType: string, name?: string) => string;
    /**
     * Sets the conversation icon of a user
     * @method
     * @since 2.2.1
     * @param {String} userID - alphanumeric ID of user
     * @param {String} emoji - emoji to set as icon
     * @param {String} primaryColor - hex string (including #) of primary color
     * @param {String} secondaryColor - hex string (including #) of secondary color
     */
    setUserIcon: (userID: string, emoji: string, primaryColor: string, secondaryColor: string) => Promise<any>;
    /**
     * Sets the bio text of a user
     * @method
     * @since 2.5.6
     * @param {String} userID - alphanumeric ID of user
     * @param {String} bio - text to set as bio
     */
    setUserBio: (userID: string, bio: string) => Promise<any>;
    /**
     * Checks if user can set their username to a string
     * @method
     * @since 2.3.6
     * @param {String} username - string to check
     * @returns {Boolean} whether or not username is valid and unused
     */
    checkUsername: (username: string) => boolean;
    /**
     * Changes the username of the current user
     * @method
     * @since 2.3.6
     * @param {String} userID - alphanumeric ID of user
     * @param {String} username - new username to set
     */
    setUsername: (userID: string, username: string) => Promise<any>;
    /**
     * Marks an activity item as read
     * @method
     * @since 2.3.2
     * @param {String} activityID - alphanumeric ID of activity object
     */
    readActivity: (activityID: string) => Promise<any>;
    /**
     * Retrieves joinable group chats
     * @method
     * @since 2.3.5
     */
    getGroupChats: () => Promise<any>;
    /**
     * Joins a group chat
     * @method
     * @since 2.3.5
     */
    joinGroupChat: (groupChatID: any, displayName: any, emoji: any, primaryColor: any, secondaryColor: any) => Promise<any>;
    /**
     * Gets a list of the user's direct messages
     * @method
     * @returns {SidechatDirectThread[]}
     * @since 2.4.4
     */
    getDMs: () => SidechatDirectThread[];
    /**
     * Gets a single direct message thread
     * @method
     * @param {String} id - alphanumeric ID of the chat to fetch
     * @returns {SidechatDirectThread}
     * @since 2.4.4
     */
    getDMThread: (id: string) => SidechatDirectThread;
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
    sendDM: (chatID: string, text: string, clientID: string, assets?: SidechatAsset[], anonymous?: boolean) => Promise<any>;
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
    startDM: (text: string, clientID: string, postID: string, anonymous?: boolean, postContext?: "feed") => Promise<any>;
}
//# sourceMappingURL=SidechatAPIClient.d.ts.map