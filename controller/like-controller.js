import { pool } from "../database/db.js";

export const LikeDislike = async (request, response) => {
    console.log("POST /like-dislike")
    const username = request.params['username']
    const job_id = request.params['job_id']
    try {
        let data = await pool.query(
            `SELECT * FROM likes 
             WHERE username='${username}' and job_id='${job_id}'`
        )
        if (data.rows.length === 0) {
            data = await pool.query(
                `INSERT INTO likes (username, job_id) VALUES ('${username}','${job_id}')`
            )
            return response.json("INCREMENT");
        }
        else {
            data = await pool.query(
                `DELETE FROM likes WHERE username='${username}' and job_id='${job_id}'`
            )
            return response.json("DECREMENT");
        }
    }
    catch (e) {
        console.log(e)
        response.json("ERROR")
    }
}

export const getLikedPosts = async (request, response) => {
    console.log("Get /get-liked-posts")
    const username = request.query.username;
    try {
        let data = await pool.query(
            `SELECT job_id FROM likes 
             WHERE username='${username}'`
        )
        return response.json(data.rows)
    }
    catch (e) {
        console.log(e)
        response.json("ERROR")
    }
}

export const getLikeCount = async (request, response) => {
    console.log("Get /get-like-count")
    try {
        let data = await pool.query(
            `SELECT job_id, COUNT(*) FROM likes 
            GROUP BY job_id`
        )
        return response.json(data.rows)
    }
    catch (e) {
        console.log(e)
        response.json("ERROR")
    }
}