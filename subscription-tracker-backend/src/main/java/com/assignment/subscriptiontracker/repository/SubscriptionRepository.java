package com.assignment.subscriptiontracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.assignment.subscriptiontracker.entity.Subscription;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription,Long>{
	//Custom method : find subscriptions by user ID
	List<Subscription> findByUserId(Long userId);
	

}
