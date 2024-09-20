const pool = require("../config/dbConfig")

const getUserByEmail = async (email) => {
    const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
    return rows[0];
}

const getUserById = async (id) => {
    const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
    return rows[0];
}

const getUser = async (key, value) => {
    const [rows] = await pool.query(`SELECT * FROM users WHERE ${key} = ?`, [value]);
    return rows[0];
}

const createUser = async (body) => {
    await pool.query(`INSERT INTO users (firstname, lastname, email, mobile, password) VALUES (?,?,?,?,?)`, [body.firstname, body.lastname, body.email, body.mobile, body.password]);
}

const getAllUsers = async () => {
    const [rows] = await pool.query(`SELECT * FROM users`);
    return rows;
}

const updateUserById = async (id, body) => {
    const setClause = Object.keys(body).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(body), id];
    console.log("setClause====>",setClause);
    console.log("values===>",values);
    await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, values);
}

const deleteUser = async (id) => {
    await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
}

const blockUser = async (id) => {
    await pool.query(`UPDATE users SET is_blocked = 1 WHERE id = ?`, [id]);
}

const unBlockUser = async (id) => {
    await pool.query(`UPDATE users SET is_blocked = 0 WHERE id = ?`, [id]);
}


module.exports = {
    getUserByEmail,
    getUser,
    createUser, 
    getAllUsers, 
    getUserById, 
    updateUserById, 
    deleteUser,
    blockUser,
    unBlockUser
};