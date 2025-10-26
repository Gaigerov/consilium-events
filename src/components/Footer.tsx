import {Phone, MapPin} from "lucide-react";

interface FooterProps {
    currentView: 'list' | 'calendar' | 'photos' | 'contacts' | 'admin';
    onViewChange: (view: 'list' | 'calendar' | 'photos' | 'contacts' | 'admin') => void;
}

export default function Footer({onViewChange}: FooterProps) {
    const navigationItems = [
        {key: 'list', label: 'Мероприятия', value: 'list' as const},
        {key: 'photos', label: 'Фотоотчеты', value: 'photos' as const},
        {key: 'contacts', label: 'Контакты', value: 'contacts' as const}
    ];

    return (
        <footer className="w-full mt-auto">
            <div className="container mx-auto px-4">
                {/* Градиентная рамка wrapper */}
                <div
                    className="p-[5px] rounded-t-[32px]"
                    style={{
                        background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.5), rgba(66, 200, 187, 0.5), rgba(13, 81, 136, 0.5))'
                    }}
                >
                    {/* Основной контейнер с frosted glass эффектом */}
                    <div className="bg-white/95 backdrop-blur-md rounded-t-[28px] px-6 py-8 md:px-12 md:py-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Левая колонка: Контакты */}
                            <div className="space-y-4">
                                <h3 className="text-gray-900 font-medium">Контактная информация</h3>

                                <div className="space-y-3 text-gray-700">
                                    {/* Адрес */}
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-[#34c759] flex-shrink-0 mt-0.5" />
                                        <p className="text-sm leading-relaxed">
                                            199034, г. Санкт-Петербург,<br />
                                            Большой пр-т ВО, д. 16/14 лит. Б,<br />
                                            пом. 4-Н, офис №7
                                        </p>
                                    </div>

                                    {/* Телефон */}
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-[#34c759] flex-shrink-0" />
                                        <a
                                            href="tel:+78123859626"
                                            className="text-sm hover:text-[#34c759] transition-colors"
                                        >
                                            +7 (812) 385-96-26
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Центральная колонка: Навигация */}
                            <div className="space-y-4">
                                <h3 className="text-gray-900 font-medium">Разделы</h3>
                                <nav className="flex flex-col space-y-2">
                                    {navigationItems.map((item) => (
                                        <button
                                            key={item.key}
                                            onClick={() => onViewChange(item.value)}
                                            className="text-sm text-gray-600 hover:text-[#34c759] transition-colors text-left cursor-pointer"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Правая колонка: Дополнительная информация */}
                            <div className="space-y-4">
                                <h3 className="text-gray-900 font-medium">О платформе</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Единое передовое медицинское пространство для непрерывного развития и поддержки медицинских специалистов России.
                                </p>
                            </div>
                        </div>

                        {/* Нижняя часть: Copyright */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-xs text-gray-500 text-center">
                                © {new Date().getFullYear()} Консилиум. Все права защищены.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
