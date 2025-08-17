import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Ionicons } from "@expo/vector-icons";

const Index = () => {
  const features = [
    {
      icon: "wallet-outline",
      title: "Track Expenses",
      description: "Monitor your daily spending and categorize expenses",
    },
    {
      icon: "trending-up-outline",
      title: "Budget Planning",
      description: "Set budgets and track your financial goals",
    },
    {
      icon: "analytics-outline",
      title: "Financial Reports",
      description: "Get insights with detailed analytics and charts",
    },
    {
      icon: "shield-checkmark-outline",
      title: "Secure & Private",
      description: "Your financial data is encrypted and secure",
    },
  ];

  const stats = [
    { label: "Active Users", value: "10K+" },
    { label: "Transactions", value: "1M+" },
    { label: "Money Saved", value: "$50M+" },
  ];

  return (
    <ScrollView className="flex-1 bg-slate-900">
      {/* Hero Section */}
      <LinearGradient
        colors={["#1e40af", "#3b82f6", "#60a5fa"]}
        className="px-6 pt-16 pb-12"
      >
        <View className="items-center">
          <View className="bg-white/10 p-4 rounded-full mb-6">
            <Ionicons name="wallet-outline" size={48} color="white" />
          </View>

          <Text className="text-4xl font-bold text-white text-center mb-4">
            Personal Finance
          </Text>

          <Text className="text-xl text-blue-100 text-center mb-8 leading-relaxed">
            Take control of your money with smart budgeting and expense tracking
          </Text>

          <TouchableOpacity className="bg-white px-8 py-4 rounded-full shadow-lg">
            <Text className="text-blue-600 font-semibold text-lg">
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Stats Section */}
      <View className="bg-white py-12 px-6">
        <View className="flex-row justify-around">
          {stats.map((stat, index) => (
            <View key={index} className="items-center">
              <Text className="text-3xl font-bold text-slate-800">
                {stat.value}
              </Text>
              <Text className="text-slate-600 mt-1">{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Features Section */}
      <View className="bg-slate-50 py-12 px-6">
        <Text className="text-3xl font-bold text-slate-800 text-center mb-2">
          Everything You Need
        </Text>
        <Text className="text-slate-600 text-center mb-10">
          Powerful tools to manage your finances effectively
        </Text>

        <View className="space-y-6">
          {features.map((feature, index) => (
            <View
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm flex-row items-center"
            >
              <View className="bg-blue-100 p-3 rounded-full mr-4">
                <Ionicons
                  name={feature.icon as any}
                  size={24}
                  color="#3b82f6"
                />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-slate-800 mb-1">
                  {feature.title}
                </Text>
                <Text className="text-slate-600">{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* How It Works Section */}
      <View className="bg-white py-12 px-6">
        <Text className="text-3xl font-bold text-slate-800 text-center mb-10">
          How It Works
        </Text>

        <View className="space-y-8">
          {[
            {
              step: "1",
              title: "Connect Your Accounts",
              desc: "Securely link your bank accounts and cards",
            },
            {
              step: "2",
              title: "Set Your Budget",
              desc: "Create budgets for different categories",
            },
            {
              step: "3",
              title: "Track & Save",
              desc: "Monitor spending and reach your goals",
            },
          ].map((item, index) => (
            <View key={index} className="flex-row items-center">
              <View className="bg-blue-600 w-12 h-12 rounded-full items-center justify-center mr-4">
                <Text className="text-white font-bold text-lg">
                  {item.step}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-slate-800">
                  {item.title}
                </Text>
                <Text className="text-slate-600 mt-1">{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Testimonials Section */}
      <View className="bg-slate-50 py-12 px-6">
        <Text className="text-3xl font-bold text-slate-800 text-center mb-10">
          What Our Users Say
        </Text>

        <View className="space-y-6">
          {[
            {
              name: "Sarah Johnson",
              role: "Small Business Owner",
              comment:
                "This app helped me save $5,000 in my first year by tracking my expenses better.",
              rating: 5,
            },
            {
              name: "Mike Chen",
              role: "Software Engineer",
              comment:
                "The budgeting features are incredible. I finally have control over my finances.",
              rating: 5,
            },
            {
              name: "Emma Davis",
              role: "Teacher",
              comment:
                "Simple, intuitive, and powerful. Everything I need to manage my money.",
              rating: 5,
            },
          ].map((testimonial, index) => (
            <View key={index} className="bg-white p-6 rounded-xl shadow-sm">
              <View className="flex-row mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Ionicons key={i} name="star" size={16} color="#fbbf24" />
                ))}
              </View>
              <Text className="text-slate-700 mb-4 italic">
                "{testimonial.comment}"
              </Text>
              <View>
                <Text className="font-semibold text-slate-800">
                  {testimonial.name}
                </Text>
                <Text className="text-slate-600 text-sm">
                  {testimonial.role}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Security Section */}
      <View className="bg-white py-12 px-6">
        <Text className="text-3xl font-bold text-slate-800 text-center mb-4">
          Bank-Level Security
        </Text>
        <Text className="text-slate-600 text-center mb-10">
          Your financial data is protected with enterprise-grade security
        </Text>

        <View className="space-y-6">
          {[
            {
              icon: "lock-closed-outline",
              title: "256-bit Encryption",
              description:
                "All data is encrypted with the same security banks use",
            },
            {
              icon: "shield-checkmark-outline",
              title: "SOC 2 Compliant",
              description: "We meet the highest standards for data protection",
            },
            {
              icon: "eye-off-outline",
              title: "Privacy First",
              description:
                "We never sell your data or share it with third parties",
            },
            {
              icon: "checkmark-circle-outline",
              title: "Regular Audits",
              description:
                "Independent security audits ensure your data stays safe",
            },
          ].map((item, index) => (
            <View key={index} className="flex-row items-center">
              <View className="bg-green-100 p-3 rounded-full mr-4">
                <Ionicons name={item.icon as any} size={24} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-slate-800">
                  {item.title}
                </Text>
                <Text className="text-slate-600 mt-1">{item.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Pricing Section */}
      <View className="bg-slate-50 py-12 px-6">
        <Text className="text-3xl font-bold text-slate-800 text-center mb-4">
          Simple Pricing
        </Text>
        <Text className="text-slate-600 text-center mb-10">
          Choose the plan that works best for you
        </Text>

        <View className="space-y-6">
          {[
            {
              name: "Free",
              price: "$0",
              period: "/month",
              description: "Perfect for getting started",
              features: [
                "Track up to 100 transactions",
                "Basic expense categories",
                "Monthly reports",
                "Mobile app access",
              ],
              popular: false,
            },
            {
              name: "Pro",
              price: "$9.99",
              period: "/month",
              description: "For serious budgeters",
              features: [
                "Unlimited transactions",
                "Custom categories",
                "Advanced analytics",
                "Goal tracking",
                "Bank synchronization",
                "Export reports",
              ],
              popular: true,
            },
            {
              name: "Family",
              price: "$19.99",
              period: "/month",
              description: "Manage family finances",
              features: [
                "Everything in Pro",
                "Up to 5 family members",
                "Shared budgets",
                "Family insights",
                "Priority support",
              ],
              popular: false,
            },
          ].map((plan, index) => (
            <View
              key={index}
              className={`bg-white p-6 rounded-xl shadow-sm border-2 ${
                plan.popular ? "border-blue-500" : "border-transparent"
              }`}
            >
              {plan.popular && (
                <View className="bg-blue-500 px-3 py-1 rounded-full self-start mb-3">
                  <Text className="text-white text-sm font-medium">
                    Most Popular
                  </Text>
                </View>
              )}

              <Text className="text-2xl font-bold text-slate-800">
                {plan.name}
              </Text>
              <View className="flex-row items-end mb-2">
                <Text className="text-4xl font-bold text-blue-600">
                  {plan.price}
                </Text>
                <Text className="text-slate-600 mb-1">{plan.period}</Text>
              </View>
              <Text className="text-slate-600 mb-6">{plan.description}</Text>

              <View className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <View key={featureIndex} className="flex-row items-center">
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#059669"
                    />
                    <Text className="text-slate-700 ml-3">{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                className={`py-3 px-6 rounded-full ${
                  plan.popular ? "bg-blue-600" : "bg-slate-200"
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    plan.popular ? "text-white" : "text-slate-700"
                  }`}
                >
                  {plan.name === "Free" ? "Get Started" : "Choose Plan"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* FAQ Section */}
      <View className="bg-white py-12 px-6">
        <Text className="text-3xl font-bold text-slate-800 text-center mb-10">
          Frequently Asked Questions
        </Text>

        <View className="space-y-6">
          {[
            {
              question: "Is my financial data secure?",
              answer:
                "Yes, we use bank-level 256-bit encryption and never store your banking credentials.",
            },
            {
              question: "Can I connect multiple bank accounts?",
              answer:
                "Absolutely! Pro and Family plans support unlimited bank account connections.",
            },
            {
              question: "Do you support international banks?",
              answer:
                "We support over 12,000 financial institutions across North America and Europe.",
            },
            {
              question: "Can I export my data?",
              answer:
                "Yes, Pro and Family plans include CSV export functionality for all your financial data.",
            },
            {
              question: "Is there a mobile app?",
              answer:
                "Yes, our mobile app is available for both iOS and Android with full feature parity.",
            },
          ].map((faq, index) => (
            <View key={index} className="bg-slate-50 p-6 rounded-xl">
              <Text className="text-lg font-semibold text-slate-800 mb-3">
                {faq.question}
              </Text>
              <Text className="text-slate-600 leading-relaxed">
                {faq.answer}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Contact Section */}
      <View className="bg-slate-50 py-12 px-6">
        <Text className="text-3xl font-bold text-slate-800 text-center mb-4">
          Need Help?
        </Text>
        <Text className="text-slate-600 text-center mb-10">
          Our support team is here to help you succeed
        </Text>

        <View className="space-y-6">
          {[
            {
              icon: "mail-outline",
              title: "Email Support",
              description: "support@personalfinance.app",
              action: "Send Email",
            },
            {
              icon: "chatbubble-outline",
              title: "Live Chat",
              description: "Available 24/7 for Pro users",
              action: "Start Chat",
            },
            {
              icon: "book-outline",
              title: "Help Center",
              description: "Browse our comprehensive guides",
              action: "Visit Help Center",
            },
          ].map((contact, index) => (
            <View
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1">
                <View className="bg-blue-100 p-3 rounded-full mr-4">
                  <Ionicons
                    name={contact.icon as any}
                    size={24}
                    color="#3b82f6"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-slate-800">
                    {contact.title}
                  </Text>
                  <Text className="text-slate-600">{contact.description}</Text>
                </View>
              </View>
              <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-full">
                <Text className="text-white font-medium">{contact.action}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* CTA Section */}
      <LinearGradient colors={["#1e40af", "#3b82f6"]} className="py-12 px-6">
        <View className="items-center">
          <Text className="text-3xl font-bold text-white text-center mb-4">
            Ready to Start?
          </Text>
          <Text className="text-blue-100 text-center mb-8 text-lg">
            Join thousands of users who are already in control of their finances
          </Text>

          <TouchableOpacity className="bg-white px-8 py-4 rounded-full mb-4">
            <Text className="text-blue-600 font-semibold text-lg">
              Create Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text className="text-blue-100 underline">Sign In</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Footer */}
      <View className="bg-slate-800 py-8 px-6">
        <View className="items-center">
          <View className="flex-row items-center mb-4">
            <Ionicons name="wallet-outline" size={24} color="white" />
            <Text className="text-white font-bold text-lg ml-2">
              Personal Finance
            </Text>
          </View>
          <Text className="text-slate-400 text-center">
            © 2025 Personal Finance App. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default Index;
