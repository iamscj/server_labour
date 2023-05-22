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
            return response.json({ msg: "Username Already Taken" })
        }
        data = await pool.query(
            `INSERT INTO users (username, phonenumber, password)
            VALUES ('${username}', '${phonenumber}', '${password}');`
        )
        return response.json({ msg: "Successfully signedup" })
    }
    catch (e) {
        console.log(e)
        return response.status(400).json({ msg: "Error While Signup, Please try again" })
    }
}

export const login = async (request, response) => {
    console.log("POST /login")
    const { username, password } = request.body;
    try {
        let data = await pool.query(
            `SELECT *
            FROM users
            WHERE username = '${username}';`
        )
        if (data.rows.length === 0) {
            return response.json({ msg: "User Does Not Exist" })
        }
        let actual_password = data.rows[0].password;
        if (actual_password !== password) {
            return response.json({ msg: "password missmatch" })
        }
        return response.json({ msg: "user verified", details: data.rows[0] })
    }
    catch (e) {
        console.log(e)
        return response.status(400).json({ msg: "Error While SignIn, Please try again" })
    }
}

// INSERT INTO users (username, phonenumber, password)
// VALUES ('JohnDoe', '555-1234', 'mypassword123');