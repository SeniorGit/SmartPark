'use client';

import { Slot } from '@/types/floorNslot';
import SlotCard from './slotCard';
import styles from '../style/slots.module.css';

interface SlotGridProps {
  slots: Slot[];
  onStatusChange: (slotId: string, newStatus: 'AVAILABLE' | 'OCCUPIED') => void;
  updatingSlot: string | null;
}

// creating auto grid as much the data 
export default function SlotGrid({ slots, onStatusChange, updatingSlot }: SlotGridProps) {
  const groupSlots = (slots: Slot[], groupSize: number = 6) => {
    const groups = [];
    for (let i = 0; i < slots.length; i += groupSize) {
      groups.push(slots.slice(i, i + groupSize));
    }
    return groups;
  };

  const slotGroups = groupSlots(slots);

  return (
    <div className={styles.slotGridContainer}>
      {slotGroups.map((group, groupIndex) => (
        <div key={groupIndex} className={styles.slotRow}>
          {group.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              onStatusChange={onStatusChange}
              isUpdating={updatingSlot === slot.id}
            />
          ))}
        </div>
      ))}
      
      {slots.length === 0 && (
        <div className={styles.noSlots}>
          <div className={styles.noSlotsIcon}>🚗</div>
          <h3>No Slots Available</h3>
          <p>This floor doesn t have any parking slots configured.</p>
        </div>
      )}
    </div>
  );
}