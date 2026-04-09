const router = express.Router();
import express from "express";

import { editProfile } from "../controllers/profile/editProfile.js";
import authenticateToken from "../middleware/authenticateToken.js";
import { getUserProfile } from "../controllers/user/getUserProfile.js";
import { getUserProfilePublic } from "../controllers/user/getUserProfilePublic.js";
import { followUser } from "../controllers/user/followUser.js";
import { unfollowUser } from "../controllers/user/unfollowUser.js";
import { getFollowingStatus } from "../controllers/following.js";
import { getUserTotalViews } from "../controllers/user/getUserTotalViews.js";
import { getUserTotalViewsInLastOneHr } from "../controllers/user/getUserViewGrowthToday.js";
import { getUserFollowerGrowth } from "../controllers/user/getUserFollowerGrowth.js";

router.patch("/edit", authenticateToken, editProfile);
// router.get("/me", authenticateToken, getUserProfile);
router.get("/profile/:username", getUserProfilePublic);
router.get("/profile/profile/:username", getUserProfile);

router.post("/follow/:username", authenticateToken, followUser);
router.post("/unfollow/:username", authenticateToken, unfollowUser);

router.get("/following/:username", authenticateToken, getFollowingStatus);

router.get("/views/:userId", getUserTotalViews);
router.get("/views/growth/:userId", getUserTotalViewsInLastOneHr);
router.get("/followers/growth/:username", getUserFollowerGrowth);
export default router;
