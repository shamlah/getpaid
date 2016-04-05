import {Page, MenuController} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/landing/landing.html'
})
export class LandingPage {

	constructor(public menu: MenuController) {}
	
	onPageWillEnter() {
		this.menu.enable(false);
	}
	
	onPageWillLeave() {
		this.menu.enable(true);
	}
}
