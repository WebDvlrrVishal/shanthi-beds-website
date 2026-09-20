/* ── Hamburger Menu ─────────────────────────────────────────────────────── */
function toggleMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const navPhone  = document.getElementById('navPhone');

  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  navPhone.classList.toggle('open');

  const isOpen = hamburger.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const navPhone  = document.getElementById('navPhone');

  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  navPhone.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* Close menu when tapping outside the nav */
document.addEventListener('click', function(e) {
  const nav = document.querySelector('nav');
  if (!nav.contains(e.target)) closeMenu();
});

/* ── Config ─────────────────────────────────────────────────────────────── */
const WHATSAPP_NUMBER = '919384515146';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyzVfQmwVseeA_YUE9kjGkUhlHwBZDo9n6Dddoozl-qpKCyoypETUgMFDNnVu5gxvlcHQ/exec';

/* ── Enquiry Form ───────────────────────────────────────────────────────── */
function handleFormSubmit(event) {
  event.preventDefault();

  const name      = document.getElementById('customerName').value.trim();
  const phone     = document.getElementById('customerPhone').value.trim();
  const message   = document.getElementById('customerMessage').value.trim();
  const submitBtn = document.getElementById('submitBtn');

  // Validation
  if (!name || !phone || !message) {
    showStatus('Please fill in all fields.', 'error');
    return;
  }
  if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
    showStatus('Please enter a valid 10-digit phone number.', 'error');
    return;
  }

  // Disable button to prevent double submit
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  // ✅ Save to Google Sheet via Apps Script
  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name,
      phone: phone,
      message: message,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    })
  }).catch(function(err) {
    console.warn('Sheet save failed (non-critical):', err);
  });

  // ✅ Build WhatsApp message
  const text =
    `Hello Shanthi Beds! 🛏️\n\n` +
    `I would like to place an enquiry:\n\n` +
    `👤 Name: ${name}\n` +
    `📞 Phone: ${phone}\n` +
    `📋 Requirement: ${message}\n\n` +
    `Please get back to me. Thank you!`;

  const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  showStatus('✅ Opening WhatsApp... Complete the send in WhatsApp to confirm your enquiry.', 'success');
  submitBtn.textContent = 'Opening WhatsApp...';

  setTimeout(function() {
    window.open(whatsappURL, '_blank');
    document.getElementById('enquiryForm').reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Enquiry via WhatsApp';
  }, 700);
}

/* ── Status Message ─────────────────────────────────────────────────────── */
function showStatus(msg, type) {
  const formStatus = document.getElementById('formStatus');
  formStatus.textContent = msg;
  formStatus.style.display = 'block';

  if (type === 'success') {
    formStatus.style.background = 'rgba(46, 139, 87, 0.2)';
    formStatus.style.color = '#2E8B57';
    formStatus.style.border = '1px solid #2E8B57';
  } else if (type === 'error') {
    formStatus.style.background = 'rgba(212, 39, 23, 0.2)';
    formStatus.style.color = '#D42717';
    formStatus.style.border = '1px solid #D42717';
  } else if (type === 'info') {
    formStatus.style.background = 'rgba(212, 160, 23, 0.2)';
    formStatus.style.color = '#D4AF37';
    formStatus.style.border = '1px solid #D4AF37';
  }

  setTimeout(function() {
    formStatus.style.display = 'none';
  }, 6000);
}