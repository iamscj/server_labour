import express from "express";
import { signupUser } from "../controller/user-controller.js";

const router = express.Router();

router.post("/signup", signupUser)
router.get("/hello", (req, res) => {
    res.json("hi")
})
router.get('*', function (req, res) {
    res.status(404).send('Not found');
});
export default router;
