// src/app/presentation/pages/home/home.component.ts

// Importa el decorador Component necesario para definir componentes Angular
import { Component } from '@angular/core';

// Importa CommonModule que proporciona directivas comunes como *ngIf, *ngFor
import { CommonModule } from '@angular/common';

// Importa RouterModule para habilitar la navegación y directivas de enrutamiento
import { RouterModule } from '@angular/router';

// Decorador @Component que define los metadatos del componente
@Component({
  selector: 'app-home', // Selector CSS para usar este componente en plantillas HTML
  standalone: true, // Indica que es un componente independiente (Angular 14+)
  imports: [CommonModule, RouterModule], // Módulos importados para este componente
  templateUrl: './home.html', // Ruta al archivo de plantilla HTML
  styleUrls: ['./home.scss'] // Ruta al archivo de estilos SCSS
})
export class HomeComponent {
  // Arreglo de características que se mostrarán en la página de inicio
  features = [
    { 
      icon: '📊', // Icono representativo
      title: 'Resultados', // Título de la característica
      description: 'Registra marcadores, consulta historial y estadísticas de partidos', // Descripción
      link: '/results' // Ruta de navegación
    },
    { 
      icon: '🏆', 
      title: 'Torneos', 
      description: 'Gestiona torneos activos, brackets, calendarios y posiciones',
      link: '/tournaments'
    },
    { 
      icon: '📝', 
      title: 'Inscripciones', 
      description: 'Inscribe equipos, sigue estado y consulta historial',
      link: '/inscriptions'
    },
    { 
      icon: '📈', 
      title: 'Estadísticas', 
      description: 'Analiza rendimiento de jugadores y equipos con gráficos',
      link: '/statistics'
    }
  ];

  // Objeto con información del usuario actual
  userInfo = {
    name: 'Caiza Redin Cristian Fernando', // Nombre completo del usuario
    role: 'Capitán de Equipo', // Rol del usuario en la aplicación
    team: 'Fénix FC', // Equipo al que pertenece
    number: '5' // Número del jugador/capitán
  };

  // Constructor del componente, se ejecuta al crear una instancia
  constructor() {
    // Mensaje de consola para depuración, confirma que el componente se cargó
    console.log('✅ Componente Home cargado');
  }
}