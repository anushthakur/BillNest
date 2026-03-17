package com.assignment.subscriptiontracker.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.assignment.subscriptiontracker.entity.Payment;
import com.assignment.subscriptiontracker.repository.PaymentRepository;


@Service
public class PaymentService {

	@Autowired
	private PaymentRepository paymentRepository;
	
	//Create or Update Payment
	public Payment savePayment(Payment payment)
	{
		return paymentRepository.save(payment);
	}
	
	//Get all payments
	public List<Payment> getAllPayments()
	{	
		return paymentRepository.findAll();
		
	}
	
	//Get payment by ID
	public Optional<Payment> getPaymentById(Long id)
	{	
		return paymentRepository.findById(id);
			
	}
	//Get payments by subscription ID
	public List<Payment> getPaymentsBySubscriptionId(Long subscriptionId)
	{	
		return paymentRepository.findBySubscriptionId(subscriptionId);

					
	}
	//Delete Payment
		public void deletePayment(Long id)
		{	
			paymentRepository.deleteById(id);
						
		}
}
