import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: Producto[] = [];
  private tiendaNombre: string = 'Tienda de Tenis';

  constructor() {
    this.cargarCarrito();
  }

  eliminarProducto(index: number) {
    if (index >= 0 && index < this.carrito.length) {
      this.carrito.splice(index, 1);
      this.guardarCarrito();
    }
  }

  agregarProducto(producto: Producto) {
    this.carrito.push(producto);
    this.guardarCarrito();
  }

  obtenerCarrito(): Producto[] {
    return this.carrito;
  }

  generarXML(): string {
    let subtotal = this.calcularSubtotal();  // Calcular el subtotal
    let iva = subtotal * 0.16;  // Calcular el IVA (16%)
    let total = subtotal + iva;  // Calcular el total

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<recibo>\n`;
    xml += `  <tienda>${this.tiendaNombre}</tienda>\n`;
    this.carrito.forEach((producto) => {
      xml += `    <producto id="${producto.id}">\n`;
      xml += `      <nombre>${producto.nombre}</nombre>\n`;
      xml += `      <precio>${producto.precio}</precio>\n`;
    xml += `    </producto>\n`;
    });
    xml += `  <subtotal>$${subtotal}</subtotal>\n`;
    xml += `  <iva>$${iva.toFixed(2)}</iva>\n`;  // Mostrar IVA con 2 decimales
    xml += `  <total>$${total.toFixed(2)}</total>\n`;  // Mostrar total con 2 decimales
    xml += `</recibo>`;

    return xml;
  }

  private calcularSubtotal(): number {
    return this.carrito.reduce((acc, producto) => acc + (producto.precio ?? 0), 0);
  }

  private guardarCarrito(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }
  }

  private cargarCarrito(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const carritoGuardado = localStorage.getItem('carrito');
      if (carritoGuardado) {
        this.carrito = JSON.parse(carritoGuardado);
      }
    }
  }
}