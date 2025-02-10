import { useQuery } from 'react-query';
import { driveService } from '../services/driveService';

export const useDriveData = (isAuthenticated) => {
    return useQuery(
        'driveData',
        () => driveService.listFiles(),
        {
            enabled: isAuthenticated,
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 30 * 60 * 1000, // 30 minutes
        }
    );
};
