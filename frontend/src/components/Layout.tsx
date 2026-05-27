import { Link, NavLink, Outlet } from "react-router-dom";
import { Bell, Bot, CloudSun, LayoutDashboard, Leaf, LogOut, Moon, Shield, Sprout, SunMedium, TestTube2 } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/disease", label: "Disease", icon: Leaf },
  { to: "/soil", label: "Soil", icon: TestTube2 },
  { to: "/weather", label: "Weather", icon: CloudSun },
  { to: "/chatbot", label: "Chatbot", icon: Bot },
  { to: "/admin", label: "Admin", icon: Shield }
];

export function Layout() {
  const [dark, setDark] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { signOut } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const notifications = [
    { title: "Irrigation window", description: "Optimal watering scheduled for 10:30 AM." },
    { title: "Disease scan ready", description: "New crop image analysis is available." },
    { title: "Soil health alert", description: "pH is slightly acidic in Block 4." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-950 lg:block">
        <Link to="/" className="flex items-center gap-3 px-2 text-xl font-semibold">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-field text-white"><Sprout size={22} /></span>
          AgriNexus AI
        </Link>
        <nav className="mt-8 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                  isActive ? "bg-green-50 text-field dark:bg-green-950/50 dark:text-green-300" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 flex items-start bg-slate-900/40 lg:hidden">
          <div className="w-72 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 text-lg font-semibold">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-field text-white"><Sprout size={20} /></span>
                AgriNexus AI
              </Link>
              <button className="rounded-lg border border-slate-200 p-2 dark:border-slate-800" onClick={() => setMobileNavOpen(false)} aria-label="Close menu">×</button>
            </div>
            <nav className="mt-8 space-y-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                      isActive ? "bg-green-50 text-field dark:bg-green-950/50 dark:text-green-300" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                    )
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex-1" onClick={() => setMobileNavOpen(false)} />
        </div>
      ) : null}

      {notificationsOpen ? (
        <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md border-l border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-950 lg:w-96">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Notifications</p>
              <h2 className="text-lg font-semibold">Actionable alerts</h2>
            </div>
            <button className="rounded-lg border border-slate-200 p-2 dark:border-slate-800" onClick={() => setNotificationsOpen(false)} aria-label="Close notifications">×</button>
          </div>
          <div className="mt-4 space-y-3">
            {notifications.map((notice) => (
              <div key={notice.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{notice.title}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{notice.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 lg:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Smart Agriculture Intelligence Platform</p>
              <h1 className="text-lg font-semibold">Farm operations command center</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-slate-200 p-2 dark:border-slate-800" onClick={() => setNotificationsOpen((value) => !value)} aria-label="Toggle notifications"><Bell size={18} /></button>
            <button className="rounded-lg border border-slate-200 p-2 dark:border-slate-800" onClick={() => setDark((value) => !value)} aria-label="Toggle theme">
              {dark ? <SunMedium size={18} /> : <Moon size={18} />}
            </button>
            <button className="rounded-lg border border-slate-200 p-2 dark:border-slate-800" onClick={signOut} aria-label="Sign out"><LogOut size={18} /></button>
          </div>
        </header>
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
