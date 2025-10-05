import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { generateFoodDescription } from '../services/geminiService';

const PostFoodPage: React.FC = () => {
  const { addFoodItem } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDescription = async () => {
    if (!title) {
        alert("Please enter a title first to generate a description.");
        return;
    }
    setIsGenerating(true);
    const generatedDesc = await generateFoodDescription(title);
    setDescription(generatedDesc);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsSubmitting(true);

    const newItem = {
        postedBy: currentUser.id,
        title,
        description,
        quantity,
        expiresAt: new Date(expiresAt),
        imageUrl: imageUrl || `https://picsum.photos/seed/${title}/400/300`,
        location: {
            lat: currentUser.location.lat, // Use poster's location
            lng: currentUser.location.lng,
            address,
        }
    };

    addFoodItem(newItem);
    
    setTimeout(() => {
        setIsSubmitting(false);
        alert("Food item posted successfully!");
        navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Post a New Food Item</h1>
      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
          </div>

          <div>
            <div className="flex justify-between items-center">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <Button type="button" variant="secondary" onClick={handleGenerateDescription} isLoading={isGenerating} className="text-xs px-2 py-1">
                    <i className="fas fa-magic mr-1"></i> AI Generate
                </Button>
            </div>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity (e.g., 1 loaf, 2 lbs)</label>
              <input type="text" id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700">Expires At</label>
              <input type="date" id="expiresAt" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
            </div>
          </div>
          
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
            <input type="text" id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Defaults to a random image" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Pickup Address</label>
            <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
          </div>

          <div className="pt-5 border-t">
            <div className="flex justify-end">
              <Button type="submit" isLoading={isSubmitting}>Post Item</Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PostFoodPage;
