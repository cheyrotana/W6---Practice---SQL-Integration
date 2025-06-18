import * as articleRepository from "../repositories/sqlArticleRepository.js";

// TODO : Change articleRepository to use the sqlArticleRepository

// GET /api/articles
export async function getAllArticles(req, res) {
  try {
    const articles = await articleRepository.getArticles();
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/articles/:id
export async function getArticleById(req, res) {
  try {
    const article = await articleRepository.getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// POST /api/articles
export async function createArticle(req, res) {
  try {
    const newArticle = await articleRepository.createArticle(req.body);
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// PUT /api/articles/:id
export async function updateArticle(req, res) {
  try {
    const updatedArticle = await articleRepository.updateArticle(
      req.params.id,
      req.body
    );
    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE /api/articles/:id
export async function deleteArticle(req, res) {
  try {
    await articleRepository.deleteArticle(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/articles/:id
export async function getArticleWithJournalist(req, res) {
  try {
    const article = await articleRepository.getArticleWithJournalistById(req.params.id);
    if (!article) return res.status(404).json({ message: "Not found" });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
}

// GET /api/journalists/:id/articles
export async function getArticlesByJournalist(req, res) {
  try {
    const journalistId = req.params.id;
    const articles = await articleRepository.getArticlesByJournalistId(
      journalistId
    );
    res.json(articles);
  } catch (error) {
    console.error("Error fetching journalist articles:", error);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
}

// GET /api/articles (filtered by category IDs)
export async function getArticlesFiltered(req, res) {
  try {
    const categoryIds = req.query.categoryIds
      ? req.query.categoryIds.split(",").map(Number)
      : [];

    const articles = await articleRepository.getArticlesByCategoryIds(categoryIds);
    res.json(articles);
  } catch (error) {
    console.error("Error fetching filtered articles:", error);
    res.status(500).json({ message: "Server error" });
  }
}


