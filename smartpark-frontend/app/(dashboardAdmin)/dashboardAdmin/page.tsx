'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building, CreateBuilding, UpdateBuilding } from '@/types/building';
import { BuildingService } from '@/lib/services/buildingService';
import BuildingsTable from './component/buildingTable';
import CreateBuildingModal from './component/createBuilding';
import UpdateBuildingModal from './component/updateBuilding';
import dashboardStyles from './style/dashboard.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState<any>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

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

  // get building data
  const fetchBuildings = async () => {
    // try to access building data
    try {
      setIsLoading(true);
      const buildingsData = await BuildingService.getAllBuildings();
      setBuildings(buildingsData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load buildings');
    } finally {
      setIsLoading(false);
    }
  };

  // handle to create building data
  const handleCreateBuilding = async (buildingData: CreateBuilding) => {
    try {
      // try to create new building
      const newBuilding = await BuildingService.createBuilding(buildingData);
      // add new builing on the last array
      setBuildings(prev => [...prev, newBuilding]);
      setSuccess('Building created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      throw err;
    }
  };

  // handle to update building data
  const handleUpdateBuilding = async (buildingId: string, buildingData: UpdateBuilding) => {
    try {
      // try update building
      const updatedBuilding = await BuildingService.updateBuilding(buildingId, buildingData);
      // replace builing on the prev location
      setBuildings(prev => 
        prev.map(building => 
          building.id === buildingId ? { ...building, ...updatedBuilding } : building
        )
      );
      setSuccess('Building updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      throw err;
    }
  };

  // delete handler
  const handleDeleteBuilding = async (buildingId: string) => {
    // confirmation before delete
    if (!confirm('Are you sure you want to delete this building? This action cannot be undone.')) {
      return;
    }

    // try to delete builing 
    try {
      await BuildingService.deleteBuilding(buildingId);
      // remove by id, if there any same id it will remove from buildings
      setBuildings(prev => prev.filter(building => building.id !== buildingId));
      setSuccess('Building deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete building');
    }
  };

  // Open edit modal and fill with prev data
  const handleEditBuilding = (building: Building) => {
    setSelectedBuilding(building);
    setIsUpdateModalOpen(true);
  };

  // logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className={dashboardStyles.container}>
      {/* Header */}
      <header className={dashboardStyles.header}>
        <div className={dashboardStyles.headerContent}>
          <h1 className={dashboardStyles.title}>SmartParking Admin</h1>
          <div className={dashboardStyles.userSection}>
            <button 
              className={`${dashboardStyles.button} ${dashboardStyles.secondary}`}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={dashboardStyles.main}>
        {/* Success/Error Messages */}
        {success && <div className={dashboardStyles.success}>{success}</div>}
        {error && <div className={dashboardStyles.error}>{error}</div>}

        {/* Page Header with Actions */}
        <div className={dashboardStyles.actions}>
          <h2 className={dashboardStyles.pageTitle}>Parking Buildings</h2>
          <div className={dashboardStyles.buttons}>
            {/* add button section */}
            <button
              className={`${dashboardStyles.button} ${dashboardStyles.primary}`}
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Add Building
            </button>
          </div>
        </div>

        {/* Buildings Table */}
        <BuildingsTable
          buildings={buildings}
          onEdit={handleEditBuilding}
          onDelete={handleDeleteBuilding}
          isLoading={isLoading}
        />

        {/* Modals */}
        <CreateBuildingModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateBuilding}
        />

        <UpdateBuildingModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedBuilding(null);
          }}
          onUpdate={handleUpdateBuilding}
          building={selectedBuilding}
        />
      </main>
    </div>
  );
}