import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CanchaService } from '../../../../data/services/cancha.service';
import { Cancha } from '../../../../core/models/cancha.model';

@Component({
  selector: 'app-cancha-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cancha-detail-page.component.html',
  styleUrls: ['./cancha-detail-page.component.css']
})
export class CanchaDetailPageComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private canchaService = inject(CanchaService);
  private cdr = inject(ChangeDetectorRef);
  cancha: Cancha | null = null;
  cargando: boolean = true;
  errorMensaje: string = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      console.log('ID URL:', idStr);

      if (idStr) {
        this.cargarDetalle(idStr);
      } else {
        this.errorMensaje = 'URL inválida';
        this.cargando = false;
      }
    });
  }

  cargarDetalle(idBuscado: string | number) {
    this.cargando = true;
    
    this.canchaService.getAllCanchas({}).subscribe({
      next: (listaCanchas) => {
        const encontrada = listaCanchas.find(c => c.id == idBuscado);

        if (encontrada) {
          console.log('¡Cancha encontrada y asignada!', encontrada.nombre);
          this.cancha = encontrada;
        } else {
          console.error('No se encontró ID:', idBuscado);
          this.errorMensaje = 'No encontramos esa cancha.';
        }

        this.cargando = false; // Apagamos el loading
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMensaje = 'Error de conexión.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  iniciarReserva() {
    if(this.cancha) alert(`Reservando: ${this.cancha.nombre}`);
  }
}