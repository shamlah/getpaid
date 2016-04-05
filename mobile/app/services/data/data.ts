import {Storage, SqlStorage} from 'ionic-angular';
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

@Injectable()
export class DataService{
	public storage: any;
	//public apiUrl: string = "http://myapps.16mb.com/bottle/app";
	public apiUrl: string = "http://localhost/git/package/data/app";
	public observable$: Observable<Object>;
	private _observer: any;	
	public data = {"isLoading": false, "session" :{}};
	public postHeaders: Object = {headers: {'Content-Type': 'application/x-www-form-urlencoded'}};
	
	constructor(public http: Http) {	
		this.storage = new Storage(SqlStorage);
		this.observable$ = new Observable(observer => this._observer = observer).share();
	}
	
	convertArrToObj(array) {
		var Obj = new Object();
		if(typeof array == "object"){
			for(var i in array){
				var thisEle = this.convertArrToObj(array[i]);
				Obj[i] = thisEle;
			}
		}else {
			Obj = array;
		}
		return Obj;
	}
	
	showLoading() {
		this.data.isLoading = true;
		this._observer.next(this.data);
	}
	
	hideLoading() {
		this.data.isLoading = false;
		this._observer.next(this.data);
	}
	
	prepareParams(params) {
		params = this.convertArrToObj(params);
		params = "params="+JSON.stringify(params);
		return params;
	}
	
	initialize(params) {
		
		this.storage.get('customer').then(customer => {			
			params.customer = JSON.parse(customer);
			params = this.prepareParams(params);
			return this.http.post(this.apiUrl, params, this.postHeaders).map(response => response.json()).subscribe(
				res => {
					this.data = res;
					this._observer.next(this.data);
				}, 
				error => {
					if(customer) {
						this.data.session = {};
						//this.data.session.customer = JSON.parse(customer);		
					}
					console.log('Attempt: Initialization failed.');
					this._observer.next(this.data);
				}
			);
		});
	}
	
	register(params) {
		params = this.prepareParams(params);
		return this.http.post(this.apiUrl+'/register', params, this.postHeaders).map(response => response.json());		
	}
	
	login(params) {
		this.showLoading();
		params = this.prepareParams(params);
		return this.http.post(this.apiUrl+'/login', params, this.postHeaders).map(response => {this.hideLoading(); return response.json();});		
	}
	
	rememberCustomer(customer) {
		this.storage.set('customer', JSON.stringify(customer));
	}
	
	logout() {
		this.showLoading();
		this.storage.remove('customer');
		return this.http.get(this.apiUrl+'/logout').map(response => {this.hideLoading(); return response.json();});				
	}
	
	getPageData(name, params) {
		return this.http.post(this.apiUrl+'/page/'+name, params, this.postHeaders).map(response => response.json());
	}
	
	saveProfile(params) {
		this.showLoading();
		params = this.prepareParams(params);
		return this.http.post(this.apiUrl+'/saveprofile', params, this.postHeaders).map(response => {this.hideLoading(); return response.json();});		
	}
	
	placeOrder(params) {
		this.showLoading();
		return this.http.post(this.apiUrl+'/placeorder', params, this.postHeaders).map(response => {this.hideLoading(); return response.json();});
	}
}