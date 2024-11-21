// app/api/shodan/route.js
import { NextResponse } from "next/server";

const SHODAN_API_KEY = process.env.SHODAN_API_KEY;

export async function POST(request) {
try {
const { query, type } = await request.json();

if (type === "ip") {
// Validar si es una IP
const ipRegex =
/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

if (!ipRegex.test(query)) {
return NextResponse.json(
{
error: "Por favor ingresa una dirección IP válida (ej: 8.8.8.8)",
},
{ status: 400 }
);
}

const response = await fetch(
`https://api.shodan.io/shodan/host/${query}?key=${SHODAN_API_KEY}`
);

const data = await response.json();

if (data.error) {
return NextResponse.json({ error: data.error }, { status: 400 });
}

return NextResponse.json(data);
} else {
// Búsqueda general
const response = await fetch(
`https://api.shodan.io/shodan/host/search?key=${SHODAN_API_KEY}&query=${encodeURIComponent(
query
)}`
);

const data = await response.json();

if (data.error) {
return NextResponse.json({ error: data.error }, { status: 400 });
}

return NextResponse.json(data);
}
} catch (error) {
return NextResponse.json(
{
error: "Error al procesar la solicitud",
},
{ status: 500 }
);
}
}
