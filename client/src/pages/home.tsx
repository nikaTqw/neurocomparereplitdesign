import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Brain, Bot, Sparkles, Image as ImageIcon, Video, FileText, 
  MessageSquare, Star, CheckCircle2, ChevronRight, XCircle,
  BarChart3, Settings2, Play, Users, Clock, Zap, Quote
} from "lucide-react";
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Cell 
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

// --- Mock Data ---

const chartData = [
  { name: 'GPT-4', price: 30, quality: 95, color: '#10A37F' },
  { name: 'Claude 3 Opus', price: 15, quality: 92, color: '#D97757' },
  { name: 'Gemini 1.5', price: 10, quality: 88, color: '#1A73E8' },
  { name: 'YandexGPT', price: 2, quality: 75, color: '#FFCC00' },
  { name: 'Llama 3', price: 1, quality: 82, color: '#0459FF' },
  { name: 'Mistral Large', price: 8, quality: 86, color: '#F25022' },
  { name: 'Midjourney v6', price: 25, quality: 98, color: '#FFFFFF', stroke: '#000' },
  { name: 'DALL-E 3', price: 18, quality: 90, color: '#000000' },
  { name: 'Sora', price: 40, quality: 96, color: '#FF3366' },
  { name: 'Runway Gen-2', price: 35, quality: 89, color: '#8A2BE2' }
];

const categories = {
  text: [
    { name: 'GPT-4o', desc: 'Универсальная модель с лучшей логикой и знаниями.', rating: 4.9, icon: Brain, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Claude 3 Opus', desc: 'Естественный стиль речи и контекст до 200K токенов.', rating: 4.8, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Gemini 1.5 Pro', desc: 'Глубокая интеграция с экосистемой Google.', rating: 4.7, icon: Sparkles, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'YandexGPT 3', desc: 'Лучшее понимание русского культурного контекста.', rating: 4.3, icon: Bot, color: 'text-yellow-600', bg: 'bg-yellow-100' }
  ],
  graphic: [
    { name: 'Midjourney v6', desc: 'Непревзойденная фотореалистичность и стилизация.', rating: 4.9, icon: ImageIcon, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'DALL-E 3', desc: 'Точное следование промптам и интеграция в ChatGPT.', rating: 4.6, icon: ImageIcon, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Stable Diffusion 3', desc: 'Open-source с максимальным контролем генерации.', rating: 4.7, icon: Settings2, color: 'text-slate-600', bg: 'bg-slate-100' },
    { name: 'Kandinsky 3.0', desc: 'Отличная работа с запросами на русском языке.', rating: 4.2, icon: ImageIcon, color: 'text-red-600', bg: 'bg-red-100' }
  ],
  video: [
    { name: 'Sora', desc: 'Генерация гиперреалистичных видео до 1 минуты.', rating: 4.9, icon: Video, color: 'text-rose-600', bg: 'bg-rose-100' },
    { name: 'Runway Gen-2', desc: 'Мощный набор инструментов для видеомонтажа.', rating: 4.6, icon: Play, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: 'Pika Labs', desc: 'Креативные стили и анимация изображений.', rating: 4.5, icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Suno AI', desc: 'Генерация музыки и вокала по текстовому описанию.', rating: 4.8, icon: Play, color: 'text-cyan-600', bg: 'bg-cyan-100' }
  ]
};

const tableData = [
  { id: 'gpt4', name: 'GPT-4', context: '128K', speed: '40', price: '$10.00', quality: '4.9', langs: '50+', multimodal: true },
  { id: 'claude', name: 'Claude 3 Opus', context: '200K', speed: '45', price: '$15.00', quality: '4.8', langs: 'Много', multimodal: true },
  { id: 'yandex', name: 'YandexGPT 3', context: '32K', speed: '120', price: '$1.50', quality: '4.1', langs: 'RU, EN', multimodal: false },
  { id: 'midjourney', name: 'Midjourney v6', context: '-', speed: '-', price: '$0.05 / img', quality: '4.9', langs: 'EN', multimodal: true },
  { id: 'dalle', name: 'DALL-E 3', context: '-', speed: '-', price: '$0.04 / img', quality: '4.7', langs: 'Много', multimodal: true },
];

export default function Home() {
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt4', 'claude', 'midjourney']);

  const toggleModel = (id: string) => {
    setSelectedModels(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-border rounded-lg shadow-delicate text-sm">
          <p className="font-medium text-foreground">{payload[0].payload.name}</p>
          <p className="text-muted-foreground mt-1">Цена: <span className="font-medium text-foreground">${payload[0].value}</span></p>
          <p className="text-muted-foreground">Качество: <span className="font-medium text-foreground">{payload[1].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white selection:bg-primary/20">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">NeuroCompare</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Каталог моделей</Link>
            <Link href="/" className="text-foreground hover:text-primary transition-colors">Сравнение</Link>
            <Link href="/" className="hover:text-primary transition-colors">Цены</Link>
            <Link href="/" className="hover:text-primary transition-colors">О проекте</Link>
          </nav>

          <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 text-white font-medium shadow-sm transition-all duration-300">
            Войти
          </Button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="py-24 md:py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl md:text-7xl font-light text-foreground leading-[1.1] tracking-tight mb-6">
                Объективное сравнение <span className="font-medium text-primary">нейросетей</span> для любых задач
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">
                Выбирайте идеальную модель по качеству, скорости и стоимости. Все популярные нейросети в одном месте с честными отзывами и прозрачной аналитикой.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="lg" className="rounded-full px-8 h-14 text-base bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
                  Подобрать модель
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-base border-border hover:bg-muted text-foreground transition-all duration-300">
                  Смотреть рейтинг
                </Button>
              </div>

              <div className="mt-12 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {['GPT-4', 'Claude', 'Midjourney', 'DALL-E'].map((name, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-secondary flex items-center justify-center text-[10px] font-bold shadow-sm" title={name}>
                      {name[0]}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Уже сравнили <span className="font-semibold text-foreground">50+</span> моделей
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <Card className="border border-border/50 shadow-delicate bg-white/60 backdrop-blur-xl rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-border/50 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-foreground">Соотношение цена/качество</h3>
                    <p className="text-xs text-muted-foreground mt-1">Топ-10 популярных моделей</p>
                  </div>
                  <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    Интерактивный график
                  </div>
                </div>
                <div className="p-6 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis type="number" dataKey="price" name="Цена" unit="$" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis type="number" dataKey="quality" name="Качество" stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={[70, 100]} />
                      <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                      <Scatter data={chartData} fill="#8884d8">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.stroke || entry.color} strokeWidth={entry.stroke ? 1 : 0} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Floating decorative elements */}
              <div className="absolute -top-6 -right-6 p-4 bg-white shadow-delicate rounded-xl border border-border/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Лидер логики</div>
                  <div className="text-sm font-bold text-foreground">GPT-4o</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-24 bg-zinc-50 border-y border-border/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4">Популярные категории</h2>
            <p className="text-muted-foreground">Изучите лучшие решения в каждой области. Мы отобрали нейросети, которые реально работают и приносят пользу бизнесу.</p>
          </div>

          <Tabs defaultValue="text" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-white p-1.5 rounded-full border border-border shadow-sm h-auto">
                <TabsTrigger value="text" className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  Текстовые
                </TabsTrigger>
                <TabsTrigger value="graphic" className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  Графические
                </TabsTrigger>
                <TabsTrigger value="video" className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  Аудио / Видео
                </TabsTrigger>
              </TabsList>
            </div>

            {Object.entries(categories).map(([key, items]) => (
              <TabsContent key={key} value={key} className="mt-0 outline-none">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <Card className="h-full border border-border/60 hover:border-primary/30 shadow-sm hover:shadow-delicate-hover transition-all duration-300 bg-white group cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                              <item.icon className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1.5 bg-zinc-50 px-2.5 py-1 rounded-full border border-border/50">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-bold text-foreground">{item.rating}</span>
                            </div>
                          </div>
                          <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4">Сравните характеристики</h2>
            <p className="text-muted-foreground max-w-xl">Детальное сравнение технических параметров и стоимости использования по API. Выберите то, что подходит именно вам.</p>
          </div>
          <Button variant="outline" className="rounded-full shrink-0 border-border">
            Полная таблица
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-zinc-50/50">
                  <th className="py-5 px-6 font-medium text-muted-foreground w-[250px]">Модель</th>
                  <th className="py-5 px-6 font-medium text-muted-foreground">Контекст (токенов)</th>
                  <th className="py-5 px-6 font-medium text-muted-foreground">Скорость (т/сек)</th>
                  <th className="py-5 px-6 font-medium text-muted-foreground">Цена (за 1M)</th>
                  <th className="py-5 px-6 font-medium text-muted-foreground">Качество</th>
                  <th className="py-5 px-6 font-medium text-muted-foreground">Языки</th>
                  <th className="py-5 px-6 font-medium text-muted-foreground">Мультимодальность</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => {
                  const isSelected = selectedModels.includes(row.id);
                  return (
                    <tr 
                      key={row.id} 
                      className={`border-b border-border/50 last:border-0 transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-zinc-50'}`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={isSelected} 
                            onCheckedChange={() => toggleModel(row.id)}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <span className="font-semibold text-foreground">{row.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">{row.context}</td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {row.speed !== '-' ? (
                          <div className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                            {row.speed}
                          </div>
                        ) : '-'}
                      </td>
                      <td className="py-4 px-6 font-medium text-foreground">{row.price}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium text-foreground">{row.quality}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">{row.langs}</td>
                      <td className="py-4 px-6">
                        {row.multimodal ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-zinc-300" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-zinc-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-4">Как нейросети меняют рабочие процессы</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Реальные кейсы от профессионалов, которые уже интегрировали ИИ в свою рутину и получили измеримые результаты.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="bg-white/5 border-white/10 text-white backdrop-blur-sm rounded-2xl overflow-hidden p-8 hover:bg-white/10 transition-colors">
              <Quote className="w-10 h-10 text-primary/50 mb-6" />
              <p className="text-xl leading-relaxed font-light mb-8">
                «Сократили время создания иллюстраций на <span className="font-medium text-primary">60%</span> благодаря подбору оптимальной графической модели через платформу»
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <div className="font-bold">Анна С.</div>
                    <div className="text-sm text-zinc-400">Арт-директор</div>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold border-2 border-zinc-900" title="Midjourney">Mj</div>
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-bold border-2 border-zinc-900" title="DALL-E">DE</div>
                </div>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white backdrop-blur-sm rounded-2xl overflow-hidden p-8 hover:bg-white/10 transition-colors">
              <Quote className="w-10 h-10 text-primary/50 mb-6" />
              <p className="text-xl leading-relaxed font-light mb-8">
                «Ускорили анализ юридических документов в <span className="font-medium text-primary">5 раз</span>, выбрав GPT-4 для обработки больших массивов текста»
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <div className="font-bold">Михаил В.</div>
                    <div className="text-sm text-zinc-400">Старший аналитик</div>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-[10px] font-bold border-2 border-zinc-900" title="GPT-4">G4</div>
                  <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-[10px] font-bold border-2 border-zinc-900" title="Claude">Cl</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 container mx-auto px-6">
        <div className="bg-white rounded-[2rem] border border-border p-12 md:p-20 text-center relative overflow-hidden shadow-delicate">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 -translate-x-1/2 translate-y-1/2"></div>
          
          <h2 className="text-3xl md:text-5xl font-light text-foreground mb-6">
            Начните тестировать нейросети прямо сейчас
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Сравнивайте, выбирайте и интегрируйте лучшие модели для своих задач в едином удобном интерфейсе.
          </p>
          
          <div className="flex flex-col items-center">
            <Button size="lg" className="rounded-full px-10 h-16 text-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1 mb-4">
              Начать тестирование
            </Button>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Бесплатно, без регистрации, 3 тестовых запроса в день
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-12 bg-zinc-50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg text-foreground">NeuroCompare</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2025 NeuroCompare. Все права защищены.
          </div>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Политика конфиденциальности</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Условия использования</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}