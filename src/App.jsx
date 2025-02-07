import { useState, useEffect } from "react";
import "./index.css";

const API_BASE = "https://hacker-news.firebaseio.com/v0";
const ENDPOINTS = {
  top: `${API_BASE}/topstories.json`,
  best: `${API_BASE}/beststories.json`,
  new: `${API_BASE}/newstories.json`,
};

function App() {
  const [storyType, setStoryType] = useState("top"); 
  const [storyIds, setStoryIds] = useState([]); 
  const [stories, setStories] = useState([]); 
  const [visibleCount, setVisibleCount] = useState(10); 

  
  useEffect(() => {
    fetch(ENDPOINTS[storyType])
      .then((res) => res.json())
      .then((ids) => {
        setStoryIds(ids);
        setStories([]); 
        setVisibleCount(10);
        loadStories(ids.slice(0, 10));
      })
      .catch((error) => console.error("Error carregant les històries:", error));
  }, [storyType]);

  
  const loadStories = async (ids) => {
    const storyPromises = ids.map(async (id) => {
      const res = await fetch(`${API_BASE}/item/${id}.json`);
      return res.json();
    });

    const newStories = await Promise.all(storyPromises);
    setStories((prevStories) => [...prevStories, ...newStories]);
  };

  
  const loadMoreStories = () => {
    const nextStories = storyIds.slice(visibleCount, visibleCount + 10);
    loadStories(nextStories);
    setVisibleCount((prevCount) => prevCount + 10);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Hacker News - Stories</h1>

      {/* Selector de tipo de historia */}
      <select
        id="storyType"
        value={storyType}
        onChange={(e) => setStoryType(e.target.value)}
      >
        <option value="top">Top Stories</option>
        <option value="best">Best Stories</option>
        <option value="new">New Stories</option>
      </select>

      <ul>
      {stories.map((story) => (
        <li key={story.id} className="story-item">
          <h2>
            <a href={story.url} target="_blank" rel="noopener noreferrer">
              {story.title}
            </a>
          </h2>
          <p>
            Puntuació: {story.score} | Autor:{" "}
            <a
              href={`https://news.ycombinator.com/user?id=${story.by}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {story.by}
            </a>
          </p>
          <p>Publicat: {new Date(story.time * 1000).toLocaleString()}</p>
          <p>
            Comentaris:{" "}
            <a
              href={`https://news.ycombinator.com/item?id=${story.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {story.descendants || 0}
            </a>
          </p>
        </li>
      ))}
    </ul>

      {/* Botón para cargar más historias */}
      {visibleCount < 500 && (
        <button onClick={loadMoreStories} >
          LOAD MORE
        </button>
      )}
    </div>
  );
}

export default App;
