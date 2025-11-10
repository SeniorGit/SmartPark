'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BuildingDetails, Floor } from '@/types/userDash';
import { UserService } from '@/lib/services/userService';
import styles from './style/building.module.css';

export default function BuildingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const buildingId = params.id as string;

  const [building, setBuilding] = useState<BuildingDetails | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBuildingDetails();
  }, [buildingId]);

  const fetchBuildingDetails = async () => {
    try {
      setLoading(true);
      const response = await UserService.getBuildingDetails(buildingId);
      setBuilding(response.data.building);
      setFloors(response.data.floors);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load building details');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSlots = (floorNumber: number) => {
    // Navigate to slots page for this floor
    router.push(`/user/buildings/${buildingId}/floors/${floorNumber}/slots`);
  };

  const getAvailabilityClass = (availableSlots: number) => {
    if (availableSlots === 0) return styles.full;
    if (availableSlots < 5) return styles.low;
    return styles.available;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <div className={styles.loadingText}>Loading building details...</div>
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
            onClick={fetchBuildingDetails}
            className={styles.retryButton}
          >
            Try Again
          </button>
          <button 
            onClick={() => router.push('/user/dashboard')}
            className={styles.backButton}
          >
            Back to Dashboard
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
            onClick={() => router.push('/user/dashboard')}
            className={styles.backButton}
          >
            ← Back to Dashboard
          </button>
          
          <div className={styles.buildingInfo}>
            <h1 className={styles.buildingName}>{building?.name}</h1>
            <p className={styles.buildingAddress}>{building?.address}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Summary Section */}
        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Building Overview</h2>
            <div className={styles.summaryStats}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{floors.length}</div>
                <div className={styles.statLabel}>Total Floors</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>
                  {floors.reduce((total, floor) => total + floor.total_slots, 0)}
                </div>
                <div className={styles.statLabel}>Total Slots</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>
                  {floors.reduce((total, floor) => total + floor.available_slots, 0)}
                </div>
                <div className={styles.statLabel}>Available Slots</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floors Section */}
        <div className={styles.floorsSection}>
          <h2 className={styles.sectionTitle}>Parking Floors</h2>
          <p className={styles.sectionSubtitle}>
            Select a floor to view available parking slots
          </p>

          {floors.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🏢</div>
              <h3 className={styles.emptyTitle}>No Floors Available</h3>
              <p className={styles.emptyDescription}>
                This building doesn t have any parking floors configured yet.
              </p>
            </div>
          ) : (
            <div className={styles.floorsGrid}>
              {floors.map((floor) => (
                <div key={floor.floor} className={styles.floorCard}>
                  <div className={styles.floorHeader}>
                    <h3 className={styles.floorTitle}>Floor {floor.floor}</h3>
                    <span className={`${styles.availabilityBadge} ${getAvailabilityClass(floor.available_slots)}`}>
                      {floor.availability}
                    </span>
                  </div>

                  <div className={styles.floorStats}>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Total Slots:</span>
                      <span className={styles.statValue}>{floor.total_slots}</span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Available:</span>
                      <span className={styles.statValue}>{floor.available_slots}</span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Occupied:</span>
                      <span className={styles.statValue}>
                        {floor.total_slots - floor.available_slots}
                      </span>
                    </div>
                  </div>

                  <div className={styles.availabilityBar}>
                    <div 
                      className={styles.availabilityFill}
                      style={{
                        width: `${(floor.available_slots / floor.total_slots) * 100}%`
                      }}
                    ></div>
                  </div>

                  <button
                    onClick={() => handleViewSlots(floor.floor)}
                    className={styles.detailsButton}
                    disabled={floor.total_slots === 0}
                  >
                    {floor.total_slots === 0 ? 'No Slots' : 'View Slots'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}