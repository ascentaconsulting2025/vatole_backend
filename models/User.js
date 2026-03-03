const { pool } = require("../config/database");
const bcrypt = require("bcryptjs");

const User = {
  // Create a new user
  create: async (email, password, role = "admin") => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO users (email, password, role)
      VALUES ($1, $2, $3)
      RETURNING id, email, role, is_active, created_at
    `;

    const result = await pool.query(query, [email, hashedPassword, role]);
    return result.rows[0];
  },

  // Find user by email
  findByEmail: async (email) => {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  // Find user by ID
  findById: async (id) => {
    const query =
      "SELECT id, email, role, is_active, last_login, created_at FROM users WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Update last login
  updateLastLogin: async (id) => {
    const query =
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1";
    await pool.query(query, [id]);
  },

  // Compare password
  comparePassword: async (candidatePassword, hashedPassword) => {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  },

  // Update user
  update: async (id, updates) => {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE users 
      SET ${fields.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, email, role, is_active, created_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },
};

module.exports = User;
