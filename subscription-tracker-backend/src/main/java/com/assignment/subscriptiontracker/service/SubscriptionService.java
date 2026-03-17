package com.assignment.subscriptiontracker.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.assignment.subscriptiontracker.entity.Subscription;
import com.assignment.subscriptiontracker.repository.SubscriptionRepository;

@Service
public class SubscriptionService {
	
	@Autowired
	private SubscriptionRepository subscriptionRepository;
	
	//Create or Update Subscription
	public Subscription saveSubscription(Subscription subscription)
	{
		return subscriptionRepository.save(subscription);
	}
	
	//Get all subscriptions
	public List<Subscription> getAllSubscriptions()
	{	
		return subscriptionRepository.findAll();
		
	}
	
	//Get subscription by ID
	public Optional<Subscription> getSubscriptionById(Long id)
	{	
		return subscriptionRepository.findById(id);
			
	}
	//Get subscriptions by User ID
	public List<Subscription> getSubscriptionsByUserId(Long userId)
	{	
		return subscriptionRepository.findByUserId(userId);
//				.stream()
//				.filter(sub->sub.isActive())
//				.toList();
					
	}
	//DElete Subscription
		public void deleteSubscription(Long id)
		{	
			subscriptionRepository.deleteById(id);
						
		}
				
		

}
