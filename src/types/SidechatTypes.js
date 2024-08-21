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

export default {};

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
