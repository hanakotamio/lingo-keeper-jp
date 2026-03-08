export interface Phrase {
  japanese: string;
  furigana: string;
  english: string;
}

export interface PhraseCategory {
  label: string;
  phrases: Phrase[];
}

export const PHRASE_CATEGORIES: PhraseCategory[] = [
  {
    label: 'Basic Greetings',
    phrases: [
      { japanese: 'おはようございます', furigana: 'おはようございます', english: 'Good morning' },
      { japanese: 'こんにちは', furigana: 'こんにちは', english: 'Hello / Good afternoon' },
      { japanese: 'こんばんは', furigana: 'こんばんは', english: 'Good evening' },
      { japanese: 'おやすみなさい', furigana: 'おやすみなさい', english: 'Good night' },
      { japanese: 'さようなら', furigana: 'さようなら', english: 'Goodbye' },
      { japanese: 'またね', furigana: 'またね', english: 'See you later' },
      { japanese: 'はじめまして', furigana: 'はじめまして', english: 'Nice to meet you' },
      { japanese: 'よろしくおねがいします', furigana: 'よろしくおねがいします', english: 'Please treat me well' },
    ],
  },
  {
    label: 'Daily Conversation',
    phrases: [
      { japanese: 'ありがとうございます', furigana: 'ありがとうございます', english: 'Thank you very much' },
      { japanese: 'どういたしまして', furigana: 'どういたしまして', english: "You're welcome" },
      { japanese: 'すみません', furigana: 'すみません', english: 'Excuse me / Sorry' },
      { japanese: 'ごめんなさい', furigana: 'ごめんなさい', english: 'I am sorry' },
      { japanese: 'はい', furigana: 'はい', english: 'Yes' },
      { japanese: 'いいえ', furigana: 'いいえ', english: 'No' },
      { japanese: 'わかりました', furigana: 'わかりました', english: 'I understand' },
      { japanese: 'わかりません', furigana: 'わかりません', english: "I don't understand" },
      { japanese: 'もういちどおねがいします', furigana: 'もういちどおねがいします', english: 'Please say it again' },
      { japanese: 'にほんごがすこしはなせます', furigana: 'にほんごがすこしはなせます', english: 'I can speak a little Japanese' },
    ],
  },
  {
    label: 'Shopping & Restaurant',
    phrases: [
      { japanese: 'いくらですか', furigana: 'いくらですか', english: 'How much is it?' },
      { japanese: 'これをください', furigana: 'これをください', english: 'I would like this, please' },
      { japanese: 'メニューをみせてください', furigana: 'メニューをみせてください', english: 'Please show me the menu' },
      { japanese: 'おすすめはなんですか', furigana: 'おすすめはなんですか', english: 'What do you recommend?' },
      { japanese: 'おかんじょうをおねがいします', furigana: 'おかんじょうをおねがいします', english: 'Check, please' },
      { japanese: 'トイレはどこですか', furigana: 'トイレはどこですか', english: 'Where is the restroom?' },
      { japanese: 'えいごがはなせますか', furigana: 'えいごがはなせますか', english: 'Do you speak English?' },
    ],
  },
];
