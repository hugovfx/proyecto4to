"use client";
import "../App.css";
import Side from "../components/Side";
import Nav from "../components/Nav";
import Content from "../components/Content";
import ButtonChat from "../components/ButtonChat";
import { useState } from 'react';

export default function DomainsDiscoveryPage() {
  const [searchType, setSearchType] = useState('domains');
  const [includeTerms, setIncludeTerms] = useState('');
  const [excludeTerms, setExcludeTerms] = useState('');
  const [sinceDate, setSinceDate] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const EXAMPLE_SEARCHES = [
    { text: 'Amazon Domains', terms: 'amazon.*', type: 'domains' },
    { text: 'AWS Cloud', terms: '*aws*,*cloud*', type: 'subdomains' },
    { text: 'Google Sites', terms: 'google.*', type: 'both' },
    { text: 'Microsoft Services', terms: '*microsoft*,*azure*', type: 'subdomains' },
    { text: 'Cloud Platforms', terms: '*cloud*,*platform*', type: 'subdomains' },
    { text: 'Email Services', terms: '*mail*,*email*', type: 'subdomains' },
    { text: 'Development', terms: '*dev*,*api*', type: 'subdomains' },
    { text: 'UACH', terms: '*uach*', type: 'subdomains' }
  ];

  // Función para preparar términos de búsqueda
  const prepareSearchTerm = (term) => {
    if (!term.includes('*') && !term.includes('.')) {
      return `*${term}*`;
    }
    return term;
  };

  const searchDomains = async () => {
    if (!includeTerms.trim()) {
      setError('Por favor ingresa al menos un término de búsqueda');
      return;
    }

    const includeArray = includeTerms
      .split(',')
      .map(term => term.trim())
      .filter(term => term)
      .map(prepareSearchTerm);

    const excludeArray = excludeTerms
      ? excludeTerms
          .split(',')
          .map(term => term.trim())
          .filter(term => term)
          .map(prepareSearchTerm)
      : [];

    if (includeArray.length > 4) {
      setError('Máximo 4 términos de búsqueda permitidos');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      console.log('Enviando búsqueda:', {
        searchType,
        includeTerms: includeArray,
        excludeTerms: excludeArray,
        sinceDate: sinceDate || undefined
      });

      const response = await fetch('/api/domains-discovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchType,
          includeTerms: includeArray,
          excludeTerms: excludeArray,
          sinceDate: sinceDate || undefined
        })
      });

      const data = await response.json();
      console.log('Datos recibidos:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error al realizar la búsqueda');
      }

      setResult({
        domains: data.domainsList || [],
        subdomains: data.subdomainsList || [],
        domainsCount: data.domainsCount || 0,
        subdomainsCount: data.subdomainsCount || 0
      });
    } catch (error) {
      console.error('Error:', error);
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
        <Content name={"Búsqueda de Dominios y Subdominios"} info={
          <div style={{ padding: '20px' }}>
            <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setSearchType('domains')}
                    className={`px-4 py-2 rounded-lg ${
                      searchType === 'domains' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    Solo Dominios
                  </button>
                  <button
                    onClick={() => setSearchType('subdomains')}
                    className={`px-4 py-2 rounded-lg ${
                      searchType === 'subdomains' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    Solo Subdominios
                  </button>
                  <button
                    onClick={() => setSearchType('both')}
                    className={`px-4 py-2 rounded-lg ${
                      searchType === 'both' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    Ambos
                  </button>
                </div>
                <div className="flex flex-col space-y-4">
                  <input
                    type="text"
                    value={includeTerms}
                    onChange={(e) => setIncludeTerms(e.target.value)}
                    placeholder="Términos a incluir (separados por comas, máx. 4)"
                    className="p-3 border rounded-lg text-lg bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                  />
                  
                  <input
                    type="text"
                    value={excludeTerms}
                    onChange={(e) => setExcludeTerms(e.target.value)}
                    placeholder="Términos a excluir (separados por comas, máx. 4)"
                    className="p-3 border rounded-lg text-lg bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                  />

                  <input
                    type="date"
                    value={sinceDate}
                    onChange={(e) => setSinceDate(e.target.value)}
                    className="p-3 border rounded-lg text-lg bg-gray-800 text-white border-gray-600"
                  />

                  <button
                    onClick={searchDomains}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 text-lg font-medium"
                  >
                    {loading ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-300 mb-2">
                    Búsquedas de ejemplo:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {EXAMPLE_SEARCHES.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchType(example.type);
                          setIncludeTerms(example.terms);
                        }}
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
                    Resultados de la búsqueda
                  </h2>
                  
                  <div className="grid gap-6">
                    {result.domains && result.domains.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-white text-lg border-b border-gray-600 pb-2">
                          Dominios Encontrados ({result.domains.length})
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                          {result.domains.map((domain, index) => (
                            <p key={index} className="text-gray-300">{domain}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.subdomains && result.subdomains.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-bold text-white text-lg border-b border-gray-600 pb-2">
                          Subdominios Encontrados ({result.subdomains.length})
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                          {result.subdomains.map((subdomain, index) => (
                            <p key={index} className="text-gray-300">{subdomain}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-gray-400 text-sm">
                      Total encontrado: {
                        (result.domains?.length || 0) + 
                        (result.subdomains?.length || 0)
                      } resultados
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        }/>
      </div>
      <ButtonChat chat="domain"/>
    </div>
  );
}