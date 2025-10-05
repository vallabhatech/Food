
import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { useNotification } from '../../contexts/NotificationContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reportDetails: { reason: string; comments: string }) => void;
  itemType: string; // e.g., 'Post' or 'Food Item'
}

const reportReasons = [
  "Inappropriate Content",
  "Spam or Misleading",
  "Safety Concern",
  "Item not as described",
  "Other"
];

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit, itemType }) => {
  const [reason, setReason] = useState(reportReasons[0]);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotification();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
        alert("Please select a reason.");
        return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onSubmit({ reason, comments });
      setIsSubmitting(false);
      addNotification(`Your report has been submitted. Our team will review it shortly.`, 'success');
      onClose();
      // Reset state for next use
      setComments('');
      setReason(reportReasons[0]);
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Report ${itemType}`}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Reason for reporting
            </label>
            <select
              id="reason"
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            >
              {reportReasons.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
              Additional Comments (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-2">Please provide any extra details that could help our moderators.</p>
            <textarea
              id="comments"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={`e.g., "The image is misleading", "This user is sending spam messages"`}
            />
          </div>
        </div>

        <div className="mt-8 pt-5 border-t">
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" isLoading={isSubmitting}>
              Submit Report
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ReportModal;
