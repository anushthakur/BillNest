package com.assignment.subscriptiontracker.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.assignment.subscriptiontracker.entity.User;
import com.assignment.subscriptiontracker.repository.UserRepository;

@Service
public class UserService {
	@Autowired
	private UserRepository userRepository;
	
	//Create or update User
	public User saveUser(User user)
	{
		return userRepository.save(user);
	}
	//Get all users
	public List<User> getAllUsers()
	{
		System.out.println("Getting all users"+ userRepository.findAll());
		return userRepository.findAll();
	}
	
	//Get user by ID
	public Optional<User> getUserById(Long id)
	{
		return userRepository.findById(id);
	}
	//Delete user
	public void deleteUser(Long id)
	{
		if(userRepository.existsById(id))
		{
			userRepository.deleteById(id);
			System.out.println("User with id:"+ id +" is deleted");
		}
		else
		{
			throw new RuntimeException("User not found");
		}
		
	}
}
