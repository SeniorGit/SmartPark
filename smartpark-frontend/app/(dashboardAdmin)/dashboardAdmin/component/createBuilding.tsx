'use client';

import { useState } from 'react';
import { CreateBuilding } from '@/types/building';
import dashboardStyles from '../style/dashboard.module.css';

// insiate data
interface CreateBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (buildingData: CreateBuilding) => Promise<void>;
}

export default function CreateBuildingModal({ isOpen, onClose, onCreate }: CreateBuildingModalProps) {
  // input state
  const [formData, setFormData] = useState<CreateBuilding>({
    name: '',
    address: '',
  });

  // loading state and error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // update processing on service
    try {
      await onCreate(formData);
      setFormData({ name: '', address: '' });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create building');
    } finally {
      setIsLoading(false);
    }
  };

  // handle form close
  const handleClose = () => {
    setFormData({ name: '', address: ''});
    setError('');
    onClose();
  };

  // make sure the page not load if not open
  if (!isOpen) return null;

  return (
    <div className={dashboardStyles.modalOverlay}>
      <div className={dashboardStyles.modal}>
        {/* header */}
        <div className={dashboardStyles.modalHeader}>
          <h2 className={dashboardStyles.modalTitle}>Add New Building</h2>
          <button className={dashboardStyles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>

        {/* error display */}
        {error && <div className={dashboardStyles.error}>{error}</div>}

        {/* main contain form */}
        <form onSubmit={handleSubmit}>
          {/* Input Builing name */}
          <div className={dashboardStyles.formGroup}>
            <label className={dashboardStyles.formLabel}>Building Name</label>
            <input
              type="text"
              className={dashboardStyles.formInput}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Mall A - Floor 1"
              required
              maxLength={100}
            />
          </div>

          {/* input Adrress */}
          <div className={dashboardStyles.formGroup}>
            <label className={dashboardStyles.formLabel}>Address</label>
            <textarea
              className={dashboardStyles.formTextarea}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter building address"
              required
              maxLength={200}
            />
          </div>

          {/* Button */}
          <div className={dashboardStyles.modalActions}>
            {/* cancel button */}
            <button
              type="button"
              className={`${dashboardStyles.button} ${dashboardStyles.cancelButton}`}
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            {/* submit button */}
            <button
              type="submit"
              className={`${dashboardStyles.button} ${dashboardStyles.primary}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Building'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}