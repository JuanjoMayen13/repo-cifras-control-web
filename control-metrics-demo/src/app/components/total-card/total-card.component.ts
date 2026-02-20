import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-total-card',
  templateUrl: './total-card.component.html',
  styleUrl: './total-card.component.css',
})
export class TotalCardComponent {
 
  //Texto descriptivo que identifica la métrica
  //Ejemplo: "Gran Total", "IVA", etc
  //Es enviado desde el componente padre
  @Input() label: string = '';

  //Valor numérico que se mostrará en la tarjeta
  //Este valor ya viene mapeado desde el padre
  @Input() valor: number = 0;

  //Clase CSS (Tailwind) dinámica para definir el color del borde
  @Input() color: string = 'border-blue-500';

  //Prefijo de moneda (ej: "Q ", "$ ", etc
  //El componente no decide la moneda, solo la muestra
  @Input() simboloMoneda: string = '';

  //Valor interno ya formateado listo para mostrar
  //Se separa del valor original para:
  // - Mantener consistencia a nivel visual
  // - Evitar formatear directamente en el template
  displayValor: string = '0.00';

  constructor() {}

  ngOnInit() {
    //Se realiza el formateo inicial del valor recibido
    //El componente padre ya envió el número, aquí solo se transforma para UI
    this.displayValor = this.formatNumber(this.valor);
  }

  //Método encargado de formatear el número con:
  // - 2 decimales fijos
  // - Separador de miles
  formatNumber(value: number): string {

    //Fija el numero a 2 decimales
    const num = value.toFixed(2);

    //Se separa parte entera y decimal
    const parts = num.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];

    //Expresion regular para separar miles
    const reg = /\B(?=(\d{3})+(?!\d))/g;
    const formattedInteger = integerPart.replace(reg, ',');

    //Se reconstruye el número formateado
    return `${formattedInteger}.${decimalPart}`;
  }
}
