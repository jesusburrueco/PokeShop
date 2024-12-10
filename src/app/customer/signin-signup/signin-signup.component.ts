import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { LoginSignupService } from '../../shared/services/login-signup.service';
import { User } from '../../core/models/object-model';

@Component({
  selector: 'app-signin-signup',
  templateUrl: './signin-signup.component.html',
  styleUrls: ['./signin-signup.component.scss']
})
export class SigninSignupComponent implements OnInit {

  users: User[] = [];
  regForm: Boolean = false;
  signUpform: FormGroup;
  signInform: FormGroup;
  signUpsubmitted = false;
  href: String = '';
  user_data;
  user_dto: User;
  user_reg_data;
  user_id: number | null = null;

  signInFormValue: any = {};

  constructor(private formBuilder: FormBuilder, private router: Router, private logsign_service: LoginSignupService) { }

  ngOnInit() {
    this.loadUsers();
    this.href = this.router.url;
    if (this.href == '/sign-up') {
      this.regForm = true;
    } else if (this.href == '/sign-in') {
      this.regForm = false;
    }

    this.signUpform = this.formBuilder.group({
      name: ['', Validators.required],
      mobNumber: ['', Validators.required],
      age: ['', Validators.required],
      dob: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      addLine1: ['', Validators.required],
      addLine2: [],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      language: ['', Validators.required],
      gender: ['', Validators.required],
      aboutYou: ['', Validators.required],
      uploadPhoto: ['', Validators.required],
      agreetc: ['', Validators.required],
      role: ['', Validators.required],

    })

    this.signInform = this.formBuilder.group({

    })
  }

  get rf() { return this.signUpform.controls; }

  onSubmitSignUp() {
    this.signUpsubmitted = true;
    if (this.signUpform.invalid) {
      // alert('Error!! :-)\n\n' + JSON.stringify(this.signUpform.value))
      return;
    }
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.signUpform.value))
    // console.log(this.signUpform.value)
    this.user_reg_data = this.signUpform.value;
      // Crear DTO temporal para enviar con los datos de usuario
    this.logsign_service.getAllUsers().subscribe(users => {
      // Encontrar el último ID de usuario en la base de datos
      const lastId = users.reduce((maxId, user) => Math.max(maxId, user.id), 0);
      console.log(lastId);
      const newId = (lastId + 1); // Sumar +1 y convertir a string

      // Construir el objeto DTO con el nuevo ID
      this.user_dto = {
        id: newId, // Asignar el nuevo ID
        aboutYou: this.user_reg_data.aboutYou,
        age: this.user_reg_data.age,
        agreetc: this.user_reg_data.agreetc,
        dob: this.user_reg_data.dob,
        email: this.user_reg_data.email,
        gender: this.user_reg_data.gender,
        address: {
          id: 0,
          addLine1: this.user_reg_data.addLine1,
          addLine2: this.user_reg_data.addLine2,
          city: this.user_reg_data.city,
          state: this.user_reg_data.state,
          zipCode: this.user_reg_data.zipCode,
        },
        language: this.user_reg_data.language,
        mobNumber: this.user_reg_data.mobNumber,
        name: this.user_reg_data.name,
        password: this.user_reg_data.password,
        uploadPhoto: this.user_reg_data.uploadPhoto,
        role: this.user_reg_data.role,
      };

      // Enviar los datos con el nuevo ID
      this.logsign_service.userRegister(this.user_dto).subscribe(
        data => {
          alert('Success');
          this.router.navigateByUrl('/sign-in');
        },
        err => {
          alert('Some Error Occurred');
        }
      );
    }, err => {
      alert('Error fetching user data');
    });
  }

  onSubmitSignIn() {
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.signInFormValue));
    this.logsign_service.authLogin(this.signInFormValue.userEmail, this.signInFormValue.userPassword).subscribe(data => {
      this.user_data = data;
      if (this.user_data.length == 1) {
        sessionStorage.setItem('user_session_id', this.user_data[0].id.toString()); // Guarda el ID correctamente
        this.user_id = Number(sessionStorage.getItem('user_session_id')); // Convierte el valor
        console.log('ID del usuario actual:', this.user_id);
        if (this.user_data[0].role == "seller") {
          sessionStorage.setItem("user_session_id", this.user_data[0].id);
          sessionStorage.setItem("role", this.user_data[0].role);
          this.router.navigateByUrl('/seller-dashboard');
        } else if (this.user_data[0].role == "buyer") {
          sessionStorage.setItem("user_session_id", this.user_data[0].id);
          sessionStorage.setItem("role", this.user_data[0].role);
          this.router.navigateByUrl('/buyer-dashboard');
        } else {
          alert("Invalid-user-role")
        }
      } else {
        alert("Invalid")
      }
      console.log(this.user_data);

    }, error => {
      console.log("My error", error);
    })
  }

  loadUsers() {
    this.logsign_service.getAllUsers().subscribe(
      (response) => {
        this.users = response;
        console.log('Usuarios cargados:', this.users);
      },
      (error) => {
        console.error('Error al cargar usuarios', error);
      }
    );
  }

}
