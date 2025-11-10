// /app/admin/dashboard/components/CreateBuildingModal.tsx
'use client';

import { useState } from 'react';
import { CreateBuildingData } from '@/types/adminDash';
import dashboardStyles from '../style/dashboard.module.css';

interface CreateBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (buildingData: CreateBuildingData) => Promise<void>;
}

export default function CreateBuildingModal({ isOpen, onClose, onCreate }: CreateBuildingModalProps) {
  const [formData, setFormData] = useState<CreateBuildingData>({
    name: '',
    address: '',
    total_floors: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await onCreate(formData);
      setFormData({ name: '', address: '', total_floors: 1 });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create building');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', address: '', total_floors: 1 });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={dashboardStyles.modalOverlay}>
      <div className={dashboardStyles.modal}>
        <div className={dashboardStyles.modalHeader}>
          <h2 className={dashboardStyles.modalTitle}>Add New Building</h2>
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

          <div className={dashboardStyles.formGroup}>
            <label className={dashboardStyles.formLabel}>Total Floors</label>
            <input
              type="number"
              className={dashboardStyles.formInput}
              value={formData.total_floors}
              onChange={(e) => setFormData({ ...formData, total_floors: parseInt(e.target.value) || 1 })}
              min="1"
              max="20"
              required
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
              {isLoading ? 'Creating...' : 'Create Building'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}