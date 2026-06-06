export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Cosmic background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0e0a1a] to-[#0a0a0f]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-900/10 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-500" />
            <span className="font-semibold tracking-tight">Chromatic Design Studios</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Dashboard</a>
            <a href="#" className="hover:text-white transition-colors">Assets</a>
            <a href="#" className="hover:text-white transition-colors">Prompts</a>
            <a href="#" className="hover:text-white transition-colors">Agents</a>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center space-y-8 py-20">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight glow-text">
            AI Design
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-white bg-clip-text text-transparent">
              Control Center
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Orchestrate models, prompts, agents, and visual assets from one
            local-first workspace. Built for teams that ship.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 transition-colors font-medium">
              Open Dashboard
            </button>
            <button className="px-6 py-3 rounded-xl glass hover:bg-white/5 transition-colors font-medium">
              Read the PDR
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 text-xs text-gray-500 flex justify-between">
          <span>Chromatic Design Studios v0.1.0</span>
          <span>Chromatic Harness</span>
        </div>
      </footer>
    </div>
  );
}
