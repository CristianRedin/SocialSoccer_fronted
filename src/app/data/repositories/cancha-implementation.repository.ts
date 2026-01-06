import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CanchaRepository } from '../../core/domain/repositories/cancha.repository';
import { Cancha } from '../../core/models/cancha.model';

@Injectable({
  providedIn: 'root',
})
export class CanchaImplementationRepository extends CanchaRepository {
  
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:2000/api/canchas'; 

  getAllCanchas(): Observable<Cancha[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(response => response.map(item => ({
          id: item.id,
          nombre: item.nombre,
          ubicacion: item.ubicacion,
          zona: item.zona,
          tipo_superficie: item.tipo_superficie,
          precio: item.precio,
          imagen: item.imagen,
          estado: item.estado,
          valoracion: item.valoracion,
          disponible: item.disponible
      })))
    );
  }

  getById(id: number): Observable<Cancha> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(item => ({
          id: item.id,
          nombre: item.nombre,
          ubicacion: item.ubicacion,
          zona: item.zona,
          tipo_superficie: item.tipo_superficie,
          precio: item.precio,
          imagen: item.imagen,
          estado: item.estado,
          disponible: item.disponible,
          hora_apertura: item.hora_apertura || '08:00', // Valor por defecto si viene null
          hora_cierre: item.hora_cierre || '22:00',
          descripcion: item.descripcion || '',
          valoracion: item.valoracion ?? 0 
      }))
    );
  }
}