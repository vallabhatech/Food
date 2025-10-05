
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-green-800 mb-6">Our Mission</h1>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed text-center">
          At NourishNet, we believe that good food belongs in bellies, not bins. Our mission is to create a seamless and trustworthy platform that connects neighbors to share surplus food, reducing waste and fighting hunger in our communities. We are building more than just an app; we are cultivating a community rooted in kindness, generosity, and mutual support.
        </p>

        <div className="grid md:grid-cols-3 gap-8 my-12 text-center">
          <div className="p-6 bg-green-50 rounded-lg">
            <i className="fas fa-recycle text-4xl text-green-600 mb-4"></i>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Reduce Waste</h2>
            <p className="text-gray-600">We empower individuals to easily share extra food, preventing it from ending up in landfills and contributing to a healthier planet.</p>
          </div>
          <div className="p-6 bg-green-50 rounded-lg">
            <i className="fas fa-users text-4xl text-green-600 mb-4"></i>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Build Community</h2>
            <p className="text-gray-600">Every shared meal is a connection made. We foster a supportive network where people can help their neighbors in a tangible way.</p>
          </div>
          <div className="p-6 bg-green-50 rounded-lg">
            <i className="fas fa-hand-holding-heart text-4xl text-green-600 mb-4"></i>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Fight Hunger</h2>
            <p className="text-gray-600">We provide a dignified way for individuals and families to access fresh, nutritious food when they need it most.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-green-800 mt-16 mb-6">How It Works</h2>
        <ol className="relative border-l border-gray-200">
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-green-200 rounded-full -left-3 ring-8 ring-white">1</span>
            <h3 className="text-lg font-semibold text-gray-900">Post a Listing</h3>
            <p className="text-base font-normal text-gray-500">Verified members with surplus food can quickly post a listing with a photo, description, and pickup details.</p>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-green-200 rounded-full -left-3 ring-8 ring-white">2</span>
            <h3 className="text-lg font-semibold text-gray-900">Claim an Item</h3>
            <p className="text-base font-normal text-gray-500">Browse available items near you and send a claim request to the poster, explaining your need.</p>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-green-200 rounded-full -left-3 ring-8 ring-white">3</span>
            <h3 className="text-lg font-semibold text-gray-900">Connect & Coordinate</h3>
            <p className="text-base font-normal text-gray-500">Once your request is accepted, use our secure chat to arrange a pickup or delivery time that works for both of you.</p>
          </li>
           <li className="ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-green-200 rounded-full -left-3 ring-8 ring-white">4</span>
            <h3 className="text-lg font-semibold text-gray-900">Share Your Story</h3>
            <p className="text-base font-normal text-gray-500">Post in our community feed about your experience to inspire others and build trust within the NourishNet community.</p>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default AboutPage;
