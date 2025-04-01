import { inject, Injectable } from '@angular/core';
import { MasterService } from '../shared/services/master.service';
import { Register } from '../models/account/register';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private masterService: MasterService) {}

  register(model: Register) {
    return this.masterService.post('Auth/Register', model);
  }

  getRoles() {
    return this.masterService.get<any[]>('Auth/roles');
  }

  getUsers() {
    return this.masterService.get<any[]>('Auth/users');
  }

  updateUser(id: string, data: any) {
    return this.masterService.put<any>(`Auth/user/update/${id}`, data);
  }

  deleteUser(userId: string){
    return this.masterService.delete(`Auth/user/delete/${userId}`);
  }
}
