// @ts-nocheck
import express from "express";
import {isAuthenticatedUser} from "../middleware/auth";
import {createPost} from "./post/createPost";
import {getAllPosts} from "./post/getAllPosts";
import {addReplies} from "./post/addReplies";
import {addReply} from "./post/addReply";
import {updateReplyLikes} from "./post/updateReplyLikes";
import {getPostsUser, getPostsUserId} from "./post/getPostsUser";
import {getPostsFollowers} from "./post/getPostsFollowers";
import {getRepliesUser, getRepliesUserId} from "./post/getRepliesUser";
import {updateLikes} from "./post/updateLikes";
import {deletePost} from "./post/deletePost";
import {updateRepliesReplyLike} from "./post/updateReplyReply";

const router = express.Router();

router.route("/create-post").post(isAuthenticatedUser(), createPost);

router.route("/get-all-posts").get(isAuthenticatedUser(), getAllPosts);

router.route("/get-posts").get(isAuthenticatedUser(), getPostsUser);

router.route("/get-replies").get(isAuthenticatedUser(), getRepliesUser);

router.route("/get-posts/:id").get(isAuthenticatedUser(), getPostsUserId);

router.route("/get-replies/:id").get(isAuthenticatedUser(), getRepliesUserId);

router.route("/update-likes").put(isAuthenticatedUser(), updateLikes);

router.route("/get-posts-followers").put(isAuthenticatedUser(), getPostsFollowers);

router.route("/add-replies").put(isAuthenticatedUser(), addReplies);

router.route("/add-reply").put(isAuthenticatedUser(), addReply);

router
    .route("/update-replies-react")
    .put(isAuthenticatedUser(), updateReplyLikes);

router
    .route("/update-reply-react")
    .put(isAuthenticatedUser(), updateRepliesReplyLike);

router.route("/delete-post/:id").delete(isAuthenticatedUser(), deletePost);

export default router;



