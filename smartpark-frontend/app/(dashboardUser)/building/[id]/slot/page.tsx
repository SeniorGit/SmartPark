'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Slot, SlotsResponse } from '@/types/userDash';
import { UserService } from '@/lib/services/userService';
import styles from './style/slots.module.css';

export default function UserSlotsPage() {
  const params = useParams();
  const router = useRouter();
  const buildingId = params.id as string;
  const floorNumber = parseInt(params.floorNumber as string);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [building, setBuilding] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSlots();
  }, [buildingId, floorNumber]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const response: SlotsResponse = await UserService.getFloorSlots(buildingId, floorNumber);
      setBuilding(response.data.building);
      setSummary(response.data.summary);
      setSlots(response.data.slots);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load parking slots');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <div className={styles.loadingText}>Loading parking slots...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <div className={styles.errorText}>{error}</div>
        <div className={styles.errorActions}>
          <button 
            onClick={fetchSlots}
            className={styles.retryButton}
          >
            Try Again
          </button>
          <button 
            onClick={() => router.push(`/user/buildings/${buildingId}`)}
            className={styles.backButton}
          >
            Back to Building
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button
            onClick={() => router.push(`/user/buildings/${buildingId}`)}
            className={styles.backButton}
          >
            ← Back to Building
          </button>
          
          <div className={styles.buildingInfo}>
            <h1 className={styles.buildingName}>{building?.name}</h1>
            <p className={styles.floorInfo}>Floor {floorNumber} • {building?.address}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Summary Section */}
        {summary && (
          <div className={styles.summarySection}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Parking Overview</h2>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>{summary.total_slots}</div>
                  <div className={styles.statLabel}>Total Slots</div>
                </div>
                <div className={`${styles.statItem} ${styles.statAvailable}`}>
                  <div className={styles.statNumber}>{summary.available_slots}</div>
                  <div className={styles.statLabel}>Available</div>
                </div>
                <div className={`${styles.statItem} ${styles.statOccupied}`}>
                  <div className={styles.statNumber}>{summary.occupied_slots}</div>
                  <div className={styles.statLabel}>Occupied</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>{summary.availability}</div>
                  <div className={styles.statLabel}>Availability</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slots Section */}
        <div className={styles.slotsSection}>
          <div className={styles.slotsHeader}>
            <h2 className={styles.slotsTitle}>Parking Slots - Floor {floorNumber}</h2>
            <p className={styles.slotsSubtitle}>
              Green slots are available, red slots are occupied
            </p>
          </div>

          {slots.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🚗</div>
              <h3 className={styles.emptyTitle}>No Parking Slots</h3>
              <p className={styles.emptyDescription}>
                This floor doesn t have any parking slots configured.
              </p>
            </div>
          ) : (
            <div className={styles.slotsGrid}>
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className={`${styles.slotCard} ${
                    slot.status === 'AVAILABLE' ? styles.slotAvailable : styles.slotOccupied
                  }`}
                >
                  <div className={styles.slotContent}>
                    <div className={styles.slotNumber}>{slot.slot_number}</div>
                    <div className={styles.slotStatus}>
                      {slot.status === 'AVAILABLE' ? 'Available' : 'Occupied'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Legend */}
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div className={`${styles.legendColor} ${styles.legendAvailable}`}></div>
              <span>Available Slots</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendColor} ${styles.legendOccupied}`}></div>
              <span>Occupied Slots</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}