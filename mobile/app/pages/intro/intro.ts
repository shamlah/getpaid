import {Page, NavController, MenuController, Alert} from 'ionic-angular';
import {DataService} from '../../services/data/data';
import {HomePage} from '../home/home';
import {LoginPage} from '../login/login';

@Page({
  templateUrl: 'build/pages/intro/intro.html'
})
export class IntroPage {
	constructor(public nav: NavController, public menu: MenuController, public dataService: DataService) {}
	
	onPageWillEnter() {
		this.menu.enable(false);
	}
	
	onPageWillLeave() {
		this.menu.enable(true);
	}
	
	loginEmail() {
		this.nav.push(LoginPage);
	}
	
	loginFacebook() {		
		var params = {'lemail':'test@test.com', 'lpassword':'test123'};
		this.dataService.login(params).subscribe(
			data => {
				if(data.status == 'success') {					
					this.dataService.rememberCustomer(data.customer);
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
	
	doAlert(info) {
		let alert = Alert.create({
			title: info.title,
			message: info.message,
			buttons: ['Ok']
		});
		this.nav.present(alert);
	}
}
