import {Page, NavController, Alert} from 'ionic-angular';
import {FORM_DIRECTIVES, FormBuilder,  ControlGroup, Validators, AbstractControl } from 'angular2/common';
import {ValidationService} from '../../services/validation/validation';
import {DataService} from '../../services/data/data';

@Page({
  templateUrl: 'build/pages/profile/profile.html',
  directives: [FORM_DIRECTIVES],
  providers: [ValidationService]
})
export class ProfilePage {
	public param: any;
	public data: any;
	public formData = {};
	public profileForm: ControlGroup;
    public id: AbstractControl;
	public name: AbstractControl;
	public email: AbstractControl;
    public password: AbstractControl;
	
	constructor(public nav: NavController, fb: FormBuilder, public dataService: DataService) {
		this.profileForm = fb.group({
			'id': ['', Validators.compose([Validators.required])],
			'name': ['', Validators.compose([Validators.required])],
			'email': ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
			'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});

		this.id = this.profileForm.controls['id'];   
		this.name = this.profileForm.controls['name'];   
		this.email = this.profileForm.controls['email'];     
		this.password = this.profileForm.controls['password'];
    }
	
	ngOnInit() {
		this.dataService.getPageData('profile', this.param).subscribe(
			res => {
				this.data = res;
				this.formData = res.profile;
			}, 
			error => {
				console.log('Attempt: Get Page Data - profile failed.');
			}
		);
	}
	
	onSubmit(value: string): void {
        if(this.profileForm.valid) {
            this.dataService.saveProfile(value).subscribe(
				data => {
					if(data.status == 'success') {
						this.doAlert(data);
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
