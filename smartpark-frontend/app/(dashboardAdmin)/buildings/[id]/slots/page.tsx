'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Slot, SlotsResponse } from '@/types/building';
import { slotService } from '@/lib/services/slotService';
import SlotGrid from './component/slotGrid';
import styles from './style/slots.module.css';

export default function SlotsManagementPage() {
  const params = useParams();
  const router = useRouter();
  const buildingId = params.id as string;
  const floorNumber = parseInt(params.floorNumber as string);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [building, setBuilding] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingSlot, setUpdatingSlot] = useState<string | null>(null);

  useEffect(() => {
    loadSlots();
  }, [buildingId, floorNumber]);

  const loadSlots = async () => {
    try {
      setLoading(true);
      const response: SlotsResponse = await slotService.getFloorSlots(buildingId, floorNumber);
      setBuilding(response.data.building);
      setSummary(response.data.summary);
      setSlots(response.data.slots);
    } catch (err) {
      setError('Failed to load slots data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (slotId: string, newStatus: 'AVAILABLE' | 'OCCUPIED') => {
    try {
      setUpdatingSlot(slotId);

      // Optimistic update untuk UX yang lebih responsif
      setSlots(prevSlots =>
        prevSlots.map(slot =>
          slot.id === slotId ? { ...slot, status: newStatus } : slot
        )
      );

      // Update summary secara optimistic
      setSummary(prevSummary => {
        if (!prevSummary) return prevSummary;
        
        const availableChange = newStatus === 'AVAILABLE' ? 1 : -1;
        const occupiedChange = newStatus === 'OCCUPIED' ? 1 : -1;
        
        return {
          ...prevSummary,
          available_slots: prevSummary.available_slots + availableChange,
          occupied_slots: prevSummary.occupied_slots + occupiedChange,
          availability: `${prevSummary.available_slots + availableChange}/${prevSummary.total_slots}`
        };
      });

      // Panggil API untuk update status
      await slotService.updateSlotStatus(slotId, { status: newStatus });
      
    } catch (err) {
      setError('Failed to update slot status');
      console.error(err);
      // Jika error, reload data untuk sync dengan server
      await loadSlots();
    } finally {
      setUpdatingSlot(null);
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
        <button 
          onClick={() => loadSlots()}
          className={styles.retryButton}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <button
          onClick={() => router.push(`/admin/buildings/${buildingId}`)}
          className={styles.backButton}
        >
          ← Back to Building
        </button>
        
        <div className={styles.headerInfo}>
          <h1 className={styles.buildingName}>{building?.name}</h1>
          <p className={styles.floorInfo}>Floor {floorNumber} • {building?.address}</p>
        </div>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className={styles.summarySection}>
          <div className={styles.summaryTitle}>Parking Overview</div>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{summary.total_slots}</div>
              <div className={styles.statLabel}>Total Slots</div>
            </div>
            <div className={`${styles.statCard} ${styles.statAvailable}`}>
              <div className={styles.statNumber}>{summary.available_slots}</div>
              <div className={styles.statLabel}>Available</div>
            </div>
            <div className={`${styles.statCard} ${styles.statOccupied}`}>
              <div className={styles.statNumber}>{summary.occupied_slots}</div>
              <div className={styles.statLabel}>Occupied</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{summary.availability}</div>
              <div className={styles.statLabel}>Availability</div>
            </div>
          </div>
        </div>
      )}

      {/* IoT Simulation Instructions */}
      <div className={styles.instructions}>
        <h3 className={styles.instructionsTitle}>IoT Simulation Controls</h3>
        <p className={styles.instructionsText}>
          Click on any parking slot to toggle its status between <strong>AVAILABLE</strong> and <strong>OCCUPIED</strong>. 
          This simulates real-time data from parking sensors.
        </p>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.legendAvailable}`}></div>
            <span>Available Slots</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.legendOccupied}`}></div>
            <span>Occupied Slots</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.legendUpdating}`}></div>
            <span>Updating...</span>
          </div>
        </div>
      </div>

      {/* Slots Grid */}
      <div className={styles.slotsSection}>
        <h2 className={styles.slotsTitle}>Parking Slots - Floor {floorNumber}</h2>
        <SlotGrid 
          slots={slots} 
          onStatusChange={handleStatusChange}
          updatingSlot={updatingSlot}
        />
      </div>

      {/* Global Updating Indicator */}
      {updatingSlot && (
        <div className={styles.globalUpdating}>
          <div className={styles.updatingSpinner}></div>
          <span>Updating slot status...</span>
        </div>
      )}
    </div>
  );
}