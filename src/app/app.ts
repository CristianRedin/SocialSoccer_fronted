// src/app/app.ts (REEMPLAZAR TODO EL CONTENIDO)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

/**
 * COMPONENTE PRINCIPAL DE LA APLICACIÓN
 * @description Componente raíz que contiene toda la aplicación
 * @selector 'app-root' - Selector HTML del componente
 * @standalone true - Indica que es un componente standalone (nueva en Angular 17+)
 */
@Component({
  selector: 'app-root',                      // Selector para usar en HTML: <app-root></app-root>
  standalone: true,                          // Componente standalone (no necesita módulo)
  imports: [CommonModule, RouterOutlet, RouterModule], // Módulos que importa
  templateUrl: './app.html',                 // Template HTML del componente
  styleUrls: ['./app.scss']                  // Estilos SCSS del componente
})
export class App {
  // Título de la aplicación que se muestra en el header
  title = 'Social Soccer - Gestión Deportiva';
  
  constructor() {
    console.log('✅ Aplicación Social Soccer iniciada correctamente');
  }
}