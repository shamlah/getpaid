import {Page, NavController, MenuController} from 'ionic-angular';
import {FORM_DIRECTIVES, FormBuilder,  ControlGroup, Validators, AbstractControl } from 'angular2/common';
import {ValidationService} from '../../services/validation/validation';
import {DataService} from '../../services/data/data';
import {HomePage} from '../home/home';

@Page({
  templateUrl: 'build/pages/order/order.html',
  directives: [FORM_DIRECTIVES],
  providers: [ValidationService]
})
export class OrderPage {
	public param: any;
	public data: any;	
	public orderForm: ControlGroup;
    public name: AbstractControl;
	public email: AbstractControl;
    public phone: AbstractControl;
	
	constructor(public nav: NavController, public menu: MenuController, fb: FormBuilder, public dataService: DataService) {
		this.orderForm = fb.group({  
			'name': ['', Validators.compose([Validators.required])],
			'email': ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
			'phone': ['', Validators.compose([Validators.required, Validators.minLength(10)])]
		});

		this.name = this.orderForm.controls['name'];   
		this.email = this.orderForm.controls['email'];     
		this.phone = this.orderForm.controls['phone'];
    }
	
	ngOnInit() {
		this.dataService.getPageData('order', this.param).subscribe(
			res => {
				this.data = res;
			}, 
			error => {
				console.log('Attempt: Get Page Data - order failed.');
			}
		);
	}
	
	onSubmit(value: string): void { 
        if(this.orderForm.valid) {
            this.dataService.placeOrder(value).subscribe(
				data => {
					if(data.session.isOrderSuccess) {
						this.nav.setRoot(HomePage);
					}
				},
				error => {
					console.log('Attempt: Order failed.');
				}
			);
        }
    }
}
