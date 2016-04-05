import {Page, NavController} from 'ionic-angular';
import {DataService} from '../../services/data/data';
import {MapToIterable} from '../../pipes/iterable';

@Page({
  templateUrl: 'build/pages/price/price.html',
  pipes: [MapToIterable]
})
export class PricePage {
	public param: any;
	public data: any;
	
	constructor(public nav: NavController, public dataService: DataService) {
		this.nav = nav;
	}
	
	ngOnInit() {
		this.dataService.getPageData('price', this.param).subscribe(
			res => {
				this.data = res;
			}, 
			error => {
				console.log('Attempt: Get Page Data - price failed.');
			}
		);
	}
}
