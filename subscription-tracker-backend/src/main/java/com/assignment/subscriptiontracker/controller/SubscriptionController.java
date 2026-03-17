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

import com.assignment.subscriptiontracker.entity.Subscription;
import com.assignment.subscriptiontracker.service.SubscriptionService;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins="*")
public class SubscriptionController {
	@Autowired
	private SubscriptionService subscriptionService;
	
	//Create Subscription
	@PostMapping
	public Subscription createSubscription(@RequestBody Subscription subscription)
	{
		return subscriptionService.saveSubscription(subscription);
	}
	
	//Get all Subscriptions
	@GetMapping
	public List<Subscription> getAllSubscriptions()
	{
		return subscriptionService.getAllSubscriptions();
	}
	//GetSubscription By ID
	@GetMapping("/{id}")
	public Optional<Subscription> getSubscriptionById(@PathVariable Long id)
	{
		return subscriptionService.getSubscriptionById(id);
	}
	//GetSubscriptions  By userID
		@GetMapping("/user/{userId}")
		public List <Subscription> getSubscriptionsByUserId(@PathVariable Long userId)
		{
			return subscriptionService.getSubscriptionsByUserId(userId);
		}	
	//Delete Subscription
		@DeleteMapping("/{id}")
		public String deleteSubscription(@PathVariable Long id)
		{
			subscriptionService.deleteSubscription(id);
			return "Subscription deleted successfully";
		}

}
