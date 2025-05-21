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
        service_id: 'YOUR_SERVICE_ID',
        template_id: 'YOUR_TEMPLATE_ID',
        user_id: 'YOUR_USER_ID',
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
