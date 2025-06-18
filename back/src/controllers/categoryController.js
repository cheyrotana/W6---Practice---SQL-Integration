import * as articleRepository from "../repositories/sqlArticleRepository.js";

export async function getAllCategories(req, res) {
  try {
    const categories = await articleRepository.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
}
