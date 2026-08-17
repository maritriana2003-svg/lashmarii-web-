// Variable para almacenar la hora seleccionada
let horaSeleccionada = "";

// Función para cambiar de pestañas (Tab System) y sincronizar el menú inferior
function switchTab(tabId) {
  // Ocultar todas las pestañas
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.classList.remove('active'));

  // Mostrar la pestaña seleccionada
  const activeTab = document.getElementById('tab-' + tabId);
  if (activeTab) {
    activeTab.classList.add('active');
  }

  // Actualizar el estado visual de los botones de la barra inferior
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(tabId)) {
      item.classList.add('active');
    }
  });

  window.scrollTo(0, 0);
}

// Función para el Acordeón de la sección Cuidados
function toggleAccordion(button) {
  button.classList.toggle('active');
  const content = button.nextElementSibling;
  
  if (content.classList.contains('show')) {
    content.classList.remove('show');
  } else {
    content.classList.add('show');
  }
}

// Función para calcular total, abono y saldo pendiente
function calcularTotal(checkboxModificado) {
  // Solo un tipo de técnica de pestañas a la vez
  if (checkboxModificado && checkboxModificado.dataset.group === 'extensiones' && checkboxModificado.checked) {
    const extensiones = document.querySelectorAll('.service-checkbox[data-group="extensiones"]');
    extensiones.forEach(cb => {
      if (cb !== checkboxModificado) cb.checked = false;
    });
  }

  let total = 0;
  const checkboxes = document.querySelectorAll('.service-checkbox:checked');
  
  checkboxes.forEach(cb => {
    total += parseInt(cb.value);
  });

  const abono = total > 0 ? 5000 : 0;
  const restante = Math.max(0, total - abono);

  // Formatear a pesos chilenos
  document.getElementById('precio-total').innerText = '$' + total.toLocaleString('es-CL');
  document.getElementById('precio-abono').innerText = '$' + abono.toLocaleString('es-CL');
  document.getElementById('precio-restante').innerText = '$' + restante.toLocaleString('es-CL');

  // Actualizar estilos visuales de las opciones seleccionadas
  document.querySelectorAll('.service-option').forEach(option => {
    const cb = option.querySelector('.service-checkbox');
    if (cb && cb.checked) {
      option.classList.add('selected');
    } else {
      option.classList.remove('selected');
    }
  });
}

// Función para actualizar horas disponibles al seleccionar fecha
function actualizarHoras() {
  const fechaInput = document.getElementById('fecha').value;
  const gridHoras = document.getElementById('grid-horas');
  const boxSobrecupo = document.getElementById('box-sobrecupo');

  if (!fechaInput) return;

  gridHoras.innerHTML = '';
  
  // Horarios disponibles estándar
  const horasDisponibles = ["10:00 AM", "12:30 PM", "03:30 PM", "06:00 PM"];

  if (horasDisponibles.length > 0) {
    boxSobrecupo.style.display = 'none';
    horasDisponibles.forEach(hora => {
      const btn = document.createElement('button');
      btn.className = 'time-btn';
      btn.innerText = hora;
      btn.onclick = function() {
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        horaSeleccionada = hora;
      };
      gridHoras.appendChild(btn);
    });
  } else {
    boxSobrecupo.style.display = 'block';
  }
}

// Selección de hora de sobrecupo
function seleccionarSobrecupo(valor) {
  horaSeleccionada = valor;
}

// Enviar mensaje de confirmación por WhatsApp
function enviarWhatsApp() {
  const nombre = document.getElementById('nombre').value.trim();
  const fecha = document.getElementById('fecha').value;
  const servicios = [];

  document.querySelectorAll('.service-checkbox:checked').forEach(cb => {
    servicios.push(cb.dataset.name);
  });

  if (!nombre) {
    alert("Por favor, ingresa tu nombre completo.");
    return;
  }

  if (servicios.length === 0) {
    alert("Por favor, selecciona al menos un servicio.");
    return;
  }

  if (!fecha || !horaSeleccionada) {
    alert("Por favor, selecciona la fecha y la hora para tu cita.");
    return;
  }

  const mensaje = `Hola Lash Marii! 💖 Quisiera agendar una cita:\n\n` +
    `👤 *Nombre:* ${nombre}\n` +
    `💅 *Servicios:* ${servicios.join(', ')}\n` +
    `📅 *Fecha:* ${fecha}\n` +
    `⏰ *Hora:* ${horaSeleccionada}\n\n` +
    `Ya tengo listos los datos para hacer la transferencia del abono.`;

  const url = `https://wa.me/56912345678?text=${encodeURIComponent(mensaje)}`; // Reemplaza con tu número de WhatsApp
  window.open(url, '_blank');
}
