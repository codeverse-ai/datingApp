import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogoutIcon } from '../components/icons/LogoutIcon';
import { BoostIcon } from '../components/icons/BoostIcon';
import { StarIcon } from '../components/icons/StarIcon';
import { PremiumModal } from '../components/PremiumModal';
import type { AppRoute } from '../types';
import { VIBES, ZODIAC_SIGNS } from '../constants';
import { LikedProfilesModal } from '../components/LikedProfilesModal';
import { SuperLikedProfilesModal } from '../components/SuperLikedProfilesModal';
import { XIcon } from '../components/icons/XIcon';

interface ProfilePageProps {
  navigate: (path: AppRoute) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ navigate }) => {
  const { user, updateUser, logout, toggleZenMode } = useAuth();
  // Editable fields
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [occupation, setOccupation] = useState('');
  const [vibe, setVibe] = useState('');
  const [zodiac, setZodiac] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showLikedProfiles, setShowLikedProfiles] = useState(false);
  const [showSuperLikedProfiles, setShowSuperLikedProfiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const syncStateFromUser = (currentUser: typeof user) => {
    if (currentUser) {
      setName(currentUser.name);
      setAge(currentUser.age.toString());
      setBio(currentUser.bio);
      setOccupation(currentUser.occupation);
      setVibe(currentUser.vibe);
      setZodiac(currentUser.zodiac);
      setPhotos(currentUser.photos);
    }
  }

  useEffect(() => {
    syncStateFromUser(user);
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    await updateUser({
        name,
        age: parseInt(age, 10) || user.age,
        bio,
        occupation,
        vibe,
        zodiac,
        photos,
    });
    setIsSaving(false);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    syncStateFromUser(user);
  }
  
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
    if (photos.length > 1) {
        setPhotos(photos.filter((_, index) => index !== indexToDelete));
    } else {
        alert("You must have at least one photo.");
    }
  };


  if (!user) {
    return null; 
  }

  const likedCount = user.likedProfiles?.length || 0;
  const superLikedCount = user.superLikedProfiles?.length || 0;

  return (
    <div className="flex flex-col h-full bg-transparent">
        <div className="p-4 flex-grow overflow-y-auto pb-24">
             <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-teal-500">
                    Profile
                </h1>
                <button onClick={logout} className="p-2 rounded-full hover:bg-black/10 transition-colors">
                    <LogoutIcon className="w-6 h-6 text-slate-500" />
                </button>
            </header>

            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
              {/* Photo Grid */}
              <div className="relative -mt-16 mb-4">
                <div className="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto">
                    {Array.from({ length: 6 }).map((_, index) => {
                        const photo = photos[index];
                        return (
                            <div key={index} className="relative aspect-square rounded-lg bg-slate-200/50 flex items-center justify-center border-2 border-dashed border-slate-300">
                                {photo ? (
                                    <>
                                        <img src={photo} className="w-full h-full object-cover rounded-md" />
                                        {isEditing && (
                                            <button onClick={() => handleDeletePhoto(index)} className="absolute -top-1 -right-1 bg-slate-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                                                &times;
                                            </button>
                                        )}
                                        {index === 0 && <div className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">Main</div>}
                                    </>
                                ) : isEditing && (
                                    <button onClick={() => fileInputRef.current?.click()} className="text-slate-400 text-3xl hover:text-rose-500">+</button>
                                )}
                            </div>
                        )
                    })}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple accept="image/*" className="hidden" />
              </div>
              
              <div className="text-center mb-8">
                  {isEditing ? (
                      <input type="text" value={name} onChange={e => setName(e.target.value)} className="text-3xl font-bold bg-transparent text-center border-b-2 border-slate-300 focus:outline-none focus:border-rose-500 w-4/5"/>
                  ) : (
                      <h2 className="text-3xl font-bold">{name}, {age}</h2>
                  )}
                  {isEditing ? (
                      <input type="text" value={occupation} onChange={e => setOccupation(e.target.value)} className="text-md text-slate-500 bg-transparent text-center border-b border-slate-300 focus:outline-none focus:border-rose-500 mt-1 w-3/5"/>
                  ) : (
                      <p className="text-md text-slate-500">{occupation}</p>
                  )}
              </div>
              
              <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-slate-800">About me</h3>
                    {isEditing ? (
                        <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-slate-100 text-slate-700 border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-rose-500" rows={3}></textarea>
                    ) : (
                        <p className="text-slate-600 whitespace-pre-wrap p-3 bg-white/50 rounded-lg">{bio || 'No bio yet. Tap "Edit Profile" to add one!'}</p>
                    )}
                  </div>
                  
                  <div>
                      <h3 className="font-semibold mb-2 text-slate-800">My Vibe</h3>
                      {isEditing ? (
                          <select value={vibe} onChange={e => setVibe(e.target.value)} className="w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
                              {VIBES.map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                      ) : (
                          <div className="inline-block px-4 py-2 text-md bg-white/50 text-slate-700 font-semibold rounded-lg">{vibe}</div>
                      )}
                  </div>

                   <div>
                      <h3 className="font-semibold mb-2 text-slate-800">Zodiac</h3>
                      {isEditing ? (
                          <select value={zodiac} onChange={e => setZodiac(e.target.value)} className="w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
                              {ZODIAC_SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                      ) : (
                          <div className="inline-block px-4 py-2 text-md bg-white/50 text-slate-700 font-semibold rounded-lg">{zodiac}</div>
                      )}
                  </div>

                  <div>
                      <h3 className="font-semibold mb-2 text-slate-800">Interests</h3>
                      <div className="flex flex-wrap gap-2 p-3 bg-white/50 rounded-lg">
                          {user.interests.map(interest => (
                              <div key={interest} className="px-3 py-1 text-sm bg-rose-500/20 text-rose-600 font-semibold rounded-full">{interest}</div>
                          ))}
                      </div>
                  </div>
              </div>

              <div className="text-center mt-8">
                  {isEditing ? (
                      <div className="flex gap-4">
                          <button onClick={handleCancel} className="flex-1 p-3 rounded-full bg-slate-200 text-slate-700 font-semibold">Cancel</button>
                          <button onClick={handleSave} disabled={isSaving} className="flex-1 p-3 rounded-full bg-rose-500 text-white disabled:opacity-50 font-semibold">
                              {isSaving ? 'Saving...' : 'Save'}
                          </button>
                      </div>
                  ) : (
                      <button onClick={() => setIsEditing(true)} className="w-full max-w-sm p-3 text-lg font-semibold text-slate-700 bg-slate-200 rounded-full hover:bg-slate-300 transition-all">
                          Edit Profile
                      </button>
                  )}
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg mt-6">
                <h3 className="text-xl font-bold mb-4 text-slate-800">My Stats</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                        onClick={() => likedCount > 0 && setShowLikedProfiles(true)}
                        className={`p-4 rounded-lg bg-white/50 transition-colors ${likedCount > 0 ? 'cursor-pointer hover:bg-white' : 'cursor-default'}`}
                    >
                        <p className="font-semibold text-slate-800">Profiles Liked</p>
                        <p className="text-3xl font-bold text-rose-500 mt-1">{likedCount}</p>
                    </div>
                     <div 
                        onClick={() => superLikedCount > 0 && setShowSuperLikedProfiles(true)}
                        className={`p-4 rounded-lg bg-white/50 transition-colors ${superLikedCount > 0 ? 'cursor-pointer hover:bg-white' : 'cursor-default'}`}
                    >
                        <p className="font-semibold text-slate-800">Super Likes</p>
                        <p className="text-3xl font-bold text-sky-500 mt-1">{superLikedCount}</p>
                    </div>
                </div>
            </div>

             <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg mt-6">
              <h3 className="text-xl font-bold mb-2 text-slate-800">Settings & Privacy</h3>
              <div className="space-y-1 text-slate-700">
                <label className="flex justify-between items-center p-3 hover:bg-black/5 rounded-lg transition-colors cursor-pointer">
                    <span>Zen Mode</span>
                     <div className="relative">
                        <input type="checkbox" className="sr-only" checked={user.zenMode.enabled} onChange={toggleZenMode} />
                        <div className={`block w-14 h-8 rounded-full transition ${user.zenMode.enabled ? 'bg-rose-500' : 'bg-slate-200'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${user.zenMode.enabled ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                </label>
                <a href="#" className="flex justify-between items-center p-3 hover:bg-black/5 rounded-lg transition-colors cursor-pointer">
                  <span>Account</span>
                  <span className="text-slate-400">&gt;</span>
                </a>
                 <a href="#" className="flex justify-between items-center p-3 hover:bg-black/5 rounded-lg transition-colors cursor-pointer">
                  <span>Privacy</span>
                   <span className="text-slate-400">&gt;</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center mt-6 text-white">
                <div onClick={() => setShowPremiumModal(true)} className="bg-gradient-to-br from-amber-400 to-orange-500 p-4 rounded-xl cursor-pointer hover:shadow-lg hover:shadow-orange-500/30 transition-shadow">
                    <BoostIcon className="w-8 h-8 mx-auto mb-2" />
                    <h4 className="font-bold">Get Boosts</h4>
                    <p className="text-xs">Be a top profile</p>
                </div>
                <div onClick={() => setShowPremiumModal(true)} className="bg-gradient-to-br from-sky-400 to-blue-500 p-4 rounded-xl cursor-pointer hover:shadow-lg hover:shadow-blue-500/30 transition-shadow">
                    <StarIcon className="w-8 h-8 mx-auto mb-2" />
                    <h4 className="font-bold">Get Super Likes</h4>
                    <p className="text-xs">3x more likely to match</p>
                </div>
            </div>
        </div>
        {showPremiumModal && (
            <PremiumModal
                onClose={() => setShowPremiumModal(false)}
                navigate={navigate}
            />
        )}
        {showLikedProfiles && (
            <LikedProfilesModal
                profiles={user.likedProfiles}
                onClose={() => setShowLikedProfiles(false)}
                navigate={navigate}
            />
        )}
        {showSuperLikedProfiles && (
            <SuperLikedProfilesModal
                profiles={user.superLikedProfiles}
                onClose={() => setShowSuperLikedProfiles(false)}
                navigate={navigate}
            />
        )}
    </div>
  );
};

export default ProfilePage;