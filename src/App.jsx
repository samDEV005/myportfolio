
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3001/api/comments";

function App() {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadComments() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load comments.");
      }

      const data = await response.json();
      setComments(data);
      setMessage("");
    } catch (error) {
      console.error("Loading comments failed:", error);
      setMessage(
        "Could not load comments. Please check that the API and MySQL are running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, []);

  // Send a new comment to the backend to save it in MySQL.
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const cleanName = name.trim();
    const cleanComment = comment.trim();

    if (cleanName.length < 2 || cleanName.length > 60) {
      setMessage("Name must contain 2–60 characters.");
      return;
    }

    if (cleanComment.length < 3 || cleanComment.length > 1000) {
      setMessage("Comment must contain 3–1000 characters.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cleanName,
          comment: cleanComment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save your comment.");
      }

      setComments((previous) => [data, ...previous]);
      setName("");
      setComment("");
      setMessage("Your comment was saved in the MySQL database.");
    } catch (error) {
      console.error("Saving comment failed:", error);
      setMessage(
        error.message || "Could not save your comment. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="portfolio">
      <header className="site-header">
        <a className="brand" href="#home">MyPortfolio</a>
        <nav aria-label="Main navigation">
          <a href="#about">About me</a>
          <a href="#skills"> my Skills</a>
          <a href="#projects">my Projects</a>
          <a href="#comments">Comments</a>
          <a href="#contact">Contacts</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <p className="eyebrow">WELCOME TO MY PORTFOLIO</p>
          <h1>Hello, my name is NIYITANGA Samuel</h1>
          <p className="hero-text">
            Welcome to my portfolio. Explore my work and leave a comment.
          </p>
          <a className="primary-link" href="#projects">Explore my work</a>
        </section>

        <section className="section" id="about">
          <p className="eyebrow">INTRODUCTION</p>
          <h2>About Me</h2>
          <p>
            I am learning to build modern websites with React and Docker.
            Replace this paragraph with your own introduction.
          </p>
        </section>

        <section className="section" id="skills">
          <p className="eyebrow">WHAT I AM LEARNING</p>
          <h2>Skills</h2>
          <div className="tag-list">
            <span>HTML</span>
            <span>CSS</span>
            <span>JavaScript</span>
            <span>React</span>
            <span>Docker</span>
          </div>
        </section>

        <section className="section" id="projects">
          <p className="eyebrow">MY WORK</p>
          <h2>Projects</h2>
          <article className="project-card">
            <h3>My Portfolio</h3>
            <p>A React portfolio packaged and served using Docker.</p>
          </article>
        </section>

        <section className="section comments-section" id="comments">
          <p className="eyebrow">JOIN THE CONVERSATION</p>
          <h2>Leave a Comment</h2>
          <p>Comments are saved in the MySQL database.</p>

          <form className="comment-form" onSubmit={handleSubmit}>
            <label htmlFor="comment-name">Your name</label>
            <input
              id="comment-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              maxLength={60}
              autoComplete="name"
              required
              placeholder="Enter your name"
            />

            <label htmlFor="comment-text">Your comment</label>
            <textarea
              id="comment-text"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              minLength={3}
              maxLength={1000}
              rows={5}
              required
              placeholder="Write your comment..."
            />

            <p className="character-count">
              {comment.length}/1000 characters
            </p>

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Comment"}
            </button>
          </form>

          {message && (
            <p className="notice" role="status">{message}</p>
          )}

          <div className="comments-list">
            <div className="comments-heading">
              <h3>
                Comments ({comments.length})
              </h3>
              <button
                type="button"
                className="refresh-button"
                onClick={loadComments}
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {loading ? (
              <p className="muted">Loading comments from MySQL...</p>
            ) : comments.length === 0 ? (
              <p className="muted">
                No comments yet. Be the first to leave one!
              </p>
            ) : (
              comments.map((item) => (
                <article className="comment-card" key={item.id}>
                  <div className="comment-meta">
                    <strong>{item.name}</strong>
                    <time dateTime={item.created_at}>
                      {new Date(item.created_at).toLocaleString()}
                    </time>
                  </div>
                  <p className="comment-body">{item.comment}</p>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="section" id="contact">
          <p className="eyebrow">GET IN TOUCH</p>
          <h2>Contact</h2>
          <p>MTN:+250 788366495 &amp; AIRTEL:+250 722840249</p>
          <a href="mailto:niyitangasamuel005.com">
            Contact me by email
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} MyPortfolio</p>
        <p>Built with React, Docker, Node.js and MySQL.</p>
      </footer>
    </div>
  );
}

export default App;
