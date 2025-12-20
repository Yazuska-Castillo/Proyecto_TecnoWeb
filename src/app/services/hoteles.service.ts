import { Injectable } from '@angular/core';
import { Hotel } from '../models/hotel';
import { HOTELES_PREDEFINIDOS } from 'src/data/hoteles-predefinidos';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root',
})
export class HotelesService {
  private key = 'hoteles_encriptados';
  private imagenesKey = 'hilton_imagenes_hotel_'; // Prefijo para imágenes de hoteles

  constructor() {
    // Carga inicial SOLO una vez (encriptada)
    if (!localStorage.getItem(this.key)) {
      const encrypted = CryptoService.encrypt(HOTELES_PREDEFINIDOS);
      localStorage.setItem(this.key, encrypted);
    }
  }

  obtenerHoteles(): Hotel[] {
    const data = localStorage.getItem(this.key);
    if (!data) return [];

    try {
      const hotelesDesencriptados: any[] = CryptoService.decrypt(data);
      
      // Convertir cada objeto a tipo Hotel
      const hoteles: Hotel[] = hotelesDesencriptados.map((item: any) => {
        return new Hotel(
          item.id || 0,
          item.nombre || '',
          item.ubicacion || '',
          item.categoria || 1,
          item.habitaciones || 1,
          item.descripcion || '',
          [], // Las imágenes vacías aquí, se cargan después
          item.mapaUrl || ''
        );
      });

      const hotelesConImagenes = hoteles.map(hotel => {
        const imagenesCargadas = this.cargarTodasImagenesHotel(hotel.id);
        return {
          ...hotel,
          imagenes: imagenesCargadas.length > 0 ? imagenesCargadas : []
        };
      });
      
      return hotelesConImagenes;
    } catch (error) {
      console.error('Error al desencriptar hoteles', error);
      return [];
    }
  }

  private guardarHotelesEncriptados(hoteles: Hotel[]): void {
    // NO guardar las imágenes base64 en el objeto encriptado
    const hotelesSinImagenesBase64 = hoteles.map(hotel => ({
      ...hotel,
      imagenes: [] // Las imágenes se guardan por separado
    }));
    
    const encrypted = CryptoService.encrypt(hotelesSinImagenesBase64);
    localStorage.setItem(this.key, encrypted);
  }

  guardarImagenHotel(hotelId: number, imagenIndex: number, base64Image: string): void {
    const clave = `${this.imagenesKey}${hotelId}_${imagenIndex}`;
    try {
      localStorage.setItem(clave, base64Image);
      console.log(`✅ Imagen de hotel guardada: ${clave} (${Math.round(base64Image.length / 1024)} KB)`);
      
      // Verificar que se guardó
      const verificada = localStorage.getItem(clave);
      if (verificada) {
        console.log(`🔍 Verificación: Imagen ${clave} guardada correctamente`);
      } else {
        console.error(`❌ Error: Imagen ${clave} NO se guardó`);
      }
    } catch (error) {
      console.error(`❌ Error al guardar imagen ${clave}:`, error);
      
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.limpiarImagenesAntiguas();
        // Intentar de nuevo
        try {
          localStorage.setItem(clave, base64Image);
          console.log(`✅ Imagen guardada después de limpiar espacio`);
        } catch (retryError) {
          console.error(`❌ Error persistente al guardar imagen:`, retryError);
        }
      }
    }
  }

  cargarImagenHotel(hotelId: number, imagenIndex: number): string | null {
    const clave = `${this.imagenesKey}${hotelId}_${imagenIndex}`;
    return localStorage.getItem(clave);
  }

  cargarTodasImagenesHotel(hotelId: number): string[] {
    const imagenes: string[] = [];
    let index = 0;
    
    while (true) {
      const clave = `${this.imagenesKey}${hotelId}_${index}`;
      const imagen = localStorage.getItem(clave);
      
      if (imagen) {
        imagenes.push(imagen); // Base64
        index++;
      } else {
        break;
      }
    }
    
    if (imagenes.length === 0) {
      const hotelPredefinido = HOTELES_PREDEFINIDOS.find(h => h.id === hotelId);
      if (hotelPredefinido && hotelPredefinido.imagenes) {
        return hotelPredefinido.imagenes; 
      }
    }
    
    console.log(`📸 Hotel ${hotelId} tiene ${imagenes.length} imágenes (${imagenes.length > 0 ? 'Base64' : 'ninguna'})`);
    return imagenes;
  }

  eliminarImagenesHotel(hotelId: number): void {
    let index = 0;
    let imagenesEliminadas = 0;
    
    while (true) {
      const clave = `${this.imagenesKey}${hotelId}_${index}`;
      const imagenExiste = localStorage.getItem(clave);
      
      if (imagenExiste) {
        localStorage.removeItem(clave);
        imagenesEliminadas++;
        index++;
      } else {
        break;
      }
    }
    
    console.log(`🗑️ Eliminadas ${imagenesEliminadas} imágenes del hotel ${hotelId}`);
  }

  eliminarImagenHotel(hotelId: number, imagenIndex: number): void {
    const clave = `${this.imagenesKey}${hotelId}_${imagenIndex}`;

    localStorage.removeItem(clave);
    this.reindexarImagenesHotel(hotelId, imagenIndex);
    
    console.log(`🗑️ Eliminada imagen ${imagenIndex} del hotel ${hotelId}`);
  }

  private reindexarImagenesHotel(hotelId: number, indiceEliminado: number): void {
    let index = indiceEliminado + 1;
    
    while (true) {
      const claveActual = `${this.imagenesKey}${hotelId}_${index}`;
      const claveNueva = `${this.imagenesKey}${hotelId}_${index - 1}`;
      const imagen = localStorage.getItem(claveActual);
      
      if (imagen) {
        // Mover imagen a índice anterior
        localStorage.setItem(claveNueva, imagen);
        localStorage.removeItem(claveActual);
        index++;
      } else {
        break;
      }
    }
  }

  private limpiarImagenesAntiguas(): void {
    const clavesAEliminar: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i);
      if (clave && clave.startsWith(this.imagenesKey)) {
        clavesAEliminar.push(clave);
      }
    }

    const aEliminar = clavesAEliminar.slice(0, Math.min(10, clavesAEliminar.length));
    aEliminar.forEach(clave => {
      localStorage.removeItem(clave);
      console.log(`🧹 Limpiada imagen antigua: ${clave}`);
    });
    
    console.log(`🧹 Limpiadas ${aEliminar.length} imágenes antiguas de hoteles`);
  }

  agregarHotel(hotel: Hotel): void {
    const hoteles = this.obtenerHoteles();

    // Generar ID
    hotel.id = hoteles.length > 0 ? Math.max(...hoteles.map((h) => h.id)) + 1 : 1;

    // Guardar imágenes en localStorage
    if (hotel.imagenes && hotel.imagenes.length > 0) {
      hotel.imagenes.forEach((imagen, index) => {
        this.guardarImagenHotel(hotel.id, index, imagen);
      });
    }

    const hotelSinImagenes = {
      ...hotel,
      imagenes: [] // No guardar base64 aquí
    };

    hoteles.push(hotelSinImagenes);
    this.guardarHotelesEncriptados(hoteles);
    
    console.log(`🏨 Hotel agregado: ${hotel.nombre} (ID: ${hotel.id}) con ${hotel.imagenes.length} imágenes`);
  }

  actualizarHotel(hotel: Hotel): void {

    this.eliminarImagenesHotel(hotel.id);

    if (hotel.imagenes && hotel.imagenes.length > 0) {
      hotel.imagenes.forEach((imagen, index) => {
        this.guardarImagenHotel(hotel.id, index, imagen);
      });
    }

    const hoteles = this.obtenerHoteles().map((h) => {
      if (h.id === hotel.id) {
        return {
          ...hotel,
          imagenes: [] 
        };
      }
      return h;
    });
    this.guardarHotelesEncriptados(hoteles);
    console.log(`✏️ Hotel actualizado: ${hotel.nombre} (ID: ${hotel.id})`);
  }

  eliminarHotel(id: number): void {
    this.eliminarImagenesHotel(id);

    const hoteles = this.obtenerHoteles().filter((h) => h.id !== id);
    this.guardarHotelesEncriptados(hoteles);
    
    console.log(`🗑️ Hotel eliminado (ID: ${id})`);
  }

  getHotelById(id: number): Hotel | undefined {
    const hoteles = this.obtenerHoteles();
    const hotel = hoteles.find(h => h.id === id);
    
    if (hotel) {
      // Cargar imágenes específicas para este hotel
      const imagenesCargadas = this.cargarTodasImagenesHotel(id);
      return {
        ...hotel,
        imagenes: imagenesCargadas
      };
    }
    
    return undefined;
  }

  contarImagenesHoteles(): number {
    let count = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i);
      if (clave && clave.startsWith(this.imagenesKey)) {
        count++;
      }
    }
    
    return count;
  }

  limpiarTodasLasImagenesHoteles(): void {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const clave = localStorage.key(i);
      if (clave && clave.startsWith(this.imagenesKey)) {
        localStorage.removeItem(clave);
      }
    }
    console.log('🧹 Todas las imágenes de hoteles han sido eliminadas');
  }

  obtenerEspacioImagenes(): string {
    let totalBytes = 0;
    let totalImagenes = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i);
      if (clave && clave.startsWith(this.imagenesKey)) {
        const valor = localStorage.getItem(clave);
        if (valor) {
          totalBytes += valor.length * 2;
          totalImagenes++;
        }
      }
    }
    
    const mb = totalBytes / (1024 * 1024);
    return `${totalImagenes} imágenes usando ${mb.toFixed(2)} MB`;
  }
}