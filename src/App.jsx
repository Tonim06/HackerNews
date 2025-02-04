import { useState, useEffect } from "react";

const API_BASE = "https://hacker-news.firebaseio.com/v0";
const ENDPOINTS = {
  top: `${API_BASE}/topstories.json`,
  best: `${API_BASE}/beststories.json`,
  new: `${API_BASE}/newstories.json`,
};

function App() {
  const [storyType, setStoryType] = useState("top"); // Tipo de historia seleccionada
  const [storyIds, setStoryIds] = useState([]); // Guarda las historias disponibles
  const [stories, setStories] = useState([]); // Guarda las historias mostradas
  const [visibleCount, setVisibleCount] = useState(10); // Controla cuántas historias mostramos

  // 🔄 Cargar historias cuando cambia el tipo de selección
  useEffect(() => {
    fetch(ENDPOINTS[storyType])
      .then((res) => res.json())
      .then((ids) => {
        setStoryIds(ids);
        setStories([]); // Reiniciar historias al cambiar la selección
        setVisibleCount(10);
        loadStories(ids.slice(0, 10)); // Cargar las primeras 10 historias
      })
      .catch((error) => console.error("Error carregant les històries:", error));
  }, [storyType]);

  // 📌 Función para cargar historias a partir de un array de IDs
  const loadStories = async (ids) => {
    const storyPromises = ids.map(async (id) => {
      const res = await fetch(`${API_BASE}/item/${id}.json`);
      return res.json();
    });

    const newStories = await Promise.all(storyPromises);
    setStories((prevStories) => [...prevStories, ...newStories]);
  };

  // 🟢 Cargar 10 más
  const loadMoreStories = () => {
    const nextStories = storyIds.slice(visibleCount, visibleCount + 10);
    loadStories(nextStories);
    setVisibleCount((prevCount) => prevCount + 10);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1>Hacker News - Stories</h1>

      {/* 🔘 Selector de tipo de historia */}
      <label htmlFor="storyType">Selecciona tipus d'històries: </label>
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
                {story.descendants || 0}
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
