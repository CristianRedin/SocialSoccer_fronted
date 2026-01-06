export interface Cancha {
    id: number;
    nombre: string;
    ubicacion: string;
    zona: string;
    tipo_superficie: string;
    precio: number;
    imagen: string;
    estado: string;
    hora_apertura?: string;
    hora_cierre?: string;
    descripcion?: string;
    valoracion?: number;   
    disponible?: number;
}