import {App, IonicApp, Platform, Alert} from 'ionic-angular';
import {DataService} from './services/data/data';
import {LandingPage} from './pages/landing/landing';
import {IntroPage} from './pages/intro/intro';
import {HomePage} from './pages/home/home';
import {ProfilePage} from './pages/profile/profile';
import {HistoryPage} from './pages/history/history';


@App({
	templateUrl: 'build/app.html',
	config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
	providers: [DataService]
})
class MyApp {
	rootPage: any = LandingPage;
	pages: Array<{title: string, component: any}>;
	params = {};
	data: any;

	constructor(private app: IonicApp, private platform: Platform, public dataService: DataService) {
		this.initializeApp();

		// used for an example of ngFor and navigation
		this.pages = [
			{ title: 'Home', component: HomePage },
			{ title: 'Profile', component: ProfilePage },
			{ title: 'Order History', component: HistoryPage }
		];
	}

	initializeApp() {
		this.platform.ready().then(() => {
		  // The platform is now ready. Note: if this callback fails to fire, follow
		  // the Troubleshooting guide for a number of possible solutions:
		  //
		  // Okay, so the platform is ready and our plugins are available.
		  // Here you can do any higher level native things you might need.
		  //
		  // First, let's hide the keyboard accessory bar (only works natively) since
		  // that's a better default:
		  //
		  // Keyboard.setAccessoryBarVisible(false);
		  //
		  // For example, we might change the StatusBar color. This one below is
		  // good for dark backgrounds and light text:
		  // StatusBar.setStyle(StatusBar.LIGHT_CONTENT)
		});
	}
  
	ngOnInit() {
		this.dataService.observable$.subscribe(res => {
			this.data = res;
			if(this.data && this.data.session && this.data.session.customer && this.data.session.customer.isLoggedIn) {
				this.rootPage = HomePage;
			} else {
				this.rootPage = IntroPage;
			}
		});
		this.dataService.initialize(this.params);
	}

	openPage(page) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		let nav = this.app.getComponent('nav');
		if(page.title == 'Home') {
			nav.root(page.component);
		} else {
			nav.push(page.component);
		}
	}
  
	logout() {
		this.dataService.logout().subscribe(
			data => {
				if(data.status == 'success') {
					let nav = this.app.getComponent('nav');
					nav.setRoot(IntroPage);
				} else {
					this.doAlert(data);
				}
			},
			error => {
				console.log('Attempt: Logout failed.');
			}
		);
	}
  
	doAlert(info) {
		let nav = this.app.getComponent('nav');
		let alert = Alert.create({
			title: info.title,
			message: info.message,
			buttons: ['Ok']
		});
		nav.present(alert);
	}
}
