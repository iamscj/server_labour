import { pool } from "../database/db.js";

export const isLiked = async (request, response) => {
    console.log("GET /like-dislike")
    const username = request.params['username']
    const job_id = request.params['job_id']
    console.log(username, job_id)
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