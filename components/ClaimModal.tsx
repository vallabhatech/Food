import React, { useState } from 'react';
import { FoodItem, DeliveryOption } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  foodItem: FoodItem | null;
  onSubmit: (reason: string, deliveryOption: DeliveryOption) => void;
}

const ClaimModal: React.FC<ClaimModalProps> = ({ isOpen, onClose, foodItem, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>(DeliveryOption.ClaimerPickup);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !deliveryOption) {
        alert("Please fill out all fields.");
        return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
        onSubmit(reason, deliveryOption);
        setIsSubmitting(false);
        onClose();
        setReason('');
    }, 1000);
  };

  if (!foodItem) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Claim: ${foodItem.title}`}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Reason for Claiming
            </label>
            <p className="text-xs text-gray-500 mb-2">Please explain briefly why you need this item. This helps donors understand the impact of their contribution.</p>
            <textarea
              id="reason"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700">Delivery Option</h4>
            <fieldset className="mt-2">
              <legend className="sr-only">Delivery options</legend>
              <div className="space-y-2">
                {Object.values(DeliveryOption).map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      id={option}
                      name="delivery-option"
                      type="radio"
                      checked={deliveryOption === option}
                      // FIX: Cast option to DeliveryOption as Object.values(enum) returns string[]
                      onChange={() => setDeliveryOption(option as DeliveryOption)}
                      className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <label htmlFor={option} className="ml-3 block text-sm text-gray-700">
                      {option}
                      {option === DeliveryOption.PlatformDelivery && <span className="font-semibold text-green-700"> ($5 fee)</span>}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t">
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Send Claim Request
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ClaimModal;