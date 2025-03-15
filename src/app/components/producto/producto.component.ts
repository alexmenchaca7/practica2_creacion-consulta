import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto'; 
import { ProductoService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'] // Cambiado a styleUrls
})
export class ProductoComponent implements OnInit {

  productos: Producto[] = [];
  mensajeExito: boolean = false;


  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productos = this.productoService.obtenerProducto();
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarProducto(producto);

    // Mostrar el mensaje de éxito
    this.mensajeExito = true;

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      this.mensajeExito = false;
    }, 3000);
  }

  irAlCarrito(): void {
    this.router.navigate(['/carrito']);
  }
}