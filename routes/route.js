import express from "express";
import { signupUser, login } from "../controller/user-controller.js";
import { createJob, getJob, getJobByCategory } from "../controller/post-controller.js";
import { LikeDislike } from "../controller/like-controller.js";
const router = express.Router();

router.post("/signup", signupUser)
router.post("/login", login)
router.post("/login", login)
router.post("/create-job", createJob)
router.get("/get-all-jobs", getJob)
router.get("/get-all-jobs-by-category/:field", getJobByCategory)
router.post("/like-dislike/:username/:job_id", LikeDislike)

router.get("/hello", (req, res) => {
    res.json("hi")
})
router.get('*', function (req, res) {
    res.status(404).send('Not found');
});
export default router;
