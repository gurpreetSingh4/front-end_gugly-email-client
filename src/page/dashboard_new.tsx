import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { ThemeToggle } from "../components/ui/theme-toggle";
import { Button } from "../components/ui/button";
import {
  Mail,
  Inbox,
  Send,
  Star,
  File,
  Trash2,
  Menu,
  Search,
  Plus,
  Settings,
  User,
  LogOut,
  SunMoon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { RegisteredEmails } from "../components/RegisteredEmails";

export default function Dashboard() {
  const { user, logoutMutation } = useAuth();
  console.log("pta cle ga user h bhi kyanehi",user)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } hidden md:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300`}
      >
        <div className="flex items-center p-4 h-16">
          {sidebarOpen ? (
            <div className="flex items-center space-x-2">
              <Mail className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">GuglyMail</span>
            </div>
          ) : (
            <Mail className="h-6 w-6 text-primary mx-auto" />
          )}
        </div>

        <Button onClick={() => {}} className="mx-4 my-4">
          <Plus className="h-4 w-4 mr-2" />
          {sidebarOpen ? "Compose" : ""}
        </Button>

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              !sidebarOpen && "justify-center px-0"
            }`}
          >
            <Inbox className="h-5 w-5 mr-3" />
            {sidebarOpen && <span>Inbox</span>}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              !sidebarOpen && "justify-center px-0"
            }`}
          >
            <Star className="h-5 w-5 mr-3" />
            {sidebarOpen && <span>Starred</span>}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              !sidebarOpen && "justify-center px-0"
            }`}
          >
            <Send className="h-5 w-5 mr-3" />
            {sidebarOpen && <span>Sent</span>}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              !sidebarOpen && "justify-center px-0"
            }`}
          >
            <File className="h-5 w-5 mr-3" />
            {sidebarOpen && <span>Drafts</span>}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              !sidebarOpen && "justify-center px-0"
            }`}
          >
            <Trash2 className="h-5 w-5 mr-3" />
            {sidebarOpen && <span>Trash</span>}
          </Button>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            onClick={toggleSidebar}
            className="w-full justify-start"
          >
            <Menu className="h-5 w-5 mr-3" />
            {sidebarOpen && <span>Collapse</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="md:hidden flex items-center space-x-2">
              <Mail className="h-6 w-6 text-primary" />
              <span className="font-semibold">GuglyMail</span>
            </div>
            <div className="hidden md:flex relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 max-w-[400px] bg-gray-50 dark:bg-gray-700"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-400 text-white">
                    {user?.fullName
                      ? user.fullName
                      : user?.fullName?.[0]?.toUpperCase() || "U"}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.fullName || "User"}
                    </p>
                    <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-gray-800/50 dark:bg-black/50">
            <div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Mail className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">GuglyMail</span>
                </div>
                <button onClick={toggleMobileMenu}>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <Button onClick={() => {}} className="w-full mb-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Compose
                </Button>
                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <Inbox className="h-5 w-5 mr-3" />
                    <span>Inbox</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Star className="h-5 w-5 mr-3" />
                    <span>Starred</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Send className="h-5 w-5 mr-3" />
                    <span>Sent</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <File className="h-5 w-5 mr-3" />
                    <span>Drafts</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Trash2 className="h-5 w-5 mr-3" />
                    <span>Trash</span>
                  </Button>
                </nav>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start items-center"
                  >
                    <User className="h-5 w-5 mr-3" />
                    <span>Profile</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start items-center"
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    <span>Settings</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start items-center"
                  >
                    <SunMoon className="h-5 w-5 mr-3" />
                    <span>Theme</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start items-center text-red-500 dark:text-red-400"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>Log out</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Welcome to GuglyMail</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Your intelligent email client powered by AI. Get started by
                  exploring your inbox or composing a new message.
                </p>
                <h2 className="text-xl font-bold mb-4">
                  Your Connected Emails
                </h2>
                <div className="space-y-4">
                  
                  {user && <RegisteredEmails userId={String(user.id)} />}
                </div>
                {/* <div className="flex gap-3">
                  <a href="/email">
                    <Button>Go to Email Dashboard</Button>
                  </a>
                </div> */}
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Email Intelligence</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Experience the power of AI in your email workflow:
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300 mb-4">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Smart email composition with AI assistance
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Automatic email categorization and tagging
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Smart reply suggestions for faster responses
                  </li>
                </ul>
                <a
                  href="/email"
                  className="text-primary hover:text-primary-600 font-medium"
                >
                  Try it now →
                </a>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">AI Tools</h2>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <span>AI Writing Assistant</span>
                  </li>
                  <li className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    </div>
                    <span>Smart Scheduling</span>
                  </li>
                  <li className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <span>Template Manager</span>
                  </li>
                  <li className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z" />
                        <path d="M7 22V7H2.3a1 1 0 0 0-1 1.1l.8 8a2 2 0 0 0 2 1.9z" />
                      </svg>
                    </div>
                    <span>Smart Reply</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Recent Emails</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">Team Updates</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        10:30 AM
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Weekly project status and upcoming deadlines for the
                      marketing campaign...
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded px-2 py-1 mr-2">
                        Work
                      </span>
                      <span className="inline-block bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 rounded px-2 py-1">
                        Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <a href="/email">View All Emails</a>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
