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
