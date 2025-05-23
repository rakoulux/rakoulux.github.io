import React from "react";
import { Link } from "react-router-dom"; // Si tu utilises React Router

export default function Histoire() {
  return (
    <div className="min-h-screen bg-beige-home flex flex-col items-center">
      <div className="mt-14 bg-orange-home rounded-2xl shadow-lg px-6 py-4 w-full max-w-4xl mx-4 flex flex-row items-center justify-center gap-x-12">
        <Link to="/" className="px-6 py-2 rounded-full text-white font-semibold transition">Le cassoulet</Link>
        <Link to="/description" className="px-6 py-2 rounded-full text-white font-semibold transition">Description</Link>
        <Link to="/reportage" className="px-6 py-2 rounded-full text-white font-semibold transition">Reportage</Link>
        <Link to="/histoire" className="px-6 py-2 rounded-full text-white font-semibold transition">Histoire</Link>
        <Link to="/about" className="px-6 py-2 rounded-full text-white font-semibold transition">A propos</Link>
      </div>
    </div>
  );
}
