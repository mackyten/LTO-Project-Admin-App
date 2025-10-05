import emailjs from "@emailjs/browser";

// Initialize EmailJS with your public key
// Replace 'YOUR_PUBLIC_KEY' with your actual public key from EmailJS dashboard
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

// Example function to send an email
export const sendEmail = async (templateParams: Record<string, unknown>) => {
  console.log("Sending email with params:", templateParams);
  try {
    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    );
    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

// Function to send payment-related emails
export const sendPaymentEmail = async (templateParams: Record<string, unknown>) => {
  console.log("Sending payment email with params:", templateParams);
  try {
    const result = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_PAYMENTID,
      templateParams
    );
    console.log("Payment email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to send payment email:", error);
    throw error;
  }
};

export default emailjs;
