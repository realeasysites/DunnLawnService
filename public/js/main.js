document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav drawer
const navToggle = document.getElementById('navToggle');
const navClose = document.getElementById('navClose');
const mobileNav = document.getElementById('mobileNav');

if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => mobileNav.classList.add('open'));
  navClose.addEventListener('click', () => mobileNav.classList.remove('open'));
  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) mobileNav.classList.remove('open');
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
}

// Generic form-submission wiring, reused by the quote form and the careers/application form
function wireUpForm({ formId, statusId, endpoint, sendingText, defaultText, successText }) {
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = sendingText;

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();

      if (result.ok) {
        status.textContent = successText;
        status.className = 'form-status show ok';
        form.reset();
      } else {
        status.textContent = result.error || 'Something went wrong. Please call or text us instead.';
        status.className = 'form-status show err';
      }
    } catch (err) {
      status.textContent = 'Something went wrong. Please call or text (585) 313-4157 instead.';
      status.className = 'form-status show err';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = defaultText;
    }
  });
}

wireUpForm({
  formId: 'quoteForm',
  statusId: 'formStatus',
  endpoint: '/api/quote',
  sendingText: 'Sending...',
  defaultText: 'Send My Free Quote Request',
  successText: 'Thanks! We got your request and will be in touch soon.'
});

wireUpForm({
  formId: 'careersForm',
  statusId: 'careersFormStatus',
  endpoint: '/api/careers',
  sendingText: 'Submitting...',
  defaultText: 'Submit My Application',
  successText: "Thanks for applying! Ethan will be in touch soon."
});
