import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: "N8N_WEBHOOK_URL no está configurada" },
        { status: 500 }
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error enviando el lead a n8n" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Lead enviado correctamente",
    });
  } catch (error) {
    console.error("Error en /api/lead:", error);

    return NextResponse.json(
      { error: "Error interno procesando el lead" },
      { status: 500 }
    );
  }
}