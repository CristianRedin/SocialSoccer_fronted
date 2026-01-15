export interface Resultado {
  id?: number;
  equipoLocal: string;
  equipoVisitante: string;
  golesLocal: number;
  golesVisitante: number;
  fecha: Date | string;
  jornada: number;
  temporada: string;
  arbitro: string;
  estado?: string;
  fecha_creacion?: string;
  fecha_modificacion?: string;
  
  // Campos adicionales para mostrar
  equipoLocal_nombre?: string;
  equipoLocal_escudo?: string;
  equipoVisitante_nombre?: string;
  equipoVisitante_escudo?: string;
  arbitro_nombre?: string;
  arbitro_apellido?: string;
  total_goles?: number;
  ganador?: string;
  resultado_tipo?: string;
  diferencia_goles?: number;
  condicion?: 'Local' | 'Visitante';
  resultado?: 'Victoria' | 'Empate' | 'Derrota';
}

export interface ResultadoResponse {
  message: string;
  resultado: Resultado;
}

export interface ResultadosListResponse {
  message: string;
  resultados: Resultado[];
  total: number;
}

export interface EstadisticasResponse {
  message: string;
  estadisticas: {
    total_partidos: number;
    total_goles: number;
    promedio_goles_partido: number;
    max_goles_partido: number;
    min_goles_partido: number;
    victorias_local: number;
    victorias_visitante: number;
    empates: number;
    total_jornadas: number;
    total_temporadas: number;
  };
}

export interface BusquedaParams {
  q?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  jornada?: number;
  temporada?: string;
  limite?: number;
}

export interface PartidoMundial {
  id: number;
  tournament: string;
  phase: string;
  group?: string | null;
  date: string;
  homeTeam: {
    name: string;
    flag: string;
    code: string;
  };
  awayTeam: {
    name: string;
    flag: string;
    code: string;
  };
  homeScore: number;
  awayScore: number;
  stadium: string;
  city: string;
  attendance: string;
  referee: string;
  mvp: {
    name: string;
    goals?: number;
    assists?: number;
    team: string;
  };
  status: string;
  events: any[];
}