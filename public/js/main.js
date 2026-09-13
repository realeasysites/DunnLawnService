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

// Quote form submission
const form = document.getElementById('quoteForm');
const status = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();

      if (result.ok) {
        status.textContent = "Thanks! We got your request and will be in touch soon.";
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
      submitBtn.textContent = 'Send My Free Quote Request';
    }
  });
}
