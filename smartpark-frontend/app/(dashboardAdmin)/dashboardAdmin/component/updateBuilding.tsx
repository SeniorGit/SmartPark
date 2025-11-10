// /app/admin/dashboard/components/UpdateBuildingModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Building, UpdateBuildingData } from '@/types/adminDash';
import dashboardStyles from '../style/dashboard.module.css';

interface UpdateBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (buildingId: string, buildingData: UpdateBuildingData) => Promise<void>;
  building: Building | null;
}

export default function UpdateBuildingModal({ 
  isOpen, 
  onClose, 
  onUpdate, 
  building 
}: UpdateBuildingModalProps) {
  const [formData, setFormData] = useState<UpdateBuildingData>({
    name: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (building) {
      setFormData({
        name: building.name,
        address: building.address,
      });
    }
  }, [building]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!building) return;

    setIsLoading(true);
    setError('');

    try {
      await onUpdate(building.id, formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update building');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', address: '' });
    setError('');
    onClose();
  };

  if (!isOpen || !building) return null;

  return (
    <div className={dashboardStyles.modalOverlay}>
      <div className={dashboardStyles.modal}>
        <div className={dashboardStyles.modalHeader}>
          <h2 className={dashboardStyles.modalTitle}>Update Building</h2>
          <button className={dashboardStyles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>

        {error && <div className={dashboardStyles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
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

          <div className={dashboardStyles.modalActions}>
            <button
              type="button"
              className={`${dashboardStyles.button} ${dashboardStyles.cancelButton}`}
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
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