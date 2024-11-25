"use client";
import "../App.css";
import Side from "../components/Side";
import Nav from "../components/Nav";
import { useState } from 'react';
import Content from "../components/Content";
import ButtonChat from "../components/ButtonChat";
export default function Home() {
  const [searchType, setSearchType] = useState('ip');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const EXAMPLE_IPS = [
    { text: 'Google DNS', ip: '8.8.8.8' },
    { text: 'Cloudflare DNS', ip: '1.1.1.1' },
    { text: 'OpenDNS', ip: '208.67.222.222' },
  ];

  const FREE_QUERIES = [
    { text: 'Buscar servidores Apache', query: 'apache' },
    { text: 'Buscar cámaras', query: 'webcam' },
    { text: 'Servidores FTP', query: 'port:21' }
  ];

  const searchShodan = async () => {
    if (!query.trim()) {
      setError('Por favor ingresa un valor para buscar');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/shodan', {   
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query,
          type: searchType 
        }),
      });
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }
      
      setResult(data);
    } catch (error) {
      setError('Error al realizar la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cont1">
      <Side />
      <div className="cont12">
        <Nav />
        <Content name={"NMAP & Shodan Search"} info={
          <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
            <div className="flex gap-4" style={{ padding: '20px' }}>
              {/* Panel izquierdo */}
              <div style={{ width: '40%' }}>
                {/* Selector de tipo de búsqueda */}
                <div className="flex gap-4 mb-4 justify-center">
                  <button
                    onClick={() => setSearchType('ip')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      searchType === 'ip' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    Búsqueda por IP
                  </button>
                  <button
                    onClick={() => setSearchType('query')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      searchType === 'query' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    Búsqueda General
                  </button>
                </div>

                {/* Campo de búsqueda */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchShodan()}
                    placeholder={
                      searchType === 'ip' 
                        ? "Ingresa una IP (ej: 8.8.8.8)" 
                        : "Ingresa tu búsqueda (ej: apache)"
                    }
                    className="p-3 border rounded-lg flex-1 text-lg bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                  />
                  <button
                    onClick={searchShodan}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 text-lg font-medium"
                  >
                    {loading ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>

                {error && (
                  <p className="text-red-400 mt-2 font-medium">{error}</p>
                )}

                {/* Ejemplos */}
                <div className="mt-4">
                  <p className="text-sm text-gray-300 mb-2 font-medium">
                    {searchType === 'ip' ? 'IPs de ejemplo:' : 'Búsquedas de ejemplo:'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(searchType === 'ip' ? EXAMPLE_IPS : FREE_QUERIES).map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(searchType === 'ip' ? example.ip : example.query)}
                        className="text-sm bg-gray-700 text-white px-3 py-1 rounded-full hover:bg-gray-600"
                      >
                        {example.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Panel derecho - Resultados */}
              <div style={{ width: '60%' }}>
                {loading && (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-white text-lg">Buscando...</p>
                  </div>
                )}
                
                {result && !loading && (
                  <div className="border border-gray-600 p-6 rounded-lg bg-gray-800 shadow-sm">
                    {searchType === 'ip' ? (
                      <>
                        <p className="text-2xl font-semibold mb-4 text-white">
                          Información de {result.ip_str}
                        </p>
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h3 className="font-bold text-white">Información General</h3>
                            <p className="text-gray-300">
                              <span className="font-medium">Organización:</span> {result.org || 'No disponible'}
                            </p>
                            <p className="text-gray-300">
                              <span className="font-medium">ISP:</span> {result.isp || 'No disponible'}
                            </p>
                            <p className="text-gray-300">
                              <span className="font-medium">País:</span> {result.country_name || 'No disponible'}
                            </p>
                            <p className="text-gray-300">
                              <span className="font-medium">Ciudad:</span> {result.city || 'No disponible'}
                            </p>
                          </div>
                          {result.ports && result.ports.length > 0 && (
                            <div className="space-y-2">
                              <h3 className="font-bold text-white">Puertos Abiertos</h3>
                              <p className="text-gray-300">{result.ports.join(', ')}</p>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <h2 className="text-2xl font-semibold mb-4 text-white">
                          Resultados de búsqueda
                        </h2>
                        {result.matches && result.matches.length > 0 ? (
                          <div className="space-y-4">
                            {result.matches.map((match, index) => (
                              <div key={index} className="border-b border-gray-600 pb-4">
                                <p className="font-medium text-white">IP: {match.ip_str}</p>
                                <p className="text-gray-300">Puerto: {match.port}</p>
                                {match.org && <p className="text-gray-300">Organización: {match.org}</p>}
                                {match.location && <p className="text-gray-300">Ubicación: {match.location.country_name}</p>}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-300">No se encontraron resultados</p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        }/>
      </div>
      <ButtonChat chat="nmap"/>
    </div>
  );
}