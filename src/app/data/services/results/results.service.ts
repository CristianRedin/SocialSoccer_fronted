import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { 
  Resultado, 
  ResultadoResponse, 
  ResultadosListResponse,
  EstadisticasResponse,
  BusquedaParams,
  PartidoMundial
} from './results.models';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  private apiUrl = 'http://localhost:2000/api/resultados'; // Ajusta el puerto según tu backend

  constructor(private http: HttpClient) { }

  // ========== CRUD BÁSICO ==========

  // 1. Obtener todos los resultados (lista simple)
  getAllResultados(): Observable<Resultado[]> {
    return this.http.get<Resultado[]>(`${this.apiUrl}/lista`);
  }

  // 2. Obtener resultados con información detallada
  getResultadosDetallados(): Observable<ResultadosListResponse> {
    return this.http.get<ResultadosListResponse>(`${this.apiUrl}/mostrar`);
  }

  // 3. Obtener resultado por ID
  getResultadoById(id: number): Observable<Resultado> {
    return this.http.get<Resultado>(`${this.apiUrl}/buscar/${id}`);
  }

  // 4. Crear nuevo resultado
  createResultado(resultado: Resultado): Observable<ResultadoResponse> {
    return this.http.post<ResultadoResponse>(`${this.apiUrl}/crear`, resultado);
  }

  // 5. Actualizar resultado
  updateResultado(id: number, resultado: Partial<Resultado>): Observable<{message: string}> {
    return this.http.put<{message: string}>(`${this.apiUrl}/actualizar/${id}`, resultado);
  }

  // 6. Eliminar resultado (soft delete)
  deleteResultado(id: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/eliminar/${id}`);
  }

  // 7. Obtener resultado con encriptación
  getResultadoEncriptado(id: number): Observable<Resultado> {
    return this.http.get<Resultado>(`${this.apiUrl}/mandar/${id}`);
  }

  // ========== FUNCIONES ESPECÍFICAS ==========

  // 8. Obtener resultados por jornada
  getResultadosPorJornada(jornada: number): Observable<ResultadosListResponse> {
    return this.http.get<ResultadosListResponse>(`${this.apiUrl}/jornada/${jornada}`)
      .pipe(
        catchError(() => {
          // Si el endpoint no existe, simular respuesta
          return of({
            message: `Resultados de la jornada ${jornada}`,
            jornada: jornada,
            resultados: [],
            total: 0
          } as any);
        })
      );
  }

  // 9. Obtener resultados por equipo
  getResultadosPorEquipo(equipo: string): Observable<ResultadosListResponse> {
    return this.http.get<ResultadosListResponse>(`${this.apiUrl}/equipo/${equipo}`)
      .pipe(
        catchError(() => {
          return of({
            message: `Resultados del equipo ${equipo}`,
            equipo: equipo,
            resultados: [],
            estadisticas: { victorias: 0, empates: 0, derrotas: 0 },
            total: 0
          } as any);
        })
      );
  }

  // 10. Obtener resultados por temporada
  getResultadosPorTemporada(temporada: string): Observable<ResultadosListResponse> {
    return this.http.get<ResultadosListResponse>(`${this.apiUrl}/temporada/${temporada}`)
      .pipe(
        catchError(() => {
          return of({
            message: `Resultados de la temporada ${temporada}`,
            temporada: temporada,
            resultados: [],
            total: 0
          } as any);
        })
      );
  }

  // 11. Obtener estadísticas generales
  getEstadisticasGenerales(): Observable<EstadisticasResponse> {
    return this.http.get<EstadisticasResponse>(`${this.apiUrl}/estadisticas`)
      .pipe(
        catchError(() => {
          return of({
            message: 'Estadísticas generales',
            estadisticas: {
              total_partidos: 0,
              total_goles: 0,
              promedio_goles_partido: 0,
              max_goles_partido: 0,
              min_goles_partido: 0,
              victorias_local: 0,
              victorias_visitante: 0,
              empates: 0,
              total_jornadas: 0,
              total_temporadas: 0
            }
          });
        })
      );
  }

  // 12. Buscar resultados con filtros
  searchResultados(params: BusquedaParams): Observable<ResultadosListResponse> {
    let httpParams = new HttpParams();
    
    if (params.q) httpParams = httpParams.set('q', params.q);
    if (params.fecha_inicio) httpParams = httpParams.set('fecha_inicio', params.fecha_inicio);
    if (params.fecha_fin) httpParams = httpParams.set('fecha_fin', params.fecha_fin);
    if (params.jornada) httpParams = httpParams.set('jornada', params.jornada.toString());
    if (params.temporada) httpParams = httpParams.set('temporada', params.temporada);
    
    return this.http.get<ResultadosListResponse>(`${this.apiUrl}/buscar`, { params: httpParams })
      .pipe(
        catchError(() => {
          return of({
            message: 'Búsqueda de resultados',
            resultados: [],
            filtros: params,
            total: 0
          } as any);
        })
      );
  }

  // 13. Obtener últimos resultados
  getUltimosResultados(limite: number = 10): Observable<ResultadosListResponse> {
    return this.http.get<ResultadosListResponse>(`${this.apiUrl}/ultimos`, { 
      params: { limite: limite.toString() }
    }).pipe(
      catchError(() => {
        return of({
          message: `Últimos ${limite} resultados`,
          resultados: [],
          total: 0
        } as any);
      })
    );
  }

  // 14. Obtener historial entre dos equipos
  getHistorialEquipos(equipo1: string, equipo2: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/historial/${equipo1}/${equipo2}`)
      .pipe(
        catchError(() => {
          return of({
            message: `Historial entre ${equipo1} y ${equipo2}`,
            equipos: { equipo1, equipo2 },
            historial: [],
            estadisticas: { 
              victorias_equipo1: 0, 
              victorias_equipo2: 0, 
              empates: 0, 
              goles_equipo1: 0, 
              goles_equipo2: 0 
            },
            total: 0
          });
        })
      );
  }

  // ========== CONVERSIÓN PARA MUNDIAL 2026 ==========

  // Convertir Resultado del backend a PartidoMundial para el frontend
  convertirAPartidoMundial(resultado: Resultado): PartidoMundial {
    return {
      id: resultado.id || 0,
      tournament: 'Copa Mundial FIFA 2026',
      phase: this.determinarFase(resultado.jornada || 1),
      group: this.determinarGrupo(resultado.equipoLocal, resultado.equipoVisitante),
      date: new Date(resultado.fecha).toISOString(),
      homeTeam: {
        name: resultado.equipoLocal_nombre || resultado.equipoLocal,
        flag: this.getFlag(resultado.equipoLocal),
        code: this.getCountryCode(resultado.equipoLocal)
      },
      awayTeam: {
        name: resultado.equipoVisitante_nombre || resultado.equipoVisitante,
        flag: this.getFlag(resultado.equipoVisitante),
        code: this.getCountryCode(resultado.equipoVisitante)
      },
      homeScore: resultado.golesLocal || 0,
      awayScore: resultado.golesVisitante || 0,
      stadium: 'Estadio ' + (resultado.arbitro_nombre?.split(' ')[0] || 'Mundial'),
      city: this.getRandomCity(),
      attendance: this.formatAttendance(Math.floor(Math.random() * 50000) + 30000),
      referee: resultado.arbitro_nombre ? `${resultado.arbitro_nombre} ${resultado.arbitro_apellido}` : 'Árbitro FIFA',
      mvp: {
        name: this.getRandomPlayer(),
        team: this.getCountryCode(resultado.golesLocal! > resultado.golesVisitante! ? resultado.equipoLocal : resultado.equipoVisitante),
        goals: Math.max(resultado.golesLocal!, resultado.golesVisitante!)
      },
      status: 'finalizado',
      events: this.generarEventos(resultado)
    };
  }

  // ========== UTILIDADES ==========

  private determinarFase(jornada: number): string {
    if (jornada <= 3) return 'FASE DE GRUPOS';
    if (jornada === 4) return 'OCTAVOS DE FINAL';
    if (jornada === 5) return 'CUARTOS DE FINAL';
    if (jornada === 6) return 'SEMIFINALES';
    if (jornada === 7) return 'TERCER PUESTO';
    return 'FINAL';
  }

  private determinarGrupo(equipo1: string, equipo2: string): string | null {
    // Lógica simple para determinar grupo basado en equipos
    const grupos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const hash = (equipo1 + equipo2).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `Grupo ${grupos[hash % grupos.length]}`;
  }

  private getFlag(countryName: string): string {
    const flags: {[key: string]: string} = {
      'Argentina': '🇦🇷', 'Brasil': '🇧🇷', 'Uruguay': '🇺🇾', 'Colombia': '🇨🇴',
      'Francia': '🇫🇷', 'Alemania': '🇩🇪', 'España': '🇪🇸', 'Italia': '🇮🇹',
      'Inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Portugal': '🇵🇹', 'Países Bajos': '🇳🇱', 'Bélgica': '🇧🇪',
      'Estados Unidos': '🇺🇸', 'México': '🇲🇽', 'Canadá': '🇨🇦', 'Japón': '🇯🇵'
    };
    
    const country = countryName.replace(/🇦🇷|🇧🇷|🇺🇾|🇨🇴|🇫🇷|🇩🇪|🇪🇸|🇮🇹|🏴󠁧󠁢󠁥󠁮󠁧󠁿|🇵🇹|🇳🇱|🇧🇪|🇺🇸|🇲🇽|🇨🇦|🇯🇵/g, '').trim();
    return flags[country] || '🏴';
  }

  private getCountryCode(countryName: string): string {
    const codes: {[key: string]: string} = {
      'Argentina': 'ARG', 'Brasil': 'BRA', 'Uruguay': 'URU', 'Colombia': 'COL',
      'Francia': 'FRA', 'Alemania': 'GER', 'España': 'ESP', 'Italia': 'ITA',
      'Inglaterra': 'ENG', 'Portugal': 'POR', 'Países Bajos': 'NED', 'Bélgica': 'BEL',
      'Estados Unidos': 'USA', 'México': 'MEX', 'Canadá': 'CAN', 'Japón': 'JPN'
    };
    
    const country = countryName.replace(/🇦🇷|🇧🇷|🇺🇾|🇨🇴|🇫🇷|🇩🇪|🇪🇸|🇮🇹|🏴󠁧󠁢󠁥󠁮󠁧󠁿|🇵🇹|🇳🇱|🇧🇪|🇺🇸|🇲🇽|🇨🇦|🇯🇵/g, '').trim();
    return codes[country] || 'FIFA';
  }

  private getRandomCity(): string {
    const cities = ['Ciudad de México', 'Los Ángeles', 'Nueva York', 'Dallas', 'Vancouver', 'Guadalajara'];
    return cities[Math.floor(Math.random() * cities.length)];
  }

  private getRandomPlayer(): string {
    const players = [
      'Lionel Messi', 'Kylian Mbappé', 'Cristiano Ronaldo', 'Neymar Jr', 
      'Kevin De Bruyne', 'Harry Kane', 'Karim Benzema', 'Vinicius Jr',
      'Erling Haaland', 'Mohamed Salah', 'Robert Lewandowski', 'Kai Havertz'
    ];
    return players[Math.floor(Math.random() * players.length)];
  }

  private formatAttendance(num: number): string {
    return num.toLocaleString('es-ES') + ' espectadores';
  }

  private generarEventos(resultado: Resultado): any[] {
    const eventos = [];
    const { golesLocal, golesVisitante, equipoLocal, equipoVisitante } = resultado;
    
    // Generar goles
    for (let i = 0; i < golesLocal!; i++) {
      eventos.push({
        type: 'goal',
        minute: Math.floor(Math.random() * 90) + 1,
        player: this.getRandomPlayer(),
        team: this.getFlag(equipoLocal),
        description: 'Gol de gran jugada'
      });
    }
    
    for (let i = 0; i < golesVisitante!; i++) {
      eventos.push({
        type: 'goal',
        minute: Math.floor(Math.random() * 90) + 1,
        player: this.getRandomPlayer(),
        team: this.getFlag(equipoVisitante),
        description: 'Gol de contraataque'
      });
    }
    
    // Generar tarjetas
    if (Math.random() > 0.5) {
      eventos.push({
        type: 'yellow_card',
        minute: Math.floor(Math.random() * 90) + 1,
        player: this.getRandomPlayer(),
        team: Math.random() > 0.5 ? this.getFlag(equipoLocal) : this.getFlag(equipoVisitante),
        description: 'Falta táctica'
      });
    }
    
    return eventos.sort((a, b) => a.minute - b.minute);
  }
}