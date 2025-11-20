'use client';

import { Slot } from '@/types/building';
import styles from '../style/slots.module.css';

interface SlotCardProps {
  slot: Slot;
  onStatusChange: (slotId: string, newStatus: 'AVAILABLE' | 'OCCUPIED') => void;
  isUpdating?: boolean;
}

export default function SlotCard({ slot, onStatusChange, isUpdating = false }: SlotCardProps) {
  const handleClick = () => {
    if (!isUpdating) {
      const newStatus = slot.status === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE';
      onStatusChange(slot.id, newStatus);
    }
  };

  const getSlotClass = () => {
    let className = styles.slotCard;
    
    if (isUpdating) {
      className += ` ${styles.slotUpdating}`;
    } else if (slot.status === 'AVAILABLE') {
      className += ` ${styles.slotAvailable}`;
    } else {
      className += ` ${styles.slotOccupied}`;
    }
    
    return className;
  };

  return (
    <div
      className={getSlotClass()}
      onClick={handleClick}
      title={`Click to change status to ${slot.status === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE'}`}
    >
      <div className={styles.slotContent}>
        <div className={styles.slotNumber}>{slot.slot_number}</div>
        <div className={styles.slotStatus}>
          {isUpdating ? 'Updating...' : slot.status}
        </div>
      </div>
      
      {isUpdating && (
        <div className={styles.updatingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}
    </div>
  );
}