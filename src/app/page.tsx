"use client";

import { useState, type FormEvent } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

const useCases = [
  "Clínicas",
  "Restaurantes",
  "Gimnasios",
  "Academias",
  "Inmobiliarias",
  "Peluquerías",
];

const benefits = [
  {
    title: "No perder solicitudes",
    text: "Cada lead queda guardado automáticamente en Google Sheets.",
  },
  {
    title: "Priorizar clientes buenos",
    text: "Los leads con mayor presupuesto se detectan y notifican por Gmail.",
  },
  {
    title: "Automatizar tareas repetidas",
    text: "El negocio no tiene que copiar datos manualmente ni revisar formularios todo el día.",
  },
];

const flowSteps = [
  "Formulario web",
  "API interna Next.js",
  "Webhook n8n",
  "Google Sheets",
  "Gmail si es prioritario",
];

export default function Home() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessages([]);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const lead = {
  nombre: formData.get("nombre"),
  email: formData.get("email"),
  telefono: formData.get("telefono"),
  tipo_negocio: formData.get("tipo_negocio"),
  mensaje: formData.get("mensaje"),
  presupuesto: Number(formData.get("presupuesto")),
  prioridad: formData.get("prioridad"),
  website: formData.get("website"),
};

    if (isDemoMode) {
      console.log("Lead recibido en modo demo:", lead);
      setStatus("success");
      form.reset();
      return;
    }

    try {
     const response = await fetch("/api/lead", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(lead),
});

const data = await response.json();

if (!response.ok) {
  const details = Array.isArray(data.details)
    ? data.details
    : ["Ha ocurrido un error enviando el formulario."];

  setErrorMessages(details);
  setStatus("error");
  return;
}

setStatus("success");
form.reset();
    } catch (error) {
  console.error(error);
  setErrorMessages([
    "No se ha podido conectar con el servidor. Comprueba que la web y n8n están activos.",
  ]);
  setStatus("error");
}
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Webs + Automatizaciones con IA
            </p>

            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Captura leads y automatiza respuestas para pequeños negocios.
            </h1>

            <p className="mb-8 max-w-xl text-lg text-slate-300">
              Demo práctica de una web conectada a n8n que recibe solicitudes,
              las guarda en Google Sheets y avisa por Gmail cuando un lead tiene
              alto presupuesto.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#formulario"
                className="rounded-xl bg-cyan-400 px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Probar formulario
              </a>

              <a
                href="#flujo"
                className="rounded-xl border border-white/15 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Ver cómo funciona
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Flujo de la demo
            </p>

            <div className="space-y-3">
              {flowSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/80 p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950">
                    {index + 1}
                  </div>

                  <div>
                    <p className="font-semibold">{step}</p>
                    <p className="text-sm text-slate-400">
                      {index === 0 && "El cliente rellena sus datos."}
                      {index === 1 && "La web procesa el envío de forma segura."}
                      {index === 2 && "n8n recibe el lead y ejecuta el workflow."}
                      {index === 3 && "El lead queda registrado automáticamente."}
                      {index === 4 && "Solo se avisa si el presupuesto es alto."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/60 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Problema
          </p>

          <h2 className="mb-6 max-w-3xl text-3xl font-bold md:text-4xl">
            Muchos negocios pierden clientes porque gestionan las solicitudes de
            forma manual.
          </h2>

          <p className="max-w-3xl text-lg text-slate-300">
            Un cliente pide información, nadie responde rápido, los datos se
            pierden en mensajes sueltos o no queda claro qué oportunidades son
            más importantes. Esta demo resuelve ese flujo básico con una web y
            una automatización.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Solución
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="mb-3 text-xl font-bold">{benefit.title}</h3>
                <p className="text-slate-300">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="flujo" className="bg-slate-900/60 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Arquitectura técnica
          </p>

          <h2 className="mb-8 text-3xl font-bold md:text-4xl">
            Así funciona por dentro.
          </h2>

          <div className="grid gap-4 md:grid-cols-5">
            {flowSteps.map((step, index) => (
              <div
                key={step}
                className="rounded-3xl border border-white/10 bg-slate-950 p-5"
              >
                <p className="mb-4 text-3xl font-bold text-cyan-400">
                  0{index + 1}
                </p>
                <h3 className="font-semibold">{step}</h3>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="mb-3 font-semibold">Regla principal del workflow:</p>

            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-300">
{`IF presupuesto >= 500
├── Lead prioritario → Google Sheets + Gmail
└── Lead normal → Google Sheets`}
            </pre>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Casos de uso
          </p>

          <h2 className="mb-8 text-3xl font-bold md:text-4xl">
            Aplicable a negocios locales que reciben solicitudes.
          </h2>

          <div className="flex flex-wrap gap-3">
            {useCases.map((useCase) => (
              <span
                key={useCase}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-slate-200"
              >
                {useCase}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="formulario" className="bg-slate-900/60 px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Prueba la demo
            </p>

            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Envía un lead de prueba.
            </h2>

            <p className="mb-6 text-lg text-slate-300">
              En local, este formulario conecta con n8n, Google Sheets y Gmail.
              En Vercel está en modo demo hasta desplegar n8n en un VPS.
            </p>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
              <p className="mb-2 font-semibold text-white">Prueba recomendada:</p>
              <p>
                Usa un presupuesto de <strong>1200 €</strong> para probar el
                camino de lead prioritario.
              </p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-white p-6 text-slate-950 shadow-2xl"
          >
            <div className="absolute left-[-9999px]" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <h2 className="mb-2 text-2xl font-bold">Solicita tu demo</h2>
            <h2 className="mb-2 text-2xl font-bold">Solicita tu demo</h2>
            <p className="mb-6 text-sm text-slate-600">
              Rellena el formulario y la automatización procesará el lead.
            </p>

            <div className="grid gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Nombre</label>
                <input
                  name="nombre"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
                  placeholder="Clínica Dental Sonrisa Plus"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
                  placeholder="contacto@negocio.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Teléfono
                </label>
                <input
                  name="telefono"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
                  placeholder="+34600000000"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tipo de negocio
                </label>
                <input
                  name="tipo_negocio"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
                  placeholder="Restaurante, clínica, gimnasio..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Presupuesto aproximado
                </label>
                <input
                  name="presupuesto"
                  type="number"
                  required
                  min="0"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
                  placeholder="1200"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Prioridad
                </label>
                <select
                  name="prioridad"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
                  defaultValue="Media"
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Mensaje
                </label>
                <textarea
                  name="mensaje"
                  required
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
                  placeholder="Quiero una web con formulario, WhatsApp y automatización de leads..."
                />
              </div>

              <button
                disabled={status === "loading"}
                className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? "Enviando..." : "Enviar solicitud"}
              </button>

              {status === "success" && (
                <p className="rounded-xl bg-green-100 px-4 py-3 text-sm font-medium text-green-800">
                  {isDemoMode
                    ? "Demo enviada correctamente. En producción este formulario conectará con n8n, Google Sheets y Gmail."
                    : "Solicitud enviada correctamente."}
                </p>
              )}

              {status === "error" && (
  <div className="rounded-xl bg-red-100 px-4 py-3 text-sm font-medium text-red-800">
    <p className="mb-2">No se ha podido enviar el formulario:</p>

    <ul className="list-disc space-y-1 pl-5">
      {errorMessages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  </div>
)}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}