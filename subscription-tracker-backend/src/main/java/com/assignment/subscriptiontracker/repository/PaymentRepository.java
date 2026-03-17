package com.assignment.subscriptiontracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.assignment.subscriptiontracker.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Long>{
	//Find all the payments for a specific subscription //Custom method
	List<Payment> findBySubscriptionId(Long subscriptionId);

}
