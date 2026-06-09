import nodemailer from 'nodemailer';

function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
}

function createTransport() {
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASSWORD
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<'sent' | 'logged'> {
  const subject = 'Restablecer contraseña - Quiniela Mundial 2026';
  const text = [
    'Recibimos una solicitud para restablecer tu contraseña.',
    '',
    'Si fuiste tú, abre este enlace (válido 1 hora):',
    resetUrl,
    '',
    'Si no solicitaste el cambio, ignora este correo.',
  ].join('\n');

  if (!isSmtpConfigured()) {
    console.log(`[password-reset] SMTP no configurado. Enlace para ${to}:`);
    console.log(resetUrl);
    return 'logged';
  }

  const transport = createTransport();
  await transport.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
    html: `
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <p><a href="${resetUrl}">Restablecer contraseña</a></p>
      <p>El enlace expira en 1 hora. Si no solicitaste el cambio, ignora este correo.</p>
    `,
  });

  return 'sent';
}
