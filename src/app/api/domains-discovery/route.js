import { NextResponse } from "next/server";

const API_KEY = process.env.WHOISXML_API_KEY;
const API_BASE_URL = 'https://domains-subdomains-discovery.whoisxmlapi.com/api/v1';

const validateSearchTerms = (terms) => {
  if (!Array.isArray(terms)) return false;
  if (terms.length === 0 || terms.length > 4) return false;
  return terms.every(term => typeof term === 'string' && term.length > 0);
};

export async function POST(request) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: "Error de configuración: API Key no encontrada" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { searchType, includeTerms, excludeTerms, sinceDate } = body;

    // Validar términos de búsqueda
    if (!includeTerms || !validateSearchTerms(includeTerms)) {
      return NextResponse.json(
        { error: "Se requieren términos de búsqueda válidos (máximo 4)" },
        { status: 400 }
      );
    }

    // Construir el cuerpo de la petición
    const requestBody = {
      apiKey: API_KEY,
      outputFormat: 'JSON'
    };

    // Agregar términos según el tipo de búsqueda
    if (searchType === 'domains' || searchType === 'both') {
      requestBody.domains = {
        include: includeTerms
      };
    }

    if (searchType === 'subdomains' || searchType === 'both') {
      requestBody.subdomains = {
        include: includeTerms
      };
      if (excludeTerms && validateSearchTerms(excludeTerms)) {
        requestBody.subdomains.exclude = excludeTerms;
      }
    }

    // Agregar fecha si está presente
    if (sinceDate) {
      requestBody.sinceDate = sinceDate;
    }

    console.log('Request body:', requestBody); // Para debugging

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la respuesta de la API');
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