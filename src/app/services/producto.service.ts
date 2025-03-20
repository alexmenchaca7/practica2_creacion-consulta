import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private productos: Producto[] = [];

  constructor() {
    this.cargarProductosPorDefecto();
  }

  obtenerProducto(): Producto[] {
    return this.productos;
  }

  private cargarProductosPorDefecto(): void {
    const productosXML = `
      <?xml version="1.0" encoding="UTF-8"?>
          <productos>
            <producto id="1">
              <nombre>Tenis Nike Court Vision High</nombre>
              <precio>2099</precio>
              <cantidad>10</cantidad>
              <imagen>assets/tenis1.jpg</imagen>
            </producto>
            <producto id="2">
              <nombre>Tenis Nike Court Vision Low</nombre>
              <precio>1139</precio>
              <cantidad>15</cantidad>
              <imagen>assets/tenis2.png</imagen>
            </producto>
            <producto id="3">
              <nombre>Tenis Nike Casual Full Force Low</nombre>
              <precio>2299</precio>
              <cantidad>8</cantidad>
              <imagen>assets/tenis3.png</imagen>
            </producto>
            <producto id="4">
              <nombre>Tenis Nike Full Force Low</nombre>
              <precio>1609</precio>
              <cantidad>12</cantidad>
              <imagen>assets/tenis4.png</imagen>
            </producto>
            <producto id="5">
              <nombre>Tenis Nike Dunk Low Retro</nombre>
              <precio>2299</precio>
              <cantidad>20</cantidad>
              <imagen>assets/tenis5.png</imagen>
            </producto>
            <producto id="6">
              <nombre>Tenis Nike Air Max Excee</nombre>
              <precio>1919</precio>
              <cantidad>5</cantidad>
              <imagen>assets/tenis6.png</imagen>
            </producto>
          </productos>
    `;
    this.productos = this.parsearProductosDesdeXML(productosXML);
  }

  private parsearProductosDesdeXML(xml: string): Producto[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'application/xml');
    const productos: Producto[] = [];
    const productosNodes = xmlDoc.getElementsByTagName('producto');
    for (let i = 0; i < productosNodes.length; i++) {
      const productoNode = productosNodes[i];
      const id = Number(productoNode.getAttribute('id'));
      const nombre = productoNode.getElementsByTagName('nombre')[0].textContent || '';
      const precio = Number(productoNode.getElementsByTagName('precio')[0].textContent);
      const imagen = productoNode.getElementsByTagName('imagen')[0].textContent || '';
      productos.push(new Producto(id, nombre, precio, imagen));
    }
    return productos;
  }
}