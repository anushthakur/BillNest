package com.assignment.subscriptiontracker.service;

import java.time.LocalDate;
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

	// Create or Update Subscription
	public Subscription saveSubscription(Subscription subscription) {
		return subscriptionRepository.save(subscription);
	}

	// Get all subscriptions
	public List<Subscription> getAllSubscriptions() {
		return subscriptionRepository.findAll();
	}

	// Get subscription by ID
	public Optional<Subscription> getSubscriptionById(Long id) {
		return subscriptionRepository.findById(id);
	}

	// Get subscriptions by User ID
	public List<Subscription> getSubscriptionsByUserId(Long userId) {
		return subscriptionRepository.findByUserId(userId);
	}

	// Delete Subscription
	public void deleteSubscription(Long id) {
		subscriptionRepository.deleteById(id);
	}

	// Determine if a subscription is active. A subscription is considered active
	// if renewalDate is null (undated) or renewalDate is today or in the future.
	private boolean isActive(Subscription s) {
		if (s == null)
			return false;
		LocalDate renewal = s.getRenewalDate();
		if (renewal == null)
			return true; // undated subscriptions are assumed active
		return !renewal.isBefore(LocalDate.now());
	}

	// Monthly equivalent amount for a subscription
	private double monthlyEquivalent(Subscription s) {
		if (s == null || s.getAmount() == null)
			return 0.0;
		String cycle = s.getBillingCycle();
		double amt = s.getAmount();
		if (cycle == null)
			return amt; // default to treating as monthly
		if ("YEARLY".equalsIgnoreCase(cycle))
			return amt / 12.0;
		// MONTHLY or unknown
		return amt;
	}

	// Yearly equivalent amount for a subscription
	private double yearlyEquivalent(Subscription s) {
		if (s == null || s.getAmount() == null)
			return 0.0;
		String cycle = s.getBillingCycle();
		double amt = s.getAmount();
		if (cycle == null)
			return amt * 12.0; // default assume monthly
		if ("YEARLY".equalsIgnoreCase(cycle))
			return amt;
		// MONTHLY or unknown
		return amt * 12.0;
	}

	// calculate total monthly cost across active subscriptions
	public double getTotalMonthlyCost() {
		return subscriptionRepository.findAll().stream().filter(this::isActive).mapToDouble(this::monthlyEquivalent)
				.sum();
	}

	// calculate total yearly cost across active subscriptions
	public double getTotalYearlyCost() {
		return subscriptionRepository.findAll().stream().filter(this::isActive).mapToDouble(this::yearlyEquivalent)
				.sum();
	}

	// count active subscriptions
	public long getActiveSubscriptionsCount() {
		return subscriptionRepository.findAll().stream().filter(this::isActive).count();
	}

	// upcoming renewals within given days
	public List<Subscription> getUpcomingRenewals(int days) {
		LocalDate now = LocalDate.now();
		LocalDate until = now.plusDays(days);
		return subscriptionRepository.findAll().stream().filter(s -> {
			if (s == null)
				return false;
			LocalDate r = s.getRenewalDate();
			return r != null && (!r.isBefore(now)) && (!r.isAfter(until));
		}).toList();
	}

}

