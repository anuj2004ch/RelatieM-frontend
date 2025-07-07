
// import { useState } from 'react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { login } from '../lib/api.js';
// import toast from 'react-hot-toast';
// import { Eye, EyeOff, User, Lock, Loader2, Sparkles, Shield, ArrowRight } from 'lucide-react';
// import { Link } from 'react-router';

// function LoginPage() {
//   const [loginData, setLoginData] = useState({ identifier: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [inputFocus, setInputFocus] = useState({ identifier: false, password: false });
//   const queryClient = useQueryClient();
  
//   const { mutate: loginMutation, isPending } = useMutation({
//     mutationFn: login,
//     onSuccess: () => {
//       toast.success("Welcome back! Login successful!", {
//         icon: '🎉',
//         duration: 4000,
//       });
//       queryClient.invalidateQueries({ queryKey: ["authUser"] });
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || "Invalid credentials. Please try again.", {
//         icon: '❌',
//         duration: 4000,
//       });
//     }
//   });

//   const handleLogin = async (e) => {
//     e.preventDefault();
    
//     // Enhanced validation
//     if (!loginData.identifier.trim()) {
//       toast.error("Please enter your email or username", { icon: '⚠️' });
//       return;
//     }
//     if (loginData.password.length < 6) {
//       toast.error("Password must be at least 6 characters long", { icon: '⚠️' });
//       return;
//     }
    
//     loginMutation(loginData);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setLoginData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFocus = (field) => {
//     setInputFocus(prev => ({ ...prev, [field]: true }));
//   };

//   const handleBlur = (field) => {
//     setInputFocus(prev => ({ ...prev, [field]: false }));
//   };

//   // Detect if input is email or username
//   const isEmail = loginData.identifier.includes('@');

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 flex items-center justify-center p-4 relative overflow-hidden">
//       {/* Background decorative elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
//         <div className="absolute top-20 left-20 w-2 h-2 bg-primary/30 rounded-full animate-pulse"></div>
//         <div className="absolute top-40 right-32 w-1 h-1 bg-secondary/40 rounded-full animate-pulse delay-300"></div>
//         <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-accent/30 rounded-full animate-pulse delay-700"></div>
//       </div>

//       <div className="w-full max-w-md relative z-10">
//         {/* Header with Enhanced Branding */}
//         <div className="text-center mb-8">
//           <div className="relative mx-auto w-52 h-36 mb-6">
//             <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-xl"></div>
//             <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm rounded-3xl p-6 border border-primary/20 shadow-2xl">
//               <img 
//                 src="/i.png" 
//                 alt="RelatieM Logo" 
//                 className="w-full h-full object-contain drop-shadow-lg"
//                 onError={(e) => {
//                   e.target.style.display = 'none';
//                   e.target.nextSibling.style.display = 'flex';
//                 }}
//               />
//               <div 
//                 className="w-full h-full bg-gradient-to-br from-primary/40 to-secondary/40 rounded-2xl flex items-center justify-center shadow-lg"
//                 style={{ display: 'none' }}
//               >
//                 <div className="flex items-center space-x-2">
//                   <Sparkles className="text-primary text-3xl animate-pulse" />
//                   <Shield className="text-secondary text-2xl" />
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="space-y-3">
//             <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
//               RelatieM
//             </h1>
//             <p className="text-base-content/80 text-lg font-medium">
//               Welcome back! Ready to connect?
//             </p>
//             <div className="flex items-center justify-center space-x-2 text-sm text-base-content/60">
//               <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
//               <span className="font-medium">Sign in to continue</span>
//               <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Login Form */}
//         <div className="relative">
//           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl blur-xl"></div>
//           <div className="relative card bg-base-100/80 backdrop-blur-xl shadow-2xl border border-primary/10 rounded-3xl">
//             <div className="card-body p-8">
//               <form onSubmit={handleLogin} className="space-y-6">
//                 {/* Enhanced Email/Username Input */}
//                 <div className="form-control">
//                   <label className="label pb-2">
//                     <span className="label-text font-bold text-base-content flex items-center space-x-2">
//                       <User className="w-4 h-4 text-primary" />
//                       <span>Email or Username</span>
//                     </span>
//                   </label>
//                   <div className="relative group">
//                     <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
//                       inputFocus.identifier ? 'text-primary scale-110' : 'text-primary/60'
//                     }`}>
//                       {isEmail ? (
//                         <User className="w-5 h-5" />
//                       ) : (
//                         <User className="w-5 h-5" />
//                       )}
//                     </div>
//                     <input
//                       type="text"
//                       name="identifier"
//                       value={loginData.identifier}
//                       onChange={handleInputChange}
//                       onFocus={() => handleFocus('identifier')}
//                       onBlur={() => handleBlur('identifier')}
//                       placeholder="Enter your email or username"
//                       className={`input input-bordered w-full pl-12 text-base h-14 transition-all duration-300 rounded-2xl ${
//                         inputFocus.identifier 
//                           ? 'input-primary bg-primary/5 border-primary/50 shadow-lg' 
//                           : 'bg-base-200/50 hover:bg-base-200 border-base-300 hover:border-primary/30'
//                       }`}
//                       required
//                     />
//                     <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 ${
//                       inputFocus.identifier ? 'ring-2 ring-primary/20' : ''
//                     }`}></div>
                    
//                     {/* Input type indicator */}
//                     {loginData.identifier && (
//                       <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
//                         <div className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
//                           isEmail 
//                             ? 'bg-primary/10 text-primary border border-primary/20' 
//                             : 'bg-secondary/10 text-secondary border border-secondary/20'
//                         }`}>
//                           {isEmail ? 'Email' : 'Username'}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Enhanced Password Input */}
//                 <div className="form-control">
//                   <label className="label pb-2">
//                     <span className="label-text font-bold text-base-content flex items-center space-x-2">
//                       <Lock className="w-4 h-4 text-primary" />
//                       <span>Password</span>
//                     </span>
//                   </label>
//                   <div className="relative group">
//                     <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
//                       inputFocus.password ? 'text-primary scale-110' : 'text-primary/60'
//                     }`} />
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={loginData.password}
//                       onChange={handleInputChange}
//                       onFocus={() => handleFocus('password')}
//                       onBlur={() => handleBlur('password')}
//                       placeholder="Enter your password"
//                       className={`input input-bordered w-full pl-12 pr-12 text-base h-14 transition-all duration-300 rounded-2xl ${
//                         inputFocus.password 
//                           ? 'input-primary bg-primary/5 border-primary/50 shadow-lg' 
//                           : 'bg-base-200/50 hover:bg-base-200 border-base-300 hover:border-primary/30'
//                       }`}
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-primary/10 transition-all duration-200 group"
//                     >
//                       {showPassword ? (
//                         <EyeOff className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
//                       ) : (
//                         <Eye className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
//                       )}
//                     </button>
//                     <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 ${
//                       inputFocus.password ? 'ring-2 ring-primary/20' : ''
//                     }`}></div>
//                   </div>
//                 </div>

//                 {/* Enhanced Login Button */}
//                 <button
//                   type="submit"
//                   disabled={isPending}
//                   className="btn w-full h-14 text-base font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl relative overflow-hidden group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-0 text-white"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  
//                   {isPending ? (
//                     <div className="flex items-center space-x-3">
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                       <span>Signing you in...</span>
//                     </div>
//                   ) : (
//                     <div className="flex items-center space-x-3">
//                       <span>Sign In</span>
//                       <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
//                     </div>
//                   )}
//                 </button>
//               </form>

//               {/* Enhanced Sign Up Section */}
//               <div className="mt-8 pt-6 border-t border-base-300/50">
//                 <div className="text-center space-y-4">
//                   <p className="text-base-content/70 font-medium">
//                     New to RelatieM?
//                   </p>
//                   <Link
//                     to="/signup" 
//                     className="btn btn-outline btn-primary w-full h-12 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02] group"
//                   >
//                     <span>Create your account</span>
//                     <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform duration-300" />
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>


//       </div>
//     </div>
//   );
// }

// export default LoginPage;
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../lib/api.js';
import toast from 'react-hot-toast';
import { Eye, EyeOff, User, Lock, Loader2, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

function LoginPage() {
  const [loginData, setLoginData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [inputFocus, setInputFocus] = useState({ identifier: false, password: false });
  const queryClient = useQueryClient();
  
  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success("Welcome back! Login successful!", {
        icon: '🎉',
        duration: 4000,
      });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Invalid credentials. Please try again.", {
        icon: '❌',
        duration: 4000,
      });
    }
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!loginData.identifier.trim()) {
      toast.error("Please enter your email or username", { icon: '⚠️' });
      return;
    }
    if (loginData.password.length < 6) {
      toast.error("Password must be at least 6 characters long", { icon: '⚠️' });
      return;
    }
    
    loginMutation(loginData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
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

  // Detect if input is email or username
  const isEmail = loginData.identifier.includes('@');

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

      <div className="w-full max-w-md relative z-10">
        {/* Header with Enhanced Branding */}
        <div className="text-center mb-8">
          <div className="relative mx-auto w-52 h-36">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm rounded-3xl p-6 border border-primary/20 shadow-2xl h-full">
              <img 
                src="/i.png" 
                alt="RelatieM Logo" 
                className="w-full h-full object-contain drop-shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div 
                className="w-full h-full bg-gradient-to-br from-primary/40 to-secondary/40 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ display: 'none' }}
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="text-primary text-3xl animate-pulse" />
                  <Shield className="text-secondary text-2xl" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 space-y-3">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
              RelatieM
            </h1>
            <p className="text-base-content/80 text-lg font-medium">
              Welcome back! Ready to connect?
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-base-content/60">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              <span className="font-medium">Sign in to continue</span>
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Login Form */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl blur-xl"></div>
          <div className="relative card bg-base-100/80 backdrop-blur-xl shadow-2xl border border-primary/10 rounded-3xl">
            <div className="card-body p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Enhanced Email/Username Input */}
                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-bold text-base-content flex items-center space-x-2">
                      <User className="w-4 h-4 text-primary" />
                      <span>Email or Username</span>
                    </span>
                  </label>
                  <div className="relative group">
                    <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                      inputFocus.identifier ? 'text-primary scale-110' : 'text-primary/60'
                    }`}>
                      {isEmail ? (
                        <User className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <input
                      type="text"
                      name="identifier"
                      value={loginData.identifier}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('identifier')}
                      onBlur={() => handleBlur('identifier')}
                      placeholder="Enter your email or username"
                      className={`input input-bordered w-full pl-12 text-base h-14 transition-all duration-300 rounded-2xl ${
                        inputFocus.identifier 
                          ? 'input-primary bg-primary/5 border-primary/50 shadow-lg' 
                          : 'bg-base-200/50 hover:bg-base-200 border-base-300 hover:border-primary/30'
                      }`}
                      required
                    />
                    <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 ${
                      inputFocus.identifier ? 'ring-2 ring-primary/20' : ''
                    }`}></div>
                    
                    {/* Input type indicator */}
                    {loginData.identifier && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                          isEmail 
                            ? 'bg-primary/10 text-primary border border-primary/20' 
                            : 'bg-secondary/10 text-secondary border border-secondary/20'
                        }`}>
                          {isEmail ? 'Email' : 'Username'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Password Input */}
                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-bold text-base-content flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-primary" />
                      <span>Password</span>
                    </span>
                  </label>
                  <div className="relative group">
                    <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                      inputFocus.password ? 'text-primary scale-110' : 'text-primary/60'
                    }`} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={loginData.password}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('password')}
                      onBlur={() => handleBlur('password')}
                      placeholder="Enter your password"
                      className={`input input-bordered w-full pl-12 pr-12 text-base h-14 transition-all duration-300 rounded-2xl ${
                        inputFocus.password 
                          ? 'input-primary bg-primary/5 border-primary/50 shadow-lg' 
                          : 'bg-base-200/50 hover:bg-base-200 border-base-300 hover:border-primary/30'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-primary/10 transition-all duration-200 group"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
                      )}
                    </button>
                    <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 ${
                      inputFocus.password ? 'ring-2 ring-primary/20' : ''
                    }`}></div>
                  </div>
                </div>

                {/* Enhanced Login Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn w-full h-14 text-base font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl relative overflow-hidden group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-0 text-white"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  {isPending ? (
                    <div className="flex items-center space-x-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Signing you in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  )}
                </button>
              </form>

              {/* Enhanced Sign Up Section */}
              <div className="mt-8 pt-6 border-t border-base-300/50">
                <div className="text-center space-y-4">
                  <p className="text-base-content/70 font-medium">
                    New to RelatieM?
                  </p>
                  <Link
                    to="/signup" 
                    className="btn btn-outline btn-primary w-full h-12 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <span>Create your account</span>
                    <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default LoginPage;
