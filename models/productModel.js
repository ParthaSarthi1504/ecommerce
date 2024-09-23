
const getProductById = async (id) => {
    const [rows] = await pool.query(`SELECT * FROM products WHERE id = ?`, [id]);
    return rows[0];
}

const getProduct = async (key, value) => {
    const [rows] = await pool.query(`SELECT * FROM products WHERE ${key} = ?`, [value]);
    return rows[0];
}

const createProduct = async (body) => {
    const setClause = Object.keys(body).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(body)];
    await pool.query(`INSERT INTO products (${setClause}) VALUES (?,?,?,?,?)`, values);
}

const getAllProducts = async () => {
    const [rows] = await pool.query(`SELECT * FROM products`);
    return rows;
}

const updateProductById = async (id, body) => {
    const setClause = Object.keys(body).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(body), id];
    console.log("setClause====>",setClause);
    console.log("values===>",values);
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