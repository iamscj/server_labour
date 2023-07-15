import { pool } from "../database/db.js";

export const raiseRequest = async (req, res) => {
    console.log("POST /raiseRequest");

    const { username, job_id, phonenumber, salary, no_of_hours } = req.body;

    try {
        const query = `
      INSERT INTO requests (username, job_id, phonenumber, salary, no_of_hours)
      VALUES ($1, $2, $3, $4, $5)
    `;
        const values = [username, job_id, phonenumber, salary, no_of_hours];

        await pool.query(query, values);

        res.status(200).json({ message: "Request raised successfully" });
    }
    catch (error) {
        console.error("Error while raising request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getRequestsForUser = async (req, res) => {
    console.log("GET /getRequestsForUser")
    const username = req.params['username'];
    try {
        let data = await pool.query(
            `SELECT * FROM jobs 
             WHERE username='${username}'`
        )
        console.log(data.rows)
        if (data.rows.length === 0) {
            return res.status(200).json("No Jobs Posted")
        }
        if (data.rows.length > 0) {
            const requests = [];

            for (const job of data.rows) {
                const jobRequests = await pool.query(
                    `SELECT * FROM requests WHERE job_id='${job.job_id}'`
                );
                console.log(`Requests for job ${job.job_id}:`, jobRequests.rows);
                if (jobRequests.rows.length > 0)
                    requests.push(...jobRequests.rows);
            }
            console.log(requests)
            res.json(requests)
        } else {
            res.json("No jobs found for the given username.");
        }
    }
    catch (error) {
        console.error("Error while retrieving request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}