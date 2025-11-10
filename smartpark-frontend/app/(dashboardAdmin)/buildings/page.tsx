'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Building, Floor } from '@/types/building';
import { buildingService } from '@/lib/services/floorService';
import CreateFloorModal from './component/createFloor';
import FloorCard from './component/floorCard';
import styles from './style/building.module.css';

export default function BuildingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const buildingId = params.id as string;

  const [building, setBuilding] = useState<Building | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadFloors();
  }, [buildingId]);

  const loadFloors = async () => {
    try {
      setLoading(true);
      const response = await buildingService.getFloorsByBuilding(buildingId);
      setBuilding(response.data.building);
      setFloors(response.data.floors);
    } catch (err) {
      setError('Failed to load building details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFloor = async (data: CreateFloorRequest) => {
    try {
      await buildingService.createFloor(buildingId, data);
      await loadFloors(); // Reload data setelah create
    } catch (err) {
      setError('Failed to create floor');
      console.error(err);
    }
  };

  const handleDeleteFloor = async (floorNumber: number) => {
    try {
      await buildingService.deleteFloor(buildingId, floorNumber);
      await loadFloors(); // Reload data setelah delete
    } catch (err) {
      setError('Failed to delete floor');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Loading building details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorText}>{error}</div>
        <button 
          onClick={() => loadFloors()}
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
          onClick={() => router.push('/admin/dashboard')}
          className={styles.backButton}
        >
          ← Back to Dashboard
        </button>
        
        <div className={styles.headerInfo}>
          <h1 className={styles.buildingTitle}>{building?.name}</h1>
          <p className={styles.buildingAddress}>{building?.address}</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className={styles.createFloorButton}
        >
          + Create Floor
        </button>
      </div>

      {/* Floors Section */}
      <div className={styles.content}>
        {floors.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏢</div>
            <h3 className={styles.emptyTitle}>No Floors Created</h3>
            <p className={styles.emptyDescription}>
              This building doesn t have any floors yet. Create the first floor to get started.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className={styles.createFirstButton}
            >
              Create First Floor
            </button>
          </div>
        ) : (
          <>
            <div className={styles.floorsHeader}>
              <h2 className={styles.floorsTitle}>Building Floors</h2>
              <span className={styles.floorsCount}>{floors.length} floor(s)</span>
            </div>
            
            <div className={styles.floorsGrid}>
              {floors.map((floor) => (
                <FloorCard
                  key={floor.floor}
                  floor={floor}
                  buildingId={buildingId}
                  onDelete={handleDeleteFloor}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create Floor Modal */}
      <CreateFloorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateFloor}
        buildingId={buildingId}
      />
    </div>
  );
}