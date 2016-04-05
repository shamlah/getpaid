import {Page, NavController} from 'ionic-angular';
import {DataService} from '../../services/data/data';

@Page({
  templateUrl: 'build/pages/history/history.html'
})
export class HistoryPage {
	public param: any;
	public data: any;
	
	constructor(public nav: NavController, public dataService: DataService) {
		this.nav = nav;
	}
	
	ngOnInit() {
		this.dataService.observable$.subscribe(res => {
			this.data = res;
		});
		this.dataService.getPageData('history', this.param);
	}
}
