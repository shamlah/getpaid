<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admin_Controller extends CI_Controller 
{
    public function __construct() {		
        parent::__construct();		
		$method = $this->router->fetch_method();
		$isLoggedIn = $this->session->userdata('isLoggedIn');
		$validSession = $this->site->validateSession();
		
		if(!$isLoggedIn && $method != 'login') {
			echo $this->site->getResponse();
			die();
		}
		if($this->input->post('sid') != "" && !$validSession) {
			$this->admin_model->logout();
			$this->session->set_flashdata('invalid_session', array('type'=>'error', 'message' => 'Your session has been expired.'));
			echo $this->site->getResponse();
			die();
		}
    }
}

class Front_Controller extends CI_Controller 
{
    public function __construct() {
		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
		header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
		$method = $_SERVER['REQUEST_METHOD'];
		if($method == "OPTIONS") {
			die();
		}
        parent::__construct();
    }
}