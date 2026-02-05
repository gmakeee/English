import { Home, BookOpen, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const BottomNav = () => {
    const navItems = [
        { icon: Home, label: 'Главная', path: '/' },
        { icon: BookOpen, label: 'Учить', path: '/learn' },
        { icon: User, label: 'Профиль', path: '/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#212121] border-t border-[--tg-theme-hint-color]/10 px-6 py-2 pb-safe z-50">
            <div className="flex justify-around items-center max-w-md mx-auto">
                {navItems.map(({ icon: Icon, label, path }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            clsx(
                                "flex flex-col items-center gap-1 p-2 transition-colors",
                                isActive ? "text-tg-button" : "text-tg-hint hover:text-tg-text"
                            )
                        }
                    >
                        <Icon size={24} />
                        <span className="text-xs font-medium">{label}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default BottomNav;
