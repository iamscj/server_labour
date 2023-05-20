import { pool } from "../database/db.js";
import { v4 as uuidv4 } from 'uuid';

export const createJob = async (request, response) => {
    console.log("POST /createJob")
    const jobId = uuidv4();
    const { username, phonenumber, field, description, min_salary,
        max_salary, working_hours, latitude, longitude, expected_distance_range } = request.body;
    try {
        const query = `
      INSERT INTO Jobs (job_id, username, phonenumber, field, description, min_salary, max_salary, working_hours, latitude, longitude, expected_distance_range)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
        const values = [
            jobId,
            username,
            phonenumber,
            field,
            description,
            min_salary,
            max_salary,
            working_hours,
            latitude,
            longitude,
            expected_distance_range,
        ];
        const result = await pool.query(query, values);
        response.json({ job_id: jobId, msg: "successfull" });
    }
    catch (e) {
        console.log(e.severity)
        response.json({ error: 'Check username' });
    }
}

export const getJob = async (request, response) => {
    console.log("GET /getJob")
    try {
        const jobs = await pool.query("SELECT * FROM jobs");
        response.json(jobs.rows);
    } catch (err) {
        console.error(err.message);
    }
};

export const getJobByCategory = async (req, res) => {
    console.log("GET /getJobByCategory")

    const field = req.params['field']
    console.log(field)
    try {
        const query = 'SELECT * FROM jobs WHERE field = $1';
        const result = await pool.query(query, [field]);

        if (result.rows.length === 0) {
            return res.json({ message: 'No jobs found for the given category' });
        }

        return res.json(result.rows);
    } catch (error) {
        console.error('Error in getJobByCategory', error);
        return res.json({ message: 'Internal server error' });
    }
}