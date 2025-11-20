import { useState } from 'react';
import { CreateFloor } from '@/types/floorNslot';
import styles from '../style/building.module.css';

interface CreateFloorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFloor) => void;
  buildingId: string;
}

// create floor form
export default function CreateFloorModal({ isOpen, onClose, onSubmit }: CreateFloorModalProps) {
  const [formData, setFormData] = useState<CreateFloor>({
    floor: 1,
    total_slots: 10,
    
  });

  // handle sumbit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({
      floor: 1,
      total_slots: 10,
    });
  };

  // make sure not working when not open 
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {/* header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Create New Floor</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        {/* main content */}
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {/* floor number input */}
          <div className={styles.formGroup}>
            <label htmlFor="floorNumber" className={styles.formLabel}>
              Floor Number
            </label>
            <input
              id="floorNumber"
              type="number"
              min="1"
              max="100"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
              className={styles.formInput}
              required
            />
          </div>

          {/* total slots input */}
          <div className={styles.formGroup}>
            <label htmlFor="slotsCount" className={styles.formLabel}>
              Total Parking Slots
            </label>
            <input
              id="slotsCount"
              type="number"
              min="1"
              max="100"
              value={formData.total_slots}
              onChange={(e) => setFormData({ ...formData, total_slots: parseInt(e.target.value) })}
              className={styles.formInput}
              required
            />
            <small className={styles.helperText}>
              Number of parking slots to create on this floor
            </small>
          </div>

          {/* button submit and cancel */}
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