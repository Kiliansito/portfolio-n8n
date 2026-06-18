import { NextResponse } from "next/server";

type LeadInput = {
  nombre?: unknown;
  email?: unknown;
  telefono?: unknown;
  tipo_negocio?: unknown;
  mensaje?: unknown;
  presupuesto?: unknown;
  prioridad?: unknown;
};

type ValidLead = {
  nombre: string;
  email: string;
  telefono: string;
  tipo_negocio: string;
  mensaje: string;
  presupuesto: number;
  prioridad: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getStringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validateLead(body: LeadInput): {
  valid: boolean;
  lead?: ValidLead;
  errors?: string[];
} {
  const errors: string[] = [];

  const nombre = getStringValue(body.nombre);
  const email = getStringValue(body.email);
  const telefono = getStringValue(body.telefono);
  const tipo_negocio = getStringValue(body.tipo_negocio);
  const mensaje = getStringValue(body.mensaje);
  const prioridad = getStringValue(body.prioridad);

  const presupuesto = Number(body.presupuesto);

  if (!nombre) {
    errors.push("El nombre es obligatorio.");
  }

  if (!email) {
    errors.push("El email es obligatorio.");
  } else if (!isValidEmail(email)) {
    errors.push("El email no tiene un formato válido.");
  }

  if (!telefono) {
    errors.push("El teléfono es obligatorio.");
  }

  if (!tipo_negocio) {
    errors.push("El tipo de negocio es obligatorio.");
  }

  if (!mensaje) {
    errors.push("El mensaje es obligatorio.");
  }

  if (!Number.isFinite(presupuesto)) {
    errors.push("El presupuesto debe ser un número.");
  } else if (presupuesto < 0) {
    errors.push("El presupuesto no puede ser negativo.");
  }

  if (!prioridad) {
    errors.push("La prioridad es obligatoria.");
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
    lead: {
      nombre,
      email,
      telefono,
      tipo_negocio,
      mensaje,
      presupuesto,
      prioridad,
    },
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = validateLead(body);

    if (!validation.valid || !validation.lead) {
      return NextResponse.json(
        {
          error: "Datos del formulario no válidos",
          details: validation.errors,
        },
        { status: 400 }
      );
    }

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
      body: JSON.stringify(validation.lead),
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