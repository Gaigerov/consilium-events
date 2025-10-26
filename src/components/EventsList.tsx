import {useState, useEffect} from "react";
import EventCard from "./EventCard";
import {Button} from "./ui/button";
import {Badge} from "./ui/badge";
import {Input} from "./ui/input";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "./ui/dialog";
import {ImageWithFallback} from "./ImageWithFallback";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";
import {Search, Filter, Calendar as CalendarIcon, Clock, MapPin, Users, Play, ExternalLink} from "lucide-react";
import {trackSearch, trackFilter} from "./AnalyticsTracker";
import UserRegistrationForm from "./UserRegistrationForm";

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

interface EventsListProps {
    events: Event[];
    onRegister: (eventId: string) => void;
    onWatchStream: (event: Event) => void;
    registeredEvents: string[];
    isLoggedIn: boolean;
    onViewChange: (view: 'calendar') => void;
}

export default function EventsList({
    events,
    onRegister,
    onWatchStream,
    registeredEvents,
    isLoggedIn,
    onViewChange
}: EventsListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory] = useState<"all" | "event">("all");
    const [showLiveOnly, setShowLiveOnly] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isRegistrationFormOpen, setIsRegistrationFormOpen] = useState(false);

    const isEventLiveNow = (event: Event) => {
        const now = new Date();
        const eventStart = new Date(`${event.date}T${event.startTime}`);
        const eventEnd = new Date(`${event.date}T${event.endTime}`);
        return now >= eventStart && now <= eventEnd;
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
        const matchesLive = !showLiveOnly || (event.isLive && isEventLiveNow(event));

        return matchesSearch && matchesCategory && matchesLive;
    });

    // Отслеживание поиска
    useEffect(() => {
        if (searchTerm && searchTerm.length > 2) {
            const timeoutId = setTimeout(() => {
                trackSearch(searchTerm, filteredEvents.length);
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [searchTerm, filteredEvents.length]);

    // Отслеживание фильтрации
    useEffect(() => {
        if (selectedCategory !== "all") {
            trackFilter("category", selectedCategory, filteredEvents.length);
        }
    }, [selectedCategory, filteredEvents.length]);

    useEffect(() => {
        if (showLiveOnly) {
            trackFilter("live", "true", filteredEvents.length);
        }
    }, [showLiveOnly, filteredEvents.length]);

    const liveEventsCount = events.filter(event => event.isLive && isEventLiveNow(event)).length;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatDateRange = (event: Event) => {
        if (!event.endDate || event.endDate === event.date) {
            return formatDate(event.date);
        }
        return `${formatDate(event.date)} - ${formatDate(event.endDate)}`;
    };

    const handleCardClick = (event: Event) => {
        setSelectedEvent(event);
    };

    return (
        <div className="space-y-6">
            {/* Main Hero Section */}
            <div className="relative overflow-hidden md:overflow-visible rounded-2xl bg-gradient-to-br from-[#34c759]/20 via-blue-500/10 to-transparent border border-white/10 backdrop-blur-sm">
                <div className="relative z-10 px-6 sm:px-8 md:px-12 py-8 sm:py-12 md:py-16">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 sm:mb-6 leading-tight">
                            МЕДИЦИНА БУДУЩЕГО
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-3 sm:mb-4 leading-relaxed">
                            Конференции, симпозиумы, онлайн-курсы и экспертные дискуссии.
                        </p>
                        <div className="space-y-2 sm:space-y-3 text-base sm:text-lg md:text-xl text-white/80">
                            <p className="leading-relaxed">
                                <span className="text-white">Наша цель:</span>
                            </p>
                            <p className="leading-relaxed">
                                Создание единого передового медицинского пространства в России.
                            </p>
                            <p className="leading-relaxed">
                                Непрерывное развитие и поддержка медицинских специалистов.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Events Section */}
            <div className="space-y-4 py-6">
                <div className="flex items-center gap-3">
                    <CalendarIcon className="w-8 h-8" style={{color: '#34c759'}} />
                    <h1 className="text-4xl font-bold text-white">Мероприятия</h1>
                </div>
                <p className="text-xl text-white/70">
                    Откройте для себя удивительные события, участвуйте в прямых трансляциях
                    и расширяйте свои горизонты
                </p>
                {liveEventsCount > 0 && (
                    <Badge variant="destructive" className="animate-pulse text-base px-4 py-2">
                        <div className="w-3 h-3 bg-white rounded-full mr-2"></div>
                        {liveEventsCount} событий в прямом эфире
                    </Badge>
                )}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4">
                {/* Поисковое поле и фильтры на десктопе в одну строку, на мобильном - поиск отдельно */}
                <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center md:justify-between">
                    {/* Поисковое поле */}
                    <div className="relative flex-1 md:max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 z-10" />
                        <Input
                            placeholder="Поиск мероприятий..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-white/90 backdrop-blur-sm text-gray-900"
                        />
                    </div>

                    {/* Фильтры - на десктопе справа от поиска, на мобильном - на новой строке */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <Filter className="w-4 h-4 text-white/70" />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowLiveOnly(!showLiveOnly)}
                            className={`border-white ${showLiveOnly ? 'bg-primary hover:bg-primary/90 text-white' : 'bg-white/90 hover:bg-white text-gray-900'}`}
                        >
                            Только LIVE
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewChange('calendar')}
                            className="cursor-pointer bg-white/90 border-white text-gray-900 hover:bg-white hover:text-gray-900"
                        >
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Календарь
                        </Button>
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">
                        Мероприятий по вашему запросу не найдено
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onClick={() => handleCardClick(event)}
                        />
                    ))}
                </div>
            )}

            {/* Event Details Modal */}
            <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
                <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto p-5">
                    {selectedEvent && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl pr-8 text-white">
                                    {selectedEvent.title}
                                    {selectedEvent.isLive && isEventLiveNow(selectedEvent) && (
                                        <Badge variant="destructive" className="animate-pulse ml-2">
                                            <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                                            LIVE
                                        </Badge>
                                    )}
                                </DialogTitle>
                                <DialogDescription className="text-gray-300">
                                    Подробная информация о мероприятии
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Event Image */}
                                <div className="aspect-video w-full rounded-lg overflow-hidden">
                                    <ImageWithFallback
                                        src={selectedEvent.image}
                                        alt={selectedEvent.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="text-white text-lg mb-4">Описание</h3>
                                    <div className="space-y-6">
                                        {selectedEvent.description.split('\n\n').map((section, index) => {
                                            // Проверяем, начинается ли секция с маркера • или с заголовка
                                            const lines = section.split('\n');
                                            const hasListItems = lines.some(line => line.trim().startsWith('•'));

                                            if (section.trim() === '---') {
                                                return <div key={index} className="border-t border-white/20 my-4"></div>;
                                            }

                                            if (hasListItems) {
                                                return (
                                                    <div key={index} className="space-y-3">
                                                        {lines.map((line, lineIndex) => {
                                                            const trimmedLine = line.trim();
                                                            if (!trimmedLine) return null;

                                                            if (trimmedLine.startsWith('•')) {
                                                                return (
                                                                    <div key={lineIndex} className="flex gap-3 items-start">
                                                                        <span className="text-primary text-lg mt-0.5">•</span>
                                                                        <p className="text-gray-300 leading-relaxed flex-1">{trimmedLine.substring(1).trim()}</p>
                                                                    </div>
                                                                );
                                                            } else {
                                                                // Заголовок списка
                                                                return (
                                                                    <p key={lineIndex} className="text-white font-medium mt-4 first:mt-0">{trimmedLine}</p>
                                                                );
                                                            }
                                                        })}
                                                    </div>
                                                );
                                            }

                                            return (
                                                <p key={index} className="text-gray-300 leading-relaxed whitespace-pre-line">{section}</p>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Организаторы */}
                                {selectedEvent.organizers && selectedEvent.organizers.length > 0 && (
                                    <div>
                                        <h3 className="text-white text-lg mb-4">Организаторы</h3>
                                        <div className="space-y-3">
                                            {selectedEvent.organizers.map((organizer) => (
                                                <div
                                                    key={organizer.id}
                                                    className="flex items-start gap-3"
                                                >
                                                    <span className="text-primary text-lg mt-0.5 flex-shrink-0">•</span>
                                                    <p className="text-gray-300 leading-relaxed flex-1">{organizer.name}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Логотипы организаторов */}
                                        {selectedEvent.organizers.some(org => org.logo) && (
                                            <div className="flex flex-wrap gap-4 mt-6 justify-center">
                                                {selectedEvent.organizers
                                                    .filter(org => org.logo)
                                                    .map((organizer) => (
                                                        <img
                                                            key={organizer.id}
                                                            src={organizer.logo!}
                                                            alt={organizer.name}
                                                            className="w-[100px] h-auto object-contain"
                                                        />
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Спикеры */}
                                {selectedEvent.speakers && selectedEvent.speakers.length > 0 && (
                                    <div>
                                        <h3 className="text-white text-lg mb-4">Спикеры</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {selectedEvent.speakers.map((speaker) => (
                                                <div
                                                    key={speaker.id}
                                                    className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                                                >
                                                    <div className="flex sm:flex-row flex-col sm:items-center items-start gap-3">
                                                        <Avatar className="w-full sm:w-16 h-auto sm:h-16 aspect-square ring-2 ring-primary/20">
                                                            <AvatarImage src={speaker.avatar} alt={speaker.name} className="object-cover" />
                                                            <AvatarFallback className="bg-primary/20 text-primary">{speaker.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-white font-medium text-sm leading-tight">{speaker.name}</p>
                                                            <p className="text-gray-400 text-xs mt-1 leading-tight">{speaker.title}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Event Details */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white/10 rounded-lg border border-white/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <CalendarIcon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Дата</div>
                                            <div className="text-white">{formatDateRange(selectedEvent)}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Время</div>
                                            <div className="text-white">{selectedEvent.startTime} - {selectedEvent.endTime}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Место</div>
                                            <div className="text-white">{selectedEvent.location}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Users className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">Участники</div>
                                            <div className="text-white">{selectedEvent.registeredCount} / {selectedEvent.maxCapacity}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Price */}
                                {selectedEvent.price > 0 && (
                                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-300">Стоимость участия:</span>
                                            <span className="text-2xl text-primary">{selectedEvent.price.toLocaleString()} ₽</span>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    {selectedEvent.youtubeVideoId && (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                onWatchStream(selectedEvent);
                                                setSelectedEvent(null);
                                            }}
                                            className="flex-1 cursor-pointer text-white hover:text-white border-2 border-white/30 bg-white/10 hover:bg-white/20"
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            {selectedEvent.isLive && isEventLiveNow(selectedEvent) ? "Смотреть трансляцию" : "Смотреть запись"}
                                        </Button>
                                    )}

                                    {/* Показываем кнопку только если пользователь не зарегистрирован на мероприятие и регистрация не отключена */}
                                    {!registeredEvents.includes(selectedEvent.id) && !selectedEvent.registrationDisabled && (
                                        <Button
                                            onClick={() => {
                                                if (!isLoggedIn) {
                                                    setIsRegistrationFormOpen(true);
                                                    setSelectedEvent(null);
                                                } else {
                                                    onRegister(selectedEvent.id);
                                                    setSelectedEvent(null);
                                                }
                                            }}
                                            disabled={isLoggedIn && selectedEvent.registeredCount >= selectedEvent.maxCapacity}
                                            className="flex-1 cursor-pointer border-2 border-primary/50"
                                        >
                                            {!isLoggedIn ? (
                                                <>
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    Регистрация
                                                </>
                                            ) : selectedEvent.registeredCount >= selectedEvent.maxCapacity ? (
                                                "Мест нет"
                                            ) : (
                                                "Регистрация"
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Форма регистрации пользователя */}
            <UserRegistrationForm
                isOpen={isRegistrationFormOpen}
                onClose={() => setIsRegistrationFormOpen(false)}
            />
        </div>
    );
}
