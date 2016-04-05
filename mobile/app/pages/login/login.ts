import {Page, NavController, MenuController, Alert} from 'ionic-angular';
import {FORM_DIRECTIVES, FormBuilder,  ControlGroup, Validators, AbstractControl } from 'angular2/common';
import {ValidationService} from '../../services/validation/validation';
import {DataService} from '../../services/data/data';
import {HomePage} from '../home/home';

@Page({
  templateUrl: 'build/pages/login/login.html',
  directives: [FORM_DIRECTIVES],
  providers: [ValidationService]
})
export class LoginPage {
	//Login Form
	public loginForm: ControlGroup;
    public lemail: AbstractControl;
    public lpassword: AbstractControl;
	
	//Register Form
	public registerForm: ControlGroup;
    public name: AbstractControl;
	public email: AbstractControl;
    public password: AbstractControl;
	
	constructor(public nav: NavController, public menu: MenuController, fb: FormBuilder, public dataService: DataService) {
		//Login Form
		this.loginForm = fb.group({
			'lemail': ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
			'lpassword': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});

		this.lemail = this.loginForm.controls['lemail'];     
		this.lpassword = this.loginForm.controls['lpassword'];
		
		//Register Form
		this.registerForm = fb.group({  
			'name': ['', Validators.compose([Validators.required])],
			'email': ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
			'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});

		this.name = this.registerForm.controls['name'];   
		this.email = this.registerForm.controls['email'];     
		this.password = this.registerForm.controls['password'];
    }
	
	onPageWillEnter() {
		this.menu.enable(false);
	}
	
	onPageWillLeave() {
		this.menu.enable(true);
	}
	
	doLogin(value: string): void { 
        if(this.loginForm.valid) {
            this.dataService.login(value).subscribe(
				data => {
					if(data.status == 'success') {
						this.nav.setRoot(HomePage);
					} else {
						this.doAlert(data);
					}
				},
				error => {
					console.log('Attempt: Login failed.');
				}
			);
        }
    }
	
	doRegister(value: string): void { 
        if(this.registerForm.valid) {
            this.dataService.register(value).subscribe(
				data => {
					if(data.status == 'success') {
						this.nav.setRoot(HomePage);
					} else {
						this.doAlert(data);
					}
				},
				error => {
					console.log('Attempt: Registration failed.');
				}
			);
        }
    }
	
	doAlert(info) {
		let alert = Alert.create({
			title: info.title,
			message: info.message,
			buttons: ['Ok']
		});
		this.nav.present(alert);
	}
}
