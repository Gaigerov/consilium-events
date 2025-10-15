import {useState, useEffect} from "react";
import EventCard from "./EventCard";
import {Button} from "./ui/button";
import {Badge} from "./ui/badge";
import {Input} from "./ui/input";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "./ui/dialog";
import {ImageWithFallback} from "./ImageWithFallback";
import {Search, Filter, Calendar as CalendarIcon, Clock, MapPin, Users, Play, ExternalLink} from "lucide-react";
import {trackEventView, trackSearch, trackFilter} from "./AnalyticsTracker";

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
    registeredCount: number;
    maxCapacity: number;
    price: number;
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
    const [selectedCategory, setSelectedCategory] = useState<"all" | "event">("all");
    const [showLiveOnly, setShowLiveOnly] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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
        trackEventView(event.id, event.title, event.category);
    };

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                <h1 className="text-4xl font-bold">Мероприятия</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Поиск мероприятий..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/90 backdrop-blur-sm"
                    />
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                    <Filter className="w-4 h-4 text-white/70" />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowLiveOnly(!showLiveOnly)}
                        className={`border-white text-white ${showLiveOnly ? 'bg-primary hover:bg-primary/90' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                        Только LIVE
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewChange('calendar')}
                        className="cursor-pointer bg-white/10 border-white text-white hover:bg-white/20 hover:text-white"
                    >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Календарь
                    </Button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl">
                    {selectedEvent && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl pr-8">
                                    {selectedEvent.title}
                                    {selectedEvent.isLive && isEventLiveNow(selectedEvent) && (
                                        <Badge variant="destructive" className="animate-pulse ml-2">
                                            <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                                            LIVE
                                        </Badge>
                                    )}
                                </DialogTitle>
                                <DialogDescription>
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
                                    <h3 className="font-semibold text-lg mb-2">Описание</h3>
                                    <p className="text-muted-foreground leading-relaxed">{selectedEvent.description}</p>
                                </div>

                                {/* Event Details */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <CalendarIcon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Дата</div>
                                            <div className="font-medium">{formatDateRange(selectedEvent)}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Время</div>
                                            <div className="font-medium">{selectedEvent.startTime} - {selectedEvent.endTime}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Место</div>
                                            <div className="font-medium">{selectedEvent.location}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Users className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Участники</div>
                                            <div className="font-medium">{selectedEvent.registeredCount} / {selectedEvent.maxCapacity}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Price */}
                                {selectedEvent.price > 0 && (
                                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Стоимость участия:</span>
                                            <span className="text-2xl font-bold text-primary">{selectedEvent.price.toLocaleString()} ₽</span>
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
                                            className="flex-1 cursor-pointer"
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            {selectedEvent.isLive && isEventLiveNow(selectedEvent) ? "Смотреть трансляцию" : "Смотреть запись"}
                                        </Button>
                                    )}

                                    <Button
                                        onClick={() => {
                                            onRegister(selectedEvent.id);
                                            setSelectedEvent(null);
                                        }}
                                        disabled={!isLoggedIn || registeredEvents.includes(selectedEvent.id) || selectedEvent.registeredCount >= selectedEvent.maxCapacity}
                                        variant={registeredEvents.includes(selectedEvent.id) ? "secondary" : "default"}
                                        className="flex-1 cursor-pointer"
                                    >
                                        {!isLoggedIn ? (
                                            <>
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                Войти для регистрации
                                            </>
                                        ) : registeredEvents.includes(selectedEvent.id) ? (
                                            "Вы зарегистрированы"
                                        ) : selectedEvent.registeredCount >= selectedEvent.maxCapacity ? (
                                            "Мест нет"
                                        ) : (
                                            "Зарегистрироваться"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
