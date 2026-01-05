import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CanchaService } from '../../../../data/services/cancha.service';
import { Cancha } from '../../../../core/models/cancha.model';

@Component({
  selector: 'app-canchas-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './canchas-page.component.html',
  styleUrls: ['./canchas-page.component.css']
})
export class CanchasPageComponent implements OnInit {

  private canchaService = inject(CanchaService);
  private cd = inject(ChangeDetectorRef);

  // DATOS
  canchasTodas: Cancha[] = []; 
  listaCanchas: Cancha[] = []; 

  // OPCIONES PARA LOS SELECTS (SE LLENAN SOLAS)
  zonasDisponibles: string[] = [];
  tiposDisponibles: string[] = [];
  maxPrecioSistema: number = 100;

  // VARIABLES DE FILTRO SELECCIONADO
  filtroTexto: string = '';
  filtroZona: string = '';       
  filtroTipo: string = '';       
  filtroPrecio: number = 100;    // Precio máximo seleccionado

  cargando: boolean = true;

  ngOnInit() {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    this.cargando = true;
    
    this.canchaService.getAllCanchas({}).subscribe({
      next: (datos: Cancha[]) => {
        this.canchasTodas = datos || [];
        this.listaCanchas = [...this.canchasTodas];
        this.extraerOpcionesFiltros();
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando canchas:', err);
        this.cargando = false;
        this.cd.detectChanges();
      }
    });
  }

  extraerOpcionesFiltros() {
    // 1. Extraer Zonas únicas
    const zonas = this.canchasTodas.map(c => c.zona).filter(z => z);
    this.zonasDisponibles = [...new Set(zonas)];

    // 2. Extraer Tipos únicos (Superficie)
    const tipos = this.canchasTodas.map(c => c.tipo_superficie).filter(t => t);
    this.tiposDisponibles = [...new Set(tipos)];

    // 3. Calcular precio máximo para el slider
    if (this.canchasTodas.length > 0) {
      const precios = this.canchasTodas.map(c => c.precio);
      this.maxPrecioSistema = Math.max(...precios) + 10; 
      this.filtroPrecio = this.maxPrecioSistema; 
    }
  }

  // LÓGICA DE FILTRADO UNIFICADA
  filtrar() {
    const texto = this.filtroTexto.toLowerCase().trim();
    
    this.listaCanchas = this.canchasTodas.filter(cancha => {
      
      // 1. Filtro Texto (Nombre)
      const matchTexto = !texto || cancha.nombre.toLowerCase().includes(texto);

      // 2. Filtro Zona (Exacto)
      const matchZona = !this.filtroZona || cancha.zona === this.filtroZona;

      // 3. Filtro Tipo (Exacto)
      const matchTipo = !this.filtroTipo || cancha.tipo_superficie === this.filtroTipo;

      // 4. Filtro Precio (Menor o igual al seleccionado)
      const matchPrecio = cancha.precio <= this.filtroPrecio;

      return matchTexto && matchZona && matchTipo && matchPrecio;
    });
  }

  limpiarFiltros() {
    this.filtroTexto = '';
    this.filtroZona = '';
    this.filtroTipo = '';
    this.filtroPrecio = this.maxPrecioSistema;
    this.filtrar();
  }
}