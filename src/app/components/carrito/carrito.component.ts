import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';


@Component({
  selector: 'app-carrito',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']

})
export class CarritoComponent {
  carrito: any[] = [];
  recibo: string = ''; // Variable para almacenar el recibo

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
      this.carrito = this.carritoService.obtenerCarrito();
  }

  eliminarProducto(index: number) {
      this.carritoService.eliminarProducto(index);
  }

  generarXML() {
      this.recibo = this.carritoService.generarXML(); // Almacena el recibo generado
  }

  descargarRecibo() {
    // Crear el archivo Blob con el contenido del recibo
    const blob = new Blob([this.recibo], { type: 'application/xml' });
    
    // Crear un enlace de descarga
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'recibo.xml'; // Nombre del archivo a descargar
    link.click(); // Simula un clic para iniciar la descarga
  }


  calcularSubtotal() {
      return this.carrito.reduce((subtotal, producto) => subtotal + producto.precio, 0);
  }

  calcularIVA() {
      const subtotal = this.calcularSubtotal();
      return subtotal * 0.16; // IVA del 16%
  }

  calcularTotal() {
      const subtotal = this.calcularSubtotal();
      const iva = this.calcularIVA();
      return subtotal + iva;
  }

}
