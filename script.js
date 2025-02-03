document.addEventListener("DOMContentLoaded", async function () {
    const storiesList = document.getElementById("stories-list");

    // Paso 1: Obtener las 10 primeras historias
    const topStoriesUrl = "https://hacker-news.firebaseio.com/v0/topstories.json";
    try {
        const response = await fetch(topStoriesUrl);
        const storyIds = await response.json();
        const top10Ids = storyIds.slice(0, 10); // Solo las 10 primeras historias

        // Paso 2: Obtener detalles de cada historia
        const storyPromises = top10Ids.map(async (id) => {
            const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
            const res = await fetch(storyUrl);
            return res.json();
        });

        const stories = await Promise.all(storyPromises);

        // Paso 3: Mostrar las historias en la página
        stories.forEach(story => {
            const storyItem = document.createElement("li");

            const storyDate = new Date(story.time * 1000).toLocaleString(); // Convertir Unix timestamp

            storyItem.innerHTML = `
                <h2><a href="${story.url}" target="_blank">${story.title}</a></h2>
                <p>Puntuació: ${story.score} | Autor: <a href="https://news.ycombinator.com/user?id=${story.by}" target="_blank">${story.by}</a></p>
                <p>Publicat: ${storyDate}</p>
                <p>Comentaris: <a href="https://news.ycombinator.com/item?id=${story.id}" target="_blank">${story.descendants}</a></p>
            `;

            storiesList.appendChild(storyItem);
        });
    } catch (error) {
        console.error("Error carregant les històries:", error);
    }
});
