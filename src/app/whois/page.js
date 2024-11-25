"use client";
import "../App.css";
import Side from "../components/Side";
import Nav from "../components/Nav";
import Content from "../components/Content";
import ButtonChat from "../components/ButtonChat";
import { useState } from 'react';

export default function WhoisPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchType, setSearchType] = useState('domain'); // domain, ip, email

  const EXAMPLE_QUERIES = {
    domain: [
      { text: 'Google', value: 'google.com' },
      { text: 'Microsoft', value: 'microsoft.com' },
      { text: 'Amazon', value: 'amazon.com' },
    ],
    ip: [
      { text: 'Google DNS', value: '8.8.8.8' },
      { text: 'Cloudflare', value: '1.1.1.1' },
      { text: 'OpenDNS', value: '208.67.222.222' },
    ],
    email: [
      { text: 'Example', value: 'example@domain.com' },
      { text: 'Support', value: 'support@company.com' },
      { text: 'Info', value: 'info@business.com' },
    ]
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? 'No disponible'
      : date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
  };

  const formatStatus = (status) => {
    if (!status) return 'No disponible';
    if (Array.isArray(status)) {
      return status.map(s => s.toLowerCase()).join(', ');
    }
    return status.toLowerCase();
  };

  const searchWhois = async (hardRefresh = false) => {
    if (!query.trim()) {
      setError('Por favor ingresa un dominio, IP o email para buscar');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const params = new URLSearchParams({
        domain: query.trim(),
        _hardRefresh: hardRefresh ? '1' : '0',
        preferFresh: '1',
        da: '2',
        checkProxyData: '1'
      });

      const response = await fetch(`/api/whois?${params}`);
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
                <div className="flex flex-col gap-4 items-center">
                  {/* Selector de tipo de búsqueda */}
                  <div className="flex gap-4 mb-2">
                    <button
                      onClick={() => setSearchType('domain')}
                      className={`px-4 py-2 rounded-lg ${
                        searchType === 'domain' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      Dominio
                    </button>
                    <button
                      onClick={() => setSearchType('ip')}
                      className={`px-4 py-2 rounded-lg ${
                        searchType === 'ip' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      IP
                    </button>
                    <button
                      onClick={() => setSearchType('email')}
                      className={`px-4 py-2 rounded-lg ${
                        searchType === 'email' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      Email
                    </button>
                  </div>

                  {/* Barra de búsqueda */}
                  <div className="flex gap-4 w-full justify-center">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchWhois()}
                      placeholder={
                        searchType === 'domain' ? "Ingresa un dominio (ej: google.com)" :
                        searchType === 'ip' ? "Ingresa una IP (ej: 8.8.8.8)" :
                        "Ingresa un email (ej: example@domain.com)"
                      }
                      className="p-3 border rounded-lg w-96 text-lg bg-gray-800 text-white border-gray-600
                      placeholder-gray-400"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => searchWhois()}
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 text-lg font-medium"
                      >
                        {loading ? 'Buscando...' : 'Buscar'}
                      </button>
                      <button
                        onClick={() => searchWhois(true)}
                        disabled={loading}
                        title="Forzar actualización de datos"
                        className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 disabled:bg-gray-600 text-lg font-medium"
                      >
                        🔄
                      </button>
                    </div>
                  </div>

                  {/* Ejemplos */}
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-300 mb-2">
                      Ejemplos de {
                        searchType === 'domain' ? 'dominios' :
                        searchType === 'ip' ? 'IPs' :
                        'emails'
                      }:
                    </p>
                    <div className="flex gap-2">
                      {EXAMPLE_QUERIES[searchType].map((example, index) => (
                        <button
                          key={index}
                          onClick={() => setQuery(example.value)}
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
              </div>

              {result && !loading && (
                <div className="border border-gray-600 p-6 rounded-lg bg-gray-800 shadow-lg">
                  <h2 className="text-2xl font-semibold mb-6 text-white">
                    Información de {result.domainName}
                  </h2>
                  
                  <div className="grid gap-6">
                    {/* Información General */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-white text-lg border-b border-gray-600 pb-2">
                        Información General
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <p className="text-gray-300">
                          <span className="font-medium">Registrador:</span> {result.registrar?.name || 'No disponible'}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">ID IANA:</span> {result.registrar?.ianaId || 'No disponible'}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">URL Registrador:</span> {result.registrar?.url || 'No disponible'}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Estado:</span> {formatStatus(result.status)}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Creado:</span> {formatDate(result.dates?.created)}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Actualizado:</span> {formatDate(result.dates?.updated)}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Expira:</span> {formatDate(result.dates?.expires)}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Disponibilidad:</span> {result.domainAvailability}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Proxy/Whois Guard:</span> {
                            result.proxy?.isProxy 
                              ? `Sí (${result.proxy?.provider || 'Proveedor no especificado'})`
                              : 'No'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Servidores de Nombres */}
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

                    {/* Direcciones IP */}
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

                    {/* Información de Registro */}
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
                          {result.registrant.state && (
                            <p className="text-gray-300">
                              <span className="font-medium">Estado/Provincia:</span> {result.registrant.state}
                            </p>
                          )}
                          {result.registrant.city && (
                            <p className="text-gray-300">
                              <span className="font-medium">Ciudad:</span> {result.registrant.city}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Información de Contactos */}
                    {(result.contacts?.admin || result.contacts?.technical) && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-white text-lg border-b border-gray-600 pb-2">
                          Información de Contactos
                        </h3>
                        <div className="grid gap-4">
                          {result.contacts.admin && (
                            <div>
                              <h4 className="text-white font-medium mb-2">Contacto Administrativo:</h4>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-gray-300">
                                <p>Organización: {result.contacts.admin.organization || 'No disponible'}</p>
                                <p>País: {result.contacts.admin.country || 'No disponible'}</p>
                              </div>
                            </div>
                          )}
                          {result.contacts.technical && (
                            <div>
                              <h4 className="text-white font-medium mb-2">Contacto Técnico:</h4>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-gray-300">
                                <p>Organización: {result.contacts.technical.organization || 'No disponible'}</p>
                                <p>País: {result.contacts.technical.country || 'No disponible'}</p>
                              </div>
                            </div>
                          )}
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
      <ButtonChat chat="whois"/>
    </div>
  );
}