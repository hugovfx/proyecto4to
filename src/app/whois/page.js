"use client";

import "../App.css";
import Side from "../components/Side";
import Nav from "../components/Nav";
import { useState } from "react";
import Content from "../components/Content";

export default function Home() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchWhois = async () => {
    if (!query.trim()) {
      setError("Por favor ingresa un dominio para buscar.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      console.log("Buscando dominio:", query);

      const response = await fetch("/api/whois", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      console.log("Respuesta recibida:", response);

      if (!response.ok) {
        const { error } = await response.json();
        setError(error || "Error desconocido al realizar la búsqueda.");
        return;
      }

      const data = await response.json();
      console.log("Datos recibidos:", data);
      setResult(data);
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cont1">
      <Side />
      <div className="cont12">
        <Nav />
        <Content
          name={"WHOIS Lookup"}
          info={
            <div style={{ maxWidth: "100%", overflow: "hidden" }}>
              <div className="flex gap-4" style={{ padding: "20px" }}>
                <div style={{ width: "40%" }}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ingresa un dominio (ej: example.com)"
                      className="p-3 border rounded-lg flex-1 text-lg bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                    />
                    <button
                      onClick={searchWhois}
                      disabled={loading}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 text-lg font-medium"
                    >
                      {loading ? "Buscando..." : "Buscar"}
                    </button>
                  </div>
                  {error && <p className="text-red-400 mt-2 font-medium">{error}</p>}
                </div>

                <div style={{ width: "60%" }}>
                  {loading && (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-white text-lg">Buscando información WHOIS...</p>
                    </div>
                  )}
                  {result && !loading && (
                    <div className="border border-gray-600 p-6 rounded-lg bg-gray-800 shadow-sm">
                      <h2 className="text-2xl font-semibold mb-4 text-white">
                        Información WHOIS para: {result.domain_name || query}
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-bold text-white">Registrar</h3>
                          <p className="text-gray-300">{result.registrar || "No disponible"}</p>
                        </div>
                        <div>
                          <h3 className="font-bold text-white">Fechas</h3>
                          <p className="text-gray-300">
                            <span className="font-medium">Creación:</span>{" "}
                            {result.creation_date
                              ? new Date(result.creation_date * 1000).toLocaleDateString()
                              : "No disponible"}
                          </p>
                          <p className="text-gray-300">
                            <span className="font-medium">Expiración:</span>{" "}
                            {result.expiration_date
                              ? new Date(result.expiration_date * 1000).toLocaleDateString()
                              : "No disponible"}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-bold text-white">Servidores de Nombres</h3>
                          {result.name_servers ? (
                            <ul className="list-disc list-inside text-gray-300">
                              {result.name_servers.map((ns, index) => (
                                <li key={index}>{ns}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-300">No disponible</p>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">DNSSEC</h3>
                          <p className="text-gray-300">{result.dnssec || "No disponible"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
