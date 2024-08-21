declare const _default: {};
export default _default;
/**
 * A user-created post or comment, depending on the "type" prop
 */
export type SidechatPostOrComment = {
    /**
     * - whether this object represents a post or a comment on a post
     */
    type: "post" | "comment";
    /**
     * - alphanumeric ID of post or comment
     */
    id: string;
    /**
     * - undocumented
     */
    authored_by_user: boolean;
    /**
     * - post creator's name in-app
     */
    alias: string;
    /**
     * - alphanumeric ID of group
     */
    group_id: string;
    /**
     * - group in which post or comment was created
     */
    group: SidechatGroup;
    /**
     * - text content of post or comment
     */
    text: string;
    /**
     * - date string of post or comment creation time
     */
    created_at: string;
    /**
     * - sum of upvotes and downvotes
     */
    vote_total: number;
    /**
     * - current user's vote on post or comment
     */
    vote_status: SidechatVoteString;
    /**
     * - array of simple assets attached to post or comment
     */
    assets: SidechatSimpleAsset[];
    /**
     * - undocumented
     */
    attachments: any[];
    /**
     * - whether or not you can send a DM to creator of post
     */
    dms_disabled: boolean;
    /**
     * - undocumented
     */
    tags: string[];
    /**
     * - creator's identity information
     */
    identity: SidechatIdentity;
    /**
     * - undocumented
     */
    pinned: boolean;
    /**
     * - undocumented
     */
    is_saved: boolean;
    /**
     * - undocumented
     */
    follow_status: "following" | "not_following";
    /**
     * - undocumented
     */
    destination?: "group";
    /**
     * - number of comments on post (only if type=post)
     */
    comment_count?: number;
    /**
     * - whether or not you can comment on post (only if type=post)
     */
    comments_disabled?: boolean;
    /**
     * - poll attached to post (only if the post has a poll)
     */
    poll?: SidechatPoll;
    /**
     * - alphanumeric ID of parent post (only if type=comment)
     */
    parent_post_id?: string;
    /**
     * - alphanumeric ID of comment being replied to, falls back to parent_post_id (only if type=comment)
     */
    reply_post_id?: string;
    /**
     * - text content of comment being replied to, falls back to text (only if type=comment)
     */
    context?: string;
};
/**
 * A group object, containing metadata about a group as well as its join conditions and states.  Some properties vary based on the endpoint the object came from.
 */
export type SidechatGroup = {
    /**
     * - alphanumeric ID of group
     */
    id: string;
    /**
     * - human-readable name of group
     */
    name: string;
    /**
     * - name to file group under
     */
    analytics_name: string;
    /**
     * - whether or not current user is a member of group
     */
    membership_type: "non_member" | "member";
    /**
     * -  group's theme color as hex code (e.g., #FFFFFF)
     */
    color: string;
    /**
     * - basis on which group accepts new members
     */
    group_join_type: "open" | "closed" | "email_domain";
    /**
     * - group's visibility setting
     */
    group_visibility: "private" | "public_to_all" | "public_to_schools";
    /**
     * - whether or not group's asset library is visible
     */
    asset_library_visibility: "show" | "hide";
    /**
     * - undocumented
     */
    roles?: any[];
    /**
     * - description of group
     */
    description?: string;
    /**
     * - image URL for group icon
     */
    icon_url?: SidechatPrivateAssetURL;
    /**
     * - number of users in group
     */
    member_count?: number;
    /**
     * - undocumented
     */
    should_show_leaderboard?: boolean;
};
/**
 * An asset object, containing information about an image within a post or comment
 */
export type SidechatSimpleAsset = {
    /**
     * - alphanumeric ID of asset
     */
    id: string;
    /**
     * - undocumented
     */
    type: "image";
    /**
     * - file type of asset
     */
    content_type: "jpeg" | "png" | "gif";
    /**
     * - width of asset
     */
    width: number;
    /**
     * - height of asset
     */
    height: number;
    /**
     * - URL string of asset's location
     */
    url?: SidechatPrivateAssetURL;
};
/**
 * An asset object, containing information about an image from the asset library
 */
export type SidechatLibraryAsset = {
    /**
     * - alphanumeric ID of asset
     */
    id: string;
    /**
     * - date string of asset creation time
     */
    created_at: string;
    /**
     * - metadata associated with asset
     */
    metadata: SidechatAssetMetadata;
    /**
     * - URL string of asset's location
     */
    url: SidechatPrivateAssetURL;
};
/**
 * An asset object, containing information about an image from the asset library
 */
export type SidechatAssetMetadata = {
    /**
     * - width of asset
     */
    width: number;
    /**
     * - height of asset
     */
    height: number;
    /**
     * - undocumented
     */
    type: "image";
    /**
     * - file type of asset
     */
    content_type: "jpeg" | "png" | "gif";
};
/**
 * A user's anonymous identity information
 */
export type SidechatIdentity = {
    /**
     * - representation of user's name (varies across app)
     */
    name: string;
    /**
     * - undocumented
     */
    posted_with_username: boolean;
};
/**
 * The current user's information
 */
export type SidechatCurrentUser = {
    /**
     * - alphanumeric ID of current user
     */
    id: string;
    /**
     * - verified email of current user in an unreadable hashed form
     */
    hashedVerifiedEmail: string;
    /**
     * - whether or not user is a moderator
     */
    isGlobalModerator: boolean;
    /**
     * - whether or not user is an admin
     */
    isGlobalAdmin: boolean;
    memberships: SidechatMembership[];
    /**
     * - undocumented
     */
    roles: any[];
    /**
     * - domain of verified email address on account
     */
    emailDomain: string;
    /**
     * - domain of verified email address on account, preceeded by *. to support subdomains
     */
    wildcardEmailDomain: string;
};
/**
 * Representation of a group membership
 */
export type SidechatMembership = {
    /**
     * - alphanumeric ID of group
     */
    groupId: string;
    /**
     * - role of current user in group
     */
    type: string;
};
/**
 * An asset URL that can only be accessed by making a request with a user's bearer token attached in the Authorization header
 */
export type SidechatPrivateAssetURL = string;
/**
 * A cursor for paginating through post lists
 */
export type SidechatCursorString = string;
/**
 * A vote on a comment or post
 */
export type SidechatVoteString = "upvote" | "downvote" | "none";
/**
 * A user's bearer authentication token needed for most requests
 */
export type SidechatAuthToken = string;
/**
 * A list of posts and the associated cursor
 */
export type SidechatPostsAndCursor = {
    posts: SidechatPostOrComment[];
    cursor: SidechatCursorString;
};
/**
 * A direct message thread
 */
export type SidechatDirectThread = {
    /**
     * - alphanumeric ID of thread
     */
    id: string;
    /**
     * - alphanumeric ID of group in which the thread exists
     */
    group_id: string;
    /**
     * - date string of when the last message in the chat was sent
     */
    updated_at: string;
    /**
     * - post or comment from which the thread was originally sent
     */
    post_id: string;
    /**
     * - the context of the DM thread (only "feed" is known at the moment)
     */
    post_context: string;
    /**
     * - whether or not the other user has accepted this DM
     */
    accept_status: "accepted";
    /**
     * - the type of the content from which the DM was originally sent
     */
    type: "post" | "comment";
    /**
     * - array of direct message objects
     */
    messages: SidechatDirectMessage[];
};
/**
 * A single direct message
 */
export type SidechatDirectMessage = {
    /**
     * - time at which the message was sent
     */
    created_at: string;
    /**
     * - alphanumeric ID of the device the message was sent on
     */
    client_id: string;
    /**
     * - obfuscated version of the sender's alphanumeric ID
     */
    obfuscatedUserId: string;
    /**
     * - body text of the message
     */
    text: string;
    /**
     * - alphanumeric ID of the message
     */
    id: string;
    /**
     * - alphanumeric ID of the thread in which the message resides
     */
    chat_id: string;
    /**
     * - whether or not the current user sent the message
     */
    authored_by_user: boolean;
    /**
     * - undocumented
     */
    type: "message";
};
/**
 * Represents a poll with choices
 */
export type SidechatPoll = {
    /**
     * - alphanumeric ID of poll
     */
    id: string;
    /**
     * - alphanumeric ID of post to which poll is attached
     */
    post_id: string;
    /**
     * - array of poll choices
     */
    choices: SidechatPollChoice[];
    /**
     * - whether or not poll results are publicly visible
     */
    allows_view_results: boolean;
    /**
     * - number of users who have viewed poll results
     */
    view_results_count: number;
    /**
     * - whether or not current user has voted in poll
     */
    participated: boolean;
};
/**
 * Represents a poll choice
 */
export type SidechatPollChoice = {
    /**
     * - number of votes for choice
     */
    count: number;
    /**
     * - user-visible text of choice
     */
    text: string;
    /**
     * - whether or not current user has voted for choice
     */
    selected: boolean;
};
//# sourceMappingURL=SidechatTypes.d.ts.map