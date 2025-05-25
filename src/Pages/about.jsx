import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

// DiaporamaAuto en composant interne ou importé
function DiaporamaAuto({ images, interval = 3000, duration = 600 }) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const timerRef = useRef();

  // Gestion de l'auto-défilement
  useEffect(() => {
    if (!images || images.length === 0) return;
    timerRef.current = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % images.length);
        setFade(true);
      }, duration);
    }, interval);
    return () => clearInterval(timerRef.current);
  }, [images, interval, duration]);

  // Navigation manuelle
  const goTo = (newIndex) => {
    setFade(false);
    setTimeout(() => {
      setIndex(newIndex);
      setFade(true);
    }, duration / 2);
    clearInterval(timerRef.current);
  };

  if (!images || images.length === 0) {
    return <div className="text-gray-400">Aucune image trouvée.</div>;
  }

  return (
    <div className="rounded-xl p-4 w-[90vh] max-h-[80vh] flex flex-col items-center relative bg-beige-home">
      <h2 className="text-2xl font-bold mb-4 text-orange-600"></h2>
      <div className="relative w-full flex flex-col items-center">
        <div
          className="w-full max-h-[60vh] flex items-center justify-center rounded-lg overflow-hidden"
          style={{
            background: "",
            minHeight: 400,
            transition: `background ${duration}ms`,
          }}
        >
          <img
            src={images[index]}
            alt={`image-${index}`}
            className="w-full max-h-[60vh] object-cover rounded-lg"
            style={{
              opacity: fade ? 1 : 0,
              transition: `opacity ${duration}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const navigate = useNavigate();
  const [apropos, setApropos] = useState(null);
  const [images, setImages] = useState([]);

// Charger le JSON aPropos
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/JSON/aPropos.json")
      .then(res => res.json())
      .then(data => setApropos(data));
  }, []);

  // Charger la liste des images depuis images.json
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/Images/images.json")
      .then(res => res.json())
      .then(files => setImages(files.map(f => process.env.PUBLIC_URL + "/Images/" + f)));
  }, []);


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

      {/* Deux colonnes centrées */}
      <div className="flex flex-row justify-center items-center w-full h-full mt-16">
        {/* Colonne gauche : JSON */}
        {/* Colonne gauche : Remerciements défilants */}
      <div
        className="rounded-xl p-8 mr-8 w-[55vh] max-h-[65vh] overflow-hidden flex items-center justify-center"
        style={{ position: "relative", height: "65vh" }}
      >
        <div
          style={{
            animation: apropos
              ? `credits-scroll ${apropos.Participant.length * 1.5 + 12}s linear infinite`
              : "none",
            willChange: "transform",
            display: "inline-block",
            minWidth: "100%",
          }}
        >
          {apropos ? (
            <div className="flex flex-col items-center text-center space-y-6">
              <h2 className="text-3xl font-bold mb-2 text-orange-600">Remerciements</h2>
              <p className="mb-4 text-gray-700 text-lg">{apropos.Remerciement}</p>

              <h2 className="text-2xl font-semibold mb-1 text-orange-500">Participants</h2>
              <ul className="mb-4 list-none text-lg">
                {apropos.Participant.map((p, i) => (
                  <li key={i} className="mb-1 font-bold">{p}</li>
                ))}
              </ul>

              <h2 className="text-2xl font-semibold mb-1 text-orange-500">Sources</h2>
              <ul className="mb-4 list-none text-base">
                {apropos.Source.map((s, i) => (
                  <li key={i}>
                    <a href={s} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{s}</a>
                  </li>
                ))}
              </ul>

              <h2 className="text-2xl font-semibold mb-1 text-orange-500">Explications des pages</h2>
              <ul className="space-y-2 text-base">
                {Object.entries(apropos.ExplicationPage).map(([k, v]) => (
                  <li key={k}>
                    <span className="font-semibold">{k} :</span> <span className="text-gray-700">{v}</span>
                  </li>
                ))}
              </ul>
              <div className="h-16" /> {/* Espace à la fin pour le scroll */}
            </div>
          ) : (
            <div className="text-center text-gray-400">Chargement...</div>
          )}
        </div>
      </div>
        {/* Colonne droite : diaporama auto */}
        <DiaporamaAuto images={images} interval={3000} duration={600} />
      </div>
    </div>
  );
}
