// Navegación por Pestañas
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.nav-item').forEach(nav => {
    nav.classList.remove('active');
  });

  const targetTab = document.getElementById('tab-' + tabId);
  if (targetTab) {
    targetTab.classList.add('active');
  }

  const navButtons = document.querySelectorAll('.bottom-nav .nav-item');
  const tabsMap = { 'inicio': 0, 'agenda': 1, 'boutique': 2, 'cuidados': 3, 'fidelidad': 4 };
  if (tabsMap[tabId] !== undefined && navButtons[tabsMap[tabId]]) {
    navButtons[tabsMap[tabId]].classList.add('active');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Selección de Servicios y Totales
let selectedServices = [];
let totalPrice = 0;

function toggleService(element, serviceName, price) {
  const checkbox = element.querySelector('.service-checkbox');
  const isSelected = !checkbox.checked;
  
  checkbox.checked = isSelected;
  element.classList.toggle('selected', isSelected);

  if (isSelected) {
    selectedServices.push({ name: serviceName, price: price });
  } else {
    selectedServices = selectedServices.filter(s => s.name !== serviceName);
  }

  calculateTotals();
}

function calculateTotals() {
  totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const abono = totalPrice * 0.5;
  const restante = totalPrice - abono;

  document.getElementById('total-price').innerText = `$${totalPrice.toLocaleString('es-CL')}`;
  document.getElementById('abono-price').innerText = `$${abono.toLocaleString('es-CL')}`;
  document.getElementById('restante-price').innerText = `$${restante.toLocaleString('es-CL')}`;
}

// Horarios y Sobrecupos
function loadAvailableHours() {
  const dateInput = document.getElementById('booking-date').value;
  const timeGrid = document.getElementById('time-grid');
  const overbookBox = document.getElementById('overbook-box');

  if (!dateInput) return;

  timeGrid.innerHTML = '';
  
  const availableTimes = ['10:00 AM', '11:30 AM', '15:00 PM', '16:30 PM'];

  if (availableTimes.length > 0) {
    overbookBox.style.display = 'none';
    availableTimes.forEach(time => {
      const btn = document.createElement('button');
      btn.className = 'time-btn';
      btn.innerText = time;
      btn.onclick = function() {
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        btn.dataset.time = time;
      };
      timeGrid.appendChild(btn);
    });
  } else {
    timeGrid.innerHTML = '<div class="placeholder-text">No hay horas disponibles.</div>';
    overbookBox.style.display = 'block';
  }
}

// Carruseles de la Boutique
const carousels = {};

function moveCarousel(carouselId, direction) {
  const carousel = document.getElementById(carouselId);
  const track = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const dots = carousel.querySelectorAll('.dot');
  
  if (!carousels[carouselId]) carousels[carouselId] = 0;

  carousels[carouselId] += direction;

  if (carousels[carouselId] < 0) {
    carousels[carouselId] = slides.length - 1;
  } else if (carousels[carouselId] >= slides.length) {
    carousels[carouselId] = 0;
  }

  const slideWidth = slides[0].clientWidth;
  track.style.transform = `translateX(-${carousels[carouselId] * slideWidth}px)`;

  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === carousels[carouselId]);
  });
}

function setCarouselSlide(carouselId, index) {
  carousels[carouselId] = index;
  const carousel = document.getElementById(carouselId);
  const track = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const dots = carousel.querySelectorAll('.dot');

  const slideWidth = slides[0].clientWidth;
  track.style.transform = `translateX(-${index * slideWidth}px)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

// Acordeón de Cuidados
function toggleAccordion(header) {
  header.classList.toggle('active');
  const content = header.nextElementSibling;
  content.classList.toggle('show');
}

// Procesar Reserva a WhatsApp
function processBooking() {
  const name = document.getElementById('client-name').value.trim();
  const phone = document.getElementById('client-phone').value.trim();
  const date = document.getElementById('booking-date').value;
  const selectedTimeBtn = document.querySelector('.time-btn.selected');
  const overbookTime = document.getElementById('overbook-time').value;

  let time = selectedTimeBtn ? selectedTimeBtn.dataset.time : overbookTime;

  if (!name || !phone) {
    alert('Por favor ingresa tu Nombre y Teléfono.');
    return;
  }

  if (selectedServices.length === 0) {
    alert('Por favor selecciona al menos un servicio.');
    return;
  }

  if (!date || !time) {
    alert('Por favor selecciona la fecha y la hora para tu cita.');
    return;
  }

  const servicesText = selectedServices.map(s => `• ${s.name} ($${s.price.toLocaleString('es-CL')})`).join('%0A');
  const abono = totalPrice * 0.5;

  let message = `¡Hola Lash Marii! 💖 Quisiera confirmar una reserva:%0A%0A`;
  message += `👤 *Cliente:* ${encodeURIComponent(name)}%0A`;
  message += `📞 *Teléfono:* ${encodeURIComponent(phone)}%0A`;
  message += `📅 *Fecha:* ${date}%0A`;
  message += `⏰ *Hora:* ${time}%0A%0A`;
  message += `✨ *Servicios Seleccionados:*%0A${servicesText}%0A%0A`;
  message += `💳 *Total:* $${totalPrice.toLocaleString('es-CL')}%0A`;
  message += `📌 *Abono a transferir (50%):* $${abono.toLocaleString('es-CL')}%0A%0A`;
  message += `Adjunto mi comprobante de transferencia a continuación 👇`;

  const whatsappUrl = `https://wa.me/56912345678?text=${message}`;
  window.open(whatsappUrl, '_blank');
}
