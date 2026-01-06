import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cancha } from '../../core/models/cancha.model';
import { CanchaRepository } from '../../core/domain/repositories/cancha.repository';

@Injectable({
  providedIn: 'root'
})
export class CanchaService extends CanchaRepository {
  
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:2000/api/canchas'; 
  // private url = `${environment.apiUrl}/canchas`; 

  // 3. Modificamos getAll para aceptar "filtros" opcionales
  override getAllCanchas(filtros: any = {}): Observable<Cancha[]> {
    
    // Configuramos los parámetros de la URL
    let params = new HttpParams();
    if (filtros.zona) params = params.append('zona', filtros.zona);
    if (filtros.superficie) params = params.append('superficie', filtros.superficie);
    if (filtros.precio_max) params = params.append('precio_max', filtros.precio_max);

    // Hacemos la petición con los params
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => {
        return response.canchas ? response.canchas : response;
      })
    );
  }

  override getById(id: number): Observable<Cancha> {
    return this.http.get<Cancha>(`${this.apiUrl}/${id}`);
  }
}