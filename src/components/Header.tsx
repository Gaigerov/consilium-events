import {useState} from "react";
import {Button} from "./ui/button";
import {Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription} from "./ui/sheet";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "./ui/dropdown-menu";
import {LogIn, Menu, LogOut, User, Settings} from "lucide-react";
import {ImageWithFallback} from "./ImageWithFallback";
import Logo from "./Logo";

interface HeaderProps {
    onLoginClick: () => void;
    onLogout?: () => void;
    isLoggedIn: boolean;
    userAvatar?: string;
    userName?: string;
    currentView: 'list' | 'calendar' | 'photos' | 'contacts' | 'analytics' | 'admin';
    onViewChange: (view: 'list' | 'calendar' | 'photos' | 'contacts' | 'analytics' | 'admin') => void;
    showAnalytics?: boolean;
    isAdmin?: boolean;
}

export default function Header({onLoginClick, onLogout, isLoggedIn, userAvatar, userName, currentView, onViewChange, showAnalytics = false, isAdmin = false}: HeaderProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const navigationItems = [
        {key: 'list', label: 'Мероприятия', value: 'list' as const},
        {key: 'photos', label: 'Фотоотчеты', value: 'photos' as const},
        {key: 'contacts', label: 'Контакты', value: 'contacts' as const},
        ...(showAnalytics ? [{key: 'analytics', label: 'Аналитика', value: 'analytics' as const}] : []),
        ...(isAdmin ? [{key: 'admin', label: 'Админ', value: 'admin' as const}] : [])
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-transparent">
            <div className="container mx-auto px-4 py-4 bg-transparent">
                {/* Основной контейнер с адаптивным flex */}
                <div className="flex items-center justify-between min-h-16 gap-2 sm:gap-4 bg-white/95 backdrop-blur-md rounded-xl px-4 py-2 border-2 border-blue-500/50">
                    {/* Логотип */}
                    <div className="flex-shrink-0">
                        <Logo onClick={() => onViewChange('list')} />
                    </div>

                    {/* Навигация только для экранов шире 1099px */}
                    <nav className="hidden min-[1100px]:flex items-center flex-wrap justify-center gap-x-2 lg:gap-x-4 gap-y-1 flex-1 max-w-2xl mx-4">
                        {navigationItems.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => onViewChange(item.value)}
                                className={`
                  nav-item whitespace-nowrap px-3 py-2 text-sm lg:text-base transition-all duration-200 cursor-pointer
                  ${currentView === item.value
                                        ? 'text-primary font-medium border-b-2 border-primary'
                                        : 'text-muted-foreground hover:text-primary border-b-2 border-transparent'
                                    }
                `}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Правая группа: мобильное меню и профиль */}
                    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                        {/* Профиль/Вход */}
                        {isLoggedIn ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center space-x-2 p-2 hover:bg-accent rounded-full transition-colors cursor-pointer">
                                        <ImageWithFallback
                                            src={userAvatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                                            alt="User"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <span className="hidden sm:block text-sm">{userName || 'Профиль'}</span>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 z-50">
                                    <DropdownMenuLabel className="px-2 py-1.5">
                                        <div className="flex items-center space-x-2">
                                            <ImageWithFallback
                                                src={userAvatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                                                alt="User"
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{userName || 'Пользователь'}</p>
                                                {isAdmin && (
                                                    <p className="text-xs leading-none text-muted-foreground">Администратор</p>
                                                )}
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => onViewChange('list')} className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Мои мероприятия</span>
                                    </DropdownMenuItem>
                                    {isAdmin && (
                                        <DropdownMenuItem onClick={() => onViewChange('admin')} className="cursor-pointer">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Администрирование</span>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={onLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Выйти</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <button
                                onClick={onLoginClick}
                                className="flex items-center justify-center p-2 text-primary hover:text-primary/80 hover:bg-accent rounded-full transition-colors cursor-pointer"
                            >
                                <LogIn className="w-4 h-4" />
                                <span className="sr-only">Войти</span>
                            </button>
                        )}

                        {/* Бургер-меню для экранов до 1099px */}
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <button className="min-[1100px]:hidden p-2 hover:bg-accent rounded-full transition-colors cursor-pointer">
                                    <Menu className="w-4 h-4" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px] rounded-l-2xl bg-white">
                                <SheetTitle className="sr-only">Навигационное меню</SheetTitle>
                                <SheetDescription className="sr-only">
                                    Выберите раздел для навигации по сайту
                                </SheetDescription>
                                <div className="flex flex-col space-y-3 mt-8">
                                    {/* Профиль пользователя в мобильном меню */}
                                    {isLoggedIn && (
                                        <div className="flex items-center space-x-3 p-4 bg-accent/50 rounded-xl mb-4">
                                            <ImageWithFallback
                                                src={userAvatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                                                alt="User"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div className="flex flex-col">
                                                <p className="text-sm font-medium">{userName || 'Пользователь'}</p>
                                                {isAdmin && (
                                                    <p className="text-xs text-muted-foreground">Администратор</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <h3 className="font-medium text-xl mb-6 text-center">Навигация</h3>
                                    {navigationItems.map((item) => (
                                        <button
                                            key={item.key}
                                            onClick={() => {
                                                onViewChange(item.value);
                                                setIsSheetOpen(false);
                                            }}
                                            className={`text-left p-4 rounded-xl hover:bg-accent transition-all duration-200 cursor-pointer ${currentView === item.value ? 'bg-accent text-primary font-medium border border-primary/20' : 'hover:translate-x-1'
                                                }`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}

                                    {/* Кнопка выхода в мобильном меню */}
                                    {isLoggedIn && (
                                        <button
                                            onClick={() => {
                                                onLogout?.();
                                                setIsSheetOpen(false);
                                            }}
                                            className="text-left p-4 rounded-xl hover:bg-accent transition-all duration-200 text-red-600 hover:bg-red-50 border border-red-200 mt-4 cursor-pointer"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <LogOut className="w-4 h-4" />
                                                <span>Выйти</span>
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
