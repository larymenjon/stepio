export const motivationalQuotes = [
  "Cada pequeno passo é uma grande vitória. 💚",
  "Você é a melhor mãe que seu filho poderia ter.",
  "O amor de mãe move montanhas.",
  "Celebre cada conquista, por menor que pareça.",
  "Você não está sozinha nessa jornada. 🌟",
  "Seu filho tem sorte de ter você.",
  "Um dia de cada vez, uma conquista de cada vez.",
  "Você é mais forte do que imagina.",
  "O progresso nem sempre é linear, e tudo bem.",
  "Sua dedicação faz toda a diferença.",
  "Respire fundo. Você está indo muito bem! 🌈",
  "Cada criança tem seu próprio tempo de florescer.",
  "Sua paciência é um superpoder.",
  "Hoje é um novo dia cheio de possibilidades.",
  "Você é uma guerreira. Nunca esqueça disso. 💪",
];

export function getRandomQuote(): string {
  const index = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[index];
}

export function getDailyQuote(): string {
  // Use date as seed for consistent daily quote
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % motivationalQuotes.length;
  return motivationalQuotes[index];
}
