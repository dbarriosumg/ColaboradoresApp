import { Component } from '@angular/core';
import { Employee } from './models/employee';
import { ApiService } from './services/api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ColaboradoresApp';
  employeeId: number = 0;
  btnSave: boolean = false
  btnUpdate: boolean = true
  btnDelete: boolean = true
  displayedColumns = ["dpi", "name", 
    "gender", 
    "maritalStatus", 
    "nit", 
    "noIggs",
    "noIrtra",
    "phoneNumber", 
    "address", 
    'email' ]

    form: FormGroup = new FormGroup({
      name: new FormControl(''),
      lastName: new FormControl(''),
      dpi: new FormControl(''),
      gender: new FormControl('Masculino'),
      maritalStatus: new FormControl('Soltero'),
      nit: new FormControl(''),
      noIggs: new FormControl(''),
      noIrtra: new FormControl(''),
      phoneNumber: new FormControl(''),
      address: new FormControl(''),
      email: new FormControl(''),
    });

  employees: Employee[] = []

constructor(
  private api : ApiService,
  private formBuilder: FormBuilder){

}
  ngOnInit() : void {
    this.getEmployees()
  }

  createForm(){
    this.form = this.formBuilder.group({
      name : ['', Validators.required],
      lastName : ['', Validators.required],
      dpi : ['', [Validators.required, Validators.minLength(13)]],
      gender : 'Masculino',
      maritalStatus : 'Soltero',
      nit : ['', Validators.required],
      noIggs : [''],
      noIrtra : [''],
      phoneNumber : ['', [Validators.required, Validators.minLength(8)]],
      address : ['', Validators.required],
      email : ['', Validators.required],
    })
  }

  // Método para obtener la lista de empleados desde la API
getEmployees() {
  // Llamamos al método getEmployee() de la API utilizando el servicio "api"
  this.api.getEmployee().subscribe((response: Employee[]) => {
    // Cuando la respuesta es recibida, asignamos la lista de empleados a la variable "employees"
    this.employees = response;
  });
}


  createEmployee() {
    // Verifica si el formulario es válido
    if (this.form.valid) {
      // Obtiene los valores del formulario
      let valueForm = this.form.value;
  
      // Construye el objeto para enviar al API
      let employeeBody = {
        Id: 0,
        FirstName: valueForm.name,
        LastName: valueForm.lastName,
        Dpi: valueForm.dpi,
        Gender: valueForm.gender,
        MaritalStatus: valueForm.maritalStatus,
        Nit: valueForm.nit,
        NoIggs: valueForm.noIggs,
        NoIrtra: valueForm.noIrtra,
        PhoneNumber: valueForm.phoneNumber,
        Address: valueForm.address,
        Email: valueForm.email,
      };
  
      // Llamada al método de creación de empleado en el API
      this.api.CreateEmployee(employeeBody).subscribe({
        // Callback cuando se recibe una respuesta exitosa
        next: (response: any) => {
          if (response) {
            // Muestra una alerta de éxito
            this.alertSuccess("Creado Con Exito");
            // Actualiza la lista de empleados
            this.getEmployees();
            // Restablece el formulario
            this.resetForm();
          }
        },
        // Callback cuando ocurre un error
        error: (error: HttpErrorResponse) => {
          // Muestra una alerta de error
          this.alertError("Error al intentar crear");
        },
      });
    } else {
      // Marca todos los campos del formulario como tocados para mostrar errores
      this.form.markAllAsTouched();
    }
  }
  

  updateEmployee() {
    // Verificar si el formulario es válido
    if (this.form.valid) {
      // Obtener los valores del formulario
      let valueForm = this.form.value;
  
      // Crear el objeto con los datos del empleado a actualizar
      let employeeBody = {
        Id: this.employeeId,          // ID del empleado a actualizar
        FirstName: valueForm.name,
        LastName: valueForm.lastName,
        Dpi: valueForm.dpi,
        Gender: valueForm.gender,
        MaritalStatus: valueForm.maritalStatus,
        Nit: valueForm.nit,
        NoIggs: valueForm.noIggs,
        NoIrtra: valueForm.noIrtra,
        PhoneNumber: valueForm.phoneNumber,
        Address: valueForm.address,
        Email: valueForm.email,
      };
  
      // Llamar a la API para actualizar el empleado
      this.api.UpdateEmployee(employeeBody).subscribe({
        next: (response: any) => {
          // Si se recibe una respuesta
          if (response) {
            // Mostrar mensaje de éxito
            this.alertSuccess("Actualizado Con Exito");
  
            // Actualizar la lista de empleados
            this.getEmployees();
  
            // Restablecer el formulario
            this.resetForm();
          }
        },
        error: (error: HttpErrorResponse) => {
          // Mostrar mensaje de error
          this.alertError("Error al intentar actualizar");
        }
      });
    }
  }
  

  // Método para eliminar un empleado
deleteEmployee() {
  // Llamada al método DeleteEmployee del servicio API
  this.api.DeleteEmployee(this.employeeId).subscribe({
    // Callback que se ejecuta cuando la operación es exitosa
    next: (response: any) => {
      if (response) {
        // Mostrar una alerta de éxito si hay respuesta
        this.alertSuccess("Eliminado Con Exito");
        // Obtener la lista actualizada de empleados
        this.getEmployees();
        // Restablecer el formulario
        this.resetForm();
      }
    },
    // Callback que se ejecuta en caso de error
    error: (error: HttpErrorResponse) => {
      // Mostrar una alerta de error
      this.alertError("Error al intentar eliminar");
    }
  });
}


 // Esta función se llama cuando se selecciona una fila en una tabla o lista.
selectRow(row: any) {
  // Usamos patchValue para actualizar los valores del formulario con los valores de la fila seleccionada.
  this.form.patchValue({
    name: row.firstName,
    lastName: row.lastName,
    dpi: row.dpi,
    gender: row.gender,
    maritalStatus: row.maritalStatus,
    nit: row.nit,
    noIggs: row.noIggs,
    noIrtra: row.noIrtra,
    phoneNumber: row.phoneNumber,
    address: row.address,
    email: row.email,
  });

  // Guardamos el ID del empleado seleccionado para su posterior uso.
  this.employeeId = row.id;

  // Habilitamos el botón de guardar (Save) y deshabilitamos los botones de actualizar (Update) y eliminar (Delete).
  this.btnSave = true;
  this.btnUpdate = false;
  this.btnDelete = false;
}


  alertSuccess(msg: string){
    Swal.fire({
      icon: 'success',
      title: 'Great!!!',
      text: `${msg}`,
    })
  }

  alertError(msg: string){
    Swal.fire({
      icon: 'error',
      title: 'Ops...',
      text: `${msg}`,
    })
  }

  resetForm(){
    this.form.reset()
    this.btnsDisabled()
    this.form.patchValue({
      gender: 'Masculino',
      maritalStatus: 'Soltero'
    });
  }

  btnsDisabled(){
    this.btnSave = false
    this.btnUpdate = true
    this.btnDelete = true
  }
}
