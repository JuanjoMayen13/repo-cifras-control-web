import { Component } from '@angular/core';
import { CifrasService } from './services/cifras.service';


// Modelo que representa la estructura que
// devuelve el backend con las cifras de control.
export interface CifrasControl {
  cantidadDocumentos: number;
  granTotal: number;
  iva: number;
  impuestoPetroleo: number;
  turismoHospedaje: number;
  turismoPasajes: number;
  timbrePrensa: number;
  bomberos: number;
  tasaMunicipal: number;
  bebidasAlcoholicas: number;
  tabaco: number;
  cemento: number;
  bebidasNoAlcoholicas: number;
  tarifaPortuaria: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  //Símbolo de moneda que se envía al componente.
  //En el proyecto real este valor puede venir
  //desde login, configuración o backend
  simboloMoneda: string = 'Q ';

  //Variable que almacena la respuesta completa
  //que devuelve el backend
  cifrasControl!: CifrasControl;

  //Arreglo que se usa directamente en el *ngFor
  //para renderizar dinámicamente los total-card
  //
  //Este arreglo es una transformación del modelo
  //(CifrasControl) hacia un modelo
  //orientado a presentación en la interfaz
  tarjetasTotales: any[] = [];

  constructor(private cifrasService: CifrasService) {}

  //Método que transforma el modelo (CifrasControl) en una estructura de UI
  //
  //Esto permite:
  // - Desacoplar el componente visual del backend
  // - Controlar labels sin modificar el modelo
  // - Asignar estilos dinámicos por tarjeta
  private mapearTarjetas(): void {
    this.tarjetasTotales = [
      {
        label: 'Cantidad Documentos',
        valor: this.cifrasControl.cantidadDocumentos,
        color: 'border-indigo-500',
      },
      {
        label: 'Gran Total',
        valor: this.cifrasControl.granTotal,
        color: 'border-green-500',
      },
      {
        label: 'IVA',
        valor: this.cifrasControl.iva,
        color: 'border-blue-500',
      },
      {
        label: 'Impuesto Petróleo',
        valor: this.cifrasControl.impuestoPetroleo,
        color: 'border-yellow-500',
      },
      {
        label: 'Turismo Hospedaje',
        valor: this.cifrasControl.turismoHospedaje,
        color: 'border-purple-500',
      },
    ];
  }

  //Ejecuta la solicitud al servicio.
  //En la aplicación real se envían dos parametros FechaInicio y FechaFin
  //permitiendo filtrar por rango completo, solo desde,
  //solo hasta o sin fechas.
  obtenerCifras(): void {
    const parametros = {
      Tipo: 'FACT',
    };

    // Ejemplo real:
    //
    // if (this.rangoSeleccionado?.desde) {
    //   parametros.FechaInicio = this.rangoSeleccionado.desde;
    // }
    //
    // if (this.rangoSeleccionado?.hasta) {
    //   parametros.FechaFin = this.rangoSeleccionado.hasta;
    // }
    this.cifrasService.getFacturasFELCifras(parametros).subscribe({
      next: (response: any) => {
        this.cifrasControl = response.data[0];
        this.mapearTarjetas();
      },
      error: (err) => {
        console.error('Error obteniendo cifras:', err);
      },
    });
  }
}
