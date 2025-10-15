import {useState} from "react";
import Header from "./components/Header";
import EventsList from "./components/EventsList";
import EventCalendar from "./components/EventCalendar";
import PhotoReports from "./components/PhotoReports";
import Contacts from "./components/Contacts";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import AdminPanel from "./components/AdminPanel";
import SocialLogin from "./components/SocialLogin";
import YouTubeModal, {YouTubeModalEvent} from "./components/YouTubeModal";
import YandexMetrica from "./components/YandexMetrica";
import AnalyticsTracker, {
    trackEventView,
    trackEventRegistration,
    trackStreamStart,
    trackSocialLogin,
    trackNavigation
} from "./components/AnalyticsTracker";
import {toast} from "sonner";
import {Toaster} from "./components/ui/sonner";

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    endDate?: string; // Дата окончания для многодневных мероприятий
    startTime: string;
    endTime: string;
    location: string;
    image: string;
    category: "event" | "exhibition";
    isLive: boolean;
    youtubeVideoId?: string;
    registeredCount: number;
    maxCapacity: number;
    price: number;
}

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    isAdmin?: boolean;
}

// Примеры мероприятий (выставки исключены)
const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

const getCurrentTime = () => {
    const now = new Date();
    // Текущее время минус 30 минут для начала
    const startTime = new Date(now.getTime() - 30 * 60000);
    // Текущее время плюс 2 часа для окончания
    const endTime = new Date(now.getTime() + 2 * 60 * 60000);

    return {
        start: startTime.toTimeString().slice(0, 5),
        end: endTime.toTimeString().slice(0, 5)
    };
};

const times = getCurrentTime();

const mockEvents: Event[] = [
    {
        id: "1_live",
        title: "Онлайн-конференция по цифровым технологиям",
        description: "Прямая трансляция ведущих экспертов в области цифровой трансформации и инноваций. Обсуждение актуальных трендов и технологий будущего.",
        date: getTodayDate(),
        startTime: times.start,
        endTime: times.end,
        location: "Онлайн трансляция",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
        category: "event",
        isLive: true,
        youtubeVideoId: "dQw4w9WgXcQ",
        registeredCount: 127,
        maxCapacity: 500,
        price: 0
    },
    {
        id: "2",
        title: "Конференция по технологиям будущего",
        description: "Ведущие эксперты обсудят последние достижения в области искусственного интеллекта, машинного обучения и квантовых вычислений.",
        date: "2025-01-20",
        startTime: "10:00",
        endTime: "18:00",
        location: "Технопарк Сколково",
        image: "https://images.unsplash.com/photo-1576085898323-218337e3e43c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwZXZlbnQlMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzU4OTA1MTU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        category: "event",
        isLive: false,
        youtubeVideoId: "jNQXAC9IVRw",
        registeredCount: 230,
        maxCapacity: 300,
        price: 0
    },
    {
        id: "3",
        title: "Классическая музыка: вечер камерных произведений",
        description: "Выступление камерного оркестра с программой из произведений Моцарта, Бетховена и современных композиторов.",
        date: "2025-01-25",
        startTime: "19:30",
        endTime: "22:00",
        location: "Консерватория им. Чайковского",
        image: "https://images.unsplash.com/photo-1558634986-2103d9d53bb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25jZXJ0JTIwaGFsbHxlbnwxfHx8fDE3NTg5Nzg0ODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
        category: "event",
        isLive: false,
        youtubeVideoId: "9E6b3swbnWg",
        registeredCount: 180,
        maxCapacity: 200,
        price: 1500
    },
    {
        id: "4",
        title: "Мастер-класс по цифровому дизайну",
        description: "Практический воркшоп по созданию современных интерфейсов и работе с инструментами дизайна.",
        date: "2025-01-28",
        startTime: "14:00",
        endTime: "17:00",
        location: "Креативное пространство 'Факел'",
        image: "https://images.unsplash.com/photo-1580893196685-f061a838ba99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwd29ya3Nob3B8ZW58MXx8fHwxNzU4OTc4NDgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        category: "event",
        isLive: true,
        youtubeVideoId: "uHKfrz65KSU",
        registeredCount: 15,
        maxCapacity: 25,
        price: 2500
    },
    {
        id: "5",
        title: "Книжная ярмарка и встреча с авторами",
        description: "Крупнейшая книжная ярмарка города с презентациями новых изданий и автограф-сессиями известных писателей.",
        date: "2025-01-12",
        startTime: "11:00",
        endTime: "19:00",
        location: "Центральная библиотека",
        image: "https://images.unsplash.com/photo-1718745015015-09cd064a263b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwZmFpciUyMGxpdGVyYXR1cmV8ZW58MXx8fHwxNzU4OTc4NzU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
        category: "event",
        isLive: false,
        youtubeVideoId: "kJQP7kiw5Fk",
        registeredCount: 85,
        maxCapacity: 150,
        price: 0
    },
    {
        id: "6",
        title: "Балет 'Лебединое озеро'",
        description: "Классическая постановка балета в исполнении театра оперы и балета с участием приглашенных солистов.",
        date: "2025-01-18",
        startTime: "19:00",
        endTime: "21:30",
        location: "Большой театр",
        image: "https://images.unsplash.com/photo-1524330685423-3e1966445abe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZSUyMHBlcmZvcm1hbmNlJTIwc3RhZ2V8ZW58MXx8fHwxNzU4ODk5MTk5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        category: "event",
        isLive: true,
        youtubeVideoId: "9rJoB7y6Ncs",
        registeredCount: 420,
        maxCapacity: 500,
        price: 3500
    },
    {
        id: "7",
        title: "Международный кинофестиваль",
        description: "Трехдневный фестиваль независимого кино с показами авторских фильмов, встречами с режиссерами и мастер-классами.",
        date: "2025-01-15",
        endDate: "2025-01-17",
        startTime: "12:00",
        endTime: "23:00",
        location: "Киноцентр 'Октябрь'",
        image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBmaWxtJTIwZmVzdGl2YWx8ZW58MXx8fHwxNzU4OTA1MTU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        category: "event",
        isLive: false,
        youtubeVideoId: "dQw4w9WgXcQ",
        registeredCount: 145,
        maxCapacity: 200,
        price: 1000
    },
    {
        id: "8",
        title: "Фестиваль уличной культуры",
        description: "Двухдневный фестиваль с выступлениями артистов, граффити, брейк-данс баттлами и DJ-сетами.",
        date: "2025-01-22",
        endDate: "2025-01-23",
        startTime: "14:00",
        endTime: "22:00",
        location: "Парк Горького",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBmZXN0aXZhbHxlbnwxfHx8fDE3NTg5MDUxNTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        category: "event",
        isLive: true,
        youtubeVideoId: "jNQXAC9IVRw",
        registeredCount: 320,
        maxCapacity: 500,
        price: 0
    }
];

export default function App() {
    const [currentView, setCurrentView] = useState<'list' | 'calendar' | 'photos' | 'contacts' | 'analytics' | 'admin'>('list');
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
    const [events, setEvents] = useState<Event[]>(mockEvents);
    const [youtubeModal, setYoutubeModal] = useState<{
        isOpen: boolean;
        event: YouTubeModalEvent | null;
    }>({isOpen: false, event: null});

    // ID счетчика Яндекс.Метрики (замените на свой)
    const YANDEX_METRICA_ID = 94567890;

    const handleLogin = (provider: string, userData: User) => {
        // Проверка администратора по email
        const adminUser = userData.email === 'gaigerov@gmail.com' ? {...userData, isAdmin: true} : userData;

        setUser(adminUser);
        trackSocialLogin(provider, userData.id);

        // Сообщения в зависимости от провайдера
        const providerNames = {
            google: 'Google',
            github: 'GitHub',
            yandex: 'Яндекс',
            vk: 'ВКонтакте'
        };

        const providerName = providerNames[provider as keyof typeof providerNames] || provider;
        const adminMessage = adminUser.isAdmin ? " (Администратор)" : "";
        toast.success(`Добро пожаловать, ${userData.name}${adminMessage}! Вход через ${providerName}`);
    };

    const handleLogout = () => {
        const userName = user?.name || 'Пользователь';
        setUser(null);
        setRegisteredEvents([]);
        setCurrentView('list');
        toast.success(`До свидания, ${userName}!`);
    };

    const handleRegister = (eventId: string) => {
        if (!user) {
            setIsLoginOpen(true);
            return;
        }

        const event = events.find(e => e.id === eventId);
        if (!event) return;

        if (registeredEvents.includes(eventId)) {
            toast.info("Вы уже зарегистрированы на это мероприятие");
            return;
        }

        setRegisteredEvents(prev => [...prev, eventId]);

        // Обновляем счетчик регистраций
        setEvents(prev => prev.map(e =>
            e.id === eventId ? {...e, registeredCount: e.registeredCount + 1} : e
        ));

        trackEventRegistration(eventId, event.title, user.id);
        toast.success(`Вы зарегистрированы на "${event.title}"`);
    };

    const handleWatchStream = (event: Event) => {
        // Проверка доступа к LIVE трансляции
        if (event.isLive && !user) {
            setIsLoginOpen(true);
            toast.info("Для просмотра прямой трансляции необходимо войти в аккаунт");
            return;
        }

        trackStreamStart(event.id, event.title, user?.id);

        // Преобразуем Event в YouTubeModalEvent
        const modalEvent: YouTubeModalEvent = {
            id: event.id,
            title: event.title,
            youtubeVideoId: event.youtubeVideoId,
            isLive: event.isLive
        };

        setYoutubeModal({isOpen: true, event: modalEvent});
    };

    const handleViewChange = (view: 'list' | 'calendar' | 'photos' | 'contacts' | 'analytics' | 'admin') => {
        setCurrentView(view);
        trackNavigation(view, user?.id);
    };

    // CRUD операции для админ-панели
    const handleEventAdd = (newEvent: Omit<Event, 'id' | 'registeredCount'>) => {
        const event: Event = {
            ...newEvent,
            id: Date.now().toString(),
            registeredCount: 0
        };
        setEvents(prev => [...prev, event]);
    };

    const handleEventUpdate = (eventId: string, updatedData: Partial<Event>) => {
        setEvents(prev => prev.map(event =>
            event.id === eventId ? {...event, ...updatedData} : event
        ));
    };

    const handleEventDelete = (eventId: string) => {
        setEvents(prev => prev.filter(event => event.id !== eventId));
        setRegisteredEvents(prev => prev.filter(id => id !== eventId));
    };

    return (
        <div className="min-h-screen" style={{background: 'var(--background)'}}>
            <Header
                onLoginClick={() => setIsLoginOpen(true)}
                onLogout={handleLogout}
                isLoggedIn={!!user}
                userAvatar={user?.avatar}
                userName={user?.name}
                currentView={currentView}
                onViewChange={handleViewChange}
                showAnalytics={!!user}
                isAdmin={user?.isAdmin}
            />

            <main className="container mx-auto px-4 py-6">
                {currentView === 'list' && (
                    <EventsList
                        events={events}
                        onRegister={handleRegister}
                        onWatchStream={handleWatchStream}
                        registeredEvents={registeredEvents}
                        isLoggedIn={!!user}
                        onViewChange={handleViewChange}
                    />
                )}
                {currentView === 'calendar' && (
                    <EventCalendar
                        events={events}
                        onRegister={handleRegister}
                        onWatchStream={handleWatchStream}
                        registeredEvents={registeredEvents}
                        isLoggedIn={!!user}
                    />
                )}
                {currentView === 'photos' && <PhotoReports />}
                {currentView === 'contacts' && <Contacts />}
                {currentView === 'analytics' && user && (
                    <AnalyticsDashboard events={events} />
                )}
                {currentView === 'admin' && user?.isAdmin && (
                    <AdminPanel
                        events={events}
                        onEventAdd={handleEventAdd}
                        onEventUpdate={handleEventUpdate}
                        onEventDelete={handleEventDelete}
                    />
                )}
            </main>

            <SocialLogin
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onLogin={handleLogin}
            />

            <YouTubeModal
                isOpen={youtubeModal.isOpen}
                onClose={() => setYoutubeModal({isOpen: false, event: null})}
                event={youtubeModal.event}
                isLoggedIn={!!user}
                onLogin={() => setIsLoginOpen(true)}
            />

            <Toaster />

            {/* Интеграция Яндекс.Метрики */}
            <YandexMetrica counterId={YANDEX_METRICA_ID} />
            <AnalyticsTracker counterId={YANDEX_METRICA_ID} />
        </div>
    );
}
