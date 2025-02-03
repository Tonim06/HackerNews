import { useState, useEffect } from "react";

const TOP_STORIES_URL = "https://hacker-news.firebaseio.com/v0/topstories.json";

function App() {
  const [storyIds, setStoryIds] = useState([]); // Guarda las 500 historias
  const [stories, setStories] = useState([]); // Guarda las historias mostradas
  const [visibleCount, setVisibleCount] = useState(10); // Controla cuántas historias se muestran

  // 🟢 Cargar las 500 stories al iniciar
  useEffect(() => {
    fetch(TOP_STORIES_URL)
      .then((res) => res.json())
      .then((ids) => {
        setStoryIds(ids);
        loadStories(ids.slice(0, 10)); // Carga las primeras 10 historias
      })
      .catch((error) => console.error("Error carregant les històries:", error));
  }, []);

  // 🔄 Función para cargar historias desde sus IDs
  const loadStories = async (ids) => {
    const storyPromises = ids.map(async (id) => {
      const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      return res.json();
    });

    const newStories = await Promise.all(storyPromises);
    setStories((prevStories) => [...prevStories, ...newStories]); // Agregar nuevas historias
  };

  // 📌 Función para cargar 10 más
  const loadMoreStories = () => {
    const nextStories = storyIds.slice(visibleCount, visibleCount + 10);
    loadStories(nextStories);
    setVisibleCount((prevCount) => prevCount + 10);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1>Hacker News - Top Stories</h1>
      <ul>
        {stories.map((story) => (
          <li key={story.id} style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
            <h2>
              <a href={story.url} target="_blank" rel="noopener noreferrer">
                {story.title}
              </a>
            </h2>
            <p>
              Puntuació: {story.score} | Autor:{" "}
              <a href={`https://news.ycombinator.com/user?id=${story.by}`} target="_blank">
                {story.by}
              </a>
            </p>
            <p>Publicat: {new Date(story.time * 1000).toLocaleString()}</p>
            <p>
              Comentaris:{" "}
              <a href={`https://news.ycombinator.com/item?id=${story.id}`} target="_blank">
                {story.descendants}
              </a>
            </p>
          </li>
        ))}
      </ul>

      {/* Botón para cargar más historias */}
      {visibleCount < 500 && (
        <button onClick={loadMoreStories} style={{ padding: "10px", fontSize: "16px" }}>
          Carregar més
        </button>
      )}
    </div>
  );
}

export default App;
