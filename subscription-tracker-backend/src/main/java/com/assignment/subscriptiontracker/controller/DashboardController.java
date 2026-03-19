package com.assignment.subscriptiontracker.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.assignment.subscriptiontracker.entity.Subscription;
import com.assignment.subscriptiontracker.service.PaymentService;
import com.assignment.subscriptiontracker.service.SubscriptionService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public Map<String, Object> getDashboardData() {
        Map<String, Object> dashboardData = new HashMap<>();

        long activeSubscriptions = subscriptionService.getActiveSubscriptionsCount();
        double totalMonthly = subscriptionService.getTotalMonthlyCost();
        double totalYearly = subscriptionService.getTotalYearlyCost();
        double totalPaidAmount = paymentService.getTotalPaidAmount();

        // upcoming renewals within next 30 days
        List<Subscription> upcoming = subscriptionService.getUpcomingRenewals(30);

        dashboardData.put("activeSubscriptions", activeSubscriptions);
        dashboardData.put("totalMonthlyCost", totalMonthly);
        dashboardData.put("totalYearlyCost", totalYearly);
        dashboardData.put("totalPaidAmount", totalPaidAmount);
        dashboardData.put("upcomingRenewals", upcoming);

        return dashboardData;
    }

    @GetMapping("/active")
    public List<Map<String, Object>> getActiveSubscriptions() {
        // return a lightweight view of active subscriptions to avoid deep recursion
        List<Subscription> all = subscriptionService.getAllSubscriptions();
        return all.stream().filter(s -> {
            if (s == null) return false;
            java.time.LocalDate r = s.getRenewalDate();
            return r == null || !r.isBefore(java.time.LocalDate.now());
        }).map(s -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", s.getId());
            m.put("name", s.getName());
            m.put("amount", s.getAmount());
            m.put("billingCycle", s.getBillingCycle());
            m.put("renewalDate", s.getRenewalDate());
            if (s.getUser() != null) m.put("userName", s.getUser().getName());
            else m.put("userName", null);
            return m;
        }).collect(Collectors.toList());
    }

}