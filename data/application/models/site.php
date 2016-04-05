<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Site extends CI_Model 
{
	protected $response = null;
	protected $params = array();
	protected $messages = array();
	protected $mediaDir = 'media';
	protected $paramSegment = 4;
	
	public function getParams($key = '') {
		if(!$this->params) {
			$this->params = json_decode($this->input->post('params'), true);
		}
		if(!$key) { return $this->params; }
		return ($key && isset($this->params[$key])) ? $this->params[$key]: null;
	}
	
	public function validateSession() {
		if($this->getParams('sid') == session_id()) {
			return true;
		}
		return false;
	}
	
	public function addMessage($key, $data) {
		$this->messages[$key] = $key;
		$this->session->set_flashdata($key, $data);
	}
	
	public function addResponse($key, $data) {
		$this->response[$key] = $data;
	}
	
	public function getResponse() {
		$this->response['session'] = $this->session->userdata();
		$this->response['session']['sid'] = session_id();
		$this->response['session']['message'] = $this->session->flashdata();		
		$this->removeMessages();
		return json_encode($this->response);
	}
	
	public function removeMessages() {
		foreach($this->messages as $key => $message) {
			unset($_SESSION[$key]);
			unset($_SESSION['__ci_vars'][$key]);
		}
	}
}