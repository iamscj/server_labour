import { pool } from "../database/db.js";
import twilio from 'twilio';

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
  } catch (error) {
    console.error("Error while raising request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRequestsForUser = async (req, res) => {
  console.log("GET /getRequestsForUser");
  const username = req.params["username"];
  try {
    let data = await pool.query(
      `SELECT * FROM jobs 
             WHERE username='${username}'`
    );
    console.log(data.rows);
    if (data.rows.length === 0) {
      return res.status(200).json("No Jobs Posted");
    }
    if (data.rows.length > 0) {
      const requests = [];

      for (const job of data.rows) {
        const jobRequests = await pool.query(
          `SELECT * FROM requests WHERE job_id='${job.job_id}'`
        );
        console.log(`Requests for job ${job.job_id}:`, jobRequests.rows);
        if (jobRequests.rows.length > 0) requests.push(...jobRequests.rows);
      }
      console.log(requests);
      res.json(requests);
    } else {
      res.json("No jobs found for the given username.");
    }
  } catch (error) {
    console.error("Error while retrieving request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const acceptRejectRequest = async (req, res) => {
  console.log("/POST acceptRejectRequest");
  const status = req.body.status;
  const job_id = req.body.job_id;
  const username1 = req.body.username1; //labour
  const username2 = req.body.username2; //user
  const phonenumber1 = req.body.phonenumber1; //labour
  const phonenumber2 = req.body.phonenumber2; //user
  const accountSid = 'AC0cabc3e452bca2d11c8a2c70c5024bce';
  const authToken = '574c3db1fd374d08d11c188fe0b1e43b';
  //yes =>accept + delete job id
  //yes1 => accept + keep job id
  //no => remove request
  if (status === "yes" || status === "yes1") {
    //whatsapp logic
    const fromPhoneNumber = '+14155238886'; // Twilio phone number
    const toPhoneNumber = '+917892335688'; // receipient
    const customMessage = 'Hello, this is a custom message from FindYourLabour';
    const client = twilio(accountSid, authToken);
    const message = await client.messages.create({
      body: customMessage,
      from: fromPhoneNumber,
      to: toPhoneNumber
    });

    console.log(`Message SID: ${message.sid}`);
    return res.json("successful")
  }
  // if (status === "yes") {
  //   try {
  //     const query = `DELETE FROM jobs WHERE job_id="${job_id}"`;
  //     await pool.query(query);
  //     res.json({ msg: "successfull" });
  //   } catch (err) {
  //     res.json({ msg: "error while doing the operation" });
  //   }
  // } else if (status === "yes1" || status === "no") {
  //   try {
  //     const query = `DELETE FROM requests WHERE username="${username2}" and job_id="${job_id}"`;
  //     await pool.query(query);
  //     res.json({ msg: "successfull" });
  //   } catch (err) {
  //     res.json({ msg: "error while doing the operation" });
  //   }
  // }
};
// -- Constraint for username referencing users table
// ALTER TABLE requests
// ADD CONSTRAINT fk_requests_username
// FOREIGN KEY (username)
// REFERENCES users(username)
// ON DELETE CASCADE;

// -- Constraint for job_id referencing jobs table
// ALTER TABLE requests
// ADD CONSTRAINT fk_requests_job_id
// FOREIGN KEY (job_id)
// REFERENCES jobs(job_id)
// ON DELETE CASCADE;
