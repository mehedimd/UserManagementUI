import { Component, OnInit, TemplateRef } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { AuthService } from '../../../services/auth.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [DatePipe,ReactiveFormsModule,NgbModule],
  templateUrl: './user.component.html',
  styleUrl : './user.component.css'
})
export class UserComponent implements OnInit {
  users: any[] = [];
  userRole: string = '';
  editUserForm!: FormGroup;
  selectedUserId!: string;
  modalRef!: NgbModalRef;

  constructor(
    private accountService: AccountService, 
    private authService: AuthService,
    private fb: FormBuilder, private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole(); // Get the logged-in user's role
    console.log(this.userRole)
    this.loadUsers();

    this.editUserForm = this.fb.group({
      name: ['',Validators.required],
      email: ['', [Validators.email]],
      designation: ['',Validators.required]
    });
  }

  loadUsers() {
    this.accountService.getUsers().subscribe({
      next: (data : any) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error fetching users', err);
      }
    });
  }

  
  openEditModal(user: any, content: TemplateRef<any>) {
    this.selectedUserId = user.id;
    this.editUserForm.patchValue({
      name: user.name,
      email: user.email,
      designation: user.designation
    });

    this.modalRef = this.modalService.open(content, { centered: true });
  }

  updateUser(modal: any) {
    if (!this.selectedUserId) return;

    const updatedData = this.editUserForm.value;
    this.accountService.updateUser(this.selectedUserId, updatedData).subscribe({
      next : res => {
        this.loadUsers();
        modal.close();
      },
      error : e => {
        console.log(e);
        modal.close();
      }
    }
    );
  }

  deleteUser(userId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.accountService.deleteUser(userId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
            this.ngOnInit();
          },
          error: (err) => {
            console.error('Error deleting user', err);
            Swal.fire('Error', 'There was a problem deleting the user.', 'error');
          }
        });
      }
    });
  }
  
}
