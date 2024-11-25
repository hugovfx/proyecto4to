import { NextResponse } from "next/server";

const WHOISXML_API_KEY = process.env.WHOISXML_API_KEY;
const API_BASE_URL = 'https://www.whoisxmlapi.com/whoisserver/WhoisService';

const validateInput = (input) => {
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(input)) return true;

  // Validar IP v4
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(input)) {
    const octets = input.split('.');
    return octets.every(octet => {
      const num = parseInt(octet);
      return num >= 0 && num <= 255;
    });
  }

  // Validar IP v6
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^::1$|^([0-9a-fA-F]{1,4}:){1,7}:$|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$/;
  if (ipv6Regex.test(input)) return true;

  // Validar dominio
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(input) && input.length <= 253;
};

const normalizeInput = (input) => {
  return input.toLowerCase().trim();
};

const validateOptionalParams = (params) => {
  const booleanParams = ['preferFresh', 'ip', 'ipWhois', 'checkProxyData', 
                        'thinWhois', 'ignoreRawTexts', 'multiIdIana', '_parse', '_hardRefresh'];
  const numericParams = ['da'];
  
  booleanParams.forEach(param => {
    if (params[param] !== undefined) {
      params[param] = params[param] === 'true' || params[param] === '1' ? '1' : '0';
    }
  });

  numericParams.forEach(param => {
    if (params[param] !== undefined) {
      params[param] = ['0', '1', '2'].includes(params[param]) ? params[param] : '0';
    }
  });

  if (params.outputFormat && !['JSON', 'XML'].includes(params.outputFormat.toUpperCase())) {
    params.outputFormat = 'JSON';
  }

  return params;
};

const buildQueryParams = (query, searchParams) => {
  const validatedParams = validateOptionalParams({
    domainName: query,
    outputFormat: 'JSON',
    preferFresh: searchParams.get('preferFresh') || '1',
    da: searchParams.get('da') || '2',
    ip: searchParams.get('ip') || '1',
    ipWhois: searchParams.get('ipWhois') || '1',
    checkProxyData: searchParams.get('checkProxyData') || '1',
    thinWhois: searchParams.get('thinWhois') || '0',
    ignoreRawTexts: searchParams.get('ignoreRawTexts') || '0',
    multiIdIana: searchParams.get('multiIdIana') || '1',
    _parse: searchParams.get('_parse') || '0',
    _hardRefresh: searchParams.get('_hardRefresh') || '0'
  });

  const params = new URLSearchParams({
    apiKey: WHOISXML_API_KEY,
    ...validatedParams
  });

  return params.toString();
};

const processWhoisResponse = (data) => {
  const whoisRecord = data.WhoisRecord;
  
  return {
    domainName: whoisRecord.domainName,
    domainAvailability: whoisRecord.domainAvailability || 'UNAVAILABLE',
    registrar: {
      name: whoisRecord.registrarName,
      ianaId: whoisRecord.registrarIANAID,
      url: whoisRecord.registrarURL,
      abuse: whoisRecord.registrarAbuseInfo || null
    },
    dates: {
      created: whoisRecord.createdDate,
      updated: whoisRecord.updatedDate,
      expires: whoisRecord.expiresDate
    },
    status: whoisRecord.status,
    nameServers: whoisRecord.nameServers?.hostNames || [],
    ips: whoisRecord.ips || [],
    proxy: {
      isProxy: whoisRecord.privateWhoisProxy?.isProxy || false,
      provider: whoisRecord.privateWhoisProxy?.provider || null
    },
    registrant: whoisRecord.registryData?.registrant || whoisRecord.registrant,
    contacts: {
      admin: whoisRecord.registryData?.administrativeContact || whoisRecord.administrativeContact,
      technical: whoisRecord.registryData?.technicalContact || whoisRecord.technicalContact
    },
    audit: {
      createdDateTime: whoisRecord.audit?.createdDate,
      updatedDateTime: whoisRecord.audit?.updatedDate
    },
    registry: whoisRecord.registryData ? {
      createdDate: whoisRecord.registryData.createdDate,
      updatedDate: whoisRecord.registryData.updatedDate,
      expiresDate: whoisRecord.registryData.expiresDate,
      status: whoisRecord.registryData.status
    } : null,
    rawTexts: whoisRecord.rawText ? {
      full: whoisRecord.rawText,
      registry: whoisRecord.registryData?.rawText || null,
      registrar: whoisRecord.registrarWHOISServer || null
    } : null
  };
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
    const rawQuery = searchParams.get("domain")?.trim();

    if (!rawQuery) {
      return NextResponse.json(
        { error: "Se requiere un dominio, IP o email válido" },
        { status: 400 }
      );
    }

    const normalizedQuery = normalizeInput(rawQuery);
    
    if (!validateInput(normalizedQuery)) {
      return NextResponse.json(
        { 
          error: "El formato de entrada no es válido",
          details: "Por favor, ingrese una IP válida (v4 o v6), un email o un nombre de dominio válido"
        },
        { status: 400 }
      );
    }

    const url = `${API_BASE_URL}?${buildQueryParams(normalizedQuery, searchParams)}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: {
        revalidate: searchParams.get('_hardRefresh') === '1' ? 0 : 3600
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.WhoisRecord) {
      return NextResponse.json(
        { 
          error: "No se encontró información para esta consulta",
          query: normalizedQuery
        },
        { status: 404 }
      );
    }

    const processedResponse = processWhoisResponse(data);

    const cacheControl = searchParams.get('_hardRefresh') === '1' 
      ? 'no-store, must-revalidate'
      : 'public, max-age=3600, s-maxage=3600';

    return NextResponse.json(processedResponse, {
      headers: {
        'Cache-Control': cacheControl,
        'CDN-Cache-Control': cacheControl,
      }
    });

  } catch (error) {
    console.error("Error en la API:", error);
    return NextResponse.json(
      { 
        error: "Error al procesar la solicitud",
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}