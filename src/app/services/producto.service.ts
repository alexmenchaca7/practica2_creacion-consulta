import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private productos:Producto[]=[
    new Producto(1, 'Tenis Nike Court Vision High', 2099, 'assets/tenis1.jpg'),
    new Producto(2, 'Tenis Nike Court Vision Low', 1139, 'assets/tenis2.png'),
    new Producto(3, 'Tenis Nike Casual Full Force Low', 2299, 'assets/tenis3.png'),
    new Producto(4, 'Tenis Nike Full Force Low', 1609, 'assets/tenis4.png'),
    new Producto(5, 'Tenis Nike Dunk Low Retro', 2299, 'assets/tenis5.png'),
    new Producto(6, 'Tenis Nike Air Max Excee', 1919, 'assets/tenis6.png')
  ];
  
  obtenerProducto():Producto[]{
     return this.productos;
  }
}