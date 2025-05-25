import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-beige-home flex flex-col items-center">
      <div className="mt-14 bg-orange-home rounded-2xl shadow-lg px-6 py-4 w-full max-w-4xl mx-4 flex flex-row items-center justify-center gap-x-12">
        <Link to="/" className="px-6 py-2 rounded-full text-white font-semibold transition">Le cassoulet</Link>
        <Link to="/description" className="px-6 py-2 rounded-full text-white font-semibold transition">Description</Link>
        <Link to="/reportage" className="px-6 py-2 rounded-full text-white font-semibold transition">Reportage</Link>
        <Link to="/histoire" className="px-6 py-2 rounded-full text-white font-semibold transition">Histoire</Link>
        <Link to="/about" className="px-6 py-2 rounded-full text-white font-semibold transition">A propos</Link>
      </div>
      <div className="flex flex-row items-center justify-center mt-12">
        <h1 className="text-black text-6xl font-bold">Préparons le cassoulet ensemble !</h1>
      </div>    
      <div className="flex flex-row items-center justify-center mt-12">
        <img
          src="/Images/bol.png"
          alt="Cassoulet"
          className="mt-10 w-full max-w-md rounded-lg"
        />
      </div>
      {/* Bouton vert centré */}
      <div className="flex flex-row items-center justify-center mt-8">
        <Link
          to="/description"
          className="px-8 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow transition"
        >
          Cuisinons !
        </Link>
      </div>
    </div>
  );
}
