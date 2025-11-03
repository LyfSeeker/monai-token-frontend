export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0015] relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-violet-900/40 to-fuchsia-900/40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
      
      <div className="relative z-10 text-center space-y-8">
        {/* Dual spinning rings */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 w-24 h-24 border-8 border-purple-500/30 border-t-fuchsia-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-24 h-24 border-8 border-transparent border-b-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-0 w-24 h-24 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-full blur-xl opacity-60"></div>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="space-y-3">
          <h2 className="text-3xl font-black bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-400 bg-clip-text text-transparent tracking-tight">
            Loading Dashboard
          </h2>
          <p className="text-purple-300/60 text-sm font-medium">Connecting to Monad Testnet...</p>
        </div>
      </div>
    </div>
  );
}
