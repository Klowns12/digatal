import React from 'react';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import ContactForm from '../components/contact/ContactForm';

const HomePage = () => {
  return (
    <>
      <Hero />
      <Services />
      <ContactForm />
    </>
  );
};

export default HomePage;