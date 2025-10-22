export async function onRequestPost(context) {
  try {
    const SENDGRID_API_KEY = context.env.FeelingCareKey
    const VERIFIED_SENDER_EMAIL = context.env.VERIFIED_SENDER_EMAIL || 'lanxinlu0102@gmail.com'
    const data = await context.request.json()

    // Prepare email payload
    const emailPayload = {
      personalizations: [{ to: [{ email: data.to }] }],
      // Always send from the verified sender to satisfy SPF/DKIM
      from: { email: VERIFIED_SENDER_EMAIL, name: 'FeelingCareSupport' },
      subject: data.subject || 'No Subject',
      content: [
        {
          type: data.html ? 'text/html' : 'text/plain',
          value: data.html || data.text || 'No message content provided.',
        },
      ],
    }

    // Optional Reply-To: where recipients can respond
    if (data.replyTo) {
      emailPayload.reply_to = { email: data.replyTo }
    }

    if (data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0) {
      emailPayload.attachments = data.attachments.map((att) => ({
        content: att.content,
        filename: att.filename,
        type: att.type || 'application/octet-stream',
        disposition: 'attachment',
      }))
    }

    // Send the email via SendGrid API
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('SendGrid Error:', errorBody)
      return new Response(JSON.stringify({ error: errorBody }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, message: 'Email sent successfully!' }), {
      status: 200,
    })
  } catch (err) {
    console.error('Backend Error:', err)
    return new Response(JSON.stringify({ error: 'Server error: ' + err.message }), { status: 500 })
  }
}
