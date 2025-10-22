import {useState} from "react";
import Header from "./components/Header";
import EventsList from "./components/EventsList";
import EventCalendar from "./components/EventCalendar";
import PhotoReports from "./components/PhotoReports";
import Contacts from "./components/Contacts";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import AdminPanel from "./components/AdminPanel";
import SocialLogin from "./components/SocialLogin";
import VideoModal, {VideoModalEvent} from "./components/VideoModal";
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
    endDate?: string;
    startTime: string;
    endTime: string;
    location: string;
    image: string;
    category: "event" | "exhibition";
    isLive: boolean;
    youtubeVideoId?: string;
    rutubeVideoId?: string;
    videoPlatform?: "youtube" | "rutube";
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

const eventImg = '/consilium-events/images/Ganelina.png';
const gastroImg = '/consilium-events/images/gastroLeto.png';

const mockEvents: Event[] = [
    {
        id: "1_live",
        title: "Всероссийская научно-практическая конференция с международным участием «Ганелинские чтения»",
        description: "Очный формат с онлайн-трансляцией в режиме реального времени (время местное).",
        date: "2026-05-15",
        startTime: "10:00",
        endTime: "18:00",
        location: "Санкт-Петербург, отель «Московские Ворота» (Московский пр., д. 97A)",
        image: eventImg,
        category: "event",
        isLive: true,
        videoPlatform: "youtube",
        youtubeVideoId: "dQw4w9WgXcQ",
        registeredCount: 127,
        maxCapacity: 2000,
        price: 0
    },
    {
        id: "2",
        title: `Конференция «Гастро-лето-2025 на Неве»`,
        description: "Ведущие эксперты обсудят последние достижения в области искусственного интеллекта, машинного обучения и квантовых вычислений.",
        date: "2025-06-07",
        endDate: "2025-06-08",
        startTime: "10:00",
        endTime: "18:00",
        location: `Отель «Введенский», конференц-зал «Введенский», Большой проспект П.С., 37; Лофт «Вдохновение» переулок Пирогова,18;`,
        image: gastroImg,
        category: "event",
        isLive: false,
        rutubeVideoId: "56e75054070ae7eb0743b65e4587d77b",
        videoPlatform: "rutube",
        registeredCount: 300,
        maxCapacity: 300,
        price: 0
    },
];

export default function App() {
    const [currentView, setCurrentView] = useState<'list' | 'calendar' | 'photos' | 'contacts' | 'analytics' | 'admin'>('list');
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
    const [events, setEvents] = useState<Event[]>(mockEvents);
    const [videoModal, setVideoModal] = useState<{
        isOpen: boolean;
        event: VideoModalEvent | null;
    }>({isOpen: false, event: null});

    const YANDEX_METRICA_ID = 94567890;

    const handleLogin = (provider: string, userData: User) => {
        const adminUser = userData.email === 'gaigerov@gmail.com' ? {...userData, isAdmin: true} : userData;

        setUser(adminUser);
        trackSocialLogin(provider, userData.id);

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

        setEvents(prev => prev.map(e =>
            e.id === eventId ? {...e, registeredCount: e.registeredCount + 1} : e
        ));

        trackEventRegistration(eventId, event.title, user.id);
        toast.success(`Вы зарегистрированы на "${event.title}"`);
    };

    const handleWatchStream = (event: Event) => {
        if (event.isLive && !user) {
            setIsLoginOpen(true);
            toast.info("Для просмотра прямой трансляции необходимо войти в акккаунт");
            return;
        }

        trackStreamStart(event.id, event.title, user?.id);

        const modalEvent: VideoModalEvent = {
            id: event.id,
            title: event.title,
            youtubeVideoId: event.youtubeVideoId,
            rutubeVideoId: event.rutubeVideoId,
            videoPlatform: event.videoPlatform,
            isLive: event.isLive
        };

        setVideoModal({isOpen: true, event: modalEvent});
    };

    const handleViewChange = (view: 'list' | 'calendar' | 'photos' | 'contacts' | 'analytics' | 'admin') => {
        setCurrentView(view);
        trackNavigation(view, user?.id);
    };

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
        <div className="min-h-screen relative">
            {/* Фоновый логотип */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute bottom-4 right-4 opacity-50">
                    <img
                        src="/consilium-events/consiliumlogomini2000.png"
                        alt="Consilium Logo"
                        className="h-[15vh] w-auto object-contain"
                    />
                </div>
            </div>

            {/* Основной контент */}
            <div className="relative z-10">
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

                <VideoModal
                    isOpen={videoModal.isOpen}
                    onClose={() => setVideoModal({isOpen: false, event: null})}
                    event={videoModal.event}
                    isLoggedIn={!!user}
                    onLogin={() => setIsLoginOpen(true)}
                />

                <Toaster />
            </div>

            <YandexMetrica counterId={YANDEX_METRICA_ID} />
            <AnalyticsTracker counterId={YANDEX_METRICA_ID} />
        </div>
    );
}
