'use client';

import { Floor } from '@/types/floorNslot';
import { useRouter } from 'next/navigation';
import styles from '../style/building.module.css';

// floor state
interface FloorCardProps {
  floor: Floor;
  buildingId: string;
  onDelete: (floorNumber: number) => void;
}

// card floor component
export default function FloorCard({ floor, buildingId, onDelete }: FloorCardProps) {
  // routing to send user to detail floors
  const router = useRouter();
  const handleManage = () => {
    router.push(`/buildings/${buildingId}/floors/${floor.floor}`);
  };

  // handle delete confirmation
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete floor ${floor.floor_prefix}? This action cannot be undone.`)) {
      onDelete(floor.floor);
    }
  };

  // available badge colors
  const getAvailabilityClass = () => {
    if (floor.total_avai_slots === 0) return styles.full;
    if (floor.total_avai_slots === floor.total_slots) return styles.empty;
    return styles.partial;
  };

  return (
    <div className={styles.floorCard}>
      {/* header */}
      <div className={styles.floorCardHeader}>
        <h3 className={styles.floorNumber}>Floor {floor.floor_prefix}</h3>
        <span className={`${styles.availabilityBadge} ${getAvailabilityClass()}`}>
          {floor.total_avai_slots}
        </span>
      </div>

      <div className={styles.floorStats}>
        {/* show total slot */}
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Slots:</span>
          <span className={styles.statValue}>{floor.total_slots}</span>
        </div>

        {/* show total available */}
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Available:</span>
          <span className={styles.statValue}>{floor.total_avai_slots}</span>
        </div>

        {/* Show total Occupide */}
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Occupied:</span>
          <span className={styles.statValue}>{floor.total_occu_slots}</span>
        </div> 
      </div>

      {/* button container for manage and delete */}
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