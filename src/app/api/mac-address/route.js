import { NextResponse } from "next/server";

const MAC_API_KEY = process.env.WHOISXML_API_KEY;
const API_BASE_URL = 'https://mac-address.whoisxmlapi.com/api/v1';

// Función auxiliar para validar MAC address
const isValidMac = (mac) => {
  // Acepta MACs con o sin delimitadores
  const macRegex = /^([0-9A-Fa-f]{2}[:-]?){5}([0-9A-Fa-f]{2})$/;
  return macRegex.test(mac);
};

const buildQueryParams = (mac) => {
  return new URLSearchParams({
    apiKey: MAC_API_KEY,
    macAddress: mac,
    outputFormat: 'JSON'
  }).toString();
};

export async function GET(request) {
  try {
    if (!MAC_API_KEY) {
      return NextResponse.json(
        { error: "Error de configuración: API Key no encontrada" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const mac = searchParams.get("mac")?.trim();

    if (!mac) {
      return NextResponse.json(
        { error: "Se requiere una dirección MAC" },
        { status: 400 }
      );
    }

    if (!isValidMac(mac)) {
      return NextResponse.json(
        { error: "Formato de dirección MAC no válido" },
        { status: 400 }
      );
    }

    const url = `${API_BASE_URL}?${buildQueryParams(mac)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la respuesta de la API');
    }

    // Si no hay datos en la respuesta
    if (!data || !data.vendorDetails) {
      return NextResponse.json(
        { error: "No se encontró información para esta dirección MAC" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Error en la API:", error);
    return NextResponse.json(
      { 
        error: "Error al procesar la solicitud",
        details: error.message
      },
      { status: 500 }
    );
  }
}