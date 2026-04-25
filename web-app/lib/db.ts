export const saveToGallery = async (base64Data: string) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("VideoGallery", 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("videos")) {
        db.createObjectStore("videos", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("videos", "readwrite");
      const store = tx.objectStore("videos");

      const videoEntry = {
        data: base64Data,
        timestamp: new Date().toISOString(),
        name: `Recording_${new Date().getTime()}`
      };

      const addRequest = store.add(videoEntry);
      addRequest.onsuccess = () => resolve(true);
      addRequest.onerror = () => reject(addRequest.error);
    };
  });
};

export const getAllVideos = async (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("VideoGallery", 1);

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("videos", "readonly");
      const store = tx.objectStore("videos");
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
};