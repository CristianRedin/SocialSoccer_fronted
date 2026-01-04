// src/app/presentation/pages/results/results.component.ts - COPA MUNDIAL 2026
// Componente para gestionar resultados del Mundial 2026: registrar resultados, ver historial y estadísticas

import { Component, OnInit } from '@angular/core'; // Importa decorador Component y interfaz OnInit para ciclo de vida
import { CommonModule } from '@angular/common'; // Importa CommonModule para directivas como *ngIf, *ngFor
import { FormsModule } from '@angular/forms'; // Importa FormsModule para formularios y two-way data binding [(ngModel)]

@Component({ // Decorador que define los metadatos del componente Angular
  selector: 'app-results', // Selector HTML para usar este componente: <app-results></app-results>
  standalone: true, // Componente standalone (independiente) de Angular 14+
  imports: [CommonModule, FormsModule], // Módulos que necesita este componente
  templateUrl: './results.html', // Ruta al archivo de plantilla HTML
  styleUrls: ['./results.scss'] // Ruta al archivo de estilos SCSS
})
export class ResultsComponent implements OnInit { // Clase del componente que implementa OnInit
  // ========== PARTE 1: REGISTRAR RESULTADO ==========
  showResultForm = false; // Controla si se muestra u oculta el formulario para registrar resultado
  
  // Objeto que almacena los datos del formulario para registrar un nuevo resultado
  resultForm = {
    tournament: 'Copa Mundial FIFA 2026', // Nombre del torneo (predefinido)
    phase: 'FASE DE GRUPOS', // Fase del torneo (seleccionable)
    homeTeam: '🇦🇷 Argentina', // Equipo local (predefinido como Argentina)
    awayTeam: '', // Equipo visitante (se selecciona)
    homeScore: null as number | null, // Marcador del equipo local (puede ser null)
    awayScore: null as number | null, // Marcador del equipo visitante (puede ser null)
    date: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
    stadium: 'Estadio Azteca', // Estadio donde se jugó el partido
    city: 'Ciudad de México', // Ciudad del estadio
    referee: '', // Nombre del árbitro
    mvp: '', // Jugador más valioso del partido
    events: [] as any[] // Array para almacenar eventos del partido (goles, tarjetas, etc.)
  };

  // Fases del Mundial 2026 - array con todas las fases posibles
  phases = ['FASE DE GRUPOS', 'OCTAVOS DE FINAL', 'CUARTOS DE FINAL', 'SEMIFINALES', 'TERCER PUESTO', 'FINAL'];
  
  // Selecciones del Mundial 2026 - array con las 16 selecciones participantes (con banderas emoji)
  worldCupTeams = [
    '🇦🇷 Argentina', '🇧🇷 Brasil', '🇺🇾 Uruguay', '🇨🇴 Colombia',
    '🇫🇷 Francia', '🇩🇪 Alemania', '🇪🇸 España', '🇮🇹 Italia',
    '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra', '🇵🇹 Portugal', '🇳🇱 Países Bajos', '🇧🇪 Bélgica',
    '🇺🇸 Estados Unidos', '🇲🇽 México', '🇨🇦 Canadá', '🇯🇵 Japón'
  ];

  // Estadios del Mundial 2026 - array con información de los estadios sede
  stadiums = [
    { name: 'Estadio Azteca', city: 'Ciudad de México', capacity: '87,000' },
    { name: 'SoFi Stadium', city: 'Los Ángeles', capacity: '70,240' },
    { name: 'MetLife Stadium', city: 'Nueva York', capacity: '82,500' },
    { name: 'AT&T Stadium', city: 'Dallas', capacity: '80,000' },
    { name: 'BC Place', city: 'Vancouver', capacity: '54,500' },
    { name: 'Estadio Azteca', city: 'Guadalajara', capacity: '48,071' }
  ];

  // ========== PARTE 2: VER RESULTADOS ANTERIORES ==========
  isLoading = false; // ✅ MODIFICADO: Cambiado de true a false para cargar instantáneamente
    
  // Partidos del Mundial 2026 (simulados) - array con partidos de ejemplo
  matches = [
    {
      id: 1, // ID único del partido
      tournament: 'Copa Mundial FIFA 2026', // Nombre del torneo
      phase: 'FASE DE GRUPOS', // Fase del torneo
      group: 'Grupo A', // Grupo (solo aplica para fase de grupos)
      date: '2026-06-11T20:00:00', // Fecha y hora del partido en formato ISO
      homeTeam: { name: '🇲🇽 México', flag: '🇲🇽', code: 'MEX' }, // Equipo local con nombre, bandera y código
      awayTeam: { name: '🇺🇸 Estados Unidos', flag: '🇺🇸', code: 'USA' }, // Equipo visitante
      homeScore: 2, // Goles del equipo local
      awayScore: 1, // Goles del equipo visitante
      stadium: 'Estadio Azteca', // Nombre del estadio
      city: 'Ciudad de México', // Ciudad del estadio
      attendance: '87,000', // Asistencia al partido
      referee: 'Daniele Orsato (ITA)', // Árbitro del partido
      mvp: { name: 'Hirving Lozano', goals: 1, team: 'México' }, // Jugador más valioso
      status: 'finalizado', // Estado del partido
      events: [ // Array de eventos que ocurrieron durante el partido
        { type: 'goal', minute: 23, player: 'Christian Pulisic', team: '🇺🇸 USA', description: 'Gol de tiro libre' },
        { type: 'goal', minute: 45, player: 'Hirving Lozano', team: '🇲🇽 MEX', description: 'Contraataque rápido' },
        { type: 'goal', minute: 78, player: 'Raúl Jiménez', team: '🇲🇽 MEX', description: 'Cabeza en corner' },
        { type: 'yellow_card', minute: 67, player: 'Weston McKennie', team: '🇺🇸 USA', description: 'Falta táctica' }
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
        { type: 'goal', minute: 12, player: 'Lionel Messi', team: '🇦🇷 ARG', description: 'Golazo desde fuera del área' },
        { type: 'goal', minute: 34, player: 'Julian Álvarez', team: '🇦🇷 ARG', description: 'Asistencia de Messi' },
        { type: 'goal', minute: 45, player: 'Kai Havertz', team: '🇩🇪 GER', description: 'Penal' },
        { type: 'goal', minute: 67, player: 'Lionel Messi', team: '🇦🇷 ARG', description: 'Tiro libre' },
        { type: 'goal', minute: 89, player: 'Jamal Musiala', team: '🇩🇪 GER', description: 'Gran jugada individual' },
        { type: 'yellow_card', minute: 55, player: 'Joshua Kimmich', team: '🇩🇪 GER', description: 'Entrada dura' }
      ]
    },
    {
      id: 3,
      tournament: 'Copa Mundial FIFA 2026',
      phase: 'FASE DE GRUPOS',
      group: 'Grupo C',
      date: '2026-06-13T14:00:00',
      homeTeam: { name: '🇧🇷 Brasil', flag: '🇧🇷', code: 'BRA' },
      awayTeam: { name: '🇫🇷 Francia', flag: '🇫🇷', code: 'FRA' },
      homeScore: 1,
      awayScore: 1,
      stadium: 'MetLife Stadium',
      city: 'Nueva York',
      attendance: '82,500',
      referee: 'Clément Turpin (FRA)',
      mvp: { name: 'Kylian Mbappé', goals: 1, team: 'Francia' },
      status: 'finalizado',
      events: [
        { type: 'goal', minute: 28, player: 'Neymar Jr', team: '🇧🇷 BRA', description: 'Regate y definición' },
        { type: 'goal', minute: 72, player: 'Kylian Mbappé', team: '🇫🇷 FRA', description: 'Contraataque veloz' },
        { type: 'yellow_card', minute: 45, player: 'Casemiro', team: '🇧🇷 BRA', description: 'Falta profesional' },
        { type: 'yellow_card', minute: 83, player: 'Aurélien Tchouaméni', team: '🇫🇷 FRA', description: 'Manos' }
      ]
    },
    {
      id: 4,
      tournament: 'Copa Mundial FIFA 2026',
      phase: 'OCTAVOS DE FINAL',
      group: null, // En fase de eliminación no hay grupo
      date: '2026-07-01T20:00:00',
      homeTeam: { name: '🇪🇸 España', flag: '🇪🇸', code: 'ESP' },
      awayTeam: { name: '🇵🇹 Portugal', flag: '🇵🇹', code: 'POR' },
      homeScore: 2,
      awayScore: 0,
      stadium: 'AT&T Stadium',
      city: 'Dallas',
      attendance: '80,000',
      referee: 'Danny Makkelie (NED)',
      mvp: { name: 'Pedri', goals: 1, assists: 1, team: 'España' },
      status: 'finalizado',
      events: [
        { type: 'goal', minute: 38, player: 'Gavi', team: '🇪🇸 ESP', description: 'Gran combinación' },
        { type: 'goal', minute: 67, player: 'Pedri', team: '🇪🇸 ESP', description: 'Disparo lejano' },
        { type: 'yellow_card', minute: 45, player: 'Pepe', team: '🇵🇹 POR', description: 'Protesta' },
        { type: 'red_card', minute: 85, player: 'Rúben Dias', team: '🇵🇹 POR', description: 'Último hombre' }
      ]
    }
  ];

  // ========== PARTE 3: ESTADÍSTICAS PERSONALES ==========
  userStats = { // Objeto con las estadísticas del jugador/usuario
    name: 'Cristiano Messi', // Nombre del jugador
    number: 5, // Número de camiseta
    team: '🇦🇷 Argentina', // Equipo del jugador
    position: 'Mediocampista Defensivo', // Posición en el campo
    
    // Estadísticas en el Mundial 2026
    matchesplayers: 4, // Partidos jugados
    goals: 0, // Goles anotados
    assists: 3, // Asistencias realizadas
    yellowCards: 1, // Tarjetas amarillas recibidas
    redCards: 0, // Tarjetas rojas recibidas
    minutesplayers: 360, // Minutos jugados (90 min x 4 partidos)
    passes: 245, // Pases completados
    passAccuracy: 92, // Precisión de pases en porcentaje
    tackles: 18, // Entradas realizadas
    interceptions: 12, // Intercepciones realizadas
    mvpCount: 1, // Veces elegido jugador del partido
    averageRating: 7.8, // Calificación promedio por partido
    
    // Partidos jugados en el Mundial - array con detalles de cada partido
    worldCupMatches: [
      { opponent: '🇩🇪 Alemania', result: 'W 3-2', rating: 8.5, minutes: 90 }, // W = Win (Victoria)
      { opponent: '🇸🇦 Arabia Saudita', result: 'W 2-0', rating: 7.0, minutes: 90 },
      { opponent: '🇵🇱 Polonia', result: 'W 2-0', rating: 8.0, minutes: 90 },
      { opponent: '🇦🇺 Australia', result: 'W 2-1', rating: 7.5, minutes: 90 }
    ],
    
    // Próximos partidos - objeto con información del próximo encuentro
    nextMatch: {
      opponent: '🇳🇱 Países Bajos', // Próximo rival
      date: '2026-07-05', // Fecha del partido
      stadium: 'BC Place', // Estadio
      city: 'Vancouver', // Ciudad
      phase: 'CUARTOS DE FINAL' // Fase del torneo
    }
  };

  constructor() { // Constructor del componente - se ejecuta al crear instancia
    console.log('🌎 Results Component - COPA MUNDIAL 2026'); // Mensaje de depuración en consola
  }

  ngOnInit(): void { // Método del ciclo de vida OnInit - se ejecuta después del constructor
    // ✅ MODIFICADO: Eliminado el setTimeout para carga instantánea
    // Los resultados ahora se cargan inmediatamente sin delay
    this.isLoading = false; // Ya no hay estado de carga
  }

  // ========== MÉTODOS ==========
  openResultForm(): void { // Abre el formulario para registrar nuevo resultado
    this.showResultForm = true; // Cambia la variable para mostrar el formulario
  }

  closeResultForm(): void { // Cierra el formulario de registro
    this.showResultForm = false; // Oculta el formulario
    this.resetForm(); // Reinicia los valores del formulario
  }

  submitResult(): void { // Envía el formulario con el nuevo resultado
    if (!this.validateResultForm()) return; // Valida el formulario antes de proceder
    
    const isGroupStage = this.resultForm.phase === 'FASE DE GRUPOS'; // Verifica si es fase de grupos
    const newMatch = { // Crea un nuevo objeto de partido
      id: this.matches.length + 1, // Asigna un nuevo ID secuencial
      tournament: 'Copa Mundial FIFA 2026', // Nombre del torneo
      phase: this.resultForm.phase, // Fase seleccionada
      group: isGroupStage ? 'Grupo A' : null, // Si es fase de grupos asigna grupo, sino null
      date: new Date().toISOString(), // Fecha y hora actual en formato ISO
      homeTeam: { // Información del equipo local
        name: this.resultForm.homeTeam,
        flag: this.getFlag(this.resultForm.homeTeam), // Obtiene bandera emoji
        code: this.getCountryCode(this.resultForm.homeTeam) // Obtiene código de 3 letras
      },
      awayTeam: { // Información del equipo visitante
        name: this.resultForm.awayTeam,
        flag: this.getFlag(this.resultForm.awayTeam),
        code: this.getCountryCode(this.resultForm.awayTeam)
      },
      homeScore: this.resultForm.homeScore!, // Marcador local (! indica que no es null)
      awayScore: this.resultForm.awayScore!, // Marcador visitante
      stadium: this.resultForm.stadium, // Estadio seleccionado
      city: this.resultForm.city, // Ciudad del estadio
      attendance: '75,000', // Asistencia estimada (valor por defecto)
      referee: this.resultForm.referee, // Árbitro ingresado
      mvp: this.resultForm.mvp ? { // Si se especificó MVP, crea objeto
        name: this.resultForm.mvp, 
        team: this.getCountryCode(this.resultForm.homeTeam) // Equipo del MVP
      } : null, // Si no hay MVP, es null
      status: 'finalizado', // Estado del partido
      events: this.resultForm.events // Eventos registrados (goles, tarjetas, etc.)
    } as const; // 'as const' hace que el objeto sea de solo lectura

    this.matches.unshift(newMatch as any); // Agrega el nuevo partido al INICIO del array
    alert('✅ Resultado del Mundial registrado exitosamente'); // Muestra alerta de éxito
    this.closeResultForm(); // Cierra y limpia el formulario
    
    // Actualizar estadísticas del usuario
    this.updateUserStats();
  }

  updateUserStats(): void { // Simula actualización de estadísticas del jugador
    // Simular actualización de estadísticas
    this.userStats.matchesplayers++; // Incrementa partidos jugados
    this.userStats.minutesplayers += 90; // Suma 90 minutos (un partido completo)
  }

  getFlag(countryName: string): string { // Obtiene el emoji de bandera basado en nombre del país
    const flags: {[key: string]: string} = { // Objeto que mapea nombres de países a emojis
      'Argentina': '🇦🇷', 'Brasil': '🇧🇷', 'Uruguay': '🇺🇾', 'Colombia': '🇨🇴',
      'Francia': '🇫🇷', 'Alemania': '🇩🇪', 'España': '🇪🇸', 'Italia': '🇮🇹',
      'Inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Portugal': '🇵🇹', 'Países Bajos': '🇳🇱', 'Bélgica': '🇧🇪',
      'Estados Unidos': '🇺🇸', 'México': '🇲🇽', 'Canadá': '🇨🇦', 'Japón': '🇯🇵'
    };
    
    const country = countryName.replace(/🇦🇷|🇧🇷|🇺🇾|🇨🇴|🇫🇷|🇩🇪|🇪🇸|🇮🇹|🏴󠁧󠁢󠁥󠁮󠁧󠁿|🇵🇹|🇳🇱|🇧🇪|🇺🇸|🇲🇽|🇨🇦|🇯🇵/g, '').trim(); // Remueve emojis existentes
    return flags[country] || '🏴'; // Retorna bandera o bandera genérica si no encuentra
  }

  getCountryCode(countryName: string): string { // Obtiene código de país de 3 letras (FIFA)
    const codes: {[key: string]: string} = { // Objeto que mapea nombres de países a códigos
      'Argentina': 'ARG', 'Brasil': 'BRA', 'Uruguay': 'URU', 'Colombia': 'COL',
      'Francia': 'FRA', 'Alemania': 'GER', 'España': 'ESP', 'Italia': 'ITA',
      'Inglaterra': 'ENG', 'Portugal': 'POR', 'Países Bajos': 'NED', 'Bélgica': 'BEL',
      'Estados Unidos': 'USA', 'México': 'MEX', 'Canadá': 'CAN', 'Japón': 'JPN'
    };
    
    const country = countryName.replace(/🇦🇷|🇧🇷|🇺🇾|🇨🇴|🇫🇷|🇩🇪|🇪🇸|🇮🇹|🏴󠁧󠁢󠁥󠁮󠁧󠁿|🇵🇹|🇳🇱|🇧🇪|🇺🇸|🇲🇽|🇨🇦|🇯🇵/g, '').trim(); // Remueve emojis
    return codes[country] || 'XXX'; // Retorna código o 'XXX' si no encuentra
  }

  validateResultForm(): boolean { // Valida que el formulario esté completo y correcto
    if (!this.resultForm.phase) { // Si no se seleccionó fase
      alert('Selecciona la fase del torneo');
      return false;
    }
    if (!this.resultForm.awayTeam) { // Si no se seleccionó equipo rival
      alert('Selecciona el equipo rival');
      return false;
    }
    if (this.resultForm.homeScore === null || this.resultForm.awayScore === null) { // Si no hay marcador
      alert('Ingresa el marcador');
      return false;
    }
    if (this.resultForm.homeTeam === this.resultForm.awayTeam) { // Si equipo local y visitante son iguales
      alert('No puede jugar contra sí mismo');
      return false;
    }
    return true; // Si pasa todas las validaciones
  }

  resetForm(): void { // Reinicia el formulario a valores por defecto
    this.resultForm = {
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
      mvp: '',
      events: []
    };
  }

  formatDate(dateString: string): string { // Formatea fecha ISO a formato legible en español
    const date = new Date(dateString); // Crea objeto Date desde string
    return date.toLocaleDateString('es-ES', { // Formatea a español
      day: '2-digit', // Día con 2 dígitos (01, 02, ...)
      month: '2-digit', // Mes con 2 dígitos (01, 02, ...)
      year: 'numeric', // Año completo (2026)
      hour: '2-digit', // Hora con 2 dígitos (00-23)
      minute: '2-digit' // Minutos con 2 dígitos (00-59)
    });
  }

  getEventIcon(type: string): string { // Retorna emoji según tipo de evento del partido
    switch(type) { // Evalúa tipo de evento
      case 'goal': return '⚽'; // Gol
      case 'yellow_card': return '🟨'; // Tarjeta amarilla
      case 'red_card': return '🟥'; // Tarjeta roja
      case 'substitution': return '🔄'; // Cambio de jugador
      default: return '⚪'; // Evento desconocido
    }
  }

  getStadiumInfo(stadiumName: string): any { // Busca información de estadio por nombre
    return this.stadiums.find(s => s.name === stadiumName) ||  // Busca en array de estadios
            { name: stadiumName, city: 'Desconocido', capacity: '0' }; // Si no encuentra, retorna objeto por defecto
  }
}