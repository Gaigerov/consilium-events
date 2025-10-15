import {useEffect} from "react";
import {ymEvent, ymParams} from "./YandexMetrica";

interface AnalyticsTrackerProps {
    counterId: number;
}

// Типы событий для отслеживания
export interface AnalyticsEvent {
    event: string;
    eventId?: string;
    eventTitle?: string;
    category?: string;
    action?: string;
    value?: number;
    userId?: string;
    sessionId?: string;
    timestamp?: number;
    metadata?: Record<string, any>;
}

class AnalyticsService {
    private counterId: number;
    private sessionId: string;
    private events: AnalyticsEvent[] = [];

    constructor(counterId: number) {
        this.counterId = counterId;
        this.sessionId = this.generateSessionId();
    }

    private generateSessionId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Отслеживание просмотра мероприятия
    trackEventView(eventId: string, eventTitle: string, category: string, userId?: string) {
        const event: AnalyticsEvent = {
            event: 'event_view',
            eventId,
            eventTitle,
            category,
            userId,
            sessionId: this.sessionId,
            timestamp: Date.now()
        };

        this.sendEvent(event);
        this.storeEvent(event);
    }

    // Отслеживание регистрации на мероприятие
    trackEventRegistration(eventId: string, eventTitle: string, userId: string, registrationMethod: string = 'form') {
        const event: AnalyticsEvent = {
            event: 'event_registration',
            eventId,
            eventTitle,
            action: registrationMethod,
            userId,
            sessionId: this.sessionId,
            timestamp: Date.now(),
            value: 1
        };

        this.sendEvent(event);
        this.storeEvent(event);
    }

    // Отслеживание начала просмотра трансляции
    trackStreamStart(eventId: string, eventTitle: string, userId?: string) {
        const event: AnalyticsEvent = {
            event: 'stream_start',
            eventId,
            eventTitle,
            userId,
            sessionId: this.sessionId,
            timestamp: Date.now()
        };

        this.sendEvent(event);
        this.storeEvent(event);
    }

    // Отслеживание завершения просмотра трансляции
    trackStreamEnd(eventId: string, eventTitle: string, watchDuration: number, userId?: string) {
        const event: AnalyticsEvent = {
            event: 'stream_end',
            eventId,
            eventTitle,
            value: Math.round(watchDuration / 1000), // в секундах
            userId,
            sessionId: this.sessionId,
            timestamp: Date.now(),
            metadata: {
                watchDurationMs: watchDuration,
                watchDurationMin: Math.round(watchDuration / 60000)
            }
        };

        this.sendEvent(event);
        this.storeEvent(event);
    }

    // Отслеживание поиска мероприятий
    trackSearch(searchQuery: string, resultsCount: number, userId?: string) {
        const event: AnalyticsEvent = {
            event: 'events_search',
            action: 'search',
            value: resultsCount,
            userId,
            sessionId: this.sessionId,
            timestamp: Date.now(),
            metadata: {
                query: searchQuery,
                resultsCount
            }
        };

        this.sendEvent(event);
        this.storeEvent(event);
    }

    // Отслеживание фильтрации
    trackFilter(filterType: string, filterValue: string, resultsCount: number, userId?: string) {
        const event: AnalyticsEvent = {
            event: 'events_filter',
            action: filterType,
            value: resultsCount,
            userId,
            sessionId: this.sessionId,
            timestamp: Date.now(),
            metadata: {
                filterType,
                filterValue,
                resultsCount
            }
        };

        this.sendEvent(event);
        this.storeEvent(event);
    }

    // Отслеживание социального входа
    trackSocialLogin(provider: string, userId: string) {
        const event: AnalyticsEvent = {
            event: 'user_login',
            action: provider,
            userId,
            sessionId: this.sessionId,
            timestamp: Date.now(),
            metadata: {
                loginMethod: 'social',
                provider
            }
        };

        this.sendEvent(event);
        this.storeEvent(event);
    }

    // Отслеживание просмотра фотоотчета
    trackPhotoReportView(reportId: string, eventTitle: string, userId?: string) {
        const event: AnalyticsEvent = {
            event: 'photo_report_view',
            eventId: reportId,
            eventTitle,
            userId,
            sessionId: this.sessionId,
            timestamp: Date.now()
        };

        this.sendEvent(event);
        this.storeEvent(event);
    }

    // Отслеживание отправки контактной формы
    trackContactForm(formType: string, userId?: string) {
        const event: AnalyticsEvent = {
            event: 'contact_form_submit',
            action: formType,
            userId,
            sessionId: this.sessionId,
            timestamp: Date.now(),
            value: 1
        };

        this.sendEvent(event);
        this.storeEvent(event);
    }

    // Отслеживание навигации по разделам
    trackNavigation(section: string, userId?: string) {
        const event: AnalyticsEvent = {
            event: 'navigation',
            action: section,
            userId,
            sessionId: this.sessionId,
            timestamp: Date.now()
        };

        this.sendEvent(event);
        this.storeEvent(event);
    }

    // Отправка события в Яндекс.Метрику
    private sendEvent(event: AnalyticsEvent) {
        ymEvent(this.counterId, event);

        // Также отправляем параметры пользователя
        if (event.userId) {
            ymParams(this.counterId, {
                userId: event.userId,
                sessionId: this.sessionId
            });
        }
    }

    // Сохранение события в локальное хранилище для последующей аналитики
    private storeEvent(event: AnalyticsEvent) {
        try {
            const storedEvents = localStorage.getItem('analytics_events');
            const events = storedEvents ? JSON.parse(storedEvents) : [];
            events.push(event);

            // Храним только последние 1000 событий
            if (events.length > 1000) {
                events.splice(0, events.length - 1000);
            }

            localStorage.setItem('analytics_events', JSON.stringify(events));
        } catch (error) {
            console.warn('Failed to store analytics event:', error);
        }
    }

    // Получение сохраненных событий
    getStoredEvents(): AnalyticsEvent[] {
        try {
            const storedEvents = localStorage.getItem('analytics_events');
            return storedEvents ? JSON.parse(storedEvents) : [];
        } catch (error) {
            console.warn('Failed to retrieve stored events:', error);
            return [];
        }
    }

    // Очистка сохраненных событий
    clearStoredEvents() {
        try {
            localStorage.removeItem('analytics_events');
        } catch (error) {
            console.warn('Failed to clear stored events:', error);
        }
    }

    // Получение аналитики по пользователю
    getUserAnalytics(userId: string) {
        const allEvents = this.getStoredEvents();
        const userEvents = allEvents.filter(event => event.userId === userId);

        return {
            totalEvents: userEvents.length,
            eventViews: userEvents.filter(e => e.event === 'event_view').length,
            registrations: userEvents.filter(e => e.event === 'event_registration').length,
            streamViews: userEvents.filter(e => e.event === 'stream_start').length,
            totalWatchTime: userEvents
                .filter(e => e.event === 'stream_end')
                .reduce((sum, e) => sum + (e.value || 0), 0),
            lastActivity: Math.max(...userEvents.map(e => e.timestamp || 0))
        };
    }
}

// Создаем глобальный экземпляр аналитики
let analyticsService: AnalyticsService | null = null;

export default function AnalyticsTracker({counterId}: AnalyticsTrackerProps) {
    useEffect(() => {
        analyticsService = new AnalyticsService(counterId);
    }, [counterId]);

    return null;
}

// Экспортируем функции для использования в других компонентах
export const useAnalytics = () => {
    if (!analyticsService) {
        console.warn('Analytics service not initialized');
        return null;
    }
    return analyticsService;
};

// Хелпер-функции для удобного использования
export const trackEventView = (eventId: string, eventTitle: string, category: string, userId?: string) => {
    analyticsService?.trackEventView(eventId, eventTitle, category, userId);
};

export const trackEventRegistration = (eventId: string, eventTitle: string, userId: string) => {
    analyticsService?.trackEventRegistration(eventId, eventTitle, userId);
};

export const trackStreamStart = (eventId: string, eventTitle: string, userId?: string) => {
    analyticsService?.trackStreamStart(eventId, eventTitle, userId);
};

export const trackStreamEnd = (eventId: string, eventTitle: string, watchDuration: number, userId?: string) => {
    analyticsService?.trackStreamEnd(eventId, eventTitle, watchDuration, userId);
};

export const trackSearch = (searchQuery: string, resultsCount: number, userId?: string) => {
    analyticsService?.trackSearch(searchQuery, resultsCount, userId);
};

export const trackFilter = (filterType: string, filterValue: string, resultsCount: number, userId?: string) => {
    analyticsService?.trackFilter(filterType, filterValue, resultsCount, userId);
};

export const trackSocialLogin = (provider: string, userId: string) => {
    analyticsService?.trackSocialLogin(provider, userId);
};

export const trackPhotoReportView = (reportId: string, eventTitle: string, userId?: string) => {
    analyticsService?.trackPhotoReportView(reportId, eventTitle, userId);
};

export const trackContactForm = (formType: string, userId?: string) => {
    analyticsService?.trackContactForm(formType, userId);
};

export const trackNavigation = (section: string, userId?: string) => {
    analyticsService?.trackNavigation(section, userId);
};
