import { Injectable } from '@angular/core';
import { MasterService } from '../shared/services/master.service';
import { Register } from '../models/account/register';

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
}
