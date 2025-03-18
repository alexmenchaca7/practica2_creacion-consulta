import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { InventarioService } from '../../services/inventario.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  productos: Producto[] = [];
  nuevoProducto: Producto = new Producto(0, '', undefined, ''); // Initialize precio as undefined
  productoSeleccionado: Producto = new Producto(0, '', undefined, ''); // Initialize precio as undefined
  productoIndex: number = -1;
  mostrarModal: boolean = false;
  selectedFile: File | null = null;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  constructor(private inventarioService: InventarioService, private router: Router) {}

  ngOnInit(): void {
    this.productos = this.inventarioService.obtenerProductos();
    this.cargarImagenes();
  }

  onFileSelected(event: Event, isUpdate: boolean = false): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (isUpdate) {
          this.productoSeleccionado.imagen = reader.result as string;
        } else {
          this.nuevoProducto.imagen = reader.result as string;
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  agregarProducto(): void {
    if (!this.nuevoProducto.nombre || this.nuevoProducto.precio === undefined || !this.selectedFile) {
      this.mostrarMensajeError('Todos los campos son obligatorios!');
      return;
    }
    if (isNaN(Number(this.nuevoProducto.precio))) {
      this.mostrarMensajeError('El precio debe ser un número válido!');
      return;
    }
    if (this.selectedFile) {
      const filePath = `assets/${this.selectedFile.name}`;
      this.nuevoProducto.imagen = filePath;
      this.inventarioService.saveFile(this.selectedFile, filePath);
    }
    this.nuevoProducto.precio = Number(this.nuevoProducto.precio); // Convert precio to number
    this.inventarioService.agregarProducto(this.nuevoProducto);
    this.cargarImagenes(); // Cargar las imágenes desde el localStorage
    this.nuevoProducto = new Producto(0, '', undefined, ''); // Reset precio to undefined
    this.selectedFile = null;
    this.mostrarMensajeExito('Producto agregado con éxito!');
  }

  abrirModal(producto: Producto, index: number): void {
    this.productoSeleccionado = { ...producto };
    this.productoSeleccionado.precio = Number(this.productoSeleccionado.precio); // Ensure precio is a number
    this.productoIndex = index;
    this.mostrarModal = true;
    document.body.style.overflow = 'hidden'; // Disable scroll
  }

  cerrarModal(event?: MouseEvent): void {
    if (event) {
      const target = event.target as HTMLElement;
      if (target.classList.contains('modal')) {
        this.mostrarModal = false;
        document.body.style.overflow = 'auto'; // Enable scroll
      }
    } else {
      this.mostrarModal = false;
      document.body.style.overflow = 'auto'; // Enable scroll
    }
  }

  actualizarProducto(): void {
    if (!this.productoSeleccionado.nombre || this.productoSeleccionado.precio === undefined) {
      this.mostrarMensajeError('Todos los campos son obligatorios!');
      return;
    }
    if (isNaN(Number(this.productoSeleccionado.precio))) {
      this.mostrarMensajeError('El precio debe ser un número válido!');
      return;
    }
    if (this.selectedFile) {
      const oldFilePath = this.productos[this.productoIndex].imagen;
      const newFilePath = `assets/${this.selectedFile.name}`;
      this.productoSeleccionado.imagen = newFilePath;
      this.inventarioService.saveFile(this.selectedFile, newFilePath);
      this.inventarioService.deleteFile(oldFilePath);
    }
    this.productoSeleccionado.precio = Number(this.productoSeleccionado.precio); // Convert precio to number
    this.inventarioService.actualizarProducto(this.productoIndex, this.productoSeleccionado);
    this.productos[this.productoIndex] = { ...this.productoSeleccionado };
    this.cargarImagenes(); // Cargar las imágenes desde el localStorage
    this.cerrarModal();
    this.selectedFile = null;
    this.mostrarMensajeExito('Producto actualizado con éxito!');
  }

  eliminarProducto(index: number): void {
    const filePath = this.productos[index].imagen;
    this.inventarioService.deleteFile(filePath);
    this.inventarioService.eliminarProducto(index);
    this.productos.splice(index, 1);
    this.mostrarMensajeExito('Producto eliminado con éxito!');
  }

  irAProductos(): void {
    this.router.navigate(['/productos']);
  }

  private mostrarMensajeExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    setTimeout(() => {
      this.mensajeExito = null;
    }, 3000);
  }

  private mostrarMensajeError(mensaje: string): void {
    this.mensajeError = mensaje;
    setTimeout(() => {
      this.mensajeError = null;
    }, 3000);
  }

  private cargarImagenes(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.productos.forEach(producto => {
        const dataUrl = localStorage.getItem(producto.imagen);
        if (dataUrl) {
          producto.imagen = dataUrl;
        }
      });
    }
  }

  validarNumero(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9.]/g, '');
  }
}
