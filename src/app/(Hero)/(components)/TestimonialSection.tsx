import React from "react";
import TestimonialCard from "./TestimonialCard";

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "This app has completely changed the way I manage my finances. Highly recommended!",
    },
    {
      name: "Michael Lee",
      text: "Easy to use and very effective. I finally feel in control of my budget.",
    },
    {
      name: "Emily Davis",
      text: "A must-have tool for anyone looking to improve their financial habits.",
    },
  ];
  return (
    <section   className="h-80 relative text-text p-10 flex flex-wrap items-center justify-center bg-[url(/Testimonials.webp)] bg-center bg-cover bg-no-repeat">
      <div className="bg-gradient-to-b from-background via-transparent via-10% to-background from-0% to-100% absolute inset-0"></div>
      {testimonials.map((testimonial, index) => (
        <TestimonialCard
          key={index}
          Testimonial={testimonial.text}
          customerName={testimonial.name}
        />
      ))}
    </section>
  );
}
