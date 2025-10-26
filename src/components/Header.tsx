import {useState} from "react";
import {Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription} from "./ui/sheet";
import {LogIn, Menu, LogOut} from "lucide-react";
import Logo from "./Logo";

interface HeaderProps {
    onLoginClick: () => void;
    onLogout?: () => void;
    isLoggedIn: boolean;
    userAvatar?: string;
    userName?: string;
    currentView: 'list' | 'calendar' | 'photos' | 'contacts' | 'admin';
    onViewChange: (view: 'list' | 'calendar' | 'photos' | 'contacts' | 'admin') => void;
    isAdmin?: boolean;
}

export default function Header({onLoginClick, onLogout, isLoggedIn, currentView, onViewChange, isAdmin = false}: HeaderProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const navigationItems = [
        {key: 'list', label: 'Мероприятия', value: 'list' as const},
        {key: 'photos', label: 'Фотоотчеты', value: 'photos' as const},
        {key: 'contacts', label: 'Контакты', value: 'contacts' as const},
        ...(isAdmin ? [{key: 'admin', label: 'Админ', value: 'admin' as const}] : [])
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-transparent">
            <div className="container mx-auto px-4 py-4 bg-transparent">
                {/* Градиентная рамка wrapper */}
                <div
                    className="p-[5px] rounded-full"
                    style={{
                        background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.5), rgba(66, 200, 187, 0.5), rgba(13, 81, 136, 0.5))'
                    }}
                >
                    {/* Основной контейнер с адаптивным flex */}
                    <div className="relative flex items-center justify-between min-h-16 bg-white/95 backdrop-blur-md rounded-full px-4 py-2">
                        {/* Логотип */}
                        <div className="flex-shrink-0">
                            <Logo onClick={() => onViewChange('list')} />
                        </div>

                        {/* Навигация только для экранов шире 1099px - центрирование */}
                        <nav className="hidden min-[1100px]:flex items-center justify-center h-full">
                            <div className="flex items-center justify-center gap-x-2 lg:gap-x-4">
                                {navigationItems.map((item) => (
                                    <button
                                        key={item.key}
                                        onClick={() => onViewChange(item.value)}
                                        className={`
                                            nav-item whitespace-nowrap px-3 py-2 text-sm lg:text-base transition-all duration-200 cursor-pointer rounded-lg
                                            ${currentView === item.value
                                                ? 'text-primary font-medium bg-primary/10'
                                                : 'text-muted-foreground hover:text-primary hover:bg-gray-100'
                                            }
                                        `}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </nav>

                        {/* Правая группа: мобильное меню и иконка входа/выхода */}
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            {/* Иконка Вход/Выход */}
                            {isLoggedIn ? (
                                <button
                                    onClick={onLogout}
                                    className="flex items-center justify-center w-10 h-10 text-white rounded-full transition-colors cursor-pointer shadow-md"
                                    style={{backgroundColor: '#003366'}}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0055aa'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003366'}
                                    title="Выйти"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="sr-only">Выйти</span>
                                </button>
                            ) : (
                                <button
                                    onClick={onLoginClick}
                                    className="flex items-center justify-center w-10 h-10 text-white rounded-full transition-colors cursor-pointer shadow-md"
                                    style={{backgroundColor: '#003366'}}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0055aa'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003366'}
                                    title="Войти"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span className="sr-only">Войти</span>
                                </button>
                            )}

                            {/* Бургер-меню для экранов до 1099px */}
                            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                                <SheetTrigger asChild>
                                    <button
                                        className="min-[1100px]:hidden flex items-center justify-center w-10 h-10 text-white rounded-full transition-colors cursor-pointer shadow-md"
                                        style={{backgroundColor: '#003366'}}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0055aa'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003366'}
                                    >
                                        <Menu className="w-4 h-4" />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[300px] sm:w-[400px] rounded-l-2xl bg-white/95 backdrop-blur-xl p-0 border-0 overflow-hidden">
                                    <div className="absolute inset-0 rounded-l-2xl p-[5px]" style={{background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.5), rgba(66, 200, 187, 0.5), rgba(13, 81, 136, 0.5))'}}>
                                        <div className="h-full w-full bg-white/95 backdrop-blur-xl rounded-l-2xl p-6">
                                            <SheetTitle className="sr-only">Навигационное меню</SheetTitle>
                                            <SheetDescription className="sr-only">
                                                Выберите раздел для навигации по сайту
                                            </SheetDescription>
                                            <div className="flex flex-col h-full justify-center">
                                                <h3 className="text-gray-900 font-medium text-xl mb-6 text-center px-4">Навигация</h3>
                                                <div className="space-y-2">
                                                    {navigationItems.map((item) => (
                                                        <button
                                                            key={item.key}
                                                            onClick={() => {
                                                                onViewChange(item.value);
                                                                setIsSheetOpen(false);
                                                            }}
                                                            className={`w-full text-center py-4 px-6 transition-all duration-200 cursor-pointer rounded-lg ${currentView === item.value
                                                                    ? 'bg-primary/10 text-primary font-medium border border-primary/30'
                                                                    : 'text-gray-700 hover:bg-black/10 hover:text-gray-900'
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
                                                            className="w-full text-center py-4 px-6 transition-all duration-200 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg mt-4 cursor-pointer hover:border-red-300"
                                                        >
                                                            <div className="flex items-center justify-center space-x-2">
                                                                <LogOut className="w-4 h-4" />
                                                                <span>Выйти</span>
                                                            </div>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
