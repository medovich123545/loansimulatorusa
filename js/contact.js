document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending…';
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim()
    };

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        status.textContent = 'Thank you! Your message has been sent.';
        form.reset();
      } else {
        const err = await response.json();
        status.textContent = err.error || 'Oops! Something went wrong.';
      }
    } catch (err) {
      status.textContent = 'Network error. Please try again later.';
    }
  });
});
