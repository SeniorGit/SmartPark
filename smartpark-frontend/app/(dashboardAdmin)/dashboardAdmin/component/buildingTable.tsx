'use client';

import { Building} from '@/types/building';
import { useRouter } from 'next/navigation';
import dashboardStyles from '../style/dashboard.module.css';

// inisiate state
interface BuildingsTableProps {
  buildings: Building[];
  onEdit: (building: Building) => void;
  onDelete: (buildingId: string) => void;
  isLoading?: boolean;
}

export default function BuildingsTable({ 
  buildings, 
  onEdit, 
  onDelete, 
  isLoading 
}: BuildingsTableProps) {
  // send user to detail buildings
  const router = useRouter();
  const handleDetailClick = (buildingId: string) => {
    router.push(`/buildings/${buildingId}`);
  };

  // loading state
  if (isLoading) {
    return <div className={dashboardStyles.loading}>Loading buildings...</div>;
  }

  // check if any data
  if (buildings.length === 0) {
    return <div className={dashboardStyles.loading}>No buildings found. Create your first building!</div>;
  }

  return (
    // creating admin table with all data 
    <div className={dashboardStyles.tableContainer}>
      <table className={dashboardStyles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Building Name</th>
            <th>Address</th>
            {/* <th>Total Floors</th>
            <th>Available Slots</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {buildings.map((building) => (
            <tr key={building.id}>
              <td>{building.id}</td>
              <td>
                <strong>{building.name}</strong>
              </td>
              <td>{building.address}</td>
              {/* <td>{building.total_floors}</td> */}
              {/* <td>
                <span style={{ 
                  color: building.available_slots > 0 ? '#38a169' : '#e53e3e',
                  fontWeight: '600'
                }}>
                  {building.available_slots}
                </span>
              </td> */}
              <td>
                <div className={dashboardStyles.actionButtons}>
                  <button
                    className={`${dashboardStyles.smallButton} ${dashboardStyles.editButton}`}
                    onClick={() => onEdit(building)}
                  >
                    Edit
                  </button>
                  <button
                    className={`${dashboardStyles.smallButton} ${dashboardStyles.detailButton}`}
                    onClick={() => handleDetailClick(building.id)}
                  >
                    Details
                  </button>
                  <button
                    className={`${dashboardStyles.smallButton} ${dashboardStyles.deleteButton}`}
                    onClick={() => onDelete(building.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}