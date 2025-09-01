"use strict";

/**
 * Fase 2: El Jardín que Florece
 * Animación completa con Anime.js Timeline - Versión mejorada
 */

export function initGardenAnimation() {
  // Hacer visible el contenedor SVG del jardín
  const gardenSVG = document.getElementById('garden-svg');
  if (!gardenSVG) {
    console.error('No se encontró el SVG del jardín');
    return;
  }
  
  gardenSVG.style.opacity = '1';

  // Configurar valores iniciales para la animación de line drawing
  const tallo = document.getElementById('tallo');
  if (tallo) {
    anime.set(tallo, {
      strokeDasharray: anime.setDashoffset(tallo),
      strokeDashoffset: anime.setDashoffset(tallo)
    });
  }

  // Configurar estados iniciales de elementos
  anime.set('#tierra', {
    translateY: 50,
    opacity: 0
  });

  anime.set(['#hoja-1', '#hoja-2'], {
    scale: 0,
    rotate: -90,
    transformOrigin: 'center'
  });

  // Estados iniciales de capullos (más naturales)
  anime.set(['#capullo-1', '#capullo-2', '#capullo-final'], {
    scale: 0,
    opacity: 0,
    rotate: -45
  });

  // Estados iniciales de flores abiertas
  anime.set(['#flor-abierta-1', '#flor-abierta-2', '#flor-abierta-final'], {
    scale: 0,
    opacity: 0,
    rotate: 180
  });

  // Crear la línea de tiempo principal
  const tl = anime.timeline({
    autoplay: false,
    easing: 'easeInOutSine'
  });

  // 1. Añadir la Tierra con efecto más dramático
  tl.add({
    targets: '#tierra',
    translateY: 0,
    opacity: 1,
    duration: 2000,
    easing: 'easeOutBounce'
  });

  // 2. Dibujar el Tallo (Line Drawing) con crecimiento orgánico
  tl.add({
    targets: '#tallo',
    strokeDashoffset: 0,
    duration: 3500,
    easing: 'easeInOutQuart'
  }, '-=1000');

  // 3. Desplegar las Hojas con movimiento más natural
  tl.add({
    targets: '#hoja-1',
    scale: [0, 1.2, 1],
    rotate: [-90, 10, 0],
    duration: 1200,
    easing: 'easeOutElastic(1, .8)'
  }, '-=1800');

  tl.add({
    targets: '#hoja-2',
    scale: [0, 1.1, 1],
    rotate: [-90, -10, 0],
    duration: 1200,
    easing: 'easeOutElastic(1, .8)'
  }, '-=800');

  // 4. Aparecer los Capullos con secuencia natural (de abajo hacia arriba)
  tl.add({
    targets: '#capullo-1',
    scale: [0, 1.1, 1],
    opacity: [0, 1],
    rotate: [-45, 15, 0],
    duration: 1000,
    easing: 'easeOutBack(1.7)'
  }, '-=500');

  tl.add({
    targets: '#capullo-2',
    scale: [0, 1.1, 1],
    opacity: [0, 1],
    rotate: [-45, -10, 0],
    duration: 1000,
    easing: 'easeOutBack(1.7)'
  }, '-=600');

  tl.add({
    targets: '#capullo-final',
    scale: [0, 1.2, 1],
    opacity: [0, 1],
    rotate: [-45, 0, 0],
    duration: 1200,
    easing: 'easeOutBack(1.7)'
  }, '-=400');

  // 5. Pausa dramática antes de la floración
  tl.add({
    targets: {},
    duration: 800
  });

  // 6. Floración 1 - Transición suave de capullo a flor
  tl.add({
    targets: '#capullo-1',
    scale: 0,
    opacity: 0,
    rotate: 90,
    duration: 800,
    easing: 'easeInBack',
    complete: function() {
      // Animación de floración espectacular
      anime.set('#flor-abierta-1', {
        scale: 0,
        opacity: 1,
        rotate: 180
      });
      anime({
        targets: '#flor-abierta-1',
        scale: [0, 1.3, 1],
        rotate: [180, -10, 0],
        duration: 1500,
        easing: 'easeOutElastic(1, .6)',
        complete: function() {
          // Efecto de respiración suave
          anime({
            targets: '#flor-abierta-1',
            scale: [1, 1.05, 1],
            duration: 3000,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine'
          });
        }
      });
    }
  });

  // 7. Floración 2 con variación
  tl.add({
    targets: '#capullo-2',
    scale: 0,
    opacity: 0,
    rotate: -90,
    duration: 800,
    easing: 'easeInBack',
    complete: function() {
      anime.set('#flor-abierta-2', {
        scale: 0,
        opacity: 1,
        rotate: -180
      });
      anime({
        targets: '#flor-abierta-2',
        scale: [0, 1.2, 1],
        rotate: [-180, 15, 0],
        duration: 1400,
        easing: 'easeOutElastic(1, .7)',
        complete: function() {
          anime({
            targets: '#flor-abierta-2',
            scale: [1, 1.03, 1],
            duration: 3500,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine'
          });
        }
      });
    }
  }, '+=600');

  // 8. Floración Final - La más espectacular
  tl.add({
    targets: '#capullo-final',
    scale: 0,
    opacity: 0,
    rotate: 360,
    duration: 1000,
    easing: 'easeInBack',
    complete: function() {
      anime.set('#flor-abierta-final', {
        scale: 0,
        opacity: 1,
        rotate: 360
      });
      anime({
        targets: '#flor-abierta-final',
        scale: [0, 1.5, 1.2],
        rotate: [360, -20, 0],
        duration: 2000,
        easing: 'easeOutElastic(1, .5)',
        complete: function() {
          // Efecto de respiración más pronunciado para la flor principal
          anime({
            targets: '#flor-abierta-final',
            scale: [1.2, 1.25, 1.2],
            rotate: [0, 2, 0, -2, 0],
            duration: 4000,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine'
          });
        }
      });
    }
  }, '+=800');

  // 9. El Clímax: El Mensaje Final con entrada elegante
  tl.add({
    targets: '#final-message',
    opacity: [0, 1],
    translateY: [-50, 0],
    scale: [0.8, 1],
    duration: 3000,
    easing: 'easeOutQuart'
  }, '+=1000');

  // Ejecutar la línea de tiempo
  tl.play();

  // Efectos adicionales después de que todo esté visible
  setTimeout(() => {
    // Efecto de brillo mágico en todas las flores
    anime({
      targets: ['#flor-abierta-1', '#flor-abierta-2', '#flor-abierta-final'],
      filter: [
        'drop-shadow(0 0 8px rgba(255, 182, 193, 0.4))',
        'drop-shadow(0 0 20px rgba(255, 182, 193, 0.8))',
        'drop-shadow(0 0 8px rgba(255, 182, 193, 0.4))'
      ],
      duration: 4000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });

    // Animación suave de las hojas como si las moviera el viento
    anime({
      targets: ['#hoja-1', '#hoja-2'],
      rotate: [0, 3, 0, -3, 0],
      duration: 6000,
      loop: true,
      easing: 'easeInOutSine'
    });

    // Efecto especial para la flor final
    anime({
      targets: '#flor-abierta-final',
      filter: [
        'drop-shadow(0 0 15px rgba(255, 99, 71, 0.6))',
        'drop-shadow(0 0 25px rgba(255, 140, 0, 0.8))',
        'drop-shadow(0 0 15px rgba(255, 99, 71, 0.6))'
      ],
      duration: 5000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });
  }, 12000);
}
