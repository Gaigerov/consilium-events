import {useState} from "react";
import {Calendar} from "./ui/calendar";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card";
import {Badge} from "./ui/badge";
import {Button} from "./ui/button";
import {ImageWithFallback} from "./ImageWithFallback";
import {Calendar as CalendarIcon, Clock, MapPin, Users, Play} from "lucide-react";

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

interface EventCalendarProps {
    events: Event[];
    onRegister: (eventId: string) => void;
    onWatchStream: (event: Event) => void;
    registeredEvents: string[];
    isLoggedIn: boolean;
}

export default function EventCalendar({
    events,
    onRegister,
    onWatchStream,
    registeredEvents,
    isLoggedIn
}: EventCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [detailsModal, setDetailsModal] = useState<{
        isOpen: boolean;
        event: Event | null;
    }>({isOpen: false, event: null});

    // Проверяем, проходит ли событие в указанную дату
    const isEventOnDate = (event: Event, dateStr: string) => {
        if (!event.endDate || event.endDate === event.date) {
            return event.date === dateStr;
        }

        // Для многодневных событий проверяем, входит ли дата в диапазон
        return dateStr >= event.date && dateStr <= event.endDate;
    };

    // Получаем события для выбранной даты
    const getEventsForDate = (date: Date) => {
        // Используем toLocaleDateString для корректного сравнения дат без проблем с часовыми поясами
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        return events.filter(event => isEventOnDate(event, dateStr));
    };

    // Получаем все даты, на которые есть события (включая диапазоны)
    const getEventDates = () => {
        const allDates: Date[] = [];

        events.forEach(event => {
            const [startYear, startMonth, startDay] = event.date.split('-').map(Number);
            const startDate = new Date(startYear, startMonth - 1, startDay);

            if (!event.endDate || event.endDate === event.date) {
                allDates.push(startDate);
            } else {
                // Для многодневных событий добавляем все даты в диапазоне
                const [endYear, endMonth, endDay] = event.endDate.split('-').map(Number);
                const endDate = new Date(endYear, endMonth - 1, endDay);

                const currentDate = new Date(startDate);
                while (currentDate <= endDate) {
                    allDates.push(new Date(currentDate));
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        });

        return allDates;
    };

    const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
    const eventDates = getEventDates();

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatDateRange = (event: Event) => {
        if (!event.endDate || event.endDate === event.date) {
            const [year, month, day] = event.date.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            return formatDate(date);
        }

        const [startYear, startMonth, startDay] = event.date.split('-').map(Number);
        const [endYear, endMonth, endDay] = event.endDate.split('-').map(Number);
        const startDate = new Date(startYear, startMonth - 1, startDay);
        const endDate = new Date(endYear, endMonth - 1, endDay);

        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    };

    const isEventLiveNow = (event: Event) => {
        const now = new Date();
        const eventStart = new Date(`${event.date}T${event.startTime}`);
        const eventEnd = new Date(`${event.date}T${event.endTime}`);
        return now >= eventStart && now <= eventEnd;
    };

    // Функция для определения, есть ли события на конкретную дату
    const hasEventsOnDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        return events.some(event => isEventOnDate(event, dateStr));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 break-words text-white">
                    <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    Календарь Мероприятий
                </h1>
                <p className="text-white/70 text-sm sm:text-base">
                    Выберите дату, чтобы посмотреть запланированные мероприятия
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Календарь */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Выберите дату</CardTitle>
                            <CardDescription>
                                Дни с мероприятиями выделены синим цветом
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border"
                                modifiers={{
                                    hasEvents: eventDates
                                }}
                                modifiersStyles={{
                                    hasEvents: {
                                        backgroundColor: 'hsl(221.2 83.2% 53.3%)',
                                        color: 'hsl(210 40% 98%)',
                                        fontWeight: 'bold',
                                        // borderRadius: '50%'
                                    }
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* События выбранной даты */}
                <div className="lg:col-span-2">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-white text-2xl font-bold mb-2">
                                {selectedDate ? formatDate(selectedDate) : 'Выберите дату'}
                            </h2>
                            {selectedDateEvents.length > 0 ? (
                                <p className="text-white/70">
                                    Найдено {selectedDateEvents.length} мероприятий
                                </p>
                            ) : selectedDate ? (
                                <p className="text-white/70">
                                    На эту дату мероприятий не запланировано
                                </p>
                            ) : null}
                        </div>

                        {selectedDateEvents.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <CalendarIcon className="w-12 h-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground text-center">
                                        {!selectedDate
                                            ? "Выберите дату в календаре, чтобы посмотреть мероприятия"
                                            : "На выбранную дату мероприятий нет"}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {selectedDateEvents.map((event) => (
                                    <Card key={event.id} className="overflow-hidden">
                                        <div className="flex flex-col md:flex-row">
                                            <div className="md:w-48 h-32 md:h-auto relative flex-shrink-0">
                                                <ImageWithFallback
                                                    src={event.image}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                                    {event.isLive && isEventLiveNow(event) && (
                                                        <Badge variant="destructive" className="animate-pulse text-xs">
                                                            <div className="w-1.5 h-1.5 bg-white rounded-full mr-1"></div>
                                                            LIVE
                                                        </Badge>
                                                    )}
                                                    {event.endDate && event.endDate !== event.date && (
                                                        <Badge variant="secondary" className="text-xs bg-blue-500 text-white">
                                                            <CalendarIcon className="w-3 h-3 mr-1" />
                                                            Многодневное
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-1 p-4">
                                                <div className="flex flex-col h-full">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                                            {event.title}
                                                        </h3>
                                                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                                            {event.description}
                                                        </p>

                                                        <div className="space-y-1 text-sm text-muted-foreground mb-4">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-4 h-4" />
                                                                <span>{event.startTime} - {event.endTime}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-8 h-8" />
                                                                <span>{event.location}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Users className="w-4 h-4" />
                                                                <span>{event.registeredCount} / {event.maxCapacity} участников</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                        {event.youtubeVideoId && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => onWatchStream(event)}
                                                                className="flex-1"
                                                            >
                                                                <Play className="w-4 h-4 mr-2" />
                                                                {event.isLive && isEventLiveNow(event) ? "Смотреть" : "Запись"}
                                                            </Button>
                                                        )}

                                                        <Button
                                                            size="sm"
                                                            onClick={() => onRegister(event.id)}
                                                            disabled={!isLoggedIn || registeredEvents.includes(event.id) || event.registeredCount >= event.maxCapacity}
                                                            variant={registeredEvents.includes(event.id) ? "secondary" : "default"}
                                                            className="flex-1"
                                                        >
                                                            {!isLoggedIn ? "Войти"
                                                                : registeredEvents.includes(event.id) ? "Зарегистрированы"
                                                                    : event.registeredCount >= event.maxCapacity ? "Мест нет"
                                                                        : event.price === 0 ? "Бесплатно"
                                                                            : `${event.price.toLocaleString()} ₽`}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
