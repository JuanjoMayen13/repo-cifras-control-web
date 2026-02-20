import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CifrasService {
  //URL base del backend
  //En esta demo no se utiliza
  private baseUrl = '';
  constructor(private http: HttpClient) {}

  
  //Simula una petición HTTP GET.
  //
  //Retorna un Observable para mantener el
  //mismo patrón que una llamada real.
  //
  //Se utiliza:
  // - of() para emitir datos simulados
  // - delay() para simular latencia
  getFacturasFELCifras(params: any): Observable<any> {
    //Simulación backend
    const response = {
      data: [
        {
          cantidadDocumentos: 128,
          granTotal: 452300.75,
          iva: 54321.12,
          impuestoPetroleo: 1200,
          turismoHospedaje: 800,
        },
      ],
    };
    //Se retorna como Observable
    //simulando 500ms de latencia.
    return of(response).pipe(delay(500));
  }
}
