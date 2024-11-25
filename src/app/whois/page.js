"use client";
import "../App.css";
import Side from "../components/Side";
import Nav from "../components/Nav";
import Content from "../components/Content";
import { useState } from 'react';
import ButtonChat from "../components/ButtonChat";
export default function WhoisPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const EXAMPLE_DOMAINS = [
    { text: 'Google', domain: 'google.com' },
    { text: 'Microsoft', domain: 'microsoft.com' },
    { text: 'Facebook', domain: 'facebook.com' },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? 'No disponible'
      : date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
  };

  const formatStatus = (status) => {
    if (!status) return 'No disponible';
    if (Array.isArray(status)) {
      return status.map(s => s.toLowerCase()).join(', ');
    }
    return status.toLowerCase();
  };

  const searchWhois = async () => {
    if (!query.trim()) {
      setError('Por favor ingresa un dominio o IP para buscar');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/whois?domain=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al realizar la búsqueda');
      }

      setResult(data);
    } catch (error) {
      setError(error.message || 'Error de conexión al servidor');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cont1">
      <Side />
      <div className="cont12">
        <Nav />
        <Content name={"Búsqueda WHOIS"} info={
          <div style={{ padding: '20px' }}>
            <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
              <div className="flex flex-col space-y-4">
                <div className="flex gap-4 justify-center">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchWhois()}
                    placeholder="Ingresa un dominio o IP (ej: google.com o 8.8.8.8)"
                    className="p-3 border rounded-lg w-96 text-lg bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                  />
                  <button
                    onClick={searchWhois}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 text-lg font-medium"
                  >
                    {loading ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>

                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-300 mb-2">
                    Dominios de ejemplo:
                  </p>
                  <div className="flex gap-2">
                    {EXAMPLE_DOMAINS.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(example.domain)}
                        className="text-sm bg-gray-700 text-white px-3 py-1 rounded-full hover:bg-gray-600"
                      >
                        {example.text}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-center">{error}</p>
                )}
              </div>

              {result && !loading && (
                <div className="border border-gray-600 p-6 rounded-lg bg-gray-800 shadow-lg">
                  <h2 className="text-2xl font-semibold mb-6 text-white">
                    Información de {result.domainName}
                  </h2>
                  
                  <div className="grid gap-6">
                    <div className="space-y-4">
                      <h3 className="font-bold text-white text-lg border-b border-gray-600 pb-2">
                        Información General
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <p className="text-gray-300">
                          <span className="font-medium">Registrador:</span> {result.registrar || 'No disponible'}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">ID IANA:</span> {result.registrarIANAID || 'No disponible'}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">URL Registrador:</span> {result.registrarUrl || 'No disponible'}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Estado:</span> {formatStatus(result.status)}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Creado:</span> {formatDate(result.createdDate)}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Actualizado:</span> {formatDate(result.updatedDate)}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Expira:</span> {formatDate(result.expiresDate)}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Disponibilidad:</span> {result.domainAvailability}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Proxy/Whois Guard:</span> {result.isProxy ? 'Sí' : 'No'}
                        </p>
                      </div>
                    </div>

                    {result.nameServers && result.nameServers.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-white text-lg border-b border-gray-600 pb-2">
                          Servidores de Nombres
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                          {result.nameServers.map((ns, index) => (
                            <p key={index} className="text-gray-300">{ns.toLowerCase()}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.ips && result.ips.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-white text-lg border-b border-gray-600 pb-2">
                          Direcciones IP
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                          {result.ips.map((ip, index) => (
                            <p key={index} className="text-gray-300">{ip}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.registrant && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-white text-lg border-b border-gray-600 pb-2">
                          Información de Registro
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <p className="text-gray-300">
                            <span className="font-medium">Organización:</span> {result.registrant.organization || 'No disponible'}
                          </p>
                          <p className="text-gray-300">
                            <span className="font-medium">País:</span> {result.registrant.country || 'No disponible'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        }/>
      </div>
      <ButtonChat chat="nmap"/>
    </div>
  );
}