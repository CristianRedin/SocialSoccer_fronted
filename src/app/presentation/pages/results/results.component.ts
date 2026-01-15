// src/app/presentation/pages/results/results.component.ts - COPA MUNDIAL 2026
// COMPONENTE CORREGIDO - Carga instantánea

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResultsService } from '../../../data/services/results/results.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './results.html',
  styleUrls: ['./results.scss']
})
export class ResultsComponent implements OnInit {
  // ========== CONFIGURACIÓN ==========
  private readonly BACKEND_DISABLED = false;
  backendAvailable = false;
  isLoadingBackend = false;
  
  // ========== PARTE 1: REGISTRAR RESULTADO ==========
  showResultForm = false;
  
  // Formulario para crear resultado en backend
  resultForm = {
    equipoLocal: 'Argentina',
    equipoVisitante: '',
    golesLocal: null as number | null,
    golesVisitante: null as number | null,
    fecha: new Date().toISOString().split('T')[0],
    jornada: 1,
    temporada: '2024-2025',
    arbitro: ''
  };

  // Formulario para Mundial 2026 (simulado)
  worldCupForm = {
    tournament: 'Copa Mundial FIFA 2026',
    phase: 'FASE DE GRUPOS',
    homeTeam: '🇦🇷 Argentina',
    awayTeam: '',
    homeScore: null as number | null,
    awayScore: null as number | null,
    date: new Date().toISOString().split('T')[0],
    stadium: 'Estadio Azteca',
    city: 'Ciudad de México',
    referee: '',
    mvp: ''
  };

  phases = ['FASE DE GRUPOS', 'OCTAVOS DE FINAL', 'CUARTOS DE FINAL', 'SEMIFINALES', 'TERCER PUESTO', 'FINAL'];
  
  worldCupTeams = [
    '🇦🇷 Argentina', '🇧🇷 Brasil', '🇺🇾 Uruguay', '🇨🇴 Colombia',
    '🇫🇷 Francia', '🇩🇪 Alemania', '🇪🇸 España', '🇮🇹 Italia',
    '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra', '🇵🇹 Portugal', '🇳🇱 Países Bajos', '🇧🇪 Bélgica',
    '🇺🇸 Estados Unidos', '🇲🇽 México', '🇨🇦 Canadá', '🇯🇵 Japón'
  ];

  backendTeams = [
    'Argentina', 'Brasil', 'Uruguay', 'Colombia',
    'Francia', 'Alemania', 'España', 'Italia',
    'Inglaterra', 'Portugal', 'Países Bajos', 'Bélgica',
    'Estados Unidos', 'México', 'Canadá', 'Japón'
  ];

  stadiums = [
    { name: 'Estadio Azteca', city: 'Ciudad de México', capacity: '87,000' },
    { name: 'SoFi Stadium', city: 'Los Ángeles', capacity: '70,240' },
    { name: 'MetLife Stadium', city: 'Nueva York', capacity: '82,500' },
    { name: 'AT&T Stadium', city: 'Dallas', capacity: '80,000' },
    { name: 'BC Place', city: 'Vancouver', capacity: '54,500' }
  ];

  // ========== PARTE 2: DATOS ==========
  // ¡¡¡IMPORTANTE!!! Cambiado a FALSE para carga instantánea
  isLoading = false;
  
  resultadosBackend: any[] = [];
  matches: any[] = [];
  matchesToShow: any[] = [];
  estadisticasBackend: any = null;

  // ========== PARTE 3: ESTADÍSTICAS PERSONALES ==========
  userStats = {
    name: 'Cristiano Messi',
    number: 5,
    team: '🇦🇷 Argentina',
    position: 'Mediocampista Defensivo',
    matchesplayers: 4,
    goals: 0,
    assists: 3,
    yellowCards: 1,
    redCards: 0,
    minutesplayers: 360,
    passes: 245,
    passAccuracy: 92,
    tackles: 18,
    interceptions: 12,
    mvpCount: 1,
    averageRating: 7.8,
    
    worldCupMatches: [
      { opponent: '🇩🇪 Alemania', result: 'W 3-2', rating: 8.5, minutes: 90 },
      { opponent: '🇸🇦 Arabia Saudita', result: 'W 2-0', rating: 7.0, minutes: 90 },
      { opponent: '🇵🇱 Polonia', result: 'W 2-0', rating: 8.0, minutes: 90 },
      { opponent: '🇦🇺 Australia', result: 'W 2-1', rating: 7.5, minutes: 90 }
    ],
    
    nextMatch: {
      opponent: '🇳🇱 Países Bajos',
      date: '2026-07-05',
      stadium: 'BC Place',
      city: 'Vancouver',
      phase: 'CUARTOS DE FINAL'
    }
  };

  currentFilter = 'all';
  currentPhase = 'all';

  constructor(private resultsService: ResultsService) {
    console.log('🌎 Results Component - Cargando...');
  }

  ngOnInit(): void {
    console.log('✅ ngOnInit ejecutado');
    
    // 1. Cargar datos simulados INMEDIATAMENTE
    this.loadSimulatedData();
    console.log('✅ Datos simulados cargados:', this.matches.length, 'partidos');
    
    // 2. Intentar conectar con backend (en segundo plano)
    if (!this.BACKEND_DISABLED) {
      console.log('🔄 Intentando conectar con backend...');
      this.testBackendConnection();
    } else {
      console.log('🎮 Modo solo simulado');
    }
  }

  // ========== MÉTODOS DE CARGA ==========

  private loadSimulatedData(): void {
    // Datos simulados del Mundial 2026 (MÍNIMOS para mostrar algo)
    this.matches = [
      {
        id: 1,
        tournament: 'Copa Mundial FIFA 2026',
        phase: 'FASE DE GRUPOS',
        group: 'Grupo A',
        date: '2026-06-11T20:00:00',
        homeTeam: { name: '🇲🇽 México', flag: '🇲🇽', code: 'MEX' },
        awayTeam: { name: '🇺🇸 Estados Unidos', flag: '🇺🇸', code: 'USA' },
        homeScore: 2,
        awayScore: 1,
        stadium: 'Estadio Azteca',
        city: 'Ciudad de México',
        attendance: '87,000',
        referee: 'Daniele Orsato (ITA)',
        mvp: { name: 'Hirving Lozano', goals: 1, team: 'México' },
        status: 'finalizado',
        events: [
          { type: 'goal', minute: 23, player: 'Christian Pulisic', team: '🇺🇸 USA', description: 'Gol de tiro libre' },
          { type: 'goal', minute: 45, player: 'Hirving Lozano', team: '🇲🇽 MEX', description: 'Contraataque rápido' }
        ]
      },
      {
        id: 2,
        tournament: 'Copa Mundial FIFA 2026',
        phase: 'FASE DE GRUPOS',
        group: 'Grupo B',
        date: '2026-06-12T17:00:00',
        homeTeam: { name: '🇦🇷 Argentina', flag: '🇦🇷', code: 'ARG' },
        awayTeam: { name: '🇩🇪 Alemania', flag: '🇩🇪', code: 'GER' },
        homeScore: 3,
        awayScore: 2,
        stadium: 'SoFi Stadium',
        city: 'Los Ángeles',
        attendance: '70,240',
        referee: 'Anthony Taylor (ENG)',
        mvp: { name: 'Lionel Messi', goals: 2, assists: 1, team: 'Argentina' },
        status: 'finalizado',
        events: [
          { type: 'goal', minute: 12, player: 'Lionel Messi', team: '🇦🇷 ARG', description: 'Golazo' }
        ]
      }
    ];
    
    this.matchesToShow = [...this.matches];
    console.log('🎯 matchesToShow listo:', this.matchesToShow.length);
  }

  private testBackendConnection(): void {
    this.isLoadingBackend = true;
    
    // Timeout de seguridad
    const timeout = setTimeout(() => {
      console.log('⏰ Timeout: Backend no responde');
      this.backendAvailable = false;
      this.isLoadingBackend = false;
      console.log('🎮 Continuando con datos simulados');
    }, 3000);
    
    this.resultsService.getAllResultados().subscribe({
      next: (data: any) => {
        clearTimeout(timeout);
        this.backendAvailable = true;
        this.resultadosBackend = Array.isArray(data) ? data : [];
        console.log('✅ Backend conectado. Resultados:', this.resultadosBackend.length);
        
        // Actualizar UI
        this.convertBackendToWorldCup();
        this.loadBackendStats();
      },
      error: (error) => {
        clearTimeout(timeout);
        this.backendAvailable = false;
        console.log('⚠️ Error de conexión:', error.message);
        console.log('🎮 Usando datos simulados');
      },
      complete: () => {
        this.isLoadingBackend = false;
        console.log('🏁 Conexión al backend finalizada');
      }
    });
  }

  private convertBackendToWorldCup(): void {
    if (this.resultadosBackend.length > 0) {
      console.log('🔄 Convirtiendo resultados del backend...');
      
      try {
        const convertedMatches = this.resultadosBackend
          .slice(0, Math.min(3, this.resultadosBackend.length))
          .map((resultado: any) => {
            return this.convertResultadoToMatch(resultado);
          });
        
        // Combinar con datos simulados
        this.matchesToShow = [...convertedMatches, ...this.matches];
        console.log('✅ Datos combinados:', this.matchesToShow.length, 'partidos');
      } catch (error) {
        console.error('❌ Error en conversión:', error);
        // Mantener datos simulados
      }
    }
  }

  private convertResultadoToMatch(resultado: any): any {
    return {
      id: resultado.id || Date.now(),
      tournament: 'Copa Mundial FIFA 2026',
      phase: this.determinarFase(resultado.jornada || 1),
      group: this.determinarGrupo(resultado.equipoLocal, resultado.equipoVisitante),
      date: resultado.fecha ? new Date(resultado.fecha).toISOString() : new Date().toISOString(),
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
      stadium: 'Estadio ' + (resultado.arbitro?.split(' ')[0] || 'Mundial'),
      city: this.getRandomCity(),
      attendance: Math.floor(Math.random() * 50000 + 30000).toLocaleString() + ' espectadores',
      referee: resultado.arbitro || 'Árbitro FIFA',
      mvp: {
        name: this.getRandomPlayer(),
        team: this.getCountryCode(resultado.equipoLocal),
        goals: Math.max(resultado.golesLocal || 0, resultado.golesVisitante || 0)
      },
      status: 'finalizado',
      events: this.generateEvents(resultado.golesLocal || 0, resultado.golesVisitante || 0, 
        resultado.equipoLocal, resultado.equipoVisitante)
    };
  }

  private loadBackendStats(): void {
    this.resultsService.getEstadisticasGenerales().subscribe({
      next: (data: any) => {
        if (data && data.estadisticas) {
          this.estadisticasBackend = data.estadisticas;
          console.log('📊 Estadísticas cargadas');
        }
      },
      error: () => {
        console.log('⚠️ No se pudieron cargar estadísticas');
      }
    });
  }

  // ========== MÉTODOS DEL FORMULARIO ==========

  openResultForm(): void {
    this.showResultForm = true;
  }

  closeResultForm(): void {
    this.showResultForm = false;
    this.resetForms();
  }

  submitResult(): void {
    if (this.backendAvailable) {
      this.submitToBackend();
    } else {
      this.submitToSimulated();
    }
  }

  private submitToBackend(): void {
    if (!this.validateBackendForm()) return;
    
    const resultado = {
      equipoLocal: this.resultForm.equipoLocal,
      equipoVisitante: this.resultForm.equipoVisitante,
      golesLocal: this.resultForm.golesLocal!,
      golesVisitante: this.resultForm.golesVisitante!,
      fecha: this.resultForm.fecha,
      jornada: this.resultForm.jornada,
      temporada: this.resultForm.temporada,
      arbitro: this.resultForm.arbitro || 'Árbitro FIFA'
    };
    
    console.log('📤 Enviando al backend:', resultado);
    
    this.resultsService.createResultado(resultado).subscribe({
      next: (response: any) => {
        alert('✅ Resultado registrado en el backend');
        
        // Actualizar lista localmente
        if (response && response.resultado) {
          this.resultadosBackend.unshift(response.resultado);
        }
        this.convertBackendToWorldCup();
        
        this.closeResultForm();
        this.updateUserStats();
      },
      error: (error) => {
        console.error('❌ Error al guardar:', error);
        alert('❌ Error. Usando modo simulado.');
        this.submitToSimulated();
      }
    });
  }

  private submitToSimulated(): void {
    if (!this.validateWorldCupForm()) return;
    
    const newMatch = {
      id: Date.now(), // ID único
      tournament: 'Copa Mundial FIFA 2026',
      phase: this.worldCupForm.phase,
      group: this.worldCupForm.phase === 'FASE DE GRUPOS' ? 'Grupo A' : null,
      date: new Date().toISOString(),
      homeTeam: {
        name: this.worldCupForm.homeTeam,
        flag: this.getFlag(this.worldCupForm.homeTeam),
        code: this.getCountryCode(this.worldCupForm.homeTeam)
      },
      awayTeam: {
        name: this.worldCupForm.awayTeam,
        flag: this.getFlag(this.worldCupForm.awayTeam),
        code: this.getCountryCode(this.worldCupForm.awayTeam)
      },
      homeScore: this.worldCupForm.homeScore!,
      awayScore: this.worldCupForm.awayScore!,
      stadium: this.worldCupForm.stadium,
      city: this.worldCupForm.city,
      attendance: '75,000',
      referee: this.worldCupForm.referee,
      mvp: this.worldCupForm.mvp ? { 
        name: this.worldCupForm.mvp, 
        team: this.getCountryCode(this.worldCupForm.homeTeam)
      } : { name: 'Jugador Destacado', team: this.getCountryCode(this.worldCupForm.homeTeam) },
      status: 'finalizado',
      events: this.generateEvents(this.worldCupForm.homeScore!, this.worldCupForm.awayScore!, 
        this.worldCupForm.homeTeam, this.worldCupForm.awayTeam)
    };
    
    this.matches.unshift(newMatch);
    this.matchesToShow.unshift(newMatch);
    
    alert('✅ Resultado del Mundial registrado (simulado)');
    this.closeResultForm();
    this.updateUserStats();
  }

  // ========== VALIDACIONES ==========

  private validateBackendForm(): boolean {
    if (!this.resultForm.equipoVisitante) {
      alert('Selecciona el equipo visitante');
      return false;
    }
    if (this.resultForm.golesLocal === null || this.resultForm.golesVisitante === null) {
      alert('Ingresa el marcador completo');
      return false;
    }
    if (this.resultForm.equipoLocal === this.resultForm.equipoVisitante) {
      alert('No puede jugar contra sí mismo');
      return false;
    }
    return true;
  }

  private validateWorldCupForm(): boolean {
    if (!this.worldCupForm.phase) {
      alert('Selecciona la fase del torneo');
      return false;
    }
    if (!this.worldCupForm.awayTeam) {
      alert('Selecciona el equipo rival');
      return false;
    }
    if (this.worldCupForm.homeScore === null || this.worldCupForm.awayScore === null) {
      alert('Ingresa el marcador');
      return false;
    }
    if (this.worldCupForm.homeTeam === this.worldCupForm.awayTeam) {
      alert('No puede jugar contra sí mismo');
      return false;
    }
    return true;
  }

  // ========== UTILIDADES ==========

  private resetForms(): void {
    this.resultForm = {
      equipoLocal: 'Argentina',
      equipoVisitante: '',
      golesLocal: null,
      golesVisitante: null,
      fecha: new Date().toISOString().split('T')[0],
      jornada: 1,
      temporada: '2024-2025',
      arbitro: ''
    };
    
    this.worldCupForm = {
      tournament: 'Copa Mundial FIFA 2026',
      phase: 'FASE DE GRUPOS',
      homeTeam: '🇦🇷 Argentina',
      awayTeam: '',
      homeScore: null,
      awayScore: null,
      date: new Date().toISOString().split('T')[0],
      stadium: 'Estadio Azteca',
      city: 'Ciudad de México',
      referee: '',
      mvp: ''
    };
  }

  updateUserStats(): void {
    this.userStats.matchesplayers++;
    this.userStats.minutesplayers += 90;
  }

  private determinarFase(jornada: number): string {
    if (jornada <= 3) return 'FASE DE GRUPOS';
    if (jornada === 4) return 'OCTAVOS DE FINAL';
    if (jornada === 5) return 'CUARTOS DE FINAL';
    if (jornada === 6) return 'SEMIFINALES';
    if (jornada === 7) return 'TERCER PUESTO';
    return 'FINAL';
  }

  private determinarGrupo(equipo1: string, equipo2: string): string {
    const grupos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const hash = (equipo1 + equipo2).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `Grupo ${grupos[hash % grupos.length]}`;
  }

  getFlag(countryName: string): string {
    const flags: {[key: string]: string} = {
      'Argentina': '🇦🇷', 'Brasil': '🇧🇷', 'Uruguay': '🇺🇾', 'Colombia': '🇨🇴',
      'Francia': '🇫🇷', 'Alemania': '🇩🇪', 'España': '🇪🇸', 'Italia': '🇮🇹',
      'Inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Portugal': '🇵🇹', 'Países Bajos': '🇳🇱', 'Bélgica': '🇧🇪',
      'Estados Unidos': '🇺🇸', 'México': '🇲🇽', 'Canadá': '🇨🇦', 'Japón': '🇯🇵'
    };
    
    const country = countryName.replace(/🇦🇷|🇧🇷|🇺🇾|🇨🇴|🇫🇷|🇩🇪|🇪🇸|🇮🇹|🏴󠁧󠁢󠁥󠁮󠁧󠁿|🇵🇹|🇳🇱|🇧🇪|🇺🇸|🇲🇽|🇨🇦|🇯🇵/g, '').trim();
    return flags[country] || '🏴';
  }

  getCountryCode(countryName: string): string {
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
    const cities = ['Ciudad de México', 'Los Ángeles', 'Nueva York', 'Dallas', 'Vancouver'];
    return cities[Math.floor(Math.random() * cities.length)];
  }

  private getRandomPlayer(): string {
    const players = [
      'Lionel Messi', 'Kylian Mbappé', 'Cristiano Ronaldo', 'Neymar Jr', 
      'Kevin De Bruyne', 'Harry Kane', 'Karim Benzema'
    ];
    return players[Math.floor(Math.random() * players.length)];
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha no disponible';
    }
  }

  getEventIcon(type: string): string {
    switch(type) {
      case 'goal': return '⚽';
      case 'yellow_card': return '🟨';
      case 'red_card': return '🟥';
      default: return '⚪';
    }
  }

  private generateEvents(homeScore: number, awayScore: number, homeTeam: string, awayTeam: string): any[] {
    const events = [];
    
    // Goles locales
    for (let i = 0; i < homeScore; i++) {
      events.push({
        type: 'goal',
        minute: Math.floor(Math.random() * 90) + 1,
        player: this.getRandomPlayer(),
        team: this.getFlag(homeTeam),
        description: 'Gol de gran jugada'
      });
    }
    
    // Goles visitantes
    for (let i = 0; i < awayScore; i++) {
      events.push({
        type: 'goal',
        minute: Math.floor(Math.random() * 90) + 1,
        player: this.getRandomPlayer(),
        team: this.getFlag(awayTeam),
        description: 'Gol de contraataque'
      });
    }
    
    // Tarjeta amarilla (50% de probabilidad)
    if (Math.random() > 0.5) {
      events.push({
        type: 'yellow_card',
        minute: Math.floor(Math.random() * 90) + 1,
        player: this.getRandomPlayer(),
        team: Math.random() > 0.5 ? this.getFlag(homeTeam) : this.getFlag(awayTeam),
        description: 'Falta táctica'
      });
    }
    
    return events.sort((a, b) => a.minute - b.minute);
  }

  // ========== FILTROS ==========

  filterByPhase(phase: string): void {
    this.currentPhase = phase;
    
    if (phase === 'all') {
      this.matchesToShow = [...this.matches];
      if (this.resultadosBackend.length > 0) {
        const converted = this.resultadosBackend
          .slice(0, Math.min(3, this.resultadosBackend.length))
          .map(r => this.convertResultadoToMatch(r));
        this.matchesToShow = [...converted, ...this.matches];
      }
    } else {
      this.matchesToShow = this.matches.filter(match => match.phase === phase);
    }
  }

  getBackendStatusText(): string {
    if (this.isLoadingBackend) return '🔄 Conectando con backend...';
    if (this.backendAvailable) return `✅ Conectado (${this.resultadosBackend.length} resultados)`;
    return '⚠️ Usando datos simulados';
  }

  getTotalMatches(): number {
    return this.matchesToShow.length;
  }
}