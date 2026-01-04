// Importa Component y OnInit desde Angular core para crear componentes y usar ciclo de vida
import { Component, OnInit } from '@angular/core';

// Importa CommonModule para directivas comunes como *ngIf, *ngFor
import { CommonModule } from '@angular/common';

// Importa FormsModule para soporte de formularios con two-way data binding [(ngModel)]
import { FormsModule } from '@angular/forms';

// Interfaz que define la estructura de datos para un Torneo
interface Tournament {
  id: string;          // Identificador único del torneo
  name: string;        // Nombre del torneo
  category: string;    // Categoría (ej: Senior, Sub-23)
  startDate: string;   // Fecha de inicio en formato string
  endDate: string;     // Fecha de fin en formato string
  fee: number;         // Costo de inscripción
  maxTeams: number;    // Máximo número de equipos permitidos
}

// Interfaz que define la estructura de datos para una Inscripción
interface Inscription {
  id: string;          // Identificador único de la inscripción
  tournament: string;  // Nombre del torneo
  tournamentId: string; // ID del torneo
  team: string;        // Nombre del equipo
  teamId: string;      // ID del equipo
  captain: string;     // Nombre del capitán
  status: 'pendiente' | 'aprobada' | 'rechazada' | 'pago_pendiente' | 'finalizada'; // Estado de la inscripción
  date: string;        // Fecha de la inscripción
  paymentStatus: 'pagado' | 'pendiente' | 'vencido'; // Estado del pago
  paymentDate?: string; // Fecha de pago (opcional)
}

// Decorador @Component que define los metadatos del componente
@Component({
  selector: 'app-inscriptions', // Selector para usar en plantillas HTML
  standalone: true,             // Componente independiente (Angular 14+)
  imports: [CommonModule, FormsModule], // Módulos importados para este componente
  templateUrl: './inscriptions.html',   // Ruta a la plantilla HTML
  styleUrls: ['./inscriptions.scss']    // Ruta a los estilos SCSS
})

// Clase del componente que implementa OnInit para ciclo de vida
export class InscriptionsComponent implements OnInit {
  // Datos del formulario de inscripción
  teamName = '';                // Nombre del equipo (se llena automáticamente)
  selectedTeam = '';            // ID del equipo seleccionado en el formulario
  selectedTournament = '';      // ID del torneo seleccionado en el formulario
  acceptRules = false;          // Checkbox de aceptación de reglas
  captainName = 'Caiza Redin Cristian'; // Nombre del capitán (predefinido)
  
  // Estados del componente
  activeTab: 'inscription' | 'status' | 'history' = 'inscription'; // Pestaña activa
  isLoading = false; // Indicador de carga durante envío de formulario
  
  // Tipos de estados para mostrar en el resumen
  statusTypes: Array<'pendiente' | 'aprobada' | 'pago_pendiente' | 'rechazada'> = 
    ['pendiente', 'aprobada', 'pago_pendiente', 'rechazada'];
  
  // Datos simulados: equipos del usuario
  userTeams = [
    { id: 'team1', name: 'Fénix FC', category: 'Senior', players: 15 },
    { id: 'team2', name: 'Dragones FC', category: 'Sub-23', players: 18 },
    { id: 'team3', name: 'Leyendas FC', category: 'Veteranos', players: 12 }
  ];
  
  // Datos simulados: torneos disponibles
  tournaments: Tournament[] = [
    { id: '1', name: 'Copa de Campeones 2023', category: 'Senior', startDate: '2023-09-01', endDate: '2023-12-15', fee: 500, maxTeams: 16 },
    { id: '2', name: 'Liga Premier 2023', category: 'Senior', startDate: '2023-08-01', endDate: '2024-01-30', fee: 800, maxTeams: 20 },
    { id: '3', name: 'Torneo Verano 2024', category: 'Sub-23', startDate: '2024-01-15', endDate: '2024-03-30', fee: 300, maxTeams: 12 },
    { id: '4', name: 'Copa Elite', category: 'Veteranos', startDate: '2023-10-01', endDate: '2023-12-01', fee: 400, maxTeams: 10 }
  ];
  
  // Datos simulados: inscripciones actuales (en proceso)
  currentInscriptions: Inscription[] = [
    { id: 'ins1', tournament: 'Liga Premier 2023', tournamentId: '2', team: 'Fénix FC', teamId: 'team1', captain: 'Caiza Redin Cristian', status: 'aprobada', date: '15/07/2023', paymentStatus: 'pagado', paymentDate: '16/07/2023' },
    { id: 'ins2', tournament: 'Copa de Campeones 2023', tournamentId: '1', team: 'Dragones FC', teamId: 'team2', captain: 'Caiza Redin Cristian', status: 'pago_pendiente', date: '20/08/2023', paymentStatus: 'pendiente' }
  ];
  
  // Datos simulados: historial de inscripciones completadas
  inscriptionHistory: Inscription[] = [
    { id: 'hist1', tournament: 'Copa Primavera 2023', tournamentId: '5', team: 'Fénix FC', teamId: 'team1', captain: 'Caiza Redin Cristian', status: 'finalizada', date: '15/03/2023', paymentStatus: 'pagado', paymentDate: '14/03/2023' },
    { id: 'hist2', tournament: 'Liga de Invitación', tournamentId: '6', team: 'Fénix FC', teamId: 'team1', captain: 'Caiza Redin Cristian', status: 'finalizada', date: '10/08/2023', paymentStatus: 'pagado', paymentDate: '09/08/2023' },
    { id: 'hist3', tournament: 'Torneo Apertura', tournamentId: '7', team: 'Dragones FC', teamId: 'team2', captain: 'Caiza Redin Cristian', status: 'finalizada', date: '05/05/2023', paymentStatus: 'pagado', paymentDate: '04/05/2023' }
  ];

  // Detalles del torneo seleccionado (para mostrar información adicional)
  selectedTournamentDetails: Tournament | null = null;

  // Constructor del componente
  constructor() {}

  // Método del ciclo de vida: se ejecuta al inicializar el componente
  ngOnInit() {
    console.log('✅ Componente Inscriptions cargado'); // Mensaje de depuración
  }

  // Cambia la pestaña activa (inscripción, estado o historial)
  setActiveTab(tab: 'inscription' | 'status' | 'history') {
    this.activeTab = tab;
  }

  // Se ejecuta al seleccionar un torneo en el formulario
  onTournamentSelect() {
    // Busca y asigna los detalles del torneo seleccionado
    this.selectedTournamentDetails = this.tournaments.find(t => t.id === this.selectedTournament) || null;
  }

  // Se ejecuta al seleccionar un equipo en el formulario
  onTeamSelect() {
    // Actualiza teamName con el nombre del equipo seleccionado
    const selectedTeam = this.userTeams.find(t => t.id === this.selectedTeam);
    if (selectedTeam) {
      this.teamName = selectedTeam.name;
    }
  }

  // Envía el formulario de inscripción
  submitInscription() {
    // Validación de campos requeridos
    if (!this.selectedTeam || !this.selectedTournament || !this.acceptRules) {
      alert('Por favor complete todos los campos y acepte las reglas');
      return;
    }

    this.isLoading = true; // Activa indicador de carga
    
    // Simula una llamada a API con setTimeout
    setTimeout(() => {
      // Busca el equipo y torneo seleccionados
      const selectedTeam = this.userTeams.find(t => t.id === this.selectedTeam);
      const selectedTournament = this.tournaments.find(t => t.id === this.selectedTournament);
      
      // Crea un nuevo objeto de inscripción
      const newInscription: Inscription = {
        id: 'ins' + (this.currentInscriptions.length + 1), // Genera ID único
        tournament: selectedTournament?.name || '',
        tournamentId: this.selectedTournament,
        team: selectedTeam?.name || '',
        teamId: this.selectedTeam,
        captain: this.captainName,
        status: 'pendiente', // Estado inicial
        date: new Date().toLocaleDateString('es-ES'), // Fecha actual en formato español
        paymentStatus: 'pendiente' // Pago pendiente por defecto
      };
      
      // Agrega la nueva inscripción al principio del array
      this.currentInscriptions.unshift(newInscription);
      
      console.log('Inscripción enviada:', newInscription); // Log para depuración
      alert(`✅ Inscripción enviada correctamente para ${selectedTeam?.name} al torneo ${selectedTournament?.name}`);
      
      // Resetea el formulario
      this.selectedTeam = '';
      this.selectedTournament = '';
      this.acceptRules = false;
      this.selectedTournamentDetails = null;
      this.isLoading = false; // Desactiva indicador de carga
      
      // Cambia a la pestaña de estado para ver la nueva inscripción
      this.setActiveTab('status');
    }, 1500); // Simula 1.5 segundos de espera (como una llamada a API)
  }

  // Devuelve clase CSS según el estado de la inscripción
  getStatusClass(status: string): string {
    switch (status) {
      case 'aprobada': return 'status-approved';      // Clase para estado aprobado
      case 'pendiente': return 'status-pending';      // Clase para estado pendiente
      case 'rechazada': return 'status-rejected';     // Clase para estado rechazado
      case 'pago_pendiente': return 'status-payment'; // Clase para pago pendiente
      case 'finalizada': return 'status-completed';   // Clase para estado finalizado
      default: return ''; // Clase vacía si no coincide
    }
  }

  // Devuelve texto legible para el estado de la inscripción
  getStatusText(status: string): string {
    switch (status) {
      case 'aprobada': return 'Aprobada';
      case 'pendiente': return 'Pendiente';
      case 'rechazada': return 'Rechazada';
      case 'pago_pendiente': return 'Pago Pendiente';
      case 'finalizada': return 'Finalizada';
      default: return status; // Devuelve el mismo texto si no hay traducción
    }
  }

  // Filtra inscripciones por estado específico
  getInscriptionsByStatus(status: Inscription['status']): Inscription[] {
    return this.currentInscriptions.filter(ins => ins.status === status);
  }

  // Simula el procesamiento de un pago
  processPayment(inscriptionId: string) {
    const inscription = this.currentInscriptions.find(ins => ins.id === inscriptionId);
    if (inscription) {
      // Actualiza estados de pago e inscripción
      inscription.paymentStatus = 'pagado';
      inscription.paymentDate = new Date().toLocaleDateString('es-ES');
      inscription.status = 'aprobada';
      alert('✅ Pago procesado exitosamente'); // Feedback al usuario
    }
  }
}