import {useEffect} from "react";

declare global {
    interface Window {
        ym: (counterId: number, method: string, ...params: any[]) => void;
    }
}

interface YandexMetricaProps {
    counterId: number;
}

interface EventData {
    event: string;
    eventId?: string;
    eventTitle?: string;
    category?: string;
    value?: number;
    [key: string]: any;
}

export default function YandexMetrica({counterId}: YandexMetricaProps) {
    useEffect(() => {
        // Создаем скрипт Яндекс.Метрики
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.innerHTML = `
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      ym(${counterId}, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true,
        trackHash:true
      });
    `;

        document.head.appendChild(script);

        // Noscript fallback
        const noscript = document.createElement('noscript');
        noscript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${counterId}" style="position:absolute; left:-9999px;" alt="" /></div>`;
        document.body.appendChild(noscript);

        return () => {
            // Cleanup при размонтировании
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            if (noscript.parentNode) {
                noscript.parentNode.removeChild(noscript);
            }
        };
    }, [counterId]);

    return null;
}

// Хелпер функции для отправки событий
export const ymEvent = (counterId: number, eventData: EventData) => {
    if (typeof window !== 'undefined' && window.ym) {
        window.ym(counterId, 'reachGoal', eventData.event, eventData);
    }
};

export const ymParams = (counterId: number, params: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.ym) {
        window.ym(counterId, 'params', params);
    }
};

export const ymHit = (counterId: number, url: string, options?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.ym) {
        window.ym(counterId, 'hit', url, options);
    }
};
