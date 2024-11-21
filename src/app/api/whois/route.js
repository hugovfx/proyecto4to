import { NextResponse } from "next/server";

const WHOIS_API_KEY = process.env.WHOIS_API_KEY;

export async function POST(request) {
  try {
    const { query } = await request.json();

    if (!WHOIS_API_KEY) {
      console.error("API Key no configurada. Verifica el archivo .env.local");
      return NextResponse.json(
        { error: "Error interno: API Key no configurada" },
        { status: 500 }
      );
    }

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Por favor, proporciona un dominio válido (e.g., example.com)." },
        { status: 400 }
      );
    }

    const apiUrl = `https://api.api-ninjas.com/v1/whois?domain=${query}`;
    console.log("Enviando solicitud a la API externa:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: { "X-Api-Key": WHOIS_API_KEY },
    });

    console.log("Estado de la respuesta:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Error en la solicitud a la API WHOIS:",
        response.status,
        response.statusText,
        errorText
      );
      return NextResponse.json(
        { error: "Error al obtener datos de la API WHOIS." },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Datos recibidos de la API externa:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error interno del servidor:", error.message);
    return NextResponse.json(
      { error: "Error interno del servidor. Intenta más tarde." },
      { status: 500 }
    );
  }
}
