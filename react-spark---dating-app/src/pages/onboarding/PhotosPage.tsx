
import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { AppRoute } from '../../types';

interface PhotosPageProps {
  navigate: (path: AppRoute) => void;
}

const PhotosPage: React.FC<PhotosPageProps> = ({ navigate }) => {
    const { user, updateUser } = useAuth();
    const [photos, setPhotos] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const filesArray = Array.from(files);
        const remainingSlots = 6 - photos.length;

        filesArray.slice(0, remainingSlots).forEach(file => {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                if (loadEvent.target?.result) {
                    setPhotos(prevPhotos => [...prevPhotos, loadEvent.target.result as string]);
                }
            };
            reader.readAsDataURL(file);
        });
    };
    
    const handleDeletePhoto = (indexToDelete: number) => {
        setPhotos(photos.filter((_, index) => index !== indexToDelete));
    };

    const handleFinish = async () => {
        if (photos.length < 1) return;
        setLoading(true);
        await updateUser({ 
            photos: photos,
            onboardingCompleted: true,
            onboardingStep: 'completed'
        });
        setLoading(false);
        // The router in App.tsx will now redirect to /app
    };
    
    const canContinue = photos.length >= 1;

    return (
        <div className="flex flex-col h-full p-6 bg-slate-50 text-slate-800">
            <div className="flex-grow flex flex-col justify-center">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Add your best photos</h1>
                <p className="text-slate-500 mb-8">Upload at least one photo to continue. This is how you'll be seen on Spark.</p>

                <div className="grid grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => {
                        const photo = photos[index];
                        return (
                            <div key={index} className="relative aspect-square rounded-xl bg-slate-200/50 flex items-center justify-center border-2 border-dashed border-slate-300">
                                {photo ? (
                                    <>
                                        <img src={photo} className="w-full h-full object-cover rounded-lg" />
                                        <button onClick={() => handleDeletePhoto(index)} className="absolute -top-2 -right-2 bg-slate-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                                            &times;
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => fileInputRef.current?.click()} className="text-slate-400 text-4xl font-light hover:text-rose-500 transition-colors">+</button>
                                )}
                            </div>
                        )
                    })}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple accept="image/*" className="hidden" />
            </div>

            <div className="flex-shrink-0 pt-4">
                <button
                    onClick={handleFinish}
                    disabled={!canContinue || loading}
                    className="w-full p-4 text-lg font-semibold text-white bg-gradient-to-r from-[#F06292] to-rose-500 rounded-full disabled:opacity-50"
                >
                    {loading ? 'Finishing Profile...' : 'Finish'}
                </button>
            </div>
        </div>
    );
};

export default PhotosPage;