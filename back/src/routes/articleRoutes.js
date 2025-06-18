import { Router } from "express";
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleWithJournalist,
  getArticlesByJournalist,
  getArticlesFiltered,
} from "../controllers/articleController.js";

const articleRouter = Router();

articleRouter.get("/journalists/:id/articles", getArticlesByJournalist);
articleRouter.get("/articles/:id", getArticleWithJournalist);
articleRouter.get("/articles", getArticlesFiltered);
articleRouter.get("/", getAllArticles);
articleRouter.get("/:id", getArticleById);
articleRouter.post("/", createArticle);
articleRouter.put("/:id", updateArticle);
articleRouter.delete("/:id", deleteArticle);

export default articleRouter;
