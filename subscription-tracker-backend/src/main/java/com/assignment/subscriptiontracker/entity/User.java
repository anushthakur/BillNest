package com.assignment.subscriptiontracker.entity;
 
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name="users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"subscriptions"})
public class User {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable=false)
	private String name;
	
	@Column(unique=true, nullable=false)
	private String email;
	
	//One user -> many subscriptions
	@OneToMany(mappedBy="user", cascade=CascadeType.ALL)
	@ToString.Exclude
	private List<Subscription> subscriptions;

}
