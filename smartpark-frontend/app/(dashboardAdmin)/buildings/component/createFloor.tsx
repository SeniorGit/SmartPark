'use client';

import { useState } from 'react';
import { CreateFloorRequest } from '@/types/building';
import styles from '../style/building.module.css';

interface CreateFloorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFloorRequest) => void;
  buildingId: string;
}

export default function CreateFloorModal({ isOpen, onClose, onSubmit, buildingId }: CreateFloorModalProps) {
  const [formData, setFormData] = useState<CreateFloorRequest>({
    floor_number: 1,
    slots_count: 10,
    prefix: `B${buildingId.slice(0, 4).toUpperCase()}`,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      floor_number: 1,
      slots_count: 10,
      prefix: `B${buildingId.slice(0, 4).toUpperCase()}`,
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Create New Floor</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="floorNumber" className={styles.formLabel}>
              Floor Number
            </label>
            <input
              id="floorNumber"
              type="number"
              min="1"
              max="100"
              value={formData.floor_number}
              onChange={(e) => setFormData({ ...formData, floor_number: parseInt(e.target.value) })}
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="slotsCount" className={styles.formLabel}>
              Total Parking Slots
            </label>
            <input
              id="slotsCount"
              type="number"
              min="1"
              max="100"
              value={formData.slots_count}
              onChange={(e) => setFormData({ ...formData, slots_count: parseInt(e.target.value) })}
              className={styles.formInput}
              required
            />
            <small className={styles.helperText}>
              Number of parking slots to create on this floor
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="slotPrefix" className={styles.formLabel}>
              Slot Number Prefix (Optional)
            </label>
            <input
              id="slotPrefix"
              type="text"
              value={formData.prefix}
              onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
              className={styles.formInput}
              placeholder="e.g., A1, B2, etc."
              maxLength={10}
            />
            <small className={styles.helperText}>
              Prefix for slot numbers (e.g., A1-001, A1-002, ...)
            </small>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
            >
              Create Floor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}