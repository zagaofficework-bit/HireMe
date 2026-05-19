// // src/features/auth/pages/ProfilePage.jsx
// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import useAuth from '../services/useAuth';
// import { fetchMe } from '../services/auth.slice';

// const ProfilePage = () => {
//   const { user, loading, logout } = useAuth();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!user) {
//       dispatch(fetchMe());
//     }
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#0d0a1f] flex items-center justify-center">
//         <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#0d0a1f] flex flex-col items-center justify-center px-4">
//       {/* Header */}
//       <div className="fixed top-0 left-0 right-0 h-14 bg-[#0d0a1f]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-50">
//         <span className="text-white font-extrabold tracking-[0.25em] text-sm">NEON</span>
//         <button
//           onClick={handleLogout}
//           className="text-purple-400 hover:text-red-400 text-xs font-semibold tracking-widest transition-colors"
//         >
//           LOGOUT
//         </button>
//       </div>

//       {/* Card */}
//       <div className="mt-14 w-full max-w-md bg-[#160d2e] border border-white/10 rounded-2xl px-8 py-10 shadow-2xl shadow-purple-950/60">
//         {/* Avatar */}
//         <div className="flex justify-center mb-6">
//           <div className="w-20 h-20 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
//             <span className="text-3xl font-extrabold text-purple-300">
//               {user?.name?.charAt(0)?.toUpperCase() || '?'}
//             </span>
//           </div>
//         </div>

//         <h1 className="text-white text-2xl font-extrabold text-center mb-1">
//           {user?.name || 'Loading…'}
//         </h1>
//         <p className="text-purple-400/70 text-sm text-center mb-7">
//           Your profile is set up and ready.
//         </p>

//         <div className="space-y-3">
//           {[
//             { label: 'Email', value: user?.email || '—', icon: '✉' },
//             { label: 'Phone', value: user?.phone || '—', icon: '📱' },
//           ].map(({ label, value, icon }) => (
//             <div key={label} className="flex items-center gap-3 bg-[#0d0a1f] border border-white/8 rounded-lg px-4 py-3">
//               <span className="text-lg">{icon}</span>
//               <div>
//                 <p className="text-purple-400/60 text-xs font-semibold">{label}</p>
//                 <p className="text-white text-sm">{value}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;