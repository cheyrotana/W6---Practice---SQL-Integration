import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getArticles, removeArticle } from "../services/api";
export default function JournalistArticlesPage() {
  const { id } = useParams();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/api/articles/journalists/${id}/articles`)
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error("Error loading journalist articles:", err));
  }, [id]);

  return (
    <div>
      {articles.length > 0 && (
        <h2>Articles by {articles[0].journalist_name || "this journalist"}</h2>
      )}

      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          }}
        >
          {articles.map((article) => (
            <div
              key={article.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <div className="article-title">{article.title}</div>
              <p>
                <strong>Category:</strong> {article.category}
              </p>
              <div className="article-author">
                By{" "}
                <Link to={`/journalists/${article.journalist_id}/articles`}>
                  {article.journalist_name || "Unknown"}
                </Link>
              </div>
              <button
                className="button-secondary"
                onClick={() =>
                  (window.location.href = `/articles/${article.id}`)
                }
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  
}
