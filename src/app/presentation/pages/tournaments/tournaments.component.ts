// src/app/presentation/pages/tournaments/tournaments.component.ts
// Componente para gestionar torneos (crear, ver, filtrar, ver detalles)

import { Component, OnInit } from '@angular/core'; // Importa Component y OnInit para crear componente con ciclo de vida
import { CommonModule, DatePipe } from '@angular/common'; // CommonModule para directivas comunes, DatePipe para formatear fechas
import { RouterModule } from '@angular/router'; // Para navegación y enrutamiento entre páginas
import { FormsModule } from '@angular/forms'; // ✅ AGREGAR ESTO: Para formularios con two-way data binding [(ngModel)]

// Definir interfaces locales porque no están en el modelo importado
// Estas interfaces definen la estructura de datos que se usará en este componente

interface Prize { // Define estructura para premios del torneo
  position: number; // Posición en el torneo (1ro, 2do, etc.)
  amount: string; // Monto del premio en formato string
  description: string; // Descripción detallada del premio
}

interface Match { // Define estructura para partidos
  id: string; // Identificador único del partido
  date: Date; // Fecha del partido
  time: string; // Hora del partido
  homeTeam: string; // Nombre del equipo local
  awayTeam: string; // Nombre del equipo visitante
  score?: string; // Resultado del partido (opcional si aún no se juega)
  location: string; // Lugar donde se juega el partido
  status: 'scheduled' | 'in-progress' | 'finished' | 'cancelled'; // Estado del partido
}

interface Team { // Define estructura para equipos
  id: string; // Identificador único del equipo
  name: string; // Nombre del equipo
  logo: string; // Logo/emoji del equipo
  captain: string; // Nombre del capitán
  played: number; // ✅ CAMBIAR de players a played: Partidos jugados por el equipo
  wins: number; // Partidos ganados
  draws: number; // Partidos empatados
  losses: number; // Partidos perdidos
  points: number; // Puntos acumulados (3 por victoria, 1 por empate)
  goalsFor: number; // Goles a favor
  goalsAgainst: number; // Goles en contra
}

interface Standing { // Define estructura para posiciones en tabla
  position: number; // Posición en la tabla (1, 2, 3, etc.)
  team: Team; // Referencia al equipo
  played: number; // ✅ CAMBIAR de players a played: Partidos jugados
  wins: number; // Victorias
  draws: number; // Empates
  losses: number; // Derrotas
  points: number; // Puntos totales
  goalsFor: number; // Goles a favor
  goalsAgainst: number; // Goles en contra
  goalDifference: number; // Diferencia de goles (goles a favor - goles en contra)
}

interface BracketMatch { // Define estructura para partidos de llave/eliminatoria
  id: string; // Identificador único del partido
  round: 'quarter' | 'semi' | 'final'; // Ronda del torneo (cuartos, semifinal, final)
  matchNumber: number; // Número del partido en la ronda
  team1: { name: string; score?: number }; // Información del equipo 1
  team2: { name: string; score?: number }; // Información del equipo 2
  winner?: string; // Ganador del partido (si ya se jugó)
  date: Date; // Fecha del partido
  completed: boolean; // Si el partido ya se completó
}

interface Statistics { // Define estructura para estadísticas del torneo
  totalMatches: number; // Total de partidos programados
  matchesPlayed: number; // ✅ CAMBIAR de matchesPlayers a matchesPlayed: Partidos jugados
  goalsScored: number; // Total de goles anotados
  averageGoals: number; // Promedio de goles por partido
  topScorer: { name: string; team: string; goals: number }; // Máximo goleador
  bestTeam: { name: string; points: number }; // Mejor equipo (más puntos)
}

interface TournamentDetail { // Define estructura para detalles completos de un torneo
  id: string; // ID del torneo
  name: string; // Nombre del torneo
  description: string; // Descripción detallada
  rules: string[]; // Lista de reglas
  prizes: Prize[]; // Lista de premios
  calendar: Match[]; // Calendario de partidos
  teams: Team[]; // Lista de equipos participantes
  standings: Standing[]; // Tabla de posiciones
  brackets: BracketMatch[]; // Llaves del torneo
  statistics: Statistics; // Estadísticas generales
}

// Importar del modelo (ajusta la ruta según tu estructura)
// Importa las interfaces principales desde el modelo central de la aplicación
import { Tournament, TournamentStatus, TournamentType } from '../../../core/models/tournament.model';

// Decorador @Component que define metadatos del componente Angular
@Component({
  selector: 'app-tournaments', // Selector CSS para usar este componente en templates HTML: <app-tournaments>
  standalone: true, // Indica que es componente independiente (Angular 14+), no necesita ser declarado en módulo
  imports: [CommonModule, RouterModule, FormsModule], // ✅ AGREGAR FormsModule: Importa módulo para formularios
  templateUrl: './tournaments.html', // Ruta al archivo de plantilla HTML
  styleUrls: ['./tournaments.scss'], // Ruta al archivo de estilos SCSS
  providers: [DatePipe] // Provee DatePipe como servicio inyectable para formatear fechas
})
export class TournamentsComponent implements OnInit { // Clase del componente que implementa OnInit para ciclo de vida
  // Propiedades existentes...
  
  // Exporta los enums para poder usarlos en la plantilla HTML
  TournamentStatus = TournamentStatus; // Acceso a valores de estado: ACTIVE, UPCOMING, FINISHED
  TournamentType = TournamentType; // Acceso a valores de tipo: ELIMINATION, LEAGUE, MIXED
  
  tournaments: Tournament[] = []; // Array que almacena todos los torneos
  filteredTournaments: Tournament[] = []; // Array con torneos filtrados según criterios
  isLoading = true; // Bandera para controlar estado de carga (muestra spinner/loader)
  selectedStatus: string = 'all'; // Estado seleccionado en filtros (valor por defecto: 'all')
  searchQuery: string = ''; // Término de búsqueda ingresado por usuario
  selectedType: string = 'all'; // Tipo de torneo seleccionado en filtros

  // ✅ AGREGAR ESTAS PROPIEDADES FALTANTES
  // Array de filtros de estado con conteos
  statusFilters = [
    { value: 'all', label: 'Todos', count: 0 }, // Filtro para mostrar todos
    { value: TournamentStatus.ACTIVE, label: 'Activos', count: 0 }, // Solo torneos activos
    { value: TournamentStatus.UPCOMING, label: 'Próximos', count: 0 }, // Solo torneos próximos
    { value: TournamentStatus.FINISHED, label: 'Finalizados', count: 0 } // Solo torneos finalizados
  ];

  // Array de tipos de torneos para filtro
  tournamentTypes = [
    { value: 'all', label: 'Todos los tipos' }, // Todos los tipos
    { value: TournamentType.ELIMINATION, label: 'Eliminación' }, // Torneo de eliminación directa
    { value: TournamentType.LEAGUE, label: 'Liga' }, // Torneo tipo liga (todos contra todos)
    { value: TournamentType.MIXED, label: 'Mixto' } // Torneo mixto (grupos + eliminatorias)
  ];

  // NUEVAS PROPIEDADES PARA EL DETALLE
  selectedTournament: TournamentDetail | null = null; // Torneo seleccionado para ver detalle (null si no hay selección)
  showDetailModal = false; // Controla visibilidad del modal de detalle (true: visible, false: oculto)
  dashboardActiveTab: 'info' | 'calendar' | 'standings' | 'teams' | 'brackets' | 'stats' = 'info'; // Pestaña activa en dashboard de detalle

  // ✅ AGREGAR PROPIEDADES PARA EL MODAL DE CREACIÓN
  showCreateModal = false; // Controla visibilidad del modal para crear torneo
  newTournament: Partial<Tournament> = { // Objeto parcial para nuevo torneo (Partial permite campos opcionales)
    name: '', // Nombre del torneo (vacío inicialmente)
    description: '', // Descripción (vacía inicialmente)
    type: TournamentType.ELIMINATION, // Tipo por defecto: eliminación
    startDate: new Date(), // Fecha de inicio: hoy
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Fecha fin: un mes después
    maxTeams: 8, // Máximo de equipos por defecto: 8
    prize: '', // Premio (vacío inicialmente)
    location: '', // Ubicación (vacía inicialmente)
    status: TournamentStatus.UPCOMING, // Estado por defecto: próximo
    rules: '', // Reglas (vacías inicialmente)
    registrationDeadline: new Date(new Date().setDate(new Date().getDate() + 7)), // Fecha límite inscripción: una semana después
    currentTeams: 0 // Equipos actuales: 0 (recién creado)
  };

  // Datos de ejemplo para el detalle (CORREGIDOS)
  // Array con información detallada de ejemplo para demostración
  tournamentDetails: TournamentDetail[] = [
    {
      id: '1', // ID del torneo
      name: 'Copa de Campeones 2023', // Nombre del torneo
      description: 'El torneo más prestigioso del año con equipos de élite. Sistema de eliminación directa con partidos emocionantes.', // Descripción
      rules: [ // Array de reglas del torneo
        'Reglas FIFA 2023 aplicables',
        'Partidos de 90 minutos (45 min cada tiempo)',
        'Sistema de eliminación directa',
        'En caso de empate: 30 minutos de prórroga',
        'Si persiste el empate: tiros penales',
        'Máximo 5 cambios por partido',
        'Tarjetas amarillas acumulativas: 3 = suspensión'
      ],
      prizes: [ // Array de premios
        { position: 1, amount: '$3,000 USD', description: 'Trofeo de campeón + medallas' }, // Primer lugar
        { position: 2, amount: '$1,500 USD', description: 'Medallas de subcampeón' }, // Segundo lugar
        { position: 3, amount: '$500 USD', description: 'Medallas de tercer lugar' }, // Tercer lugar
        { position: 4, amount: '$250 USD', description: 'Premio consuelo' } // Cuarto lugar
      ],
      calendar: [ // Calendario de partidos
        { id: 'm1', date: new Date('2023-06-01'), time: '15:00', homeTeam: 'Dragones FC', awayTeam: 'Leones SC', score: '2-1', location: 'Cancha A', status: 'finished' }, // Partido 1
        { id: 'm2', date: new Date('2023-06-01'), time: '17:30', homeTeam: 'Águilas FC', awayTeam: 'Tigres SC', score: '3-2', location: 'Cancha B', status: 'finished' }, // Partido 2
        { id: 'm3', date: new Date('2023-06-08'), time: '15:00', homeTeam: 'Cóndores FC', awayTeam: 'Halcones SC', location: 'Cancha A', status: 'scheduled' }, // Partido 3
        { id: 'm4', date: new Date('2023-06-08'), time: '17:30', homeTeam: 'Pumas FC', awayTeam: 'Tiburones SC', location: 'Cancha B', status: 'scheduled' }, // Partido 4
        { id: 'm5', date: new Date('2023-06-15'), time: '15:00', homeTeam: 'Ganador M1', awayTeam: 'Ganador M2', location: 'Estadio Principal', status: 'scheduled' }, // Partido 5
        { id: 'm6', date: new Date('2023-06-15'), time: '17:30', homeTeam: 'Ganador M3', awayTeam: 'Ganador M4', location: 'Estadio Principal', status: 'scheduled' }, // Partido 6
        { id: 'm7', date: new Date('2023-06-22'), time: '19:00', homeTeam: 'Ganador M5', awayTeam: 'Ganador M6', location: 'Estadio Nacional', status: 'scheduled' } // Partido 7
      ],
      teams: [ // Lista de equipos participantes
        { id: 't1', name: 'Dragones FC', logo: '🐉', captain: 'Carlos Ruiz', played: 1, wins: 1, draws: 0, losses: 0, points: 3, goalsFor: 2, goalsAgainst: 1 }, // Equipo 1
        { id: 't2', name: 'Leones SC', logo: '🦁', captain: 'Miguel Torres', played: 1, wins: 0, draws: 0, losses: 1, points: 0, goalsFor: 1, goalsAgainst: 2 }, // Equipo 2
        { id: 't3', name: 'Águilas FC', logo: '🦅', captain: 'Ana López', played: 1, wins: 1, draws: 0, losses: 0, points: 3, goalsFor: 3, goalsAgainst: 2 }, // Equipo 3
        { id: 't4', name: 'Tigres SC', logo: '🐯', captain: 'Roberto Díaz', played: 1, wins: 0, draws: 0, losses: 1, points: 0, goalsFor: 2, goalsAgainst: 3 }, // Equipo 4
        { id: 't5', name: 'Cóndores FC', logo: '🦅', captain: 'Laura Martínez', played: 0, wins: 0, draws: 0, losses: 0, points: 0, goalsFor: 0, goalsAgainst: 0 }, // Equipo 5
        { id: 't6', name: 'Halcones SC', logo: '🦅', captain: 'Pedro Sánchez', played: 0, wins: 0, draws: 0, losses: 0, points: 0, goalsFor: 0, goalsAgainst: 0 }, // Equipo 6
        { id: 't7', name: 'Pumas FC', logo: '🐆', captain: 'Sofía Ramírez', played: 0, wins: 0, draws: 0, losses: 0, points: 0, goalsFor: 0, goalsAgainst: 0 }, // Equipo 7
        { id: 't8', name: 'Tiburones SC', logo: '🦈', captain: 'Jorge Mendoza', played: 0, wins: 0, draws: 0, losses: 0, points: 0, goalsFor: 0, goalsAgainst: 0 } // Equipo 8
      ],
      standings: [ // Tabla de posiciones
        { position: 1, team: { id: 't1', name: 'Dragones FC', logo: '🐉', captain: 'Carlos Ruiz', played: 1, wins: 1, draws: 0, losses: 0, points: 3, goalsFor: 2, goalsAgainst: 1 }, played: 1, wins: 1, draws: 0, losses: 0, points: 3, goalsFor: 2, goalsAgainst: 1, goalDifference: 1 }, // Posición 1
        { position: 2, team: { id: 't3', name: 'Águilas FC', logo: '🦅', captain: 'Ana López', played: 1, wins: 1, draws: 0, losses: 0, points: 3, goalsFor: 3, goalsAgainst: 2 }, played: 1, wins: 1, draws: 0, losses: 0, points: 3, goalsFor: 3, goalsAgainst: 2, goalDifference: 1 }, // Posición 2
        { position: 3, team: { id: 't2', name: 'Leones SC', logo: '🦁', captain: 'Miguel Torres', played: 1, wins: 0, draws: 0, losses: 1, points: 0, goalsFor: 1, goalsAgainst: 2 }, played: 1, wins: 0, draws: 0, losses: 1, points: 0, goalsFor: 1, goalsAgainst: 2, goalDifference: -1 }, // Posición 3
        { position: 4, team: { id: 't4', name: 'Tigres SC', logo: '🐯', captain: 'Roberto Díaz', played: 1, wins: 0, draws: 0, losses: 1, points: 0, goalsFor: 2, goalsAgainst: 3 }, played: 1, wins: 0, draws: 0, losses: 1, points: 0, goalsFor: 2, goalsAgainst: 3, goalDifference: -1 }, // Posición 4
        { position: 5, team: { id: 't5', name: 'Cóndores FC', logo: '🦅', captain: 'Laura Martínez', played: 0, wins: 0, draws: 0, losses: 0, points: 0, goalsFor: 0, goalsAgainst: 0 }, played: 0, wins: 0, draws: 0, losses: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 }, // Posición 5
        { position: 6, team: { id: 't6', name: 'Halcones SC', logo: '🦅', captain: 'Pedro Sánchez', played: 0, wins: 0, draws: 0, losses: 0, points: 0, goalsFor: 0, goalsAgainst: 0 }, played: 0, wins: 0, draws: 0, losses: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 }, // Posición 6
        { position: 7, team: { id: 't7', name: 'Pumas FC', logo: '🐆', captain: 'Sofía Ramírez', played: 0, wins: 0, draws: 0, losses: 0, points: 0, goalsFor: 0, goalsAgainst: 0 }, played: 0, wins: 0, draws: 0, losses: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 }, // Posición 7
        { position: 8, team: { id: 't8', name: 'Tiburones SC', logo: '🦈', captain: 'Jorge Mendoza', played: 0, wins: 0, draws: 0, losses: 0, points: 0, goalsFor: 0, goalsAgainst: 0 }, played: 0, wins: 0, draws: 0, losses: 0, points: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0 } // Posición 8
      ],
      brackets: [ // Llaves/eliminatorias del torneo
        // Cuartos de final
        { id: 'q1', round: 'quarter', matchNumber: 1, team1: { name: 'Dragones FC', score: 2 }, team2: { name: 'Leones SC', score: 1 }, winner: 'Dragones FC', date: new Date('2023-06-01'), completed: true }, // Cuarto 1
        { id: 'q2', round: 'quarter', matchNumber: 2, team1: { name: 'Águilas FC', score: 3 }, team2: { name: 'Tigres SC', score: 2 }, winner: 'Águilas FC', date: new Date('2023-06-01'), completed: true }, // Cuarto 2
        { id: 'q3', round: 'quarter', matchNumber: 3, team1: { name: 'Cóndores FC' }, team2: { name: 'Halcones SC' }, date: new Date('2023-06-08'), completed: false }, // Cuarto 3
        { id: 'q4', round: 'quarter', matchNumber: 4, team1: { name: 'Pumas FC' }, team2: { name: 'Tiburones SC' }, date: new Date('2023-06-08'), completed: false }, // Cuarto 4
        // Semifinales
        { id: 's1', round: 'semi', matchNumber: 1, team1: { name: 'Dragones FC' }, team2: { name: 'Águilas FC' }, date: new Date('2023-06-15'), completed: false }, // Semifinal 1
        { id: 's2', round: 'semi', matchNumber: 2, team1: { name: 'Ganador Q3' }, team2: { name: 'Ganador Q4' }, date: new Date('2023-06-15'), completed: false }, // Semifinal 2
        // Final
        { id: 'f1', round: 'final', matchNumber: 1, team1: { name: 'Ganador S1' }, team2: { name: 'Ganador S2' }, date: new Date('2023-06-22'), completed: false } // Final
      ],
      statistics: { // Estadísticas generales del torneo
        totalMatches: 7, // Total de partidos programados
        matchesPlayed: 2, // ✅ CAMBIADO: Partidos ya jugados
        goalsScored: 8, // Total de goles anotados
        averageGoals: 4.0, // Promedio de goles por partido (8/2)
        topScorer: { name: 'Juan Pérez', team: 'Águilas FC', goals: 2 }, // Máximo goleador
        bestTeam: { name: 'Dragones FC', points: 3 } // Mejor equipo (más puntos)
      }
    }
  ];

  constructor(private datePipe: DatePipe) { // Inyecta DatePipe para formatear fechas
    console.log('🏆 Tournaments Component cargado'); // Mensaje de depuración en consola
  }

  ngOnInit(): void { // Método del ciclo de vida: se ejecuta al inicializar el componente
    this.loadTournaments(); // Carga los datos de torneos
  }

  calculateCounts(): void { // Calcula cantidad de torneos por estado para mostrar en filtros
    this.statusFilters.forEach((filter: {value: string, label: string, count: number}) => { // Itera cada filtro
      if (filter.value === 'all') { // Si es filtro "Todos"
        filter.count = this.tournaments.length; // Cuenta todos los torneos
      } else { // Si es filtro específico (activos, próximos, finalizados)
        filter.count = this.tournaments.filter(t => t.status === filter.value).length; // Cuenta torneos con ese estado
      }
    });
  }

  loadTournaments(): void { // Carga datos de ejemplo de torneos (simulando llamada a API)
    this.tournaments = [ // Asigna array de torneos de ejemplo
      { // Torneo 1
        id: '1', // ID del torneo
        name: 'Copa de Campeones 2023', // Nombre
        description: 'El torneo más prestigioso del año con equipos de élite. Sistema de eliminación directa con partidos emocionantes.', // Descripción
        startDate: new Date('2023-06-01'), // Fecha de inicio
        endDate: new Date('2023-07-30'), // Fecha de fin
        status: TournamentStatus.ACTIVE, // Estado: activo
        type: TournamentType.ELIMINATION, // Tipo: eliminación
        rules: 'Reglas FIFA 2023 aplicables. Partidos de 90 minutos. Sistema de eliminación directa.', // Reglas
        prize: '$5,000 USD + Trofeo', // Premio
        maxTeams: 16, // Máximo de equipos
        currentTeams: 12, // Equipos actualmente inscritos
        location: 'Estadio Nacional', // Ubicación
        registrationDeadline: new Date('2023-05-25'), // Fecha límite inscripción
        createdBy: 'admin', // Creado por
        createdAt: new Date('2023-01-15'), // Fecha creación
        updatedAt: new Date('2023-05-20') // Fecha última actualización
      },
      { // Torneo 2
        id: '2',
        name: 'Liga Premier 2024',
        description: 'Liga regular con sistema de todos contra todos. La competencia más larga y desafiante.',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-03-15'),
        status: TournamentStatus.UPCOMING,
        type: TournamentType.LEAGUE,
        rules: '14 fechas, todos contra todos. 3 puntos por victoria, 1 por empate.',
        prize: '$2,500 USD',
        maxTeams: 8,
        currentTeams: 3,
        location: 'Complejo Deportivo Municipal',
        registrationDeadline: new Date('2024-01-05'),
        createdBy: 'admin',
        createdAt: new Date('2023-11-10'),
        updatedAt: new Date('2023-11-10')
      },
      { // Torneo 3
        id: '3',
        name: 'Torneo Relámpago Verano 2023',
        description: 'Torneo rápido de un fin de semana. Perfecto para equipos que buscan acción intensa.',
        startDate: new Date('2023-08-12'),
        endDate: new Date('2023-08-13'),
        status: TournamentStatus.FINISHED,
        type: TournamentType.ELIMINATION,
        rules: 'Partidos de 40 minutos. Sistema de eliminación directa.',
        prize: '$1,000 USD',
        maxTeams: 8,
        currentTeams: 8,
        location: 'Canchas Sintéticas del Parque',
        registrationDeadline: new Date('2023-08-05'),
        createdBy: 'admin',
        createdAt: new Date('2023-06-01'),
        updatedAt: new Date('2023-08-14')
      },
      { // Torneo 4
        id: '4',
        name: 'Copa Interclubes 2023',
        description: 'Torneo mixto con fase de grupos y eliminatorias. La competencia más completa.',
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-10-30'),
        status: TournamentStatus.ACTIVE,
        type: TournamentType.MIXED,
        rules: 'Fase de grupos + eliminatorias. 24 equipos en 6 grupos.',
        prize: '$3,000 USD + Medallas',
        maxTeams: 24,
        currentTeams: 18,
        location: 'Complejo Deportivo Regional',
        registrationDeadline: new Date('2023-08-20'),
        createdBy: 'admin',
        createdAt: new Date('2023-05-10'),
        updatedAt: new Date('2023-08-25')
      }
    ];

    this.calculateCounts(); // Calcula conteos de filtros
    this.filterTournaments(); // Aplica filtros iniciales
    this.isLoading = false; // Cambia estado de carga a falso (oculta spinner)
  }

  filterTournaments(): void { // Aplica filtros a la lista de torneos
    let filtered = [...this.tournaments]; // Crea copia del array original (spread operator)

    if (this.selectedStatus !== 'all') { // Si hay filtro de estado seleccionado (no es "all")
      filtered = filtered.filter(t => t.status === this.selectedStatus); // Filtra por estado
    }

    if (this.selectedType !== 'all') { // Si hay filtro de tipo seleccionado (no es "all")
      filtered = filtered.filter(t => t.type === this.selectedType); // Filtra por tipo
    }

    if (this.searchQuery.trim()) { // Si hay término de búsqueda (eliminando espacios)
      const query = this.searchQuery.toLowerCase(); // Convierte a minúsculas para búsqueda case-insensitive
      filtered = filtered.filter(t =>  // Filtra torneos que coincidan en:
        t.name.toLowerCase().includes(query) || // Nombre contiene término
        t.description.toLowerCase().includes(query) || // Descripción contiene término
        t.location.toLowerCase().includes(query) // Ubicación contiene término
      );
    }

    this.filteredTournaments = filtered; // Asigna resultado filtrado a propiedad
  }

  onStatusChange(status: string): void { // Se ejecuta cuando cambia filtro de estado
    this.selectedStatus = status; // Actualiza estado seleccionado
    this.filterTournaments(); // Vuelve a filtrar torneos
  }

  onTypeChange(type: string): void { // Se ejecuta cuando cambia filtro de tipo
    this.selectedType = type; // Actualiza tipo seleccionado
    this.filterTournaments(); // Vuelve a filtrar torneos
  }

  onSearchChange(query: string): void { // Se ejecuta cuando cambia término de búsqueda
    this.searchQuery = query; // Actualiza término de búsqueda
    this.filterTournaments(); // Vuelve a filtrar torneos
  }

  getStatusClass(status: TournamentStatus): string { // Retorna clase CSS según estado del torneo
    switch (status) { // Evalúa estado
      case TournamentStatus.ACTIVE: return 'status-active'; // Clase para estado activo
      case TournamentStatus.UPCOMING: return 'status-upcoming'; // Clase para estado próximo
      case TournamentStatus.FINISHED: return 'status-finished'; // Clase para estado finalizado
      default: return 'status-default'; // Clase por defecto
    }
  }

  getStatusText(status: TournamentStatus): string { // Retorna texto legible para estado
    switch (status) { // Evalúa estado
      case TournamentStatus.ACTIVE: return 'Activo'; // Texto para activo
      case TournamentStatus.UPCOMING: return 'Próximo'; // Texto para próximo
      case TournamentStatus.FINISHED: return 'Finalizado'; // Texto para finalizado
      default: return status; // Retorna valor original si no hay traducción
    }
  }

  getTypeText(type: TournamentType): string { // Retorna texto legible para tipo
    switch (type) { // Evalúa tipo
      case TournamentType.ELIMINATION: return 'Eliminación'; // Texto para eliminación
      case TournamentType.LEAGUE: return 'Liga'; // Texto para liga
      case TournamentType.MIXED: return 'Mixto'; // Texto para mixto
      default: return type; // Retorna valor original si no hay traducción
    }
  }

  getProgressPercentage(tournament: Tournament): number { // Calcula porcentaje de progreso del torneo
    if (tournament.status === TournamentStatus.FINISHED) return 100; // Si ya finalizó: 100%
    
    const start = new Date(tournament.startDate).getTime(); // Fecha inicio en milisegundos
    const end = new Date(tournament.endDate).getTime(); // Fecha fin en milisegundos
    const now = new Date().getTime(); // Fecha actual en milisegundos
    
    if (now < start) return 0; // Si aún no empieza: 0%
    if (now > end) return 100; // Si ya pasó fecha fin: 100%
    
    return Math.round(((now - start) / (end - start)) * 100); // Calcula porcentaje basado en tiempo transcurrido
  }

  getDaysRemaining(tournament: Tournament): number { // Calcula días restantes para que termine
    if (tournament.status === TournamentStatus.FINISHED) return 0; // Si ya finalizó: 0 días
    
    const end = new Date(tournament.endDate).getTime(); // Fecha fin en milisegundos
    const now = new Date().getTime(); // Fecha actual en milisegundos
    const diff = end - now; // Diferencia en milisegundos
    
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))); // Convierte a días (redondea hacia arriba)
  }

  canRegister(tournament: Tournament): boolean { // Verifica si se puede registrar en torneo
    if (tournament.status !== TournamentStatus.UPCOMING) return false; // Solo se puede registrar en torneos próximos
    if (tournament.currentTeams >= tournament.maxTeams) return false; // Si ya está lleno: no se puede registrar
    
    const deadline = new Date(tournament.registrationDeadline).getTime(); // Fecha límite en milisegundos
    const now = new Date().getTime(); // Fecha actual en milisegundos
    
    return now < deadline; // Solo si fecha actual es anterior a fecha límite
  }

  getResultsDescription(): string { // Genera descripción textual de resultados filtrados
    if (this.filteredTournaments.length === 0) { // Si no hay resultados
      return 'No se encontraron resultados'; // Mensaje de no resultados
    }
    
    if (this.selectedStatus === 'all' && this.selectedType === 'all' && !this.searchQuery) { // Si no hay filtros aplicados
      return `Mostrando todos los ${this.filteredTournaments.length} torneos`; // Mensaje mostrando todos
    }
    
    const parts = []; // Array para partes de la descripción
    if (this.selectedStatus !== 'all') { // Si hay filtro de estado
      const status = this.statusFilters.find(f => f.value === this.selectedStatus)?.label; // Busca label del estado
      if (status) {
        parts.push(`Estado: ${status}`); // Agrega parte "Estado: X"
      }
    }
    
    if (this.selectedType !== 'all') { // Si hay filtro de tipo
      const type = this.tournamentTypes.find(t => t.value === this.selectedType)?.label; // Busca label del tipo
      if (type) {
        parts.push(`Tipo: ${type}`); // Agrega parte "Tipo: X"
      }
    }
    
    if (this.searchQuery) { // Si hay búsqueda
      parts.push(`Búsqueda: "${this.searchQuery}"`); // Agrega parte "Búsqueda: X"
    }
    
    return `Resultados filtrados (${this.filteredTournaments.length}) - ${parts.join(' | ')}`; // Combina todas las partes
  }

  formatDate(date: Date): string { // Formatea fecha usando DatePipe
    return this.datePipe.transform(date, 'dd/MM/yyyy') || ''; // Formato día/mes/año
  }

  // ========== NUEVOS MÉTODOS PARA EL DETALLE ==========

  openTournamentDetail(tournamentId: string): void { // Abre modal con detalles de torneo específico
    const detail = this.tournamentDetails.find(t => t.id === tournamentId); // Busca torneo en detalles
    if (detail) { // Si encontró detalle
      this.selectedTournament = detail; // Asigna torneo seleccionado
      this.showDetailModal = true; // Muestra modal
      this.dashboardActiveTab = 'info'; // Establece pestaña activa como "info"
    }
  }

  closeDetailModal(): void { // Cierra modal de detalle
    this.showDetailModal = false; // Oculta modal
    this.selectedTournament = null; // Limpia torneo seleccionado
  }

  setActiveTab(tab: 'info' | 'calendar' | 'standings' | 'teams' | 'brackets' | 'stats'): void { // Cambia pestaña activa en dashboard
    this.dashboardActiveTab = tab; // Establece nueva pestaña activa
  }

  // Métodos para los brackets
  getBracketMatches(round: 'quarter' | 'semi' | 'final'): BracketMatch[] { // Obtiene partidos de ronda específica
    if (!this.selectedTournament) return []; // Si no hay torneo seleccionado: array vacío
    return this.selectedTournament.brackets.filter(match => match.round === round); // Filtra por ronda
  }

  // Método para el calendario
  getUpcomingMatches(): Match[] { // Obtiene partidos próximos (programados)
    if (!this.selectedTournament) return []; // Si no hay torneo seleccionado: array vacío
    return this.selectedTournament.calendar.filter(match => match.status === 'scheduled'); // Filtra por estado "scheduled"
  }

  // Método para estadísticas
  getTeamStatistics(teamId: string): any { // Obtiene estadísticas detalladas de un equipo
    if (!this.selectedTournament) return null; // Si no hay torneo seleccionado: null
    const team = this.selectedTournament.teams.find(t => t.id === teamId); // Busca equipo
    const standings = this.selectedTournament.standings.find(s => s.team.id === teamId); // Busca posición en tabla
    
    return { // Retorna objeto con estadísticas
      team, // Información del equipo
      standings, // Posición en tabla
      winPercentage: standings ? (standings.wins / standings.played) * 100 : 0, // Porcentaje de victorias
      goalsPerMatch: standings ? standings.goalsFor / standings.played : 0 // Goles por partido
    };
  }

  // ========== NUEVOS MÉTODOS PARA CREAR TORNEO ==========

  openCreateModal(): void { // Abre modal para crear nuevo torneo
    this.showCreateModal = true; // Muestra modal
    // Inicializa objeto para nuevo torneo con valores por defecto
    this.newTournament = {
      name: '', // Nombre vacío
      description: '', // Descripción vacía
      type: TournamentType.ELIMINATION, // Tipo por defecto: eliminación
      startDate: new Date(), // Fecha inicio: hoy
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Fecha fin: un mes después
      maxTeams: 8, // Máximo equipos: 8
      prize: '', // Premio vacío
      location: '', // Ubicación vacía
      status: TournamentStatus.UPCOMING, // Estado: próximo
      rules: '', // Reglas vacías
      registrationDeadline: new Date(new Date().setDate(new Date().getDate() + 7)), // Fecha límite: una semana después
      currentTeams: 0 // Equipos actuales: 0
    };
  }

  closeCreateModal(): void { // Cierra modal de creación
    this.showCreateModal = false; // Oculta modal
  }

  createTournament(): void { // Crea nuevo torneo y lo agrega a la lista
    if (this.isFormValid()) { // Valida formulario primero
      const newTournament: Tournament = { // Crea objeto Tournament completo
        id: (this.tournaments.length + 1).toString(), // Genera ID secuencial
        name: this.newTournament.name || '', // Nombre (usa valor o string vacío)
        description: this.newTournament.description || '', // Descripción
        startDate: this.newTournament.startDate || new Date(), // Fecha inicio
        endDate: this.newTournament.endDate || new Date(), // Fecha fin
        status: TournamentStatus.UPCOMING, // Estado fijo: próximo
        type: this.newTournament.type || TournamentType.ELIMINATION, // Tipo
        rules: this.newTournament.rules || '', // Reglas
        prize: this.newTournament.prize || '', // Premio
        maxTeams: this.newTournament.maxTeams || 8, // Máximo equipos
        currentTeams: 0, // Empieza con 0 equipos
        location: this.newTournament.location || '', // Ubicación
        registrationDeadline: this.newTournament.registrationDeadline || new Date(), // Fecha límite
        createdBy: 'usuario_actual', // Usuario que crea (simulado)
        createdAt: new Date(), // Fecha creación: ahora
        updatedAt: new Date() // Fecha actualización: ahora
      };

      this.tournaments.unshift(newTournament); // Agrega nuevo torneo al inicio del array
      this.calculateCounts(); // Recalcula conteos de filtros
      this.filterTournaments(); // Vuelve a filtrar
      this.closeCreateModal(); // Cierra modal
      alert('✅ Torneo creado exitosamente!'); // Mensaje de éxito
    } else { // Si formulario no es válido
      alert('⚠️ Por favor completa todos los campos requeridos'); // Mensaje de error
    }
  }

  isFormValid(): boolean { // Valida si formulario de creación está completo
    return !!( // Convierte a booleano (doble negación)
      this.newTournament.name?.trim() && // Nombre no vacío (trim elimina espacios)
      this.newTournament.description?.trim() && // Descripción no vacía
      this.newTournament.location?.trim() && // Ubicación no vacía
      this.newTournament.prize?.trim() && // Premio no vacío
      this.newTournament.rules?.trim() && // Reglas no vacías
      this.newTournament.maxTeams && // Máximo equipos definido
      this.newTournament.startDate && // Fecha inicio definida
      this.newTournament.endDate && // Fecha fin definida
      this.newTournament.registrationDeadline // Fecha límite definida
    );
  }

  formatDateForInput(date: Date): string { // Formatea fecha para input type="date"
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  // Agrega esta propiedad en la clase (por ejemplo, después de dashboardActiveTab)
  dashboardTabs: Array<'info' | 'teams' | 'calendar' | 'standings' | 'brackets' | 'stats'> = [ // Array con todas las pestañas disponibles
    'info', // Pestaña información
    'teams', // Pestaña equipos
    'calendar', // Pestaña calendario
    'standings', // Pestaña posiciones
    'brackets', // Pestaña llaves
    'stats' // Pestaña estadísticas
  ];

  // También puedes crear un método para obtener el ícono y label de cada tab
  getTabIcon(tab: string): string { // Retorna emoji según pestaña
    switch (tab) { // Evalúa pestaña
      case 'info': return '📋'; // Ícono información
      case 'teams': return '👥'; // Ícono equipos
      case 'calendar': return '📅'; // Ícono calendario
      case 'standings': return '🏆'; // Ícono posiciones
      case 'brackets': return '📊'; // Ícono llaves
      case 'stats': return '📈'; // Ícono estadísticas
      default: return '📋'; // Ícono por defecto
    }
  }

  getTabLabel(tab: string): string { // Retorna texto legible según pestaña
    switch (tab) { // Evalúa pestaña
      case 'info': return 'Información'; // Label información
      case 'teams': return 'Equipos'; // Label equipos
      case 'calendar': return 'Calendario'; // Label calendario
      case 'standings': return 'Posiciones'; // Label posiciones
      case 'brackets': return 'Llaves'; // Label llaves
      case 'stats': return 'Estadísticas'; // Label estadísticas
      default: return 'Info'; // Label por defecto
    }
  }
}