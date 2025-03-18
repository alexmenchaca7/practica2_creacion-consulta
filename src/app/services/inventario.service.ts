import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private productos: Producto[] = [
    new Producto(1, 'Tenis Nike Court Vision High', 2099, 'assets/tenis1.jpg'),
    new Producto(2, 'Tenis Nike Court Vision Low', 1139, 'assets/tenis2.png'),
    new Producto(3, 'Tenis Nike Casual Full Force Low', 2299, 'assets/tenis3.png'),
    new Producto(4, 'Tenis Nike Full Force Low', 1609, 'assets/tenis4.png'),
    new Producto(5, 'Tenis Nike Dunk Low Retro', 2299, 'assets/tenis5.png'),
    new Producto(6, 'Tenis Nike Air Max Excee', 1919, 'assets/tenis6.png')
  ];

  constructor() {
    this.cargarProductos();
  }

  obtenerProductos(): Producto[] {
    return this.productos;
  }

  agregarProducto(producto: Producto): void {
    this.productos.push(producto);
    this.guardarProductos();
  }

  actualizarProducto(index: number, producto: Producto): void {
    this.productos[index] = producto;
    this.guardarProductos();
  }

  eliminarProducto(index: number): void {
    this.productos.splice(index, 1);
    this.guardarProductos();
  }

  saveFile(file: File, filePath: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        localStorage.setItem(filePath, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  deleteFile(filePath: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(filePath);
    }
  }

  private guardarProductos(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('productos', JSON.stringify(this.productos));
    }
  }

  private cargarProductos(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const productosGuardados = localStorage.getItem('productos');
      if (productosGuardados) {
        this.productos = JSON.parse(productosGuardados);
      }
    }
  }
}