#  Demo – Flujo de Cifras de Control

Esta demo documenta cómo estructuramos y mostramos las **cifras de control** en nuestro entorno Angular, manteniendo una separación clara entre:

- Modelo de backend
- Lógica de transformación
- Servicio de datos
- Componente visual (`TotalCardComponent`)

El objetivo es que este flujo pueda replicarse fácilmente en otros proyectos siguiendo la misma lógica.

---

##  1. Arquitectura General del Flujo

El flujo implementado sigue esta estructura:
```
UI (Botón / Filtros)
        ↓
Construcción de parámetros
        ↓
Servicio (Observable)
        ↓
Respuesta backend
        ↓
Transformación del modelo
        ↓
Render dinámico de tarjetas
```

Esto permite:

- Desacoplar backend de UI
- Mantener el componente visual genérico
- Facilitar mantenimiento y escalabilidad
- Agregar filtros sin afectar la presentación

---

##  2. Modelo de Datos (Backend)

Se define una interfaz que representa exactamente la estructura que devuelve el backend.
```ts
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
```

> ** Importante:** Este modelo es técnico y representa la respuesta real del API. No debe utilizarse directamente en la vista.

---

##  3. Transformación Backend → UI

El componente principal no usa directamente el modelo del backend para renderizar. En su lugar, transforma los datos en una estructura orientada a presentación:
```ts
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
  ];
}
```

**¿Por qué hacemos esto?**

- Permite cambiar labels sin afectar el backend
- Se pueden ocultar campos sin modificar el modelo original
- Se pueden agregar estilos dinámicos
- El componente visual queda completamente reutilizable

> Este patrón funciona como una **capa adaptadora** entre dominio y presentación.

---

##  4. Servicio de Datos

El servicio simula una llamada HTTP utilizando `Observable` y `delay` para mantener el mismo patrón que una API real.
```ts
getFacturasFELCifras(params: any): Observable<any> {
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

  return of(response).pipe(delay(500));
}
```

En un entorno real se usaría `HttpClient`, se enviarían headers (JWT, Authorization), se manejarían errores globales y se consumiría un endpoint REST real.

---

##  5. Construcción de Parámetros

En la aplicación real, las cifras pueden filtrarse por fecha: rango completo, solo fecha inicio, solo fecha fin, o sin fechas. Ejemplo de construcción dinámica:
```ts
const parametros: any = {
  Tipo: 'FACT',
};

if (this.rangoSeleccionado?.desde) {
  parametros.FechaInicio = this.rangoSeleccionado.desde;
}

if (this.rangoSeleccionado?.hasta) {
  parametros.FechaFin = this.rangoSeleccionado.hasta;
}
```

> En la demo, los inputs de fecha son únicamente ilustrativos y no tienen lógica asociada.

---

##  6. Renderizado Dinámico

Las tarjetas se renderizan con `*ngFor`:
```html
<app-total-card
  *ngFor="let tarjeta of tarjetasTotales"
  [label]="tarjeta.label"
  [valor]="tarjeta.valor"
  [color]="tarjeta.color ?? ''"
  [simboloMoneda]="simboloMoneda">
</app-total-card>
```

El componente visual recibe `label`, `valor`, `color` y `simboloMoneda`, lo que permite que sea totalmente independiente del backend.

---

##  7. Responsabilidad del TotalCardComponent

El componente `TotalCardComponent`:

-  No conoce el backend
-  No conoce la API
-  No conoce filtros
-  Solo muestra datos formateados

> Esto cumple el **principio de responsabilidad única (SRP)**.

---

##  8. Cómo Replicar Esta Lógica

Para implementar este patrón en otro módulo:

1. Definir interfaz del backend
2. Crear servicio que retorne `Observable`
3. Construir parámetros dinámicamente
4. Transformar modelo backend a modelo UI
5. Renderizar componente visual reutilizable
6. Mantener el componente visual desacoplado
