import { Observable } from 'rxjs';
import { Cancha } from '../../models/cancha.model';

export abstract class CanchaRepository {
  abstract getAllCanchas(): Observable<Cancha[]>;
  abstract getById(id: number): Observable<Cancha>;
}