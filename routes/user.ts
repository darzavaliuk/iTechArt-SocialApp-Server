// @ts-nocheck
import express from "express";
import {isAuthenticatedUser} from "../middleware/auth";
import {loginUser} from "./user/loginUser";
import {createUser} from "./user/createUser";
import {getAllUsers} from "./user/getAllUsers";
import {getUser} from "./user/getUser";
import {sendEmail} from "./user/sendEmail";
import {resetPassword} from "./user/resetPassword";
import {userDetails} from "./user/userDetails";
import {loadTargets} from "./target/loadTargets";
import {addTarget} from "./target/addTarget";
import {setTarget} from "./target/setTarget";
import {updateUserAvatar, updateUserInfo} from "./user/updateUser";
import {getNotification} from "./user/getNotification";
import {followUnfollowUser} from "./user/followUser";
import {getTargetsByTime} from "./target/getTargetsByTime";

const router = express.Router();

router.route("/registration").post(createUser);

router.route("/get-targets").post(isAuthenticatedUser(), loadTargets);

router.route("/create-target").post(isAuthenticatedUser(), addTarget);

router.route("/set-target").post(isAuthenticatedUser(), setTarget);

router.route("/login").post(loginUser);

router.route("/get-subtargets").post(getTargetsByTime);

router.route("/users").get(isAuthenticatedUser(), getAllUsers);

router.route("/add-user").put(isAuthenticatedUser(), followUnfollowUser);

router.route("/get-user/:id").get(isAuthenticatedUser(), getUser);

router.route("/update-avatar").put(isAuthenticatedUser(), updateUserAvatar);

router.route("/update-profile").put(isAuthenticatedUser(), updateUserInfo);

router.route("/get-user-forget").post(sendEmail);

router.route("/reset-password").post(resetPassword);

router.route("/me").get(isAuthenticatedUser(), userDetails);

router.route("/get-notifications").get(isAuthenticatedUser(), getNotification);

export default router;
