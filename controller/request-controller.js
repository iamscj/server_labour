import { pool } from "../database/db.js";
import nodemailer from 'nodemailer';

export const raiseRequest = async (req, res) => {
  console.log("POST /raiseRequest");

  const { username, job_id, phonenumber, salary, no_of_hours, email_id } = req.body;
  try {
    let query = `SELECT * FROM jobs WHERE job_id='${job_id}'`;
    let data = await pool.query(query);
    if (data.rows.length > 0 && data.rows[0].username === username) {
      return res.json({ msg: "Cannot Raise Request For Self Jobs" });
    }
    query = `
      INSERT INTO requests (username, job_id, phonenumber, salary, no_of_hours, email_id)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [username, job_id, phonenumber, salary, no_of_hours, email_id];

    await pool.query(query, values);

    res.status(200).json({ message: "Request raised successfully" });
  } catch (error) {
    // console.error("Error while raising request:", error);
    console.log(error)
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

  const email_id_1 = req.body.email_id_1; //labour
  const email_id_2 = req.body.email_id_2; //user

  const phonenumber1 = req.body.phonenumber1; //labour
  const phonenumber2 = req.body.phonenumber2; //user

  const email_id = "findyourlabour.sa@gmail.com"
  const password = "bwlutequfsoxgxmn"

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email_id,
      pass: password
    }
  });

  //yes =>accept + delete job id
  //yes1 => accept + keep job id
  //no => remove request

  if (status === "yes" || status === "yes1") {
    try {
      let msg = `<p>Hello, this is a custom message from FindYourLabour.sa. Find the Details you requested below:</p><p>Phone number: <strong>${phonenumber1}</strong></p><p>Name: <strong>${username1}</strong></p><p>Thank You,<br>Find Your Labour Team</p>`
        ;
      let mailOptions = {
        from: email_id,
        to: email_id_2,
        subject: 'FindYourLabour User Details',
        html: msg,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
      msg = `<p>Hello, this is a custom message from FindYourLabour.sa. Find the Details you requested below:</p><p>Phone number: <strong>${phonenumber2}</strong></p><p>Name: <strong>${username2}</strong></p><p>Thank You,<br>Find Your Labour Team</p>`
        ;
      mailOptions = {
        from: email_id,
        to: email_id_1,
        subject: 'FindYourLabour User Details',
        html: msg,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }
    catch (err) {
      res.json({ msg: "error" })
    }
  }
  if (status === "yes") {
    try {
      const query = `DELETE FROM jobs WHERE job_id = '${job_id}'`;
      await pool.query(query);
      res.json({ msg: "successfull" });
    } catch (err) {
      res.json({ msg: "error while doing the operation" });
    }
  }
  else if (status === "yes1" || status === "no") {
    try {
      const query = `DELETE FROM requests WHERE username = '${username2}' and job_id = '${job_id}'`;
      await pool.query(query);
      res.json({ msg: "successfull" });
    } catch (err) {
      res.json({ msg: "error while doing the operation" });
    }
  }
};

// CREATE TABLE requests (
//   username VARCHAR(30),
//   job_id VARCHAR(100),
//   phonenumber VARCHAR(30),
//   salary INTEGER,
//   no_of_hours INTEGER,
//   email_id VARCHAR(100) NOT NULL,
//   PRIMARY KEY (username, job_id),
//   FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
//   FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE ON UPDATE CASCADE
// );