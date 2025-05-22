export interface EmailMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (data: EmailMessage): Promise<boolean> => {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'service_84mrsba',
        template_id: 'template_c6u3dvi',
        user_id: 'QAXS_hlgfJQSeZ',
        template_params: {
          to_email: 'digitalnovabkk@gmail.com',
          from_name: data.name,
          from_email: data.email,
          subject: data.subject,
          message: data.message,
        },
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
