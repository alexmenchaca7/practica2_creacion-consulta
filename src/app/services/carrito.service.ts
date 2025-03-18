import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
import { DOMParser } from 'xmldom';

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
      const carritoXML = this.convertirCarritoAXML(this.carrito);
      localStorage.setItem('carrito', carritoXML);
    }
  }

  private cargarCarrito(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const carritoXML = localStorage.getItem('carrito');
      if (carritoXML) {
        this.carrito = this.parsearCarritoDesdeXML(carritoXML);
      }
    }
  }

  private convertirCarritoAXML(carrito: Producto[]): string {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<carrito>\n`;
    carrito.forEach(producto => {
      xml += `  <producto id="${producto.id}">\n`;
      xml += `    <nombre>${producto.nombre}</nombre>\n`;
      xml += `    <precio>${producto.precio}</precio>\n`;
      xml += `    <imagen>${producto.imagen}</imagen>\n`;
      xml += `  </producto>\n`;
    });
    xml += `</carrito>`;
    return xml;
  }

  private parsearCarritoDesdeXML(xml: string): Producto[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'application/xml');
    const carrito: Producto[] = [];
    const productosNodes = xmlDoc.getElementsByTagName('producto');
    for (let i = 0; i < productosNodes.length; i++) {
      const productoNode = productosNodes[i];
      const id = Number(productoNode.getAttribute('id'));
      const nombre = productoNode.getElementsByTagName('nombre')[0].textContent || '';
      const precio = Number(productoNode.getElementsByTagName('precio')[0].textContent);
      const imagen = productoNode.getElementsByTagName('imagen')[0].textContent || '';
      carrito.push(new Producto(id, nombre, precio, imagen));
    }
    return carrito;
  }
}