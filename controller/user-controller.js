import { pool } from "../database/db.js";

export const signupUser = async (request, response) => {
    console.log("POST /signup")
    const { username, phonenumber, password } = request.body;
    try {
        let data = await pool.query(
            `SELECT *
            FROM users
            WHERE username = '${username}';`
        )
        if (data.rows.length !== 0) {
            return response.status(500).json({ msg: "Username Already Taken" })
        }
        data = await pool.query(
            `INSERT INTO users (username, phonenumber, password)
            VALUES ('${username}', '${phonenumber}', '${password}');`
        )
        return response.status(200).json({ msg: "Successfully signedup" })
    }
    catch (e) {
        console.log(e)
        return response.status(400).json({ msg: "Error While Signup, Please try again" })
    }
}

// INSERT INTO users (username, phonenumber, password)
// VALUES ('JohnDoe', '555-1234', 'mypassword123');