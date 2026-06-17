"use client";

import { useState, type FormEvent } from "react";

export default function Home() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

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

      if (!response.ok) {
        throw new Error("Error enviando el formulario");
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Automatización + Webs con IA
            </p>

            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Consigue una web que capture clientes automáticamente.
            </h1>

            <p className="mb-8 max-w-xl text-lg text-slate-300">
              Creo páginas web, formularios inteligentes y automatizaciones para
              pequeños negocios. Tus leads se guardan automáticamente y recibes
              avisos cuando un cliente tiene alto presupuesto.
            </p>

            <div className="grid gap-4 text-sm text-slate-300 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <strong className="block text-white">Web profesional</strong>
                Landing clara y preparada para vender.
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <strong className="block text-white">Leads en Sheets</strong>
                Datos guardados automáticamente.
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <strong className="block text-white">Avisos por Gmail</strong>
                Notificación si el lead es prioritario.
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-white p-6 text-slate-950 shadow-2xl"
          >
            <h2 className="mb-2 text-2xl font-bold">Solicita tu demo</h2>
            <p className="mb-6 text-sm text-slate-600">
              Rellena el formulario y recibiré tu solicitud automáticamente.
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
                <p className="rounded-xl bg-red-100 px-4 py-3 text-sm font-medium text-red-800">
                  Ha ocurrido un error. Comprueba que n8n está activo y
                  escuchando el webhook de test.
                </p>
              )}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}