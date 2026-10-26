
import { useEffect, useState } from "react";
import "./App.css";

const STORAGE_KEY = "myportfolio_comments";

function readComments() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function App() {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(readComments);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    } catch {
      setMessage("Unable to save comments in this browser.");
    }
  }, [comments]);

  function handleSubmit(event) {
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

    const newComment = {
      id: crypto.randomUUID(),
      name: cleanName,
      comment: cleanComment,
      createdAt: new Date().toISOString()
    };

    setComments((previous) => [newComment, ...previous].slice(0, 200));
    setName("");
    setComment("");
    setMessage("Your comment was saved in this browser.");
  }

  function clearComments() {
    if (!window.confirm("Delete all comments saved in this browser?")) {
      return;
    }

    setComments([]);
    setMessage("Local comments have been cleared.");
  }

  return (
    <div className="portfolio">
      <header className="site-header">
        <a className="brand" href="#home">MyPortfolio</a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#comments">Comments</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <p className="eyebrow">WELCOME TO MY PORTFOLIO</p>
          <h1>Hello, I’m <span>Samuel.</span></h1>
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
          <p>Comments are saved locally in this browser.</p>

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

            <p className="character-count">{comment.length}/1000 characters</p>
            <button type="submit">Save Comment</button>
          </form>

          {message && (
            <p className="notice" role="status">{message}</p>
          )}

          <div className="comments-list">
            <div className="comments-heading">
              <h3>Saved Comments ({comments.length})</h3>
              {comments.length > 0 && (
                <button
                  type="button"
                  className="refresh-button"
                  onClick={clearComments}
                >
                  Clear All
                </button>
              )}
            </div>

            {comments.length === 0 ? (
              <p className="muted">
                No comments yet. Be the first to leave one!
              </p>
            ) : (
              comments.map((item) => (
                <article className="comment-card" key={item.id}>
                  <div className="comment-meta">
                    <strong>{item.name}</strong>
                    <time dateTime={item.createdAt}>
                      {new Date(item.createdAt).toLocaleString()}
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
          <p>Replace this example with your contact information.</p>
          <a href="mailto:your-email@example.com">Contact me by email</a>
        </section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} MyPortfolio</p>
        <p>Built with React and Docker.</p>
      </footer>
    </div>
  );
}

export default App;
