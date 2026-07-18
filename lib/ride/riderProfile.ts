import type {
  RiderExperienceLevel,
  RiderGoal,
  RiderProfile,
} from "./types";

interface RiderExperienceOption {
  value: RiderExperienceLevel;
  label: string;
  description: string;
}

interface RiderGoalOption {
  value: RiderGoal;
  label: string;
  description: string;
}

export const DefaultRiderProfile: RiderProfile = {
  experienceLevel: "intermediate",
  goal: "recreation",
};

export const RiderExperienceOptions: RiderExperienceOption[] =
  [
    {
      value: "beginner",
      label: "Principiante",
      description:
        "Estoy desarrollando técnica, confianza y condición física.",
    },
    {
      value: "intermediate",
      label: "Intermedio",
      description:
        "Tengo experiencia regular y busco retos moderados.",
    },
    {
      value: "advanced",
      label: "Avanzado",
      description:
        "Tengo experiencia sólida y tolerancia a condiciones exigentes.",
    },
  ];

export const RiderGoalOptions: RiderGoalOption[] = [
  {
    value: "recreation",
    label: "Recreación",
    description:
      "Salir a rodar, disfrutar el recorrido y mantenerme activo.",
  },
  {
    value: "fitness",
    label: "Condición física",
    description:
      "Mejorar resistencia, fuerza y consistencia de entrenamiento.",
  },
  {
    value: "performance",
    label: "Rendimiento",
    description:
      "Entrenar con intensidad y mejorar tiempos o resultados.",
  },
  {
    value: "exploration",
    label: "Exploración",
    description:
      "Descubrir rutas, terrenos y experiencias nuevas.",
  },
];