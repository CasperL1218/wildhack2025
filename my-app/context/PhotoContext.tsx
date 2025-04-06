import React, { createContext, useState, useContext, ReactNode } from 'react';

type PhotoItem = {
  uri: string;
  dishName?: string;
};

type PhotoContextType = {
  photos: PhotoItem[];
  setPhotos: (photos: PhotoItem[]) => void;
};

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export function PhotoProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  return (
    <PhotoContext.Provider value={{ photos, setPhotos }}>
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhotoContext() {
  const context = useContext(PhotoContext);
  if (context === undefined) {
    throw new Error('usePhotoContext must be used within a PhotoProvider');
  }
  return context;
} 