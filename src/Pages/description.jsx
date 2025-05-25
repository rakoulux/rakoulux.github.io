import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Générateur de positions aléatoires sans superposition
function generatePositions(count, imgSize, padding, containerWidth, containerHeight) {
  const positions = [];
  let attempts = 0;
  while (positions.length < count && attempts < 1000) {
    attempts++;
    const x = Math.random() * (containerWidth - imgSize - padding * 2) + padding;
    const y = Math.random() * (containerHeight - imgSize - padding * 2) + padding;
    // Vérifie la superposition
    let overlap = false;
    for (const pos of positions) {
      const dx = pos.x - x;
      const dy = pos.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < imgSize + padding) {
        overlap = true;
        break;
      }
    }
    if (!overlap) positions.push({ x, y });
  }
  return positions;
}

export default function Description() {
  const [ingredients, setIngredients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [positions, setPositions] = useState([]);
  const [clicked, setClicked] = useState([]);

  const navigate = useNavigate();

  // Dimensions dynamiques
  const CONTAINER_WIDTH = 1400;
  const IMG_SIZE = 240;
  const PADDING = 16;

  // Hauteur dynamique de la zone d'affichage (fenêtre - nav)
  const [containerHeight, setContainerHeight] = useState(window.innerHeight - 180);

  useEffect(() => {
    function handleResize() {
      setContainerHeight(window.innerHeight - 180);
    }
    window.addEventListener("resize", handleResize);
    // Désactive le scroll vertical
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    fetch("/JSON/description.json")
      .then((res) => res.json())
      .then((data) => {
        const arr = Object.entries(data).map(([key, val]) => ({
          key,
          ...val,
        }));
        setIngredients(arr);
        setPositions(
          generatePositions(
            arr.length,
            IMG_SIZE,
            PADDING,
            CONTAINER_WIDTH,
            containerHeight
          )
        );
      });
    // eslint-disable-next-line
  }, [containerHeight]);

  // Fonction pour marquer un ingrédient comme cliqué
  const handleClick = (i) => {
    setSelected(i);
    setClicked(prev => prev.includes(i) ? prev : [...prev, i]);
  };

  // Pourcentage de la jauge
  const percent = ingredients.length
    ? Math.round((clicked.length / ingredients.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-beige-home flex flex-col items-center">
      {/* Navigation */}
      <div className="mt-14 bg-orange-home rounded-2xl shadow-lg px-6 py-4 w-full max-w-4xl mx-4 flex flex-row items-center justify-center gap-x-12">
        <Link to="/" className="px-6 py-2 rounded-full text-white font-semibold transition">Le cassoulet</Link>
        <Link to="/description" className="px-6 py-2 rounded-full text-white font-semibold transition">Description</Link>
        <Link to="/reportage" className="px-6 py-2 rounded-full text-white font-semibold transition">Reportage</Link>
        <Link to="/histoire" className="px-6 py-2 rounded-full text-white font-semibold transition">Histoire</Link>
        <Link to="/about" className="px-6 py-2 rounded-full text-white font-semibold transition">A propos</Link>
      </div>
      {/* Zone d'affichage transparente, responsive en hauteur */}
      <div
        className="relative mt-12"
        style={{
          width: CONTAINER_WIDTH,
          height: containerHeight,
          background: "transparent",
          overflow: "hidden",
          borderRadius: "1rem",
        }}
      >
        {ingredients.map((ingredient, i) => (
          <img
            key={ingredient.key}
            src={ingredient.imagePath}
            alt={ingredient.key}
            style={{
              position: "absolute",
              left: positions[i]?.x,
              top: positions[i]?.y,
              width: IMG_SIZE,
              height: IMG_SIZE,
              cursor: "pointer",
              border: selected === i ? "4px solid #38bdf8" : "none",
              borderRadius: "1rem",
              transition: "border 0.2s, filter 0.2s, opacity 0.2s",
              zIndex: selected === i ? 2 : 1,
              background: "transparent",
              opacity: clicked.includes(i) ? 0.5 : 1,
              filter: clicked.includes(i) ? "grayscale(1)" : "none",
              userSelect: "none", // Empêche la sélection
            }}
            className="select-none"
            draggable={false} // Empêche le drag & drop
            onClick={() => handleClick(i)}
          />
        ))}

        {/* Affichage de la description au clic */}
        {selected !== null && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center"
            style={{ background: "transparent" }} // Overlay invisible
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-orange-200 rounded-xl shadow-lg p-6"
              style={{
                minWidth: 260,
                maxWidth: 320,
                border: "2px solid #f59e42",
              }}
              onClick={e => e.stopPropagation()} // Ne ferme pas si on clique sur la pop-up
            >
              <h2 className="text-xl font-bold mb-2 capitalize">
                {ingredients[selected].key}
              </h2>
              <p className="text-gray-700">{ingredients[selected].description}</p>
              <p className="text-gray-700">{ingredients[selected].description}</p>
              {ingredients[selected].source && (
                <a
                  href={ingredients[selected].source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-orange-700 underline hover:text-orange-900"
                >
                  source
                </a>
              )}
              <button
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition"
                onClick={() => setSelected(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="mt-8 text-gray-500">Clique sur un ingrédient pour lire sa description.</p>

      {/* Jauge verticale à droite, bouton superposé */}
      <div
        className="fixed right-8 top-1/2 flex flex-col items-center z-50"
        style={{ transform: "translateY(-50%)", height: "300px", justifyContent: "center" }}
      >
        <div className="relative flex flex-col items-center">
          {/* Pourcentage au-dessus */}
          <div className="mb-2 text-orange-700 font-bold text-lg select-none">{percent}%</div>
          <div
            className="w-8 h-64 bg-orange-100 rounded-full border-2 border-orange-400 overflow-hidden flex-shrink-0 relative"
            style={{ boxShadow: "0 2px 8px rgba(245,158,66,0.15)" }}
          >
            <div
              className="absolute left-0 bottom-0 w-full bg-orange-500 transition-all duration-500"
              style={{
                height: `${percent}%`,
                borderRadius: "0 0 1rem 1rem",
              }}
            />
            {/* Icône vidéo au centre quand jauge pleine */}
            {percent === 100 && (
              <button
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 rounded-full p-3 shadow transition"
                style={{ zIndex: 10 }}
                onClick={() => navigate("/reportage")}
                title="Voir le reportage"
              >
                {/* Icône play vidéo SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="white" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="12" fill="white" opacity="0.18"/>
                  <polygon points="10,8 18,12 10,16" fill="white"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
