import {Page, NavController} from 'ionic-angular';
import {OrderPage} from '../order/order';
import {PricePage} from '../price/price';

@Page({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
	public nav: any;
	public tab1: any;
	public tab2: any;
	constructor(nav: NavController) {
		this.nav = nav;
		this.tab1 = OrderPage;
		this.tab2 = PricePage;
	}
}
