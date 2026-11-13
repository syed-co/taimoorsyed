(function(){
  // 1) Put your Formspree form URL here (the part after /f/ is your form ID).
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
  // 2) Put your booking link here (Calendly, Cal.com, Google Calendar appointment page, etc.).
  //    Until you do, "Book a call" buttons jump to the contact form instead.
  var BOOKING_URL = '';

  var PLACEHOLDER = 'YOUR' + '_FORM_ID'; // leave this line alone

  // Booking buttons
  Array.prototype.forEach.call(document.querySelectorAll('[data-book]'), function(a){
    if(BOOKING_URL){ a.href = BOOKING_URL; a.target = '_blank'; a.rel = 'noopener'; }
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-book-only]'), function(a){
    if(BOOKING_URL){ a.href = BOOKING_URL; a.target = '_blank'; a.rel = 'noopener'; a.hidden = false; }
  });

  // Sticky mobile button
  var sticky = document.getElementById('stickyCta');
  if(sticky){
    var onScroll = function(){ sticky.classList.toggle('show', (window.pageYOffset || 0) > 520); };
    window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
  }

  // Remember ad and campaign tags so leads can be traced to the ad that sent them
  var TRACK = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid'];
  var tags = {};
  try {
    var qs = new URLSearchParams(window.location.search);
    TRACK.forEach(function(k){ if(qs.get(k)){ sessionStorage.setItem('sc_' + k, qs.get(k)); } });
    TRACK.forEach(function(k){ var v = sessionStorage.getItem('sc_' + k); if(v){ tags[k] = v; } });
    if(!sessionStorage.getItem('sc_ref') && document.referrer){ sessionStorage.setItem('sc_ref', document.referrer); }
    var ref = sessionStorage.getItem('sc_ref'); if(ref){ tags.referrer = ref; }
  } catch(e) {}

  var form = document.getElementById('contactForm'), note = document.getElementById('formNote');
  if(!form || !note) return;
  if(form.elements.source_page){ form.elements.source_page.value = window.location.href; }

  form.addEventListener('submit', function(ev){
    ev.preventDefault();
    note.className = 'form-note full';
    var bad = [];
    Array.prototype.forEach.call(form.elements, function(el){
      if(!el.name || el.name.charAt(0) === '_' || el.type === 'submit' || el.type === 'hidden' || el.name === 'service' || el.name === 'source_page') return;
      var ok = el.value.trim() !== '' && (el.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
      el.classList.toggle('bad', !ok);
      if(!ok) bad.push(el);
    });
    var digits = form.elements.phone.value.replace(/\D/g,'');
    if(digits.length < 7 && bad.indexOf(form.elements.phone) < 0){ form.elements.phone.classList.add('bad'); bad.push(form.elements.phone); }
    if(bad.length){
      note.textContent = 'Please fill in every field with valid details.';
      note.classList.add('err');
      bad[0].focus();
      return;
    }
    var v = function(n){ return form.elements[n].value.trim(); };
    var service = form.elements.service ? form.elements.service.value : 'General';
    var btn = form.querySelector('button[type="submit"]');

    // Until the Formspree ID is added, fall back to a pre-filled email.
    if(FORMSPREE_ENDPOINT.indexOf(PLACEHOLDER) > -1){
      var subject = 'Website inquiry from ' + v('first_name') + ' ' + v('last_name') + ' (' + v('business_name') + ')';
      var body = ['Service: ' + service, 'First name: ' + v('first_name'), 'Last name: ' + v('last_name'), 'Business email: ' + v('email'), 'Business name: ' + v('business_name'), 'Website / social: ' + v('website'), 'Phone: ' + v('phone'), 'Annual revenue: ' + v('revenue'), 'Page: ' + window.location.href, '', 'Message:', v('message')].join('\n');
      window.location.href = 'mailto:taimoor@syedco.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      note.textContent = 'Your email app should open with everything filled in. Just hit send. If nothing opens, email me at taimoor@syedco.com.';
      note.classList.add('ok');
      return;
    }

    var data = new FormData(form);
    Object.keys(tags).forEach(function(k){ data.append(k, tags[k]); });
    btn.disabled = true; btn.style.opacity = '0.6';
    note.textContent = 'Sending...';
    fetch(FORMSPREE_ENDPOINT, { method:'POST', body:data, headers:{ 'Accept':'application/json' } })
      .then(function(res){
        if(!res.ok){ throw new Error('bad response'); }
        // Conversion events (work if you add Google Tag Manager or Google Analytics later)
        try {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event:'generate_lead', lead_service:service, lead_page:window.location.pathname });
          if(typeof window.gtag === 'function'){ window.gtag('event','generate_lead',{ lead_service:service }); }
        } catch(e) {}
        form.reset();
        note.textContent = 'Thanks, your message is in. Taking you to the next step...';
        note.classList.add('ok');
        setTimeout(function(){ window.location.href = '/thanks/?service=' + encodeURIComponent(service); }, 400);
      })
      .catch(function(){
        note.textContent = 'Something went wrong sending that. Please try again, or email me at taimoor@syedco.com.';
        note.classList.add('err');
        btn.disabled = false; btn.style.opacity = '';
      });
  });
})();
