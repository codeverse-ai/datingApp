
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogoutIcon } from '../components/icons/LogoutIcon';
import { BoostIcon } from '../components/icons/BoostIcon';
import { StarIcon } from '../components/icons/StarIcon';
import { PremiumModal } from '../components/PremiumModal';
import type { AppRoute } from '../types';
import { VIBES, ZODIAC_SIGNS } from '../constants';

interface ProfilePageProps {
  navigate: (path: AppRoute) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ navigate }) => {
  const { user, updateUser, logout, toggleZenMode } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [occupation, setOccupation] = useState('');
  const [vibe, setVibe] = useState('');
  const [zodiac, setZodiac] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAge(user.age.toString());
      setBio(user.bio);
      setOccupation(user.occupation);
      setVibe(user.vibe);
      setZodiac(user.zodiac);
    }
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
    });
    setIsSaving(false);
    setIsEditing(false);
  };
  
  if (!user) {
    return null; // Or some loading/error state
  }
  
  const handleCancel = () => {
    setIsEditing(false);
    if(user) {
      setName(user.name);
      setAge(user.age.toString());
      setBio(user.bio);
      setOccupation(user.occupation);
      setVibe(user.vibe);
      setZodiac(user.zodiac);
    }
  }

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
              <div className="relative w-40 h-40 mx-auto -mt-16 mb-4">
                  <img src={user.photos[0]} alt={user.name} className="w-full h-full rounded-full object-cover shadow-lg border-4 border-white" />
                  <button className="absolute bottom-0 right-0 bg-rose-500 text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white/80 hover:bg-rose-600 transition-colors">+</button>
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
    </div>
  );
};

export default ProfilePage;
