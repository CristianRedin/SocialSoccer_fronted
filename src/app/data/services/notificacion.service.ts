import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificacionRepository } from '../../core/domain/repositories/notificacion.repository';
import { Notificacion } from '../../core/models/notificacion.model';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService extends NotificacionRepository {
  
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:2000/api/notificaciones'; 
  // private apiUrl = `${environment.apiUrl}/notificaciones`; 

  override getAll(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.apiUrl);
  }
  override marcarComoLeida(id: string): Observable<boolean> {
    return this.http.patch(`${this.apiUrl}/${id}/leida`, {}).pipe(
      map(() => true)
    );
  }
  override eliminar(id: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => true)
    );
  }
}