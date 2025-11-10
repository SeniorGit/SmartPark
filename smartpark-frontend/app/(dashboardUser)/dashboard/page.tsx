'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building, User } from '@/types/userDash';
import { UserService } from '@/lib/services/userService';
import styles from './style/dashbord.module.css';

export default function UserDashboard() {
  const router = useRouter();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);

  // Load user data and buildings
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      setIsLoading(true);
      const buildingsData = await UserService.getAllBuildings();
      setBuildings(buildingsData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load parking buildings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const getAvailabilityClass = (availableSlots: number) => {
    if (availableSlots === 0) return styles.full;
    if (availableSlots < 5) return styles.low;
    return styles.available;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.welcomeSection}>
            <h1 className={styles.welcomeTitle}>
              Welcome, {user?.firstName} {user?.lastName}!
            </h1>
            <p className={styles.welcomeSubtitle}>
              Find available parking spaces near you
            </p>
          </div>
          
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user?.firstName} {user?.lastName}</p>
              <p className={styles.userRole}>{user?.role}</p>
            </div>
            <button 
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Error Message */}
        {error && (
          <div className={styles.errorContainer}>
            <div className={styles.errorText}>{error}</div>
            <button 
              onClick={fetchBuildings}
              className={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Page Title */}
        <div className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>Available Parking Buildings</h2>
          <p className={styles.pageSubtitle}>
            {buildings.length} building(s) available
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>Loading parking buildings...</p>
          </div>
        ) : (
          /* Buildings Grid */
          <div className={styles.buildingsGrid}>
            {buildings.map((building) => (
              <div key={building.id} className={styles.buildingCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.buildingName}>{building.name}</h3>
                  <span className={`${styles.availabilityBadge} ${getAvailabilityClass(building.available_slots)}`}>
                    {building.availability}
                  </span>
                </div>
                
                <div className={styles.cardBody}>
                  <p className={styles.buildingAddress}>{building.address}</p>
                  
                  <div className={styles.parkingInfo}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Total Slots:</span>
                      <span className={styles.infoValue}>{building.total_slots}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Available:</span>
                      <span className={styles.infoValue}>{building.available_slots}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Occupied:</span>
                      <span className={styles.infoValue}>
                        {building.total_slots - building.available_slots}
                      </span>
                    </div>
                  </div>

                  <div className={styles.availabilityBar}>
                    <div 
                      className={styles.availabilityFill}
                      style={{
                        width: `${(building.available_slots / building.total_slots) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && buildings.length === 0 && !error && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏢</div>
            <h3 className={styles.emptyTitle}>No Parking Buildings Available</h3>
            <p className={styles.emptyDescription}>
              There are currently no parking buildings registered in the system.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}