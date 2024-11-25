import { NextResponse } from "next/server";

const WHOISXML_API_KEY = process.env.WHOISXML_API_KEY;
const API_BASE_URL = 'https://www.whoisxmlapi.com/whoisserver/WhoisService';

// Función auxiliar para validar entrada
const isValidInput = (input) => {
  // Validar IP v4
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  // Validar dominio
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9](\.[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])*\.[a-zA-Z]{2,}$/;
  
  return ipv4Regex.test(input) || domainRegex.test(input);
};

const buildQueryParams = (query) => {
  const params = new URLSearchParams({
    apiKey: WHOISXML_API_KEY,
    domainName: query,
    outputFormat: 'JSON',
    ip: '1',
    checkProxyData: '1',
    da: '2',
    preferFresh: '1'
  });

  return params.toString();
};

export async function GET(request) {
  try {
    if (!WHOISXML_API_KEY) {
      return NextResponse.json(
        { error: "Error de configuración: API Key no encontrada" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("domain")?.trim();

    if (!query) {
      return NextResponse.json(
        { error: "Se requiere un dominio o IP válido" },
        { status: 400 }
      );
    }

    if (!isValidInput(query)) {
      return NextResponse.json(
        { error: "El formato de entrada no es válido" },
        { status: 400 }
      );
    }

    const url = `${API_BASE_URL}?${buildQueryParams(query)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la respuesta de la API');
    }

    if (!data || !data.WhoisRecord) {
      return NextResponse.json(
        { error: "No se encontró información para esta consulta" },
        { status: 404 }
      );
    }

    const whoisRecord = data.WhoisRecord;
    const formattedResponse = {
      domainName: whoisRecord.domainName,
      domainAvailability: whoisRecord.domainAvailability || 'UNAVAILABLE',
      registrar: whoisRecord.registrarName,
      registrarIANAID: whoisRecord.registrarIANAID,
      registrarUrl: whoisRecord.registrarURL,
      createdDate: whoisRecord.createdDate,
      updatedDate: whoisRecord.updatedDate,
      expiresDate: whoisRecord.expiresDate,
      status: whoisRecord.status,
      nameServers: whoisRecord.nameServers?.hostNames || [],
      ips: whoisRecord.ips || [],
      isProxy: whoisRecord.privateWhoisProxy?.isProxy || false,
      registrant: whoisRecord.registryData?.registrant || whoisRecord.registrant,
      contacts: {
        admin: whoisRecord.registryData?.administrativeContact || whoisRecord.administrativeContact,
        technical: whoisRecord.registryData?.technicalContact || whoisRecord.technicalContact
      }
    };

    return NextResponse.json(formattedResponse);

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