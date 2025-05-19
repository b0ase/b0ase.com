'use client';

import React from 'react';
import Link from 'next/link';
import { FaRocket, FaSave, FaSpinner } from 'react-icons/fa'; // Only keep icons needed for the main page JSX

import ProfileDetails from '@/components/ProfileDetails'; // Import the new component
import UserSkills from '@/components/UserSkills'; // Import the new UserSkills component
import UserTeams from '@/components/UserTeams'; // Import the new UserTeams component
import EditProfileForm from '@/components/EditProfileForm'; // Import the new EditProfileForm component

// Import the custom hook
import useProfileData from '@/lib/hooks/useProfileData';


export default function ProfilePage() {
  // Use the custom hook to get data and handlers
  const {
    user,
    profile,
    newUsername,
    newDisplayName,
    newBio,
    newWebsiteUrl,
    newTwitterUrl,
    newLinkedInUrl,
    newGitHubUrl,
    newInstagramUrl,
    newDiscordUrl,
    newPhoneWhatsapp,
    newTikTokUrl,
    newTelegramUrl,
    newFacebookUrl,
    newDollarHandle,
    newTokenName,
    newSupply,
    loading,
    saving,
    error,
    successMessage,
    isUploadingAvatar,
    avatarUploadError,
    allSkills,
    selectedSkills,
    userSkillIds,
    loadingSkills,
    savingSkills,
    userTeams,
    loadingUserTeams,
    errorUserTeams,
    customSkillInput,
    skillChoiceInAdder,
    setNewUsername,
    setNewDisplayName,
    setNewBio,
    setNewWebsiteUrl,
    setNewTwitterUrl,
    setNewLinkedInUrl,
    setNewGitHubUrl,
    setNewInstagramUrl,
    setNewDiscordUrl,
    setNewPhoneWhatsapp,
    setNewTikTokUrl,
    setNewTelegramUrl,
    setNewFacebookUrl,
    setNewDollarHandle,
    setNewTokenName,
    setNewSupply,
    setCustomSkillInput,
    setSkillChoiceInAdder,
    handleUpdateProfile,
    handleSimpleAvatarUpload,
    handleSkillToggle,
    handleAddCustomSkill,
  } = useProfileData();

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center">
        <FaRocket className="text-6xl text-sky-500 mb-4 animate-pulse" />
        <p className="text-xl text-gray-400">Loading your universe...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 overflow-x-hidden">
      {/* Save Profile Button - Moved to AppSubNavbar */}
      {/*
      <div className="fixed top-[30px] right-28 z-50">
        <button
          form="profile-form" // Associate button with the form by id
          type="submit"
          disabled={saving}
          className="w-56 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
      */}

      <main className="flex-grow bg-black pt-4"> {/* Adjusted padding-top as sticky button is removed from here */}
        <div className="mx-auto bg-black">
          {/* Render ProfileDetails Component */}
          <ProfileDetails
            profile={profile}
            isUploadingAvatar={isUploadingAvatar}
            avatarUploadError={avatarUploadError}
            onAvatarUpload={handleSimpleAvatarUpload}
          />

          {/* Main Content Sections */}
          <div className="mt-10">
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
              {/* Render UserSkills Component */}
              <UserSkills
                selectedSkills={selectedSkills}
                allSkills={allSkills}
                userSkillIds={userSkillIds}
                loadingSkills={loadingSkills}
                savingSkills={savingSkills}
                customSkillInput={customSkillInput}
                skillChoiceInAdder={skillChoiceInAdder}
                onSkillToggle={handleSkillToggle}
                onAddCustomSkill={handleAddCustomSkill}
                onCustomSkillInputChange={(e) => setCustomSkillInput(e.target.value)}
                onSkillChoiceInAdderChange={(e) => setSkillChoiceInAdder(e.target.value)}
              />

              {/* Render UserTeams Component */}
              <UserTeams
                userTeams={userTeams}
                loadingUserTeams={loadingUserTeams}
                errorUserTeams={errorUserTeams}
              />
            </div>

            {/* Render EditProfileForm Component */}
            <EditProfileForm
              newUsername={newUsername}
              newDisplayName={newDisplayName}
              newBio={newBio}
              newWebsiteUrl={newWebsiteUrl}
              newTwitterUrl={newTwitterUrl}
              newLinkedInUrl={newLinkedInUrl}
              newGitHubUrl={newGitHubUrl}
              newInstagramUrl={newInstagramUrl}
              newDiscordUrl={newDiscordUrl}
              newPhoneWhatsapp={newPhoneWhatsapp}
              newTikTokUrl={newTikTokUrl}
              newTelegramUrl={newTelegramUrl}
              newFacebookUrl={newFacebookUrl}
              newDollarHandle={newDollarHandle}
              newTokenName={newTokenName}
              newSupply={newSupply}
              saving={saving}
              error={error}
              successMessage={successMessage}
              avatarUploadError={avatarUploadError}
              onUsernameChange={(e) => setNewUsername(e.target.value)}
              onDisplayNameChange={(e) => setNewDisplayName(e.target.value)}
              onBioChange={(e) => setNewBio(e.target.value)}
              onWebsiteUrlChange={(e) => setNewWebsiteUrl(e.target.value)}
              onTwitterUrlChange={(e) => setNewTwitterUrl(e.target.value)}
              onLinkedInUrlChange={(e) => setNewLinkedInUrl(e.target.value)}
              onGitHubUrlChange={(e) => setNewGitHubUrl(e.target.value)}
              onInstagramUrlChange={(e) => setNewInstagramUrl(e.target.value)}
              onDiscordUrlChange={(e) => setNewDiscordUrl(e.target.value)}
              onPhoneWhatsappChange={(e) => setNewPhoneWhatsapp(e.target.value)}
              onTikTokUrlChange={(e) => setNewTikTokUrl(e.target.value)}
              onTelegramUrlChange={(e) => setNewTelegramUrl(e.target.value)}
              onFacebookUrlChange={(e) => setNewFacebookUrl(e.target.value)}
              onDollarHandleChange={(e) => setNewDollarHandle(e.target.value)}
              onTokenNameChange={(e) => setNewTokenName(e.target.value)}
              onSupplyChange={(e) => setNewSupply(e.target.value)}
              onSubmit={handleUpdateProfile}
            />
           </div>
        </div>
      </main>
    </div>
  );
}