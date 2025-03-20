import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { Producto } from '../../models/producto'; // Importa la clase Producto

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carrito: Producto[] = [];
  recibo: string = ''; // Variable para almacenar el recibo

  constructor(private carritoService: CarritoService, private router: Router) {}

  ngOnInit() {
    this.carrito = this.carritoService.obtenerCarrito();
  }

  eliminarProducto(index: number) {
    this.carritoService.eliminarProducto(index);
    this.carrito = this.carritoService.obtenerCarrito(); // Actualizar el carrito después de eliminar un producto
  }

  generarXML() {
    this.recibo = this.carritoService.generarXML(); // Almacena el recibo generado
  }

  descargarRecibo() {
    const blob = new Blob([this.recibo], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'recibo.xml';
    link.click();
  }

  calcularSubtotal() {
    return this.carrito.reduce((subtotal, producto) => subtotal + (producto.precio ?? 0) * (producto.cantidad ?? 1), 0);
  }

  calcularIVA() {
    const subtotal = this.calcularSubtotal();
    return subtotal * 0.16; // IVA del 16%
  }

  calcularTotal() {
    return this.calcularSubtotal() + this.calcularIVA();
  }

  irAProductos(): void {
    this.router.navigate(['/productos']);
  }
}