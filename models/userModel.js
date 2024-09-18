const pool = require("../config/dbConfig")

const getUserByEmail = async(email)=>{
    const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
    return rows[0];
}

const createUser = async(body) => {
    await pool.query(`INSERT INTO users (firstname, lastname, email, mobile, password) VALUES (?,?,?,?,?)`,[body.firstname,body.lastname, body.email, body.mobile, body.password]);
}

const getAllUsers = async() =>{
    const [rows] = await pool.query(`SELECT * FROM users`);
    return rows;
}

const getUserById = async(id)=>{
    const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
    return rows[0];
}

const updateUserById = async(id, body) =>{
    await pool.query(`UPDATE users SET firstname = ?, lastname =?, email =?, mobile =?, password =? WHERE id = ?`,[body.firstname,body.lastname, body.email, body.mobile, body.password, id]);
}

const deleteUser = async(id)=>{
    await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
}


module.exports = {getUserByEmail, createUser, getAllUsers, getUserById,updateUserById, deleteUser};