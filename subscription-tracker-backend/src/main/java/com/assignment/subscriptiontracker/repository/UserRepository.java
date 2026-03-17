package com.assignment.subscriptiontracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.assignment.subscriptiontracker.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
	

}
