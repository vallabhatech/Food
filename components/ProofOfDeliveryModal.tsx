import React, { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { Claim } from '../types';
import { useNotification } from '../contexts/NotificationContext';

interface ProofOfDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: Claim | null;
  onSubmit: (claimId: string) => void;
}

const ProofOfDeliveryModal: React.FC<ProofOfDeliveryModalProps> = ({ isOpen, onClose, claim, onSubmit }) => {
  const [signature, setSignature] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotification();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claim) return;
    
    // In a real app, you would handle signature data and file uploads here.
    // For this demo, we'll just check if the fields are touched.
    if (!signature) {
        alert("Please obtain a signature.");
        return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
        onSubmit(claim.id);
        addNotification('Proof of delivery submitted successfully!', 'success');
        setIsSubmitting(false);
        onClose();
        // Reset state
        setSignature('');
        setPhoto(null);
    }, 1000);
  };

  if (!claim) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Proof of Delivery">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Recipient Signature</label>
          <div className="mt-1 p-4 border border-gray-300 rounded-md bg-gray-50 h-32 flex items-center justify-center">
             {/* This is a placeholder for a signature pad component */}
             <input 
                type="text" 
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Recipient signs here..."
                className="w-full h-full border-0 bg-transparent text-center text-lg italic"
             />
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Upload Photo (Optional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <i className="fas fa-camera text-4xl text-gray-400 mx-auto"></i>
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                            <span>{photo ? photo.name : 'Upload a file'}</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
        </div>

        <div className="mt-8 pt-5 border-t">
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Confirm Delivery
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProofOfDeliveryModal;