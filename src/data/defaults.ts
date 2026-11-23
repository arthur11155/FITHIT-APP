import type {
  ExamInfo,
  ExamResult,
  GlucoseReading,
  Hospital,
  Meal,
  NutritionTip,
  UpcomingExam,
} from './types';

export const defaultReadings: GlucoseReading[] = [];

export const defaultHospitals: Hospital[] = [
  {
    id: 1,
    name: 'Hospital Universitário Oswaldo Cruz',
    specialty: 'Endocrinologia',
    distance: '1.2 km',
    address: 'Rua Arnóbio Marques, 310 - Santo Amaro',
    phone: '(81) 3184-1020',
    open: true,
    rating: 4.8,
    emergencyAvailable: true,
  },
  {
    id: 2,
    name: 'Clínica DiabCare Recife',
    specialty: 'Especializada em Diabetes',
    distance: '2.5 km',
    address: 'Av. Boa Viagem, 456 - Boa Viagem',
    phone: '(81) 3302-7891',
    open: true,
    rating: 4.9,
    emergencyAvailable: false,
  },
  {
    id: 3,
    name: 'Hospital da Restauração',
    specialty: 'Hospital Geral',
    distance: '3.8 km',
    address: 'Av. Gov. Agamenon Magalhães, s/n - Derby',
    phone: '(81) 3184-1600',
    open: true,
    rating: 4.6,
    emergencyAvailable: true,
  },
  {
    id: 4,
    name: 'Centro Médico Capibaribe',
    specialty: 'Nutrição e Endocrinologia',
    distance: '4.2 km',
    address: 'Rua da Aurora, 321 - Boa Vista',
    phone: '(81) 3302-7893',
    open: false,
    rating: 4.7,
    emergencyAvailable: false,
  },
];

export const defaultUpcomingExams: UpcomingExam[] = [];

export const defaultExamResults: ExamResult[] = [
  {
    id: 1,
    name: 'Hemoglobina Glicada (HbA1c)',
    date: '2026-05-15',
    result: '6.2%',
    reference: 'Normal < 7%',
  },
  {
    id: 2,
    name: 'Glicemia em Jejum',
    date: '2026-05-15',
    result: '118 mg/dL',
    reference: 'Normal: 70-100 mg/dL',
  },
  {
    id: 3,
    name: 'Creatinina',
    date: '2026-04-20',
    result: '0.9 mg/dL',
    reference: 'Normal: 0.6-1.2 mg/dL',
  },
];

export const defaultExamInfo: ExamInfo[] = [
  {
    name: 'Hemoglobina Glicada (HbA1c)',
    frequency: 'A cada 3 meses',
    description: 'Mede a média de glicose nos últimos 3 meses',
    importance: 'Alta',
  },
  {
    name: 'Glicemia em Jejum',
    frequency: 'Mensal',
    description: 'Mede o nível de açúcar após jejum',
    importance: 'Alta',
  },
  {
    name: 'Perfil Lipídico',
    frequency: 'Anual',
    description: 'Avalia colesterol e triglicerídeos',
    importance: 'Média',
  },
  {
    name: 'Função Renal',
    frequency: 'Anual',
    description: 'Verifica a saúde dos rins',
    importance: 'Alta',
  },
];

export const defaultMeals: Meal[] = [
  {
    id: 1,
    meal: 'Café da Manhã',
    time: '07:00 - 08:00',
    icon: 'cafe',
    completed: true,
    items: [
      { name: 'Ovo mexido (2 unid.)', carbs: 1, calories: 140 },
      { name: 'Pão integral (2 fatias)', carbs: 30, calories: 160 },
      { name: 'Abacate (1/2)', carbs: 6, calories: 120 },
      { name: 'Café sem açúcar', carbs: 0, calories: 5 },
    ],
  },
  {
    id: 2,
    meal: 'Lanche da Manhã',
    time: '10:00 - 10:30',
    icon: 'apple',
    completed: true,
    items: [
      { name: 'Maçã (1 média)', carbs: 25, calories: 95 },
      { name: 'Castanhas (10 unid.)', carbs: 4, calories: 100 },
    ],
  },
  {
    id: 3,
    meal: 'Almoço',
    time: '12:00 - 13:00',
    icon: 'sunny',
    completed: false,
    items: [
      { name: 'Arroz integral (4 col.)', carbs: 45, calories: 180 },
      { name: 'Feijão (2 col.)', carbs: 20, calories: 110 },
      { name: 'Frango grelhado (150g)', carbs: 0, calories: 165 },
      { name: 'Brócolis no vapor', carbs: 6, calories: 30 },
      { name: 'Salada verde', carbs: 5, calories: 25 },
    ],
  },
  {
    id: 4,
    meal: 'Lanche da Tarde',
    time: '15:30 - 16:00',
    icon: 'restaurant',
    completed: false,
    items: [
      { name: 'Iogurte natural s/ açúcar', carbs: 12, calories: 120 },
      { name: 'Morango (5 unid.)', carbs: 8, calories: 30 },
    ],
  },
  {
    id: 5,
    meal: 'Jantar',
    time: '19:00 - 20:00',
    icon: 'moon',
    completed: false,
    items: [
      { name: 'Salmão grelhado (150g)', carbs: 0, calories: 280 },
      { name: 'Batata doce (1 peq.)', carbs: 26, calories: 112 },
      { name: 'Aspargos grelhados', carbs: 4, calories: 20 },
      { name: 'Salada com azeite', carbs: 5, calories: 80 },
    ],
  },
];

export const defaultNutritionTips: NutritionTip[] = [
  {
    title: 'Controle de Carboidratos',
    description: 'Prefira carboidratos complexos como arroz integral, aveia e batata doce.',
    icon: 'leaf',
  },
  {
    title: 'Horários Regulares',
    description: 'Faça refeições a cada 3 horas para manter a glicemia estável.',
    icon: 'cafe',
  },
  {
    title: 'Fibras',
    description: 'Consuma alimentos ricos em fibras para controlar a absorção de açúcar.',
    icon: 'apple',
  },
];

export const defaultFoodsToAvoid = [
  'Refrigerantes e sucos industrializados',
  'Doces e sobremesas açucaradas',
  'Pão branco e massas refinadas',
  'Frituras e alimentos ultraprocessados',
  'Frutas em calda ou cristalizadas',
];

export const defaultRecommendedFoods = [
  'Vegetais verde-escuros (brócolis, espinafre)',
  'Proteínas magras (frango, peixe, ovos)',
  'Grãos integrais (aveia, quinoa, arroz integral)',
  'Oleaginosas (castanhas, amêndoas, nozes)',
  'Frutas com baixo índice glicêmico (morango, maçã)',
];
