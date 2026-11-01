import "server-only";
import nodemailer from "nodemailer";

/** SMTP settings come only from server environment variables, never the browser. */
export function emailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

let transporter: nodemailer.Transporter | null = null;
function transport() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendMail(opts: { to: string; subject: string; rows: [string, string][]; replyTo?: string }) {
  const html = `<table cellpadding="8" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${opts.rows
    .map(([k, v]) => `<tr><td style="border:1px solid #ddd;background:#f4f5f7;font-weight:bold;vertical-align:top">${esc(k)}</td><td style="border:1px solid #ddd;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join("")}</table>`;
  const text = opts.rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  await transport().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: opts.to,
    replyTo: opts.replyTo,
    subject: opts.subject.replace(/[\r\n]+/g, " ").slice(0, 200),
    text,
    html,
  });
}
