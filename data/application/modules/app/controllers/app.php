<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class App extends Front_Controller 
{
	public $module = 'app';
	
	public function __construct() {
		parent::__construct();
	}
	
	public function index() {
		$params = $this->site->getParams();
		if(isset($params['customer']['email']) & isset($params['customer']['password'])) {
			$data = array('lemail' => $params['customer']['email'], 'lpassword' => $params['customer']['password']);
			$this->appmodel->loginCustomer($data);
		}
		echo $this->site->getResponse();
	}
	
	public function register() {
		$params = $this->site->getParams();
		$response = $this->appmodel->registerCustomer($params);
		echo json_encode($response);
	}
	
	public function saveprofile() {
		$params = $this->site->getParams();
		$response = $this->appmodel->saveCustomer($params);
		echo json_encode($response);
	}
	
	public function login() {
		$params = $this->site->getParams();
		$response = $this->appmodel->loginCustomer($params);
		echo json_encode($response);
	}
	
	public function logout() {
		$response = $this->appmodel->logoutCustomer();
		echo json_encode($response);
	}
	
	public function page() {
		$type = $this->uri->segment(3);
		$page= array();
		switch($type) {
			case "order":
				$page['categories'] = $this->appmodel->getCategories();
				break;
			case "price":
				$page['prices'] = $this->appmodel->getPriceDetails();
				break;
			case "history":
				$page['orders'] = $this->appmodel->getOrderHistory();
				break;
			case "profile":
				$page['profile'] = $this->appmodel->getProfileDetails();
				break;
		}
		echo json_encode($page);
	}
}