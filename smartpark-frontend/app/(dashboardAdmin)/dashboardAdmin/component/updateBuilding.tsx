'use client';

import { useState, useEffect } from 'react';
import { Building, UpdateBuilding } from '@/types/building';
import dashboardStyles from '../style/dashboard.module.css';

// insiate state
interface UpdateBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (buildingId: string, buildingData: UpdateBuilding) => Promise<void>;
  building: Building | null;
}

export default function UpdateBuildingModal({ 
  isOpen, 
  onClose, 
  onUpdate, 
  building 
}: UpdateBuildingModalProps) {
  // form input state
  const [formData, setFormData] = useState<UpdateBuilding>({
    name: '',
    address: '',
  });

  // loading and error state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // show building data on update field
  useEffect(() => {
    if (building) {
      setFormData({
        name: building.name,
        address: building.address,
      });
    }
  }, [building]);

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!building) return;

    setIsLoading(true);
    setError('');

    // update processing to service
    try {
      await onUpdate(building.id, formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update building');
    } finally {
      setIsLoading(false);
    }
  };

  // when close all data will null
  const handleClose = () => {
    setFormData({ name: '', address: '' });
    setError('');
    onClose();
  };

  // make sure if page not open when not using
  if (!isOpen || !building) return null;

  return (
    <div className={dashboardStyles.modalOverlay}>
      <div className={dashboardStyles.modal}>
        {/* Form header */}
        <div className={dashboardStyles.modalHeader}>
          <h2 className={dashboardStyles.modalTitle}>Update Building</h2>
          <button className={dashboardStyles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>

        {/* showing error */}
        {error && <div className={dashboardStyles.error}>{error}</div>}

        {/* Form main conten */}
        <form onSubmit={handleSubmit}>

          {/* Building Name Input */}
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

          {/* Address Input */}
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
              {isLoading ? 'Updating...' : 'Update Building'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}