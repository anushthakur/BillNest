package com.assignment.subscriptiontracker.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.assignment.subscriptiontracker.entity.Payment;
import com.assignment.subscriptiontracker.service.PaymentService;


@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins="*")
public class PaymentController {
	@Autowired
	private PaymentService paymentService;
	
	//Create Payment
	@PostMapping
	public Payment createPayment(@RequestBody Payment payment)
	{
		return paymentService.savePayment(payment);
	}
	
	//Get all Payments
	@GetMapping
	public List<Payment> getAllPayments()
	{
		return paymentService.getAllPayments();
	}
	//Get Payment By ID
	@GetMapping("/{id}")
	public Optional<Payment> getPaymentById(@PathVariable Long id)
	{
		return paymentService.getPaymentById(id);
	}
	//Get Payments  By subscription ID
		@GetMapping("/subscription/{subscriptionId}")
		public List <Payment> getPaymentsBySubscriptionId(@PathVariable Long subscriptionId)
		{
			return paymentService.getPaymentsBySubscriptionId(subscriptionId);
		}	
	//Delete Payment
		@DeleteMapping("/{id}")
		public String deletePayment(@PathVariable Long id)
		{
			paymentService.deletePayment(id);
			return "Payment deleted successfully";
		}
}
