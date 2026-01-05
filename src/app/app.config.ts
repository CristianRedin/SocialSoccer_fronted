import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'; 
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';

import { CanchaRepository } from './core/domain/repositories/cancha.repository';
import { CanchaService } from './data/services/cancha.service'; 
import { NotificacionRepository } from './core/domain/repositories/notificacion.repository';
import { NotificacionService } from './data/services/notificacion.service';   

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),

    // 3. 👇 HABILITA EL CLIENTE HTTP (Sin esto, no hay conexión a API)
    provideHttpClient(withFetch()),

    // 4. 👇 REGISTRA TUS PROVEEDORES (Aquí arreglas el error NG0201)
    { provide: CanchaRepository, useClass: CanchaService },
    { provide: NotificacionRepository, useClass: NotificacionService }, 
  ]
};