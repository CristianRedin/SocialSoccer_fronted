import { Observable } from 'rxjs';
import { Notificacion } from '../../models/notificacion.model';

export abstract class NotificacionRepository {
  abstract getAll(): Observable<Notificacion[]>;
  abstract marcarComoLeida(id: string): Observable<boolean>;
  abstract eliminar(id: string): Observable<boolean>;
}