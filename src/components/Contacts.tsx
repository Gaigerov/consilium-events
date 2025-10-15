import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Textarea} from "./ui/textarea";
import {Badge} from "./ui/badge";
import {MapPin, Phone, Mail, Clock, Users, Calendar, MessageCircle, Send} from "lucide-react";
import {toast} from "sonner";

export default function Contacts() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Сообщение отправлено! Мы свяжемся с вами в ближайшее время.");
    };

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <MessageCircle className="w-8 h-8 text-primary" />
                    <h1 className="text-4xl font-bold">Контакты</h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Свяжитесь с нами для организации мероприятий, партнерства или получения информации
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Наши офисы
                            </CardTitle>
                            <CardDescription>
                                Центральные офисы и площадки для проведения мероприятий
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border-l-4 border-primary pl-4">
                                <h4 className="font-medium">Главный офис</h4>
                                <p className="text-muted-foreground">199034, г.Санкт-Петербург Большой пр. В.О., д. 16/14 лит. Б, пом. 4-Н, ком. No7</p>
                                <p className="text-sm text-muted-foreground">9:00 - 18:00, пн-пт</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="w-5 h-5" />
                                Связь с нами
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">+7 (812) 385 - 96 - 26</p>
                                        <p className="text-sm text-muted-foreground">Общие вопросы</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">info@consilium.ru</p>
                                        <p className="text-sm text-muted-foreground">Email поддержка</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                                        <Users className="w-5 h-5 text-secondary-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">+7 (495) 123-45-68</p>
                                        <p className="text-sm text-muted-foreground">Корпоративные клиенты</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-accent-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">events@consilium.ru</p>
                                        <p className="text-sm text-muted-foreground">Организация мероприятий</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Режим работы
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span>Понедельник - Пятница</span>
                                    <Badge variant="outline">9:00 - 18:00</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Суббота</span>
                                    <Badge variant="outline">10:00 - 16:00</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Воскресенье</span>
                                    <Badge variant="secondary">Выходной</Badge>
                                </div>
                                <div className="pt-2 border-t">
                                    <p className="text-sm text-muted-foreground">
                                        <strong>Техническая поддержка:</strong> круглосуточно
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        <strong>Горячая линия:</strong> +7 (812) 385 - 96 - 26 (бесплатно)
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Send className="w-5 h-5" />
                            Написать нам
                        </CardTitle>
                        <CardDescription>
                            Заполните форму, и мы обязательно ответим в течение 24 часов
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Имя *</label>
                                    <Input placeholder="Ваше имя" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email *</label>
                                    <Input type="email" placeholder="your@email.com" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Телефон</label>
                                <Input placeholder="+7 (___) ___-__-__" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Тема обращения *</label>
                                <Input placeholder="Краткое описание вопроса" required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Сообщение *</label>
                                <Textarea
                                    placeholder="Подробно опишите ваш вопрос или предложение..."
                                    className="min-h-[120px]"
                                    required
                                />
                            </div>

                            <div className="flex items-start gap-2">
                                <input type="checkbox" id="consent" className="mt-1" required />
                                <label htmlFor="consent" className="text-sm text-muted-foreground">
                                    Я согласен с обработкой персональных данных и
                                    <a href="#" className="text-primary hover:underline"> политикой конфиденциальности</a>
                                </label>
                            </div>

                            <Button type="submit" className="w-full">
                                <Send className="w-4 h-4 mr-2" />
                                Отправить сообщение
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Users className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Корпоративным клиентам</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Специальные условия для организации корпоративных мероприятий
                    </p>
                    <Button variant="outline" size="sm">
                        Узнать больше
                    </Button>
                </Card>

                <Card className="text-center p-6">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <h3 className="font-medium mb-2">Аренда площадок</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Современные залы и оборудование для ваших мероприятий
                    </p>
                    <Button variant="outline" size="sm">
                        Посмотреть залы
                    </Button>
                </Card>

                <Card className="text-center p-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <h3 className="font-medium mb-2">Партнерство</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Станьте нашим партнером и развивайте бизнес вместе с нами
                    </p>
                    <Button variant="outline" size="sm">
                        Стать партнером
                    </Button>
                </Card>
            </div>
        </div>
    );
}
