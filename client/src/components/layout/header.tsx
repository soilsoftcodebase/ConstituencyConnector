import { useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/hooks/use-app-store';
import ministerPhoto from '@/assets/minister-photo.png';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { setSearchQuery, setCurrentModal } = useAppStore();
  const [searchValue, setSearchValue] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchValue);
  };

  return (
    <div className="relative z-10 flex flex-shrink-0 h-16 bg-white shadow">
      <button 
        onClick={toggleSidebar}
        className="px-4 text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-600 md:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>
      
      <div className="flex items-center justify-between flex-1 px-4">
        <div className="flex items-center flex-1">
          <form className="w-full max-w-xl lg:max-w-2xl" onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <Input
                className="block w-full py-2 pl-10 pr-3 text-sm placeholder-gray-500 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search requests, people, or issues..."
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </form>
        </div>
        
        <div className="flex items-center ml-4 md:ml-6">
          <Button
            size="icon"
            variant="ghost"
            className="relative p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-destructive rounded-full"></span>
          </Button>

          {/* Profile */}
          <div className="relative ml-3">
            <Button variant="ghost" size="icon" className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 hover:ring-2 hover:ring-primary-200">
              <span className="sr-only">Open user menu</span>
              <Avatar className="h-9 w-9 border-2 border-primary-100">
                <AvatarImage 
                  src={ministerPhoto}
                  alt="Minister Pemmansani Chandra Shekar"
                />
                <AvatarFallback className="bg-primary-50 text-primary-700">PCS</AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
