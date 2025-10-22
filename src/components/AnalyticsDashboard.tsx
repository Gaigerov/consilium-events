import {useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select";
import {
    Eye, Users, TrendingUp, TrendingDown,
    Clock, Globe, Play, Download, Share2, BarChart3,
    Activity, Target
} from "lucide-react";

interface Event {
    id: string;
    title: string;
    category: "event" | "exhibition";
    date: string;
    location: string;
}

interface EventAnalytics {
    eventId: string;
    eventTitle: string;
    totalViews: number;
    uniqueVisitors: number;
    registrations: number;
    streamViews: number;
    avgWatchTime: number;
    peakViewers: number;
    conversionRate: number;
    bounceRate: number;
    shareCount: number;
    downloadCount: number;
    countries: {name: string; users: number; sessions: number}[];
    dailyStats: {date: string; views: number; registrations: number; streams: number}[];
    referrers: {source: string; users: number; percentage: number}[];
    devices: {type: string; users: number; percentage: number}[];
    ageGroups: {group: string; users: number; percentage: number}[];
}

const mockAnalytics: EventAnalytics[] = [
    {
        eventId: "2",
        eventTitle: "Конференция по технологиям будущего",
        totalViews: 15847,
        uniqueVisitors: 12456,
        registrations: 230,
        streamViews: 8934,
        avgWatchTime: 24.5,
        peakViewers: 1205,
        conversionRate: 1.45,
        bounceRate: 32.1,
        shareCount: 89,
        downloadCount: 156,
        countries: [
            {name: "Россия", users: 8234, sessions: 12456},
            {name: "Беларусь", users: 1876, sessions: 2543},
            {name: "Казахстан", users: 1234, sessions: 1876},
            {name: "Украина", users: 876, sessions: 1234},
            {name: "Другие", users: 236, sessions: 456}
        ],
        dailyStats: [
            {date: "2025-01-15", views: 1234, registrations: 12, streams: 0},
            {date: "2025-01-16", views: 2345, registrations: 25, streams: 0},
            {date: "2025-01-17", views: 3456, registrations: 38, streams: 0},
            {date: "2025-01-18", views: 4567, registrations: 52, streams: 0},
            {date: "2025-01-19", views: 3234, registrations: 41, streams: 0},
            {date: "2025-01-20", views: 1011, registrations: 62, streams: 8934}
        ],
        referrers: [
            {source: "Поиск Яндекс", users: 4567, percentage: 36.7},
            {source: "Социальные сети", users: 3456, percentage: 27.8},
            {source: "Прямые переходы", users: 2345, percentage: 18.8},
            {source: "Email рассылка", users: 1234, percentage: 9.9},
            {source: "Реферальные сайты", users: 854, percentage: 6.8}
        ],
        devices: [
            {type: "Desktop", users: 7456, percentage: 59.9},
            {type: "Mobile", users: 4123, percentage: 33.1},
            {type: "Tablet", users: 877, percentage: 7.0}
        ],
        ageGroups: [
            {group: "18-24", users: 2456, percentage: 19.7},
            {group: "25-34", users: 4567, percentage: 36.7},
            {group: "35-44", users: 3234, percentage: 26.0},
            {group: "45-54", users: 1456, percentage: 11.7},
            {group: "55+", users: 743, percentage: 5.9}
        ]
    }
];

interface AnalyticsDashboardProps {
    events: Event[];
}

export default function AnalyticsDashboard({events}: AnalyticsDashboardProps) {
    const [selectedEvent, setSelectedEvent] = useState<string>("all");
    const [timeRange, setTimeRange] = useState<string>("7days");
    const [activeTab, setActiveTab] = useState<string>("overview");

    const selectedAnalytics = mockAnalytics[0]; // Показываем данные первого события как пример

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const getGrowthIcon = (value: number) => {
        return value >= 0 ?
            <TrendingUp className="w-4 h-4 text-green-500" /> :
            <TrendingDown className="w-4 h-4 text-red-500" />;
    };

    return (
        <div className="space-y-6 overflow-hidden">
            {/* Header */}
            <div className="space-y-4 overflow-hidden">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 break-words text-white">
                        <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                        Аналитика мероприятий
                    </h1>
                    <p className="text-white/70 text-sm sm:text-base">
                        Подробная статистика просмотров, регистраций и взаимодействий
                    </p>
                </div>

                {/* Фильтры - адаптивные для мобильных */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                        <SelectTrigger className="w-full sm:w-[250px] bg-white">
                            <SelectValue placeholder="Все мероприятия" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="all">Все мероприятия</SelectItem>
                            {events.map(event => (
                                <SelectItem key={event.id} value={event.id}>
                                    {event.title.length > 30 ? event.title.substring(0, 30) + '...' : event.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-white">
                            <SelectValue placeholder="Период" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="1days">1 день</SelectItem>
                            <SelectItem value="7days">7 дней</SelectItem>
                            <SelectItem value="30days">30 дней</SelectItem>
                            <SelectItem value="90days">90 дней</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-hidden">
                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium truncate">Всего просмотров</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold break-words">{formatNumber(selectedAnalytics.totalViews)}</div>
                        <div className="flex items-center text-xs text-muted-foreground truncate">
                            {getGrowthIcon(12.5)}
                            <span className="ml-1 truncate">+12.5% за неделю</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium truncate">Уникальные посетители</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold break-words">{formatNumber(selectedAnalytics.uniqueVisitors)}</div>
                        <div className="flex items-center text-xs text-muted-foreground truncate">
                            {getGrowthIcon(8.2)}
                            <span className="ml-1 truncate">+8.2% за неделю</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium truncate">Регистрации</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold break-words">{selectedAnalytics.registrations}</div>
                        <div className="flex items-center text-xs text-muted-foreground truncate">
                            {getGrowthIcon(selectedAnalytics.conversionRate)}
                            <span className="ml-1 truncate">{selectedAnalytics.conversionRate}% конверсия</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium truncate">Просмотры трансляций</CardTitle>
                        <Play className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold break-words">{formatNumber(selectedAnalytics.streamViews)}</div>
                        <div className="flex items-center text-xs text-muted-foreground truncate">
                            <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{selectedAnalytics.avgWatchTime} мин среднее</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-white/20 overflow-x-auto">
                <nav className="flex space-x-8 min-w-max">
                    {[
                        {id: 'overview', label: 'Обзор'},
                        {id: 'audience', label: 'Аудитория'},
                        {id: 'streams', label: 'Трансляции'},
                        {id: 'geography', label: 'География'},
                        {id: 'sources', label: 'Источники'}
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-white hover:text-white/80'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6 overflow-hidden">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
                        {/* Daily Stats Chart */}
                        <Card className="overflow-hidden">
                            <CardHeader>
                                <CardTitle>Динамика по дням</CardTitle>
                                <CardDescription>Просмотры, регистрации и трансляции</CardDescription>
                            </CardHeader>
                            <CardContent className="overflow-hidden">
                                <div className="space-y-4 overflow-hidden">
                                    {selectedAnalytics.dailyStats.map((stat, index) => (
                                        <div key={index} className="flex items-center justify-between gap-2 overflow-hidden">
                                            <span className="text-sm flex-shrink-0">{new Date(stat.date).toLocaleDateString()}</span>
                                            <div className="flex items-center space-x-2 text-sm overflow-hidden flex-wrap">
                                                <span className="text-blue-600 truncate">{stat.views} просмотров</span>
                                                <span className="text-green-600 truncate">{stat.registrations} регистраций</span>
                                                {stat.streams > 0 && <span className="text-red-600 truncate">{stat.streams} трансляций</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Performance Metrics */}
                        <Card className="overflow-hidden">
                            <CardHeader>
                                <CardTitle>Показатели эффективности</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Конверсия в регистрацию</span>
                                        <span>{selectedAnalytics.conversionRate}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full"
                                            style={{width: `${selectedAnalytics.conversionRate * 20}%`}}
                                        ></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Показатель отказов</span>
                                        <span>{selectedAnalytics.bounceRate}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{width: `${100 - selectedAnalytics.bounceRate}%`}}
                                        ></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Время на странице</span>
                                        <span>{selectedAnalytics.avgWatchTime} мин</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{width: `${Math.min(selectedAnalytics.avgWatchTime * 2, 100)}%`}}
                                        ></div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Share2 className="w-4 h-4 text-blue-500" />
                                            <span>{selectedAnalytics.shareCount} репостов</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Download className="w-4 h-4 text-green-500" />
                                            <span>{selectedAnalytics.downloadCount} скачиваний</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'audience' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Age Groups */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Возрастные группы</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {selectedAnalytics.ageGroups.map((group, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-sm">{group.group}</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full"
                                                        style={{width: `${group.percentage}%`}}
                                                    ></div>
                                                </div>
                                                <span className="text-sm w-12 text-right">{group.percentage}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Devices */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Устройства</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {selectedAnalytics.devices.map((device, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-sm">{device.type}</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full"
                                                        style={{width: `${device.percentage}%`}}
                                                    ></div>
                                                </div>
                                                <span className="text-sm w-12 text-right">{device.users.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'streams' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Пиковые зрители</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-primary">
                                    {selectedAnalytics.peakViewers.toLocaleString()}
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Максимальное количество одновременных зрителей
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Среднее время просмотра</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-primary">
                                    {selectedAnalytics.avgWatchTime} мин
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    В среднем пользователи смотрят трансляцию
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Всего просмотров</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-primary">
                                    {selectedAnalytics.streamViews.toLocaleString()}
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Общее количество просмотров трансляции
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'geography' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>География пользователей</CardTitle>
                            <CardDescription>Распределение аудитории по странам</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {selectedAnalytics.countries.map((country, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                <Globe className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{country.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {country.sessions.toLocaleString()} сессий
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">{country.users.toLocaleString()}</div>
                                            <div className="text-sm text-muted-foreground">пользователей</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'sources' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Источники трафика</CardTitle>
                            <CardDescription>Откуда приходят пользователи</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {selectedAnalytics.referrers.map((referrer, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                <Activity className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{referrer.source}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {referrer.percentage}% от общего трафика
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">{referrer.users.toLocaleString()}</div>
                                            <div className="text-sm text-muted-foreground">пользователей</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
