<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Appmodel extends CI_Model 
{
	public $customerTable = 'customer';
	public $categoryTable = 'category';
	public $productTable = 'product';
	public $orderTable = 'order';
	
	public function registerCustomer($params) {
		$response = array();
		$customer = $this->db->get_where($this->customerTable, array('email' => $params['email']))->row();
		if($customer && $customer->id) {
			$response = array('status' => 'failed', 'title' => 'Already Registed?', 'message' => 'This email is already registered.');
		} else {
			$params['password'] = base64_encode($params['password']);
			$params['status'] = 1;
			$params['created'] = date('Y-m-d H:i:s');
			$params['updated'] = date('Y-m-d H:i:s');
			$id = $this->db->insert($this->customerTable, $params);
			if($id) {
				$info = array('lemail' => $params['email'], 'lpassword' => $params['password']);
				$this->loginCustomer($info);
				$response = array('status' => 'success', 'message' => 'You have been registered successfully');
			} else {
				$response = array('status' => 'failed', 'message' => $this->db->_error_message());
			}
		}
		return $response;
	}
	
	public function loginCustomer($params) {
		$response = array();
		$customer = $this->db->get_where($this->customerTable, array('email'=> $params['lemail'], 'password' => base64_encode($params['lpassword']), 'status' => 1))->row();
		if($customer && $customer->id) {
			$customer->password = base64_decode($customer->password);
			$customer->isLoggedIn = true;
			$this->session->set_userdata('customer', $customer);
			$response = array('status' => 'success', 'message' => 'Welcome back '.$customer->name, 'customer' => $customer);
		} else {
			$response = array('status' => 'failed', 'title' => 'Error', 'message' => 'Invalid username or password');
		}
		return $response;
	}
	
	public function saveCustomer($params) {
		$response = array();
		if(isset($params['id']) && $params['id']) {
			$params['password'] = base64_encode($params['password']);
			$this->db->update($this->customerTable, $params, array('id' => $params['id']));
			$response = array('status' => 'success', 'title' => 'Success', 'message' => 'The data has been updated Successfully');
		} else {
			$response = array('status' => 'failed', 'title' => 'Error', 'message' => 'Invalid data');
		}
		return $response;
	}
	
	public function logoutCustomer() {
		$this->session->sess_destroy();
		return array('status' => 'success', 'message' => 'You have been logged out successfully');
	}
	
	public function getCategories() {
		return $this->db->get_where($this->categoryTable, array('status' => 1))->result();
	}
	
	public function getPriceDetails() {
		$response = array();
		$categories = $this->db->get_where($this->categoryTable, array('status' => 1))->result_array();
		foreach($categories as $category) {
			$id = $category['id'];
			$response[$id] = $category;
			$response[$id]['products'] = $this->db->get_where($this->productTable, array('status' => 1, 'category_id' => $id))->result();
		}
		return $response;
	}
	
	public function getOrderHistory() {
		$response = array();
		$customer = $this->session->userdata('customer');
		$response = $this->db->get_where($this->orderTable, array('customer_id' => $customer->id))->result();		
		return $response;
	}
	
	public function getProfileDetails() {
		$response = array();
		$customer = $this->session->userdata('customer');
		$response = $this->db->get_where($this->customerTable, array('id' => $customer->id))->row();
		$response->password = base64_decode($response->password);
		return $response;
	}
}