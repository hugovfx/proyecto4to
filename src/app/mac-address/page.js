"use client";
import "../App.css";
import Side from "../components/Side";
import Nav from "../components/Nav";
import Content from "../components/Content";
import { useState } from 'react';

export default function MacAddressPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const EXAMPLE_MACS = [
    { text: 'Apple', mac: '00:03:93:00:00:00' },
    { text: 'Intel', mac: '00:02:B3:00:00:00' },
    { text: 'Cisco', mac: '00:00:0C:00:00:00' },
  ];

  const searchMacAddress = async () => {
    if (!query.trim()) {
      setError('Por favor ingresa una dirección MAC');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/mac-address?mac=${encodeURIComponent(query)}`);
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
        <Content name={"Búsqueda MAC Address"} info={
          <div style={{ padding: '20px' }}>
            <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
              <div className="flex flex-col space-y-4">
                <div className="flex gap-4 justify-center">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchMacAddress()}
                    placeholder="Ingresa una dirección MAC (ej: 00:00:5E:00:53:AF)"
                    className="p-3 border rounded-lg w-96 text-lg bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                  />
                  <button
                    onClick={searchMacAddress}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 text-lg font-medium"
                  >
                    {loading ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>

                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-300 mb-2">
                    MACs de ejemplo:
                  </p>
                  <div className="flex gap-2">
                    {EXAMPLE_MACS.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(example.mac)}
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
                    Información de MAC Address: {result.macAddress}
                  </h2>
                  
                  <div className="grid gap-6">
                    <div className="space-y-4">
                      <h3 className="font-bold text-white text-lg border-b border-gray-600 pb-2">
                        Detalles del Fabricante
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <p className="text-gray-300">
                          <span className="font-medium">Compañía:</span> {result.vendorDetails.companyName || 'No disponible'}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Dirección:</span> {result.vendorDetails.companyAddress || 'No disponible'}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">País:</span> {result.vendorDetails.countryCode || 'No disponible'}
                        </p>
                        {result.vendorDetails.companyUrl && (
                          <p className="text-gray-300">
                            <span className="font-medium">Sitio Web:</span> {result.vendorDetails.companyUrl}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-bold text-white text-lg border-b border-gray-600 pb-2">
                        Detalles del Registro
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <p className="text-gray-300">
                          <span className="font-medium">Bloque MAC:</span> {result.blockDetails?.blockFound ? result.blockDetails.borderLeft + ' - ' + result.blockDetails.borderRight : 'No disponible'}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Tipo de Asignación:</span> {result.blockDetails?.assignmentBlockSize || 'No disponible'}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Fecha de Registro:</span> {result.blockDetails?.dateCreated || 'No disponible'}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Última Actualización:</span> {result.blockDetails?.dateUpdated || 'No disponible'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        }/>
      </div>
    </div>
  );
}