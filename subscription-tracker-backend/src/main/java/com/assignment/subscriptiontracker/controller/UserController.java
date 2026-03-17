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

import com.assignment.subscriptiontracker.entity.User;
import com.assignment.subscriptiontracker.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins="*") //Allows React frontend to call backend
public class UserController {
	
	@Autowired
	private UserService userService;
	
	//Create user
	@PostMapping
	public User createUser(@RequestBody User user)
	{
		return userService.saveUser(user);
	}
	
	//Get all Users
	@GetMapping
	public List<User> getAllUsers()
	{
		return userService.getAllUsers();
	}
	//Get User by ID
	@GetMapping("/{id}")
	public Optional<User> getUserById(@PathVariable Long id)
	{
		return userService.getUserById(id);
	}
	//Delete User
		@DeleteMapping("/{id}")
		public String deleteUser(@PathVariable Long id)
		{
			 userService.deleteUser(id);
			 return "User deleted successfully";
		}

}
