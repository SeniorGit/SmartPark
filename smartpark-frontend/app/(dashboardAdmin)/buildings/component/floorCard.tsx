'use client';

import { Floor } from '@/types/building';
import { useRouter } from 'next/navigation';
import styles from '../style/building.module.css';

interface FloorCardProps {
  floor: Floor;
  buildingId: string;
  onDelete: (floorNumber: number) => void;
}

export default function FloorCard({ floor, buildingId, onDelete }: FloorCardProps) {
  const router = useRouter();

  const handleManage = () => {
    router.push(`/admin/buildings/${buildingId}/floors/${floor.floor}/slots`);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete floor ${floor.floor}? This action cannot be undone.`)) {
      onDelete(floor.floor);
    }
  };

  const getAvailabilityClass = () => {
    if (floor.available_slots === 0) return styles.full;
    if (floor.available_slots === floor.total_slots) return styles.empty;
    return styles.partial;
  };

  return (
    <div className={styles.floorCard}>
      <div className={styles.floorCardHeader}>
        <h3 className={styles.floorNumber}>Floor {floor.floor}</h3>
        <span className={`${styles.availabilityBadge} ${getAvailabilityClass()}`}>
          {floor.availability}
        </span>
      </div>

      <div className={styles.floorStats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Slots:</span>
          <span className={styles.statValue}>{floor.total_slots}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Available:</span>
          <span className={styles.statValue}>{floor.available_slots}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Occupied:</span>
          <span className={styles.statValue}>{floor.total_slots - floor.available_slots}</span>
        </div>
      </div>

      <div className={styles.floorActions}>
        <button
          onClick={handleManage}
          className={styles.manageButton}
        >
          Manage Slots
        </button>
        <button
          onClick={handleDelete}
          className={styles.deleteButton}
        >
          Delete
        </button>
      </div>
    </div>
  );
}