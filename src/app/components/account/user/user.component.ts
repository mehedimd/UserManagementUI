import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { AuthService } from '../../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  users: any[] = [];
  userRole: string = '';

  constructor(private accountService: AccountService, private authService: AuthService) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole(); // Get the logged-in user's role
    this.loadUsers();
  }

  loadUsers() {
    this.accountService.getUsers().subscribe({
      next: (data : any) => {
        console.log(data);
        this.users = data;
      },
      error: (err) => {
        console.error('Error fetching users', err);
      }
    });
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.accountService.deleteUser(userId).subscribe({
        next: () => {
          alert('User deleted successfully!');
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error deleting user', err);
        }
      });
    }
  }
}
