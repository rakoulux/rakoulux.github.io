import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const videos = [
  "/video/video4.mp4",
  "/video/video1.mp4",
  "/video/video2.mp4",
];

export default function Reportage() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // Fonction pour passer à la vidéo suivante ou aller à la page histoire
  const handleNext = () => {
    if (currentVideo < videos.length - 1) {
      setCurrentVideo(currentVideo + 1);
      // Remet la vidéo au début
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.load();
      }
    } else {
      navigate("/histoire");
    }
  };

  // (Optionnel) Passer automatiquement à la vidéo suivante à la fin
  const handleEnded = () => {
    if (currentVideo < videos.length - 1) {
      setCurrentVideo(currentVideo + 1);
    } else {
      navigate("/histoire");
    }
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
      {/* Player vidéo */}
      <div className="w-full max-w-6xl mt-12 flex flex-col items-center">
        <video
          className="w-full rounded-xl shadow-lg"
          controls
          ref={videoRef}
          src={videos[currentVideo]}
          onEnded={handleEnded} // Optionnel : pour passer à la suivante automatiquement
        >
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
        {/* Bouton Passer */}
        <button
          className="mt-8 px-8 py-3 rounded-full bg-orange-home text-white font-semibold text-lg shadow transition hover:bg-orange-500"
          onClick={handleNext}
        >
          Passer
        </button>
        <div className="mt-4 text-gray-600">
          Vidéo {currentVideo + 1} sur {videos.length}
        </div>
      </div>
    </div>
  );
}
