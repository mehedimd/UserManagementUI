import { Routes } from '@angular/router';
import { LoginComponent } from './components/account/login/login.component';
import { RegisterComponent } from './components/account/register/register.component';
import { Page404Component } from './shared/components/errorpage/page404/page404.component';
import { UserComponent } from './components/account/user/user.component';

export const routes: Routes = 
[
    {path : '', component: UserComponent},
    {path : 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'user', component: UserComponent},
    {path: '**', component: Page404Component}
];
