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
## 6. TotalCardComponent – Detalle del Componente Visual

`TotalCardComponent` es el componente de presentación principal encargado de renderizar cada tarjeta de cifra de control. 
---

### Inputs

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `''` | Texto descriptivo de la métrica. Ej: `"Gran Total"`, `"IVA"` |
| `valor` | `number` | `0` | Valor numérico ya mapeado desde el padre |
| `color` | `string` | `'border-blue-500'` | Clase Tailwind dinámica para el color del borde izquierdo |
| `simboloMoneda` | `string` | `''` | Prefijo de moneda. Ej: `"Q "`, `"$ "` |

---

### Lógica del Componente (TypeScript)
```ts
export class TotalCardComponent {

  @Input() label: string = '';
  @Input() valor: number = 0;
  @Input() color: string = 'border-blue-500';
  @Input() simboloMoneda: string = '';

  // Valor interno ya formateado, listo para mostrar en el template
  displayValor: string = '0.00';

  ngOnInit() {
    // Se realiza el formateo inicial del valor recibido
    // El componente padre ya envió el número, aquí solo se transforma para UI
    this.displayValor = this.formatNumber(this.valor);
  }

  // Método encargado de formatear el número con:
  // - 2 decimales fijos
  // - Separador de miles con coma
  formatNumber(value: number): string {
    const num = value.toFixed(2);           // Fija 2 decimales
    const parts = num.split('.');           // Separa parte entera y decimal
    const integerPart = parts[0];
    const decimalPart = parts[1];

    const reg = /\B(?=(\d{3})+(?!\d))/g;   // Regex para separador de miles
    const formattedInteger = integerPart.replace(reg, ',');

    return `${formattedInteger}.${decimalPart}`;  // Reconstruye el número formateado
  }
}
```

**¿Por qué usar `displayValor` en lugar de formatear en el template?**

- Mantiene el template limpio y libre de lógica
- Centraliza el formateo en un único punto
- Facilita pruebas unitarias sobre el método `formatNumber`
- Separa el valor original (`valor`) del valor visual (`displayValor`)

---

### Template (HTML)
```html
<div
  class="bg-white rounded-lg text-left overflow-hidden shadow transform transition-all border-l-4"
  [ngClass]="color"
>
  <div class="bg-white p-3">
    <div class="flex items-start">
      <div class="text-center sm:text-left">

        <!-- Etiqueta descriptiva enviada por el padre -->
        <h3 class="text-xs sm:text-sm leading-4 font-medium text-gray-400">
          {{ label }}
        </h3>

        <!-- Valor formateado con símbolo de moneda -->
        <p class="text-sm font-semibold text-gray-900" style="white-space: nowrap">
          {{ simboloMoneda }}{{ displayValor }}
        </p>

      </div>
    </div>
  </div>
</div>
```
---

##  7. Renderizado Dinámico

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

##  8. Responsabilidad del TotalCardComponent

El componente `TotalCardComponent`:

-  No conoce el backend
-  No conoce la API
-  No conoce filtros
-  Solo muestra datos formateados

> Esto cumple el **principio de responsabilidad única**.

---

##  9. Cómo Replicar Esta Lógica

Para implementar este patrón en otro módulo:

1. Definir interfaz del backend
2. Crear servicio que retorne `Observable`
3. Construir parámetros dinámicamente
4. Transformar modelo backend a modelo UI
5. Renderizar componente visual reutilizable
6. Mantener el componente visual desacoplado

---
