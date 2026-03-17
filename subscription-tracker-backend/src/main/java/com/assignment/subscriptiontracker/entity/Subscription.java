package com.assignment.subscriptiontracker.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Table(name="subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable=false)
	private String name;
	
	@Column(nullable=false)
	private Double amount;

	@Column(nullable=false)
	private String billingCycle; //MONTHLY OR YEARLY
	
	private LocalDate startDate;
	
	private LocalDate renewalDate;
	
	//Many subscriptions belong to one user
	@ManyToOne
	@JoinColumn(name="user_id")
	private User user;
	
	//One subscription -> many payments
	@OneToMany(mappedBy = "subscription", cascade=CascadeType.ALL)
	private List<Payment> payments;

}
