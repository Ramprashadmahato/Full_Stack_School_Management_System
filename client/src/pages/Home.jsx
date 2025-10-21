import React from 'react';
import Navbar from '../components/common/Navbar';
import HeroSection from '../components/home/HeroSection';
import NoticeSection from '../components/home/NoticeSection';
import GalleryPreview from '../components/home/GalleryPreview';
import Footer from '../components/common/Footer';
import AboutSchool from '../components/home/AboutSchool';

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <AboutSchool />
      <NoticeSection />
      <GalleryPreview />
      <Footer />
    </div>
  );
};

export default Home;
