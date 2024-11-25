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

    if (!includeTerms || !validateSearchTerms(includeTerms)) {
      return NextResponse.json(
        { error: "Se requieren términos de búsqueda válidos (máximo 4)" },
        { status: 400 }
      );
    }

    const requestBody = {
      apiKey: API_KEY,
      outputFormat: 'JSON'
    };

    // Asegurarnos de que los términos tengan el formato correcto
    const formattedIncludeTerms = includeTerms.map(term => 
      term.includes('*') ? term : `*${term}*`
    );

    if (searchType === 'domains') {
      requestBody.domains = {
        include: formattedIncludeTerms
      };
    } else if (searchType === 'subdomains') {
      requestBody.subdomains = {
        include: formattedIncludeTerms,
        exclude: excludeTerms && validateSearchTerms(excludeTerms) ? excludeTerms : []
      };
    } else if (searchType === 'both') {
      const domainsResponse = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: API_KEY,
          outputFormat: 'JSON',
          domains: {
            include: formattedIncludeTerms
          }
        })
      });

      const subdomainsResponse = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: API_KEY,
          outputFormat: 'JSON',
          subdomains: {
            include: formattedIncludeTerms,
            exclude: excludeTerms && validateSearchTerms(excludeTerms) ? excludeTerms : []
          }
        })
      });

      const [domainsData, subdomainsData] = await Promise.all([
        domainsResponse.json(),
        subdomainsResponse.json()
      ]);

      return NextResponse.json({
        domains: domainsData.domainsList || [],
        subdomains: subdomainsData.subdomainsList || [],
        domainsCount: domainsData.domainsCount || 0,
        subdomainsCount: subdomainsData.subdomainsCount || 0
      });
    }

    if (sinceDate) {
      requestBody.sinceDate = sinceDate;
    }

    console.log('Request a API externa:', requestBody);

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log('API Response:', {
      status: response.status,
      data: data
    });

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
