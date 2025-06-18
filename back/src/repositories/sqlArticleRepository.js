//
//  This repository shall:
//  - Connect to the database (using the pool provided by the database.js)
// -  Perfrom the SQL querries to implement the bellow API
//
import pool from "../utils/database.js";

// Get all articles with journalist and their categories as a comma-separated string
export async function getArticles() {
  const [rows] = await pool.query(`
    SELECT a.*, j.name AS journalist_name,
      GROUP_CONCAT(c.name) AS category_names
    FROM articles a
    LEFT JOIN journalist j ON a.journalist_id = j.id
    LEFT JOIN article_category ac ON a.id = ac.article_id
    LEFT JOIN category c ON ac.category_id = c.id
    GROUP BY a.id
  `);
  return rows;
}

// Get one article by ID with journalist and categories
export async function getArticleById(id) {
  const [rows] = await pool.query(
    `
    SELECT a.*, j.name AS journalist_name,
      GROUP_CONCAT(c.name) AS category_names
    FROM articles a
    LEFT JOIN journalist j ON a.journalist_id = j.id
    LEFT JOIN article_category ac ON a.id = ac.article_id
    LEFT JOIN category c ON ac.category_id = c.id
    WHERE a.id = ?
    GROUP BY a.id
  `,
    [id]
  );
  return rows[0];
}

// Create a new article
export async function createArticle(article) {
  const { title, content, journalist_id, categoryIds } = article;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Insert article
    const [result] = await conn.query(
      `INSERT INTO articles (title, content, journalist_id) VALUES (?, ?, ?)`,
      [title, content, journalist_id]
    );

    const articleId = result.insertId;

    // Insert categories if provided
    if (categoryIds && categoryIds.length > 0) {
      const values = categoryIds.map((cid) => [articleId, cid]);
      await conn.query(
        `INSERT INTO article_category (article_id, category_id) VALUES ?`,
        [values]
      );
    }

    await conn.commit();
    return { id: articleId };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

// Update article by ID
export async function updateArticle(id, updatedData) {
  const { title, content, journalist_id, categoryIds } = updatedData;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Update article
    await conn.query(
      `UPDATE articles SET title = ?, content = ?, journalist_id = ? WHERE id = ?`,
      [title, content, journalist_id, id]
    );

    // Remove old categories
    await conn.query(`DELETE FROM article_category WHERE article_id = ?`, [id]);

    // Insert new categories if any
    if (categoryIds && categoryIds.length > 0) {
      const values = categoryIds.map((cid) => [id, cid]);
      await conn.query(
        `INSERT INTO article_category (article_id, category_id) VALUES ?`,
        [values]
      );
    }

    await conn.commit();
    return { id };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

// Delete article by ID
export async function deleteArticle(id) {
  const [result] = await pool.query(`DELETE FROM articles WHERE id = ?`, [id]);
  return result;
}

// Get articles by journalist ID
export async function getArticlesByJournalistId(journalistId) {
  const [rows] = await pool.query(
    `
    SELECT a.*, j.name AS journalist_name,
      GROUP_CONCAT(c.name) AS category_names
    FROM articles a
    LEFT JOIN journalist j ON a.journalist_id = j.id
    LEFT JOIN article_category ac ON a.id = ac.article_id
    LEFT JOIN category c ON ac.category_id = c.id
    WHERE a.journalist_id = ?
    GROUP BY a.id
  `,
    [journalistId]
  );
  return rows;
}

// Get all categories
export async function getAllCategories() {
  const [rows] = await pool.query(`SELECT * FROM category`);
  return rows;
}

// Get articles filtered by categories (many-to-many)
export async function getArticlesByCategoryIds(categoryIds) {
  if (!categoryIds || categoryIds.length === 0) {
    return getArticles(); // fallback to get all articles
  }

  const placeholders = categoryIds.map(() => "?").join(", ");
  const [rows] = await pool.query(
    `
    SELECT a.*, j.name AS journalist_name,
      GROUP_CONCAT(c.name) AS category_names
    FROM articles a
    LEFT JOIN journalist j ON a.journalist_id = j.id
    JOIN article_category ac ON a.id = ac.article_id
    JOIN category c ON ac.category_id = c.id
    WHERE ac.category_id IN (${placeholders})
    GROUP BY a.id
  `,
    categoryIds
  );
  return rows;
}