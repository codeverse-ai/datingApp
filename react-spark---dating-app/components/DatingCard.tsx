import React, { useState } from 'react';
import type { ProfileWithDistance, IconProps } from '../types';
import { motion, PanInfo, useMotionValue, useTransform, useAnimationControls } from 'framer-motion';
import { InfoIcon } from './icons/InfoIcon';

interface DatingCardProps {
  profile: ProfileWithDistance;
  onSwipe: (decision: 'like' | 'dislike' | 'superlike') => void;
  onViewProfile: (profile: ProfileWithDistance) => void;
  isTopCard: boolean;
  animationControls?: ReturnType<typeof useAnimationControls>;
  zIndex: number;
}

const PhotoProgress: React.FC<{ count: number; activeIndex: number }> = ({ count, activeIndex }) => (
  <div className="absolute top-2 left-2 right-2 flex space-x-1 p-1 rounded-full bg-black/30 backdrop-blur-sm z-20">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`h-1 flex-1 rounded-full ${i === activeIndex ? 'bg-white' : 'bg-white/50'}`}
      />
    ))}
  </div>
);

const ZodiacIcon: React.FC<{ sign: string, className?: string }> = ({ sign, className }) => {
  const signSymbol = sign.split(' ')[0] || '';
  return <span className={className} role="img" aria-label={sign}>{signSymbol}</span>
}

export const DatingCard: React.FC<DatingCardProps> = ({ profile, onSwipe, onViewProfile, isTopCard, animationControls, zIndex }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-25, 25]);
  
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
  const superLikeOpacity = useTransform(y, [-150, 0], [1, 0]);


  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y < -100) {
      onSwipe('superlike');
    } else if (info.offset.x > 100) {
      onSwipe('like');
    } else if (info.offset.x < -100) {
      onSwipe('dislike');
    }
  };

  const changePhoto = (direction: 'next' | 'prev') => {
    if (profile.photos.length <= 1) return;
    if (direction === 'next') {
      setActivePhotoIndex(i => (i + 1) % profile.photos.length);
    } else {
      setActivePhotoIndex(i => (i - 1 + profile.photos.length) % profile.photos.length);
    }
  };

  return (
    <motion.div
      className="absolute w-full h-full"
      drag={isTopCard}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={animationControls}
      style={{
        zIndex,
        scale: 1 - (2 - zIndex) * 0.05,
        top: (2 - zIndex) * -10,
        cursor: isTopCard ? 'grab' : 'auto',
        x,
        y,
        rotate,
      }}
      initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0, transition: { duration: 0.3 } }}
    >
      <div className="relative w-full h-full rounded-2xl shadow-2xl overflow-hidden bg-slate-200">
        <motion.img
          key={profile.photos[activePhotoIndex]}
          src={profile.photos[activePhotoIndex]}
          alt={profile.name}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {profile.photos.length > 1 && (
          <>
            <div
              className="absolute top-0 left-0 h-full w-1/2 z-10 cursor-pointer"
              onClick={() => changePhoto('prev')}
              aria-label="Previous photo"
            />
            <div
              className="absolute top-0 right-0 h-full w-1/2 z-10 cursor-pointer"
              onClick={() => changePhoto('next')}
              aria-label="Next photo"
            />
          </>
        )}

        {/* This container now has the gradient, is full-height, and handles layout + padding */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 pb-12 z-20">
           <div 
             onClick={isTopCard ? () => onViewProfile(profile) : undefined}
             className={`text-left w-full z-30 ${isTopCard ? 'cursor-pointer' : 'cursor-default'}`}
             role={isTopCard ? 'button' : undefined}
             aria-label="View profile details"
           >
              {profile.vibe && (
                <div className="mb-2 inline-block px-3 py-1 text-sm bg-white/25 backdrop-blur-sm text-white rounded-full font-semibold">
                    {profile.vibe}
                </div>
              )}
              <h2 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-2">
                {profile.name} <span className="font-light">{profile.age}</span>
                {profile.zodiac && <ZodiacIcon sign={profile.zodiac} className="text-xl opacity-80" />}
                {isTopCard && <InfoIcon className="w-6 h-6 text-white/80" />}
              </h2>
               <p className="text-sm text-white/80 font-medium drop-shadow-md capitalize">
                 {profile.pronouns} &bull; {profile.occupation}
              </p>
              {profile.distance < 9999 && (
                 <p className="text-sm text-white/80 font-medium drop-shadow-md">{profile.distance.toFixed(1)} miles away</p>
              )}

              <p className="text-slate-200 mt-2 drop-shadow-md text-base line-clamp-2">{profile.bio}</p>
              
              {profile.interests.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.interests.slice(0, 3).map(interest => (
                    <div key={interest} className="px-3 py-1 text-sm bg-white/20 backdrop-blur-sm text-white rounded-full">
                      {interest}
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>

        {isTopCard && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-10 left-6 text-[#F06292] font-bold text-4xl border-4 border-[#F06292] rounded-lg px-4 py-1 transform -rotate-12 bg-white/80 z-10"
            >
              LIKE
            </motion.div>
            <motion.div
              style={{ opacity: nopeOpacity }}
              className="absolute top-10 right-6 text-gray-500 font-bold text-4xl border-4 border-gray-500 rounded-lg px-4 py-1 transform rotate-12 bg-white/80 z-10"
            >
              NOPE
            </motion.div>
             <motion.div
              style={{ opacity: superLikeOpacity }}
              className="absolute bottom-40 left-1/2 -translate-x-1/2 text-[#FFC107] font-bold text-4xl border-4 border-[#FFC107] rounded-lg px-4 py-1 bg-white/80 z-10"
            >
              SUPER LIKE
            </motion.div>
          </>
        )}
        
        {profile.photos.length > 1 && (
            <PhotoProgress count={profile.photos.length} activeIndex={activePhotoIndex} />
        )}

      </div>
    </motion.div>
  );
};