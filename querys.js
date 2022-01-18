const { Pool } = require("pg");

const config = {
  user: "postgres",
  host: "localhost",
  password: "Junjie1995",
  database: "softlife",
  port: 5432,
};

const pool = new Pool(config);

const consultaUsuario = async () => {
  try {
    const query = await pool.query("SELECT * FROM usuarios");
    return query.rows;
  } catch (err) {
    console.log(err.code);
    return code;
  }
};

const creaUsuario = async (datos) => {
  const statement = {
    text: "INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING *;",
    values: datos,
  };
  try {
    await pool.query(statement);
  } catch (err) {
    console.log(err.code);
    return err;
  }
};

const autentificador = async (datos) => {
  const statement = {
    text: "SELECT * FROM usuarios WHERE email = $1 AND password = $2",
    values: datos,
  };
  try {
    const query = await pool.query(statement);
    return query;
  } catch (err) {
    console.log(err.code);
    return err;
  }
};

module.exports = { consultaUsuario, creaUsuario, autentificador };
