import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../models/employee';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = "Employee"
  constructor(private http: HttpClient) { }

  public getEmployee() : Observable<Employee[]>{
    return this.http.get<Employee[]>(`${environment.apiUrl}/${this.url}`)
  }
  public CreateEmployee(employee: Employee) : Observable<Employee[]>{
    return this.http.post<Employee[]>(`${environment.apiUrl}/${this.url}`, employee)
  }
  public UpdateEmployee(employee: Employee) : Observable<Employee[]>{
    return this.http.put<Employee[]>(`${environment.apiUrl}/${this.url}`, employee)
  }
  public DeleteEmployee(employeeId: number) : Observable<Employee[]>{
    return this.http.delete<Employee[]>(`${environment.apiUrl}/${this.url}/${employeeId}`)
  }
}
