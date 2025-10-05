import React, { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (docs: { license: File; insurance: File }) => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [license, setLicense] = useState<File | null>(null);
  const [insurance, setInsurance] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!license || !insurance) {
      setError('Please upload both documents to proceed.');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call for upload
    setTimeout(() => {
        onSubmit({ license, insurance });
        setIsSubmitting(false);
        onClose();
        // Reset state
        setLicense(null);
        setInsurance(null);
    }, 1500);
  };

  const FileInput: React.FC<{label: string, file: File | null, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, id: string}> = ({label, file, onChange, id}) => (
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
                <i className={`mx-auto h-12 w-12 ${file ? 'text-green-500 fas fa-check-circle' : 'text-gray-400 fas fa-file-upload'}`}></i>
                <div className="flex text-sm text-gray-600">
                    <label htmlFor={id} className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                        <span>{file ? file.name : 'Select a file'}</span>
                        <input id={id} name={id} type="file" className="sr-only" onChange={onChange} />
                    </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
            </div>
        </div>
      </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Verification Documents">
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-sm text-gray-600">
            To ensure the safety and trust of our community, please upload a clear image of your driver's license and proof of vehicle insurance.
        </p>
        
        <FileInput 
            label="Driver's License"
            id="license-upload"
            file={license}
            onChange={(e) => handleFileChange(e, setLicense)}
        />
        <FileInput 
            label="Proof of Insurance"
            id="insurance-upload"
            file={insurance}
            onChange={(e) => handleFileChange(e, setInsurance)}
        />
        
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <div className="pt-5 border-t">
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Submit for Review
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default VerificationModal;