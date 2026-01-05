import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionRepository } from '../../../core/domain/repositories/notificacion.repository';
import { Notificacion } from '../../../core/models/notificacion.model';

@Component({
  selector: 'app-notificaciones-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones-page.component.html',
  styleUrls: ['./notificaciones-page.component.css']
})
export class NotificacionesPageComponent implements OnInit {

  private notiRepo = inject(NotificacionRepository);
  private cd = inject(ChangeDetectorRef);

  listaNotificaciones: Notificacion[] = [];
  cargando = true;
  
  // Variable para controlar el filtro activo
  filtroActual: 'todas' | 'no_leidas' | 'importantes' = 'todas';

  ngOnInit() {
    this.cargarNotificaciones();
  }

  cargarNotificaciones() {
    this.cargando = true;
    this.notiRepo.getAll().subscribe({
      next: (data) => {
        this.listaNotificaciones = data;
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (e) => {
        console.error('Error cargando notificaciones:', e);
        this.cargando = false;
        this.cd.detectChanges();
      }
    });
  }

  marcarLeida(id: string) {
    this.notiRepo.marcarComoLeida(id).subscribe(() => {
      const notif = this.listaNotificaciones.find(n => n.id === id);
      if (notif) {
        notif.leida = true;
        this.cd.detectChanges();
      }
    });
  }

  eliminar(id: string) {
    if(!confirm('¿Estás seguro de borrar esta notificación?')) return;

    this.notiRepo.eliminar(id).subscribe(() => {
      this.listaNotificaciones = this.listaNotificaciones.filter(n => n.id !== id);
      this.cd.detectChanges();
    });
  }

  // --- LÓGICA DE FILTROS ---

  // 1. Getter para la lista filtrada principal
  get notificacionesFiltradas() {
    if (this.filtroActual === 'no_leidas') {
      return this.listaNotificaciones.filter(n => !n.leida);
    }
    
    if (this.filtroActual === 'importantes') {
      return this.listaNotificaciones.filter(n => ['Alerta', 'Invitación'].includes(n.tipo));
    }

    return this.listaNotificaciones;
  }

  // 2. Getter NUEVO para el contador de la pestaña (Solución al error)
  get totalNoLeidas(): number {
    return this.listaNotificaciones.filter(n => !n.leida).length;
  }

  // 3. Función para cambiar filtro
  setFiltro(filtro: 'todas' | 'no_leidas' | 'importantes') {
    this.filtroActual = filtro;
  }
}