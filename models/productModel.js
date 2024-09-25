const pool = require("../config/dbConfig");

const getProductById = async (id) => {
    const [rows] = await pool.query(`SELECT * FROM products WHERE id = ?`, [id]);
    return rows[0];
}

const getProduct = async (key, value) => {
    const [rows] = await pool.query(`SELECT * FROM products WHERE ${key} = ?`, [value]);
    return rows[0];
}

const createProduct = async (body) => {
    const setClause = Object.keys(body).map(key => key).join(', ');
    const values =  [...Object.values(body)];
    const valuesExpected = Object.keys(body).map(_ => "?").join(' ,');

    await pool.query(`INSERT INTO products (${setClause}) VALUES (${valuesExpected})`,values);
}

const getAllProducts = async () => {
    const [rows] = await pool.query(`SELECT * FROM products`);
    return rows;
}

const updateProductById = async (id, body) => {
    const setClause = Object.keys(body).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(body), id];
    await pool.query(`UPDATE products SET ${setClause} WHERE id = ?`, values);
}

const deleteProduct = async (id) => {
    await pool.query(`DELETE FROM products WHERE id = ?`, [id]);
}

module.exports={
    getAllProducts,
    getProduct,
    getProductById,
    createProduct,
    updateProductById,
    deleteProduct
};