(function(){
  // Put your Formspree form URL here (the part after /f/ is your form ID).
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
  var PLACEHOLDER = 'YOUR' + '_FORM_ID'; // leave this line alone

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
    var btn = form.querySelector('button[type="submit"]');

    // Until the Formspree ID is added, fall back to a pre-filled email.
    if(FORMSPREE_ENDPOINT.indexOf(PLACEHOLDER) > -1){
      var subject = 'Website inquiry from ' + v('first_name') + ' ' + v('last_name') + ' (' + v('business_name') + ')';
      var body = ['First name: ' + v('first_name'), 'Last name: ' + v('last_name'), 'Business email: ' + v('email'), 'Business name: ' + v('business_name'), 'Website / social: ' + v('website'), 'Phone: ' + v('phone'), 'Annual revenue: ' + v('revenue'), 'Page: ' + window.location.href, '', 'Message:', v('message')].join('\n');
      window.location.href = 'mailto:taimoor@syedco.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      note.textContent = 'Your email app should open with everything filled in. Just hit send. If nothing opens, email me at taimoor@syedco.com.';
      note.classList.add('ok');
      return;
    }

    btn.disabled = true; btn.style.opacity = '0.6';
    note.textContent = 'Sending...';
    fetch(FORMSPREE_ENDPOINT, { method:'POST', body:new FormData(form), headers:{ 'Accept':'application/json' } })
      .then(function(res){
        if(res.ok){
          form.reset();
          if(form.elements.source_page){ form.elements.source_page.value = window.location.href; }
          note.textContent = 'Thanks, your message is in. I’ll get back to you soon.';
          note.classList.add('ok');
        } else { throw new Error('bad response'); }
      })
      .catch(function(){
        note.textContent = 'Something went wrong sending that. Please try again, or email me at taimoor@syedco.com.';
        note.classList.add('err');
      })
      .then(function(){ btn.disabled = false; btn.style.opacity = ''; });
  });
})();
