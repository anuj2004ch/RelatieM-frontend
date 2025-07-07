// import { useMutation } from "@tanstack/react-query";
// import useAuthUser from "../hooks/useAuthUser"
// import { useState } from "react"
// import toast from "react-hot-toast";
// import { completeOnboarding } from "../lib/api.js";
// import { useQueryClient } from "@tanstack/react-query";
// import { AVATARS } from "../constants/index.js";

// function OnboardingPage() {
//   const {authUser} = useAuthUser();
//   const queryClient = useQueryClient();
  
//   const [formState, setFormState] = useState({
//     fullName: authUser?.fullName || "",
//     username: authUser?.username || "",
//     bio: authUser?.bio || "",
//     location: authUser?.location || "",
//     profilePic: authUser?.profilePic || "",
//   });

//   const {mutate: onboardingMutation, isPending} = useMutation({
//     mutationFn: completeOnboarding,
//     onSuccess: () => {
//       toast.success("Profile onboarded successfully!");
//       queryClient.invalidateQueries({ queryKey: ["authUser"] });
//     },
//     onError: (error) => {
//       toast.error(error.response?.data || "Failed to onboard profile. Please try again.");
//     }
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormState(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Basic validation
//     if (!formState.fullName.trim()) {
//       toast.error("Please enter your full name");
//       return;
//     }
//     if (!formState.bio.trim()) {
//       toast.error("Please add a bio");
//       return;
//     }
//     if (!formState.location.trim()) {
//       toast.error("Please enter your location");
//       return;
//     }
    
//     onboardingMutation(formState);
//   };

//   const handleRandomAvatar = () => {
//     const idx = Math.floor(Math.random() * 10) ;
//     console.log(idx);
//     const randomAvatar = AVATARS[idx];
//     setFormState(prev => ({
//       ...prev,
//       profilePic: randomAvatar
//     }));
//     toast.success("Random avatar selected!");
//   }

  
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative">
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-2xl mx-auto">
          
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-4xl font-bold text-white mb-2">
//               Complete Your <span className="text-orange-400">Profile</span>
//             </h1>
//             <p className="text-lg text-gray-300">
//               Help others get to know you better and find the perfect language exchange partners
//             </p>
//           </div>

//           {/* Form Card */}
//           <div className="card bg-gray-800 shadow-2xl border border-gray-700 hover:shadow-3xl transition-all duration-300 hover:border-gray-600 relative z-10">
//             <div className="card-body p-8">
//               <form onSubmit={handleSubmit} className="space-y-6">
                
//                 {/* Profile Picture Section */}
//                 <div className="text-center mb-6">
//                   <div className="relative inline-block group">
//                     <div className="avatar mb-4">
//                       <div className="w-24 h-24 rounded-full ring ring-orange-400 ring-offset-2 ring-offset-gray-800 group-hover:ring-orange-300 transition-all duration-300 hover:scale-105">
//                         {formState.profilePic ? (
//                           <img src={formState.profilePic} alt="Profile" className="rounded-full" />
//                         ) : (
//                           <div className="bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
//                             {formState.fullName.charAt(0).toUpperCase() || "?"}
//                           </div>
//                         )}
//                       </div>
//                     </div>
                    
//                     {/* Avatar Selection Button */}
//                     <div className="flex justify-center mt-4">
//                       <button
//                         type="button"
//                         onClick={handleRandomAvatar}
//                         className="btn btn-outline btn-sm hover:btn-secondary transition-all duration-300 hover:scale-105 relative z-20"
//                       >
//                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                         </svg>
//                         Generate Random Avatar
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Full Name */}
//                 <div className="form-control group">
//                   <label className="label">
//                     <span className="label-text font-medium text-gray-300 group-hover:text-white transition-colors duration-200">Full Name</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="fullName"
//                     value={formState.fullName}
//                     onChange={handleInputChange}
//                     placeholder="Enter your full name"
//                     className="input input-bordered w-full focus:input-primary transition-all duration-300 bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-gray-500 focus:scale-[1.02]"
//                     required
//                   />
//                 </div>

//                 {/* Bio */}
//                 <div className="form-control group">
//                   <label className="label">
//                     <span className="label-text font-medium text-gray-300 group-hover:text-white transition-colors duration-200">Bio</span>
//                   </label>
//                   <textarea
//                     name="bio"
//                     value={formState.bio}
//                     onChange={handleInputChange}
//                     placeholder="Tell others about yourself, your interests, and what you're looking for in a language exchange partner..."
//                     className="textarea textarea-bordered h-24 w-full focus:textarea-primary transition-all duration-300 bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none hover:border-gray-500 focus:scale-[1.02]"
//                     required
//                   />
//                   <label className="label">
//                     <span className="label-text-alt text-gray-400">
//                       {formState.bio.length}/300 characters
//                     </span>
//                   </label>
//                 </div>

//                 {/* Location */}
//                 <div className="form-control group">
//                   <label className="label">
//                     <span className="label-text font-medium text-gray-300 group-hover:text-white transition-colors duration-200">Location</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="location"
//                     value={formState.location}
//                     onChange={handleInputChange}
//                     placeholder="City, Country"
//                     className="input input-bordered w-full focus:input-primary transition-all duration-300 bg-gray-700 border-gray-600 text-white placeholder-gray-400 hover:border-gray-500 focus:scale-[1.02]"
//                     required
//                   />
//                 </div>

//                 {/* Submit Button */}
//                 <div className="form-control mt-8">
//                   <button
//                     type="submit"
//                     disabled={isPending}
//                     className="btn btn-primary w-full text-white font-medium text-lg h-12 hover:scale-105 transition-all duration-300 hover:shadow-xl relative z-20 disabled:hover:scale-100"
//                   >
//                     {isPending ? (
//                       <>
//                         <span className="loading loading-spinner loading-sm"></span>
//                         Completing Profile...
//                       </>
//                     ) : (
//                       <>
//                         <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                         </svg>
//                         Complete Profile
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>

//               {/* Progress Indicator */}
//               <div className="mt-6 group">
//                 <div className="flex justify-between text-sm text-gray-400 mb-2 group-hover:text-gray-300 transition-colors duration-200">
//                   <span>Profile Completion</span>
//                   <span>Almost done!</span>
//                 </div>
//                 <progress 
//                   className="progress progress-primary w-full hover:scale-105 transition-transform duration-300" 
//                   value="85" 
//                   max="100"
//                 ></progress>
//               </div>
//             </div>
//           </div>

//           {/* Features Preview */}
//           <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center relative z-10">
//             <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:bg-gray-750 hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
//               <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 hover:bg-green-400 transition-colors duration-300">
//                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                 </svg>
//               </div>
//               <h3 className="font-semibold text-white mb-1">Find Partners</h3>
//               <p className="text-sm text-gray-400">Connect with native speakers</p>
//             </div>
            
//             <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:bg-gray-750 hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
//               <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 hover:bg-blue-400 transition-colors duration-300">
//                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                 </svg>
//               </div>
//               <h3 className="font-semibold text-white mb-1">Video Calls</h3>
//               <p className="text-sm text-gray-400">Practice speaking skills</p>
//             </div>
            
//             <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:bg-gray-750 hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
//               <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2 hover:bg-purple-400 transition-colors duration-300">
//                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                 </svg>
//               </div>
//               <h3 className="font-semibold text-white mb-1">Real-time Chat</h3>
//               <p className="text-sm text-gray-400">Real-time messaging</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OnboardingPage;
import { useMutation } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser"
import { useState } from "react"
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api.js";
import { useQueryClient } from "@tanstack/react-query";
import { AVATARS } from "../constants/index.js";
import { User, MapPin, FileText, Camera, Loader2, ArrowRight, Edit3,Sparkles } from 'lucide-react';
import { useNavigate } from "react-router";

function OnboardingPage({ complete = true }) {
  const {authUser} = useAuthUser();
  const queryClient = useQueryClient();
  const navigate=useNavigate();
  
  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    username: authUser?.username || "",
    bio: authUser?.bio || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const [inputFocus, setInputFocus] = useState({
    fullName: false,
    username: false,
    bio: false,
    location: false
  });

  const {mutate: onboardingMutation, isPending} = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success(complete ? "Profile onboarded successfully!" : "Profile updated successfully!", {
        icon: '🎉',
        duration: 4000,
      });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      if(!complete) navigate('/');
    },
    onError: (error) => {
      toast.error(error.response?.data || `Failed to ${complete ? 'onboard' : 'update'} profile. Please try again.`, {
        icon: '❌',
        duration: 4000,
      });
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFocus = (field) => {
    setInputFocus(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setInputFocus(prev => ({ ...prev, [field]: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formState.fullName.trim()) {
      toast.error("Please enter your full name", { icon: '⚠️' });
      return;
    }
    if (complete && !formState.username.trim()) {
      toast.error("Please enter a username", { icon: '⚠️' });
      return;
    }
    if (!formState.bio.trim()) {
      toast.error("Please add a bio", { icon: '⚠️' });
      return;
    }
    if (!formState.location.trim()) {
      toast.error("Please enter your location", { icon: '⚠️' });
      return;
    }
    
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 10);
    console.log(idx);
    const randomAvatar = AVATARS[idx];
    setFormState(prev => ({
      ...prev,
      profilePic: randomAvatar
    }));
    toast.success("Random avatar selected!", {
      icon: '🎨',
      duration: 3000,
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-secondary/40 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-accent/30 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="space-y-3">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
              {complete ? 'Complete Your Profile' : 'Update Your Profile'}
            </h1>
            <p className="text-base-content/80 text-lg font-medium">
              {complete 
                ? 'Help others get to know you better and find the perfect language exchange partners'
                : 'Keep your profile fresh and engaging'
              }
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-base-content/60">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              <span className="font-medium">{complete ? 'Almost there!' : 'Edit your details'}</span>
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Form Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl blur-xl"></div>
          <div className="relative card bg-base-100/80 backdrop-blur-xl shadow-2xl border border-primary/10 rounded-3xl">
            <div className="card-body p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Enhanced Profile Picture Section */}
                <div className="text-center mb-8">
                  <div className="relative inline-block group">
                    <div className="avatar mb-6">
                      <div className="w-32 h-32 rounded-full transition-all duration-300 hover:scale-105 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-lg"></div>
                        <div className="relative w-full h-full rounded-full ring ring-primary/30 ring-offset-4 ring-offset-base-100 group-hover:ring-primary/50 transition-all duration-300 overflow-hidden">
                          {formState.profilePic ? (
                            <img src={formState.profilePic} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold">
                              {formState.fullName.charAt(0).toUpperCase() || "?"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Avatar Selection Button */}
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={handleRandomAvatar}
                        className="btn btn-outline btn-primary rounded-2xl font-bold transition-all duration-300 hover:scale-105 group px-6 py-3"
                      >
                        <Camera className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                        Generate Random Avatar
                        <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Full Name Input */}
                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-bold text-base-content flex items-center space-x-2">
                      <User className="w-4 h-4 text-primary" />
                      <span>Full Name</span>
                    </span>
                  </label>
                  <div className="relative group">
                    <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                      inputFocus.fullName ? 'text-primary scale-110' : 'text-primary/60'
                    }`} />
                    <input
                      type="text"
                      name="fullName"
                      value={formState.fullName}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('fullName')}
                      onBlur={() => handleBlur('fullName')}
                      placeholder="Enter your full name"
                      className={`input input-bordered w-full pl-12 text-base h-14 transition-all duration-300 rounded-2xl ${
                        inputFocus.fullName 
                          ? 'input-primary bg-primary/5 border-primary/50 shadow-lg' 
                          : 'bg-base-200/50 hover:bg-base-200 border-base-300 hover:border-primary/30'
                      }`}
                      required
                    />
                    <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 ${
                      inputFocus.fullName ? 'ring-2 ring-primary/20' : ''
                    }`}></div>
                  </div>
                </div>

                {/* Username Input (only for complete=true) */}
                {complete && (
                  <div className="form-control">
                    <label className="label pb-2">
                      <span className="label-text font-bold text-base-content flex items-center space-x-2">
                        <Edit3 className="w-4 h-4 text-primary" />
                        <span>Username</span>
                      </span>
                    </label>
                    <div className="relative group">
                      <Edit3 className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                        inputFocus.username ? 'text-primary scale-110' : 'text-primary/60'
                      }`} />
                      <input
                        type="text"
                        name="username"
                        value={formState.username}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('username')}
                        onBlur={() => handleBlur('username')}
                        placeholder="Choose a unique username"
                        className={`input input-bordered w-full pl-12 text-base h-14 transition-all duration-300 rounded-2xl ${
                          inputFocus.username 
                            ? 'input-primary bg-primary/5 border-primary/50 shadow-lg' 
                            : 'bg-base-200/50 hover:bg-base-200 border-base-300 hover:border-primary/30'
                        }`}
                        required
                      />
                      <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 ${
                        inputFocus.username ? 'ring-2 ring-primary/20' : ''
                      }`}></div>
                    </div>
                  </div>
                )}

                {/* Enhanced Bio Input */}
                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-bold text-base-content flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span>Bio</span>
                    </span>
                  </label>
                  <div className="relative group">
                    <FileText className={`absolute left-4 top-6 w-5 h-5 transition-all duration-300 ${
                      inputFocus.bio ? 'text-primary scale-110' : 'text-primary/60'
                    }`} />
                    <textarea
                      name="bio"
                      value={formState.bio}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('bio')}
                      onBlur={() => handleBlur('bio')}
                      placeholder="Tell others about yourself, your interests, and what you're looking for in a language exchange partner..."
                      className={`textarea textarea-bordered h-32 w-full pl-12 pt-4 text-base transition-all duration-300 rounded-2xl resize-none ${
                        inputFocus.bio 
                          ? 'textarea-primary bg-primary/5 border-primary/50 shadow-lg' 
                          : 'bg-base-200/50 hover:bg-base-200 border-base-300 hover:border-primary/30'
                      }`}
                      maxLength="300"
                      required
                    />
                    <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 ${
                      inputFocus.bio ? 'ring-2 ring-primary/20' : ''
                    }`}></div>
                  </div>
                  <label className="label">
                    <span className="label-text-alt text-base-content/60 font-medium">
                      {formState.bio.length}/300 characters
                    </span>
                  </label>
                </div>

                {/* Enhanced Location Input */}
                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-bold text-base-content flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>Location</span>
                    </span>
                  </label>
                  <div className="relative group">
                    <MapPin className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                      inputFocus.location ? 'text-primary scale-110' : 'text-primary/60'
                    }`} />
                    <input
                      type="text"
                      name="location"
                      value={formState.location}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('location')}
                      onBlur={() => handleBlur('location')}
                      placeholder="City, Country"
                      className={`input input-bordered w-full pl-12 text-base h-14 transition-all duration-300 rounded-2xl ${
                        inputFocus.location 
                          ? 'input-primary bg-primary/5 border-primary/50 shadow-lg' 
                          : 'bg-base-200/50 hover:bg-base-200 border-base-300 hover:border-primary/30'
                      }`}
                      required
                    />
                    <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 ${
                      inputFocus.location ? 'ring-2 ring-primary/20' : ''
                    }`}></div>
                  </div>
                </div>

                {/* Enhanced Submit Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn w-full h-14 text-base font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl relative overflow-hidden group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-0 text-white mt-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  {isPending ? (
                    <div className="flex items-center space-x-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{complete ? 'Completing Profile...' : 'Updating Profile...'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <span>{complete ? 'Complete Profile' : 'Update Profile'}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  )}
                </button>
              </form>

              {/* Enhanced Progress Indicator (only for complete=true) */}
              {complete && (
                <div className="mt-8 pt-6 border-t border-base-300/50">
                  <div className="flex justify-between text-sm text-base-content/70 mb-3 font-medium">
                    <span>Profile Completion</span>
                    <span>Almost done!</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-sm"></div>
                    <progress 
                      className="progress progress-primary w-full h-3 rounded-full transition-all duration-300 hover:scale-[1.02]" 
                      value="85" 
                      max="100"
                    ></progress>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Features Preview (only for complete=true) */}
        {complete && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center relative z-10">
            <div className="bg-base-100/60 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 hover:bg-base-100/80 hover:border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-bold text-base-content mb-2 text-lg">Find Partners</h3>
              <p className="text-sm text-base-content/70">Connect with native speakers</p>
            </div>
            
            <div className="bg-base-100/60 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 hover:bg-base-100/80 hover:border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-base-content mb-2 text-lg">Video Calls</h3>
              <p className="text-sm text-base-content/70">Practice speaking skills</p>
            </div>
            
            <div className="bg-base-100/60 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 hover:bg-base-100/80 hover:border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-base-content mb-2 text-lg">Real-time Chat</h3>
              <p className="text-sm text-base-content/70">Real-time messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OnboardingPage;