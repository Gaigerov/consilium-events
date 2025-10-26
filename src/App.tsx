import {useState} from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import EventsList from "./components/EventsList";
import EventCalendar from "./components/EventCalendar";
import PhotoReports from "./components/PhotoReports";
import Contacts from "./components/Contacts";
import AdminPanel from "./components/AdminPanel";
import SimpleLogin from "./components/SimpleLogin";
import YouTubeModal from "./components/YouTubeModal";
import {toast} from "sonner";
import {Toaster} from "./components/ui/sonner";


interface Speaker {
    id: string;
    name: string;
    title: string;
    avatar: string;
}

interface Organizer {
    id: string;
    name: string;
    logo?: string;
}

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
    videoPlatform?: "YouTube" | "Rutube" | "VK";
    registeredCount: number;
    maxCapacity: number;
    price: number;
    speakers?: Speaker[]; 
    organizers?: Organizer[]; 
    registrationDisabled?: boolean; 
}

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    isAdmin?: boolean;
}

// const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
// };

// const getCurrentTime = () => {
//     const now = new Date();
//     const startTime = new Date(now.getTime() - 30 * 60000);
//     const endTime = new Date(now.getTime() + 2 * 60 * 60000);

//     return {
//         start: startTime.toTimeString().slice(0, 5),
//         end: endTime.toTimeString().slice(0, 5)
//     };
// };

// const times = getCurrentTime();

const mockEvents: Event[] = [
    {
        id: "1_live",
        title: "Всероссийская научно-практическая конференция с международным участием «Ганелинские чтения»",
        description: `Очный формат с онлайн-трансляцией в режиме реального времени (время местное).

Темы конференции:
• Вопросы острого коронарного синдрома
• Современные подходы к ведению пациентов с хронической ишемической болезнью сердца
• Вопросы хирургического лечения коронарной болезни сердца

Планируется включение конференции в План научно-практических мероприятий Минздрава России на 2026 год. Заявка по учебному мероприятию будет представлена в Комиссию по оценке учебных мероприятий и материалов для НМО на соответствие установленным требованиям.

Срок подачи заявок на доклады – до 01 марта 2026 г.

Заявки направлять секретарю конференции:
Гумерова Виктория Евгеньевна
e-mail: vvoron1@yahoo.com

---

Профессор Ирина Ефимовна Ганелина – выдающийся ученый и врач ХХ-ХХI века, стоявшая у истоков создания специализированных инфарктных отделений, основатель одного из первых специализированных отделений реанимации и интенсивной терапии для больных инфарктом миокарда в СССР и Европе.

В работе конференции примут участие ученики Ирины Ефимовны – ведущие кардиологи Санкт-Петербурга и других городов России.`,
        date: "2026-05-15",
        startTime: "10:00",
        endTime: "18:00",
        location: "Санкт-Петербург, отель «Московские Ворота» (Московский пр., д. 97A)",
        image: '/images/ganelinaEventPhoto.png',
        category: "event",
        isLive: true,
        videoPlatform: "YouTube",
        youtubeVideoId: "dQw4w9WgXcQ",
        registeredCount: 127,
        maxCapacity: 2000,
        price: 0,
        organizers: [
            {
                id: "org1",
                name: "Российское кардиологическое общество",
                logo: '/images/rkoLogo.png'
            },
            {
                id: "org2",
                name: "Санкт-Петербургское кардиологическое научное общество им. Г.Ф. Ланга",
                logo: '/images/spbCardioLogo.png'
            },
            {
                id: "org3",
                name: "Северо-Западный государственный медицинский университет им. И.И. Мечникова",
                logo: '/images/mechnikovLogo.png'
            },
            {
                id: "org4",
                name: "Комитет по здравоохранению Правительства Санкт-Петербурга",
                logo: '/images/spbHealthLogo.png'
            },
            {
                id: "org5",
                name: "Комитет по здравоохранению Правительства Ленинградской област��",
                logo: '/images/lenoHealthLogo.png'
            }
        ]
    },
    {
        id: "2",
        title: "Конференция «Гастро-лето-2025 на Неве»",
        description: `Цель проекта: повысить уровень знаний врачей гастроэнтерологов об этиологии и патогенезе, современных методах профилактики, диагностики, дифференциальной диагностики и лечении заболеваний органов пищеварения.

КОЛИЧЕСТВО ПРИГЛАШЕННЫХ УЧАСТНИКОВ: до 50 специалистов.

ФОРМАТ МЕРОПРИЯТИЯ: образовательные лекции, клинические разборы, дискуссии, научно-образовательная викторина.

ПРИГЛАШЕННЫЕ СПЕЦИАЛИСТЫ: гастроэнтерологи, врачи общей практики, терапевты.`,
        date: "2025-06-07",
        endDate: "2025-06-08",
        startTime: "10:00",
        endTime: "18:00",
        location: "Отель «Введенский», конференц-зал «Введенский», Большой проспект П.С., 37; Лофт «Вдохновение» переулок Пирогова,18;",
        image: '/images/gastroletoCardImage.png',
        category: "event",
        isLive: false,
        registeredCount: 50,
        maxCapacity: 50,
        price: 0,
        registrationDisabled: true,
        speakers: [

            {
                id: "speaker5",
                name: "Бакулина Наталья Валерьевна",
                title: "проректор по науке и инновационной деятельности, заведующий кафедрой внутренних болезней, нефрологии, общей и клинической фармакологии с курсом фармации ФГБОУ ВО СЗГМУ им. И.И. Мечникова Минздрава России, д.м.н., профессор, Санкт-Петербург",
                avatar: '/images/bakulinaPhoto.png'
            },
            {
                id: "speaker6",
                name: "Карева Елена Николаевна",
                title: "профессор кафедры молекулярной фармакологии и радиобиологии им. акад. П.В. Сергеева ФГАОУ ВО РНИМУ им. Н.И. Пирогова Минздрава России, профессор кафедры фармакологии ФГАОУ ВО Первый МГМУ им. И.М. Сеченова Минздрава России (Сеченовский Университет), д.м.н., профессор, Москва",
                avatar: '/images/karevaPhoto.png'
            },
            {
                id: "speaker7",
                name: "Симаненков Владимир Ильич",
                title: "профессор кафедры внутренних болезней, нефрологии, общей и клинической фармакологии с курсом фармации ФГБОУ ВО СЗГМУ им. И.И. Мечникова Минздрава России, заслуженный работник Высшей школы РФ, д.м.н., профессор, Санкт-Петербург",
                avatar: '/images/simanenkovPhoto.png'
            },
            {
                id: "speaker8",
                name: "Ситкин Станислав Игоревич",
                title: "заведующий НИГ эпигенетики и метагеномики ФГБУ «НМИЦ им. В.А. Алмазова» Минздрава России, доцент кафедры пропедевтики внутренних болезней, гастроэнтерологии и диетологии им. С.М. Рысса ФГБОУ ВО СЗГМУ им. И.И. Мечникова Минздрава России, к.м.н., доцент, Санкт-Петербург",
                avatar: '/images/sitkinPhoto.png'
            },
            {
                id: "speaker9",
                name: "Шевяков Михаил Александрович",
                title: "заведующий кафедрой клинической микологии, иммунологии и аллергологии ФГБОУ ВО СЗГМУ им. И.И. Мечникова Минздрава России, д.м.н., профессор, Санкт-Петербург",
                avatar: '/images/shevyakovPhoto.png'
            }
        ]
    }
];

export default function App() {
    const [currentView, setCurrentView] = useState<'list' | 'calendar' | 'photos' | 'contacts' | 'admin'>('list');
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
    const [events, setEvents] = useState<Event[]>(mockEvents);
    const [youtubeModal, setYoutubeModal] = useState<{
        isOpen: boolean;
        event: Event | null;
    }>({isOpen: false, event: null});

    const handleLogin = (userData: User) => {
        const adminEmails = ['gaigerov@gmail.com'];
        const adminUser = adminEmails.includes(userData.email) ? {...userData, isAdmin: true} : userData;

        setUser(adminUser);

        const adminMessage = adminUser.isAdmin ? " (Администратор)" : "";
        toast.success(`Добро пожаловать, ${userData.name}${adminMessage}!`);
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

        toast.success(`Вы зарегистрированы на "${event.title}"`);
    };

    const handleWatchStream = (event: Event) => {
        // Проверка доступа к LIVE трансляции
        if (event.isLive && !user) {
            setIsLoginOpen(true);
            toast.info("Для просмотра прямой трансляции необходимо войти в аккаунт");
            return;
        }

        setYoutubeModal({isOpen: true, event});
    };

    const handleViewChange = (view: 'list' | 'calendar' | 'photos' | 'contacts' | 'admin') => {
        setCurrentView(view);
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
        <div className="min-h-screen frosted-backdrop flex flex-col" style={{background: 'var(--background)'}}>
            <Header
                onLoginClick={() => setIsLoginOpen(true)}
                onLogout={handleLogout}
                isLoggedIn={!!user}
                userAvatar={user?.avatar}
                userName={user?.name}
                currentView={currentView}
                onViewChange={handleViewChange}
                isAdmin={user?.isAdmin}
            />

            <main className="container mx-auto px-4 py-6 flex-grow">
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
                {currentView === 'admin' && user?.isAdmin && (
                    <AdminPanel
                        events={events}
                        onEventAdd={handleEventAdd}
                        onEventUpdate={handleEventUpdate}
                        onEventDelete={handleEventDelete}
                    />
                )}
            </main>

            <SimpleLogin
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onLogin={handleLogin}
            />

            <YouTubeModal
                isOpen={youtubeModal.isOpen}
                onClose={() => setYoutubeModal({isOpen: false, event: null})}
                event={youtubeModal.event ? {
                    ...youtubeModal.event,
                    date: youtubeModal.event.date,
                    endDate: youtubeModal.event.endDate,
                    startTime: youtubeModal.event.startTime,
                    endTime: youtubeModal.event.endTime
                } : null}
                isLoggedIn={!!user}
                onLogin={() => setIsLoginOpen(true)}
            />

            <Footer
                currentView={currentView}
                onViewChange={handleViewChange}
            />

            <Toaster />
        </div>
    );
}