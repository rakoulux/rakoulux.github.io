import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"; // Si tu utilises React Router

export default function Histoire() {
  const [frise, setFrise] = useState([]);
  const friseRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    fetch("/JSON/phrise.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Fichier JSON introuvable ou erreur réseau");
        }
        // Lisons le texte brut pour debug
        return res.text().then(text => {
          console.log("Réponse brute reçue :", text);
          try {
            const data = JSON.parse(text);
            setFrise(data.frise_chronologique_cassoulet || []);
          } catch (e) {
            console.error("Erreur de parsing JSON :", e, text);
          }
        });
      })
      .catch((err) => {
        console.error("Erreur lors du chargement du JSON :", err);
      });
  }, []);
  

  // Gestion du drag-scroll horizontal
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - friseRef.current.offsetLeft;
    scrollLeft.current = friseRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - friseRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2; // sensibilité
    friseRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // Pour le support tactile (mobile)
  const touchStartX = useRef(0);
  const touchScrollLeft = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].pageX - friseRef.current.offsetLeft;
    touchScrollLeft.current = friseRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    const x = e.touches[0].pageX - friseRef.current.offsetLeft;
    const walk = (x - touchStartX.current) * 1.2;
    friseRef.current.scrollLeft = touchScrollLeft.current - walk;
  };

  return (
    <div className="min-h-screen bg-beige-home flex flex-col items-center">
      <div className="mt-14 bg-orange-home rounded-2xl shadow-lg px-6 py-4 w-full max-w-4xl mx-4 flex flex-row items-center justify-center gap-x-12">
        <Link to="/" className="px-6 py-2 rounded-full text-white font-semibold transition">Le cassoulet</Link>
        <Link to="/description" className="px-6 py-2 rounded-full text-white font-semibold transition">Description</Link>
        <Link to="/reportage" className="px-6 py-2 rounded-full text-white font-semibold transition">Reportage</Link>
        <Link to="/histoire" className="px-6 py-2 rounded-full text-white font-semibold transition">Histoire</Link>
        <Link to="/about" className="px-6 py-2 rounded-full text-white font-semibold transition">A propos</Link>
      </div>

      <div className="w-full flex flex-col items-center py-10">
        <h2 className="text-3xl font-bold mb-8">Frise Chronologique du Cassoulet</h2>
        <div
          ref={friseRef}
          className="flex flex-row gap-8 overflow-x-auto cursor-grab select-none rounded-xl px-8 py-6"
          style={{ width: "100%", maxWidth: "1100px", userSelect: "none" }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {frise.map((event, idx) => (
            <div
              key={idx}
              className="min-w-[220px] bg-orange-100 border-l-4 border-orange-400 px-4 py-3 rounded-md shadow transition hover:scale-105"
            >
              <div className="font-bold text-orange-700 mb-2">{event.date}</div>
              {Array.isArray(event.evenement) ? (
                <ul className="list-disc ml-4 text-sm text-gray-700">
                  {event.evenement.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-700">{event.evenement}</div>
              )}
            </div>
          ))}
        </div>
        <div className="text-xs mt-4 text-gray-400">
          Source : <a href="https://www.confrerieducassoulet.com/l-histoire.html" target="_blank" rel="noopener noreferrer" className="underline">confrerieducassoulet.com</a>
        </div>
      </div>
    </div>
  );
}
