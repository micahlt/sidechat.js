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
 * @prop {SidechatAsset[]} assets - array of assets attached to post or comment
 * @prop {Array} attachments - undocumented
 * @prop {Boolean} dms_disabled - whether or not you can send a DM to creator of post
 * @prop {Array} tags - undocumented
 * @prop {SidechatIdentity} identity - creator's identity information
 * @prop {Boolean} pinned - undocumented
 * @prop {Boolean} is_saved - undocumented
 * @prop {"following"|"not_following"} follow_status - undocumented
 * @prop {"group"} [destination] - undocumented
 * @prop {Number} [comment_count] - number of comments on post (only if type=post)
 * @prop {Boolean} [comments_disabled] - whether or not you can comment on post (only if type=post)
 * @prop {String} [parent_post_id] - alphanumeric ID of parent post (only if type=comment)
 * @prop {String} [reply_post_id] - alphanumeric ID of comment being replied to, falls back to parent_post_id (only if type=comment)
 * @prop {String} [context] - text content of comment being replied to, falls back to text (only if type=comment)
 */

/**
 * A group object, containing metadata about a group as well as its join conditions and states
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
 * @typedef {Object} SidechatAsset
 * @prop {String} id - alphanumeric ID of asset
 * @prop {"image"} type - undocumented
 * @prop {"jpeg"|"png"|"gif"} content_type - file type of asset
 * @prop {Number} width - the width of asset
 * @prop {Number} height - the height of asset
 * @prop {SidechatPrivateAssetURL} url - URL string of asset's location
 */

/**
 * A user's identity information
 * @typedef {Object} SidechatIdentity
 * @prop {String} name - representation of user's name (varies across app)
 * @prop {Boolean} posted_with_username - undocumented
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
 * Represents a vote on a comment or post
 * @typedef {"upvote"|"downvote"|"none"} SidechatVoteString
 */
