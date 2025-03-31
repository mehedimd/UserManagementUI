import { Routes } from '@angular/router';
import { LoginComponent } from './components/account/login/login.component';
import { RegisterComponent } from './components/account/register/register.component';
import { Page404Component } from './shared/components/errorpage/page404/page404.component';
import { UserComponent } from './components/account/user/user.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = 
[
    {path : '', redirectTo : 'user', pathMatch : 'full'},
    {path : 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'user', 
        loadComponent: ()=> import('./components/account/user/user.component').then((c)=> c.UserComponent),
        canActivate : [authGuard]
    },
    {path: '**', component: Page404Component}
];
