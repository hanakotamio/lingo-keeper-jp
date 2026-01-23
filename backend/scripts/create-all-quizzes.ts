import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create quizzes for all stories (ID 1-15)
 *
 * Requirements:
 * - 3-5 quizzes per story
 * - Types: 語彙, 文法, 読解, 文化
 * - 4 choices each (1 correct)
 * - Explanations for correct/incorrect
 * - quiz_id format: quiz-{story_id}-{number}
 */

interface QuizData {
  quiz_id: string;
  story_id: string;
  question_text: string;
  question_type: '語彙' | '文法' | '読解' | '文化';
  difficulty_level: string;
  choices: {
    choice_id: string;
    choice_text: string;
    is_correct: boolean;
    explanation: string;
  }[];
}

const allQuizzes: QuizData[] = [
  // ============================================================
  // Story 1: 朝の挨拶 (Morning Greetings) - N5/A1
  // ============================================================
  {
    quiz_id: 'quiz-1-1',
    story_id: '1',
    question_text: '「おはようございます」はいつ使いますか？',
    question_type: '語彙',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-1-1-1',
        choice_text: '朝',
        is_correct: true,
        explanation: '「おはようございます」は朝のあいさつです。'
      },
      {
        choice_id: 'quiz-1-1-2',
        choice_text: '昼',
        is_correct: false,
        explanation: '昼は「こんにちは」を使います。'
      },
      {
        choice_id: 'quiz-1-1-3',
        choice_text: '夜',
        is_correct: false,
        explanation: '夜は「こんばんは」を使います。'
      },
      {
        choice_id: 'quiz-1-1-4',
        choice_text: '寝る前',
        is_correct: false,
        explanation: '寝る前は「おやすみなさい」を使います。'
      }
    ]
  },
  {
    quiz_id: 'quiz-1-2',
    story_id: '1',
    question_text: '「ございます」は何を表しますか？',
    question_type: '文法',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-1-2-1',
        choice_text: '丁寧さ',
        is_correct: true,
        explanation: '「ございます」は「あります」の丁寧な言い方です。'
      },
      {
        choice_id: 'quiz-1-2-2',
        choice_text: '質問',
        is_correct: false,
        explanation: '質問は「ですか」を使います。'
      },
      {
        choice_id: 'quiz-1-2-3',
        choice_text: '過去',
        is_correct: false,
        explanation: '過去は「ました」を使います。'
      },
      {
        choice_id: 'quiz-1-2-4',
        choice_text: '否定',
        is_correct: false,
        explanation: '否定は「ません」を使います。'
      }
    ]
  },
  {
    quiz_id: 'quiz-1-3',
    story_id: '1',
    question_text: '朝のあいさつで、友達に言う場合は？',
    question_type: '読解',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-1-3-1',
        choice_text: 'おはよう',
        is_correct: true,
        explanation: '友達には「おはよう」というカジュアルな言い方を使います。'
      },
      {
        choice_id: 'quiz-1-3-2',
        choice_text: 'おはようございます',
        is_correct: false,
        explanation: 'これは丁寧な言い方です。先生や目上の人に使います。'
      },
      {
        choice_id: 'quiz-1-3-3',
        choice_text: 'こんにちは',
        is_correct: false,
        explanation: 'これは昼のあいさつです。'
      },
      {
        choice_id: 'quiz-1-3-4',
        choice_text: 'やあ',
        is_correct: false,
        explanation: 'これはとてもカジュアルですが、朝だけではありません。'
      }
    ]
  },

  // ============================================================
  // Story 2: 自己紹介 (Self Introduction) - N5/A1
  // ============================================================
  {
    quiz_id: 'quiz-2-1',
    story_id: '2',
    question_text: '「はじめまして」はいつ使いますか？',
    question_type: '語彙',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-2-1-1',
        choice_text: '初めて会う人に',
        is_correct: true,
        explanation: '「はじめまして」は初対面の人に使うあいさつです。'
      },
      {
        choice_id: 'quiz-2-1-2',
        choice_text: '毎日会う人に',
        is_correct: false,
        explanation: '毎日会う人には「おはよう」などを使います。'
      },
      {
        choice_id: 'quiz-2-1-3',
        choice_text: '別れる時',
        is_correct: false,
        explanation: '別れる時は「さようなら」を使います。'
      },
      {
        choice_id: 'quiz-2-1-4',
        choice_text: '感謝する時',
        is_correct: false,
        explanation: '感謝する時は「ありがとうございます」を使います。'
      }
    ]
  },
  {
    quiz_id: 'quiz-2-2',
    story_id: '2',
    question_text: '「～と申します」の意味は？',
    question_type: '文法',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-2-2-1',
        choice_text: '～と言います（丁寧）',
        is_correct: true,
        explanation: '「申します」は「言います」の謙譲語で、自分の名前を言う時に使います。'
      },
      {
        choice_id: 'quiz-2-2-2',
        choice_text: '～を申し込みます',
        is_correct: false,
        explanation: 'これは「申し込む」という別の動詞です。'
      },
      {
        choice_id: 'quiz-2-2-3',
        choice_text: '～と思います',
        is_correct: false,
        explanation: '「思います」は意見を述べる時に使います。'
      },
      {
        choice_id: 'quiz-2-2-4',
        choice_text: '～と呼びます',
        is_correct: false,
        explanation: '「呼びます」は他の人の名前を言う時に使います。'
      }
    ]
  },
  {
    quiz_id: 'quiz-2-3',
    story_id: '2',
    question_text: '自己紹介で、最後に何と言いますか？',
    question_type: '文化',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-2-3-1',
        choice_text: 'よろしくお願いします',
        is_correct: true,
        explanation: '日本では自己紹介の最後に「よろしくお願いします」と言います。'
      },
      {
        choice_id: 'quiz-2-3-2',
        choice_text: 'さようなら',
        is_correct: false,
        explanation: 'これは別れる時のあいさつです。'
      },
      {
        choice_id: 'quiz-2-3-3',
        choice_text: 'ありがとうございます',
        is_correct: false,
        explanation: 'これは感謝の言葉です。'
      },
      {
        choice_id: 'quiz-2-3-4',
        choice_text: 'すみません',
        is_correct: false,
        explanation: 'これは謝罪や声をかける時の言葉です。'
      }
    ]
  },

  // ============================================================
  // Story 3: カフェで注文 (Ordering at a Café) - N5/A1
  // ============================================================
  {
    quiz_id: 'quiz-3-1',
    story_id: '3',
    question_text: '「ください」は何を表しますか？',
    question_type: '文法',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-3-1-1',
        choice_text: '依頼・注文',
        is_correct: true,
        explanation: '「ください」は何かを欲しい時や、してほしい時に使います。'
      },
      {
        choice_id: 'quiz-3-1-2',
        choice_text: '質問',
        is_correct: false,
        explanation: '質問は「ですか」を使います。'
      },
      {
        choice_id: 'quiz-3-1-3',
        choice_text: '否定',
        is_correct: false,
        explanation: '否定は「ません」を使います。'
      },
      {
        choice_id: 'quiz-3-1-4',
        choice_text: '過去',
        is_correct: false,
        explanation: '過去は「ました」を使います。'
      }
    ]
  },
  {
    quiz_id: 'quiz-3-2',
    story_id: '3',
    question_text: 'カフェで注文する時、何と言いますか？',
    question_type: '語彙',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-3-2-1',
        choice_text: '～をください',
        is_correct: true,
        explanation: '注文する時は「～をください」と言います。'
      },
      {
        choice_id: 'quiz-3-2-2',
        choice_text: '～があります',
        is_correct: false,
        explanation: 'これは存在を表す言い方です。'
      },
      {
        choice_id: 'quiz-3-2-3',
        choice_text: '～がほしいです',
        is_correct: false,
        explanation: 'これも使えますが、「ください」の方が一般的です。'
      },
      {
        choice_id: 'quiz-3-2-4',
        choice_text: '～をあげます',
        is_correct: false,
        explanation: 'これは「与える」という意味です。'
      }
    ]
  },
  {
    quiz_id: 'quiz-3-3',
    story_id: '3',
    question_text: '「いらっしゃいませ」は誰が言いますか？',
    question_type: '文化',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-3-3-1',
        choice_text: '店員',
        is_correct: true,
        explanation: '「いらっしゃいませ」は店員がお客さんを迎える時の言葉です。'
      },
      {
        choice_id: 'quiz-3-3-2',
        choice_text: 'お客さん',
        is_correct: false,
        explanation: 'お客さんは「すみません」などと言います。'
      },
      {
        choice_id: 'quiz-3-3-3',
        choice_text: '先生',
        is_correct: false,
        explanation: '先生は「いらっしゃいませ」とは言いません。'
      },
      {
        choice_id: 'quiz-3-3-4',
        choice_text: '友達',
        is_correct: false,
        explanation: '友達には「ようこそ」などと言います。'
      }
    ]
  },

  // ============================================================
  // Story 4: 買い物 (Shopping) - N5/A1
  // ============================================================
  {
    quiz_id: 'quiz-4-1',
    story_id: '4',
    question_text: '「いくらですか」は何を聞いていますか？',
    question_type: '語彙',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-4-1-1',
        choice_text: '値段',
        is_correct: true,
        explanation: '「いくらですか」は値段を聞く表現です。'
      },
      {
        choice_id: 'quiz-4-1-2',
        choice_text: '時間',
        is_correct: false,
        explanation: '時間は「何時ですか」と聞きます。'
      },
      {
        choice_id: 'quiz-4-1-3',
        choice_text: '場所',
        is_correct: false,
        explanation: '場所は「どこですか」と聞きます。'
      },
      {
        choice_id: 'quiz-4-1-4',
        choice_text: '数量',
        is_correct: false,
        explanation: '数量は「いくつですか」と聞きます。'
      }
    ]
  },
  {
    quiz_id: 'quiz-4-2',
    story_id: '4',
    question_text: '「これ」と「それ」の違いは？',
    question_type: '文法',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-4-2-1',
        choice_text: '「これ」は近く、「それ」は遠い',
        is_correct: true,
        explanation: '「これ」は話し手の近く、「それ」は聞き手の近くのものを指します。'
      },
      {
        choice_id: 'quiz-4-2-2',
        choice_text: '「これ」は人、「それ」は物',
        is_correct: false,
        explanation: '両方とも物を指します。人は「この人」などと言います。'
      },
      {
        choice_id: 'quiz-4-2-3',
        choice_text: '「これ」は大きい、「それ」は小さい',
        is_correct: false,
        explanation: '大きさは関係ありません。'
      },
      {
        choice_id: 'quiz-4-2-4',
        choice_text: '同じ意味',
        is_correct: false,
        explanation: '距離によって使い分けます。'
      }
    ]
  },
  {
    quiz_id: 'quiz-4-3',
    story_id: '4',
    question_text: '日本のお店で「ありがとうございます」と言うのは誰ですか？',
    question_type: '文化',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-4-3-1',
        choice_text: '店員とお客さん両方',
        is_correct: true,
        explanation: '日本では店員もお客さんも「ありがとうございます」と言います。'
      },
      {
        choice_id: 'quiz-4-3-2',
        choice_text: '店員だけ',
        is_correct: false,
        explanation: 'お客さんも言います。'
      },
      {
        choice_id: 'quiz-4-3-3',
        choice_text: 'お客さんだけ',
        is_correct: false,
        explanation: '店員も言います。'
      },
      {
        choice_id: 'quiz-4-3-4',
        choice_text: '誰も言わない',
        is_correct: false,
        explanation: '両方が感謝を表します。'
      }
    ]
  },

  // ============================================================
  // Story 5: 道を聞く (Asking for Directions) - N5/A1
  // ============================================================
  {
    quiz_id: 'quiz-5-1',
    story_id: '5',
    question_text: '「すみません」は何の意味ですか？',
    question_type: '語彙',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-5-1-1',
        choice_text: '謝罪や声かけ',
        is_correct: true,
        explanation: '「すみません」は謝る時や人に声をかける時に使います。'
      },
      {
        choice_id: 'quiz-5-1-2',
        choice_text: '感謝',
        is_correct: false,
        explanation: '感謝は「ありがとうございます」です。'
      },
      {
        choice_id: 'quiz-5-1-3',
        choice_text: 'あいさつ',
        is_correct: false,
        explanation: 'あいさつは「おはよう」「こんにちは」です。'
      },
      {
        choice_id: 'quiz-5-1-4',
        choice_text: '別れの言葉',
        is_correct: false,
        explanation: '別れの言葉は「さようなら」です。'
      }
    ]
  },
  {
    quiz_id: 'quiz-5-2',
    story_id: '5',
    question_text: '「～はどこですか」は何を聞いていますか？',
    question_type: '文法',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-5-2-1',
        choice_text: '場所',
        is_correct: true,
        explanation: '「どこですか」は場所を聞く表現です。'
      },
      {
        choice_id: 'quiz-5-2-2',
        choice_text: '時間',
        is_correct: false,
        explanation: '時間は「いつですか」と聞きます。'
      },
      {
        choice_id: 'quiz-5-2-3',
        choice_text: '理由',
        is_correct: false,
        explanation: '理由は「なぜですか」と聞きます。'
      },
      {
        choice_id: 'quiz-5-2-4',
        choice_text: '方法',
        is_correct: false,
        explanation: '方法は「どうやって」と聞きます。'
      }
    ]
  },
  {
    quiz_id: 'quiz-5-3',
    story_id: '5',
    question_text: '道を教えてもらった後、何と言いますか？',
    question_type: '文化',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-5-3-1',
        choice_text: 'ありがとうございます',
        is_correct: true,
        explanation: '助けてもらった時は「ありがとうございます」と感謝を伝えます。'
      },
      {
        choice_id: 'quiz-5-3-2',
        choice_text: 'すみません',
        is_correct: false,
        explanation: '「すみません」は声をかける時に使います。'
      },
      {
        choice_id: 'quiz-5-3-3',
        choice_text: 'さようなら',
        is_correct: false,
        explanation: '「さようなら」だけでは失礼です。まず感謝を伝えます。'
      },
      {
        choice_id: 'quiz-5-3-4',
        choice_text: '何も言わない',
        is_correct: false,
        explanation: '日本では必ず感謝を伝えます。'
      }
    ]
  },

  // ============================================================
  // Story 6: 電話をかける (Making a Phone Call) - N4/A2
  // ============================================================
  {
    quiz_id: 'quiz-6-1',
    story_id: '6',
    question_text: '「もしもし」はいつ使いますか？',
    question_type: '語彙',
    difficulty_level: 'N4',
    choices: [
      {
        choice_id: 'quiz-6-1-1',
        choice_text: '電話で話す時',
        is_correct: true,
        explanation: '「もしもし」は電話での最初のあいさつです。'
      },
      {
        choice_id: 'quiz-6-1-2',
        choice_text: '直接会った時',
        is_correct: false,
        explanation: '直接会った時は「こんにちは」などを使います。'
      },
      {
        choice_id: 'quiz-6-1-3',
        choice_text: 'メールで',
        is_correct: false,
        explanation: 'メールでは「もしもし」は使いません。'
      },
      {
        choice_id: 'quiz-6-1-4',
        choice_text: '手紙で',
        is_correct: false,
        explanation: '手紙でも使いません。'
      }
    ]
  },
  {
    quiz_id: 'quiz-6-2',
    story_id: '6',
    question_text: '「～ていらっしゃいますか」の意味は？',
    question_type: '文法',
    difficulty_level: 'N4',
    choices: [
      {
        choice_id: 'quiz-6-2-1',
        choice_text: '～ていますか（尊敬語）',
        is_correct: true,
        explanation: '「いらっしゃる」は「いる」の尊敬語です。'
      },
      {
        choice_id: 'quiz-6-2-2',
        choice_text: '～てください',
        is_correct: false,
        explanation: 'これは依頼の表現です。'
      },
      {
        choice_id: 'quiz-6-2-3',
        choice_text: '～ました',
        is_correct: false,
        explanation: 'これは過去形です。'
      },
      {
        choice_id: 'quiz-6-2-4',
        choice_text: '～ましょう',
        is_correct: false,
        explanation: 'これは勧誘の表現です。'
      }
    ]
  },
  {
    quiz_id: 'quiz-6-3',
    story_id: '6',
    question_text: 'ビジネス電話で、自分の会社名を言う時は？',
    question_type: '文化',
    difficulty_level: 'N4',
    choices: [
      {
        choice_id: 'quiz-6-3-1',
        choice_text: '最初に会社名、次に名前',
        is_correct: true,
        explanation: '日本のビジネス電話では会社名→部署→名前の順で名乗ります。'
      },
      {
        choice_id: 'quiz-6-3-2',
        choice_text: '名前だけ',
        is_correct: false,
        explanation: 'ビジネスでは会社名も必要です。'
      },
      {
        choice_id: 'quiz-6-3-3',
        choice_text: '会社名だけ',
        is_correct: false,
        explanation: '自分の名前も必要です。'
      },
      {
        choice_id: 'quiz-6-3-4',
        choice_text: '何も言わない',
        is_correct: false,
        explanation: '必ず名乗ります。'
      }
    ]
  },

  // ============================================================
  // Story 7: レストランで (At a Restaurant) - N4/A2
  // ============================================================
  {
    quiz_id: 'quiz-7-1',
    story_id: '7',
    question_text: '「～にします」は何の意味ですか？',
    question_type: '文法',
    difficulty_level: 'N4',
    choices: [
      {
        choice_id: 'quiz-7-1-1',
        choice_text: '決定する',
        is_correct: true,
        explanation: '「～にします」は何かを選んで決める時に使います。'
      },
      {
        choice_id: 'quiz-7-1-2',
        choice_text: '質問する',
        is_correct: false,
        explanation: '質問は「ですか」を使います。'
      },
      {
        choice_id: 'quiz-7-1-3',
        choice_text: '否定する',
        is_correct: false,
        explanation: '否定は「ません」を使います。'
      },
      {
        choice_id: 'quiz-7-1-4',
        choice_text: '過去を表す',
        is_correct: false,
        explanation: '過去は「ました」を使います。'
      }
    ]
  },
  {
    quiz_id: 'quiz-7-2',
    story_id: '7',
    question_text: '「おすすめ」の意味は？',
    question_type: '語彙',
    difficulty_level: 'N4',
    choices: [
      {
        choice_id: 'quiz-7-2-1',
        choice_text: '推薦する料理',
        is_correct: true,
        explanation: '「おすすめ」は良いと思うものを勧めることです。'
      },
      {
        choice_id: 'quiz-7-2-2',
        choice_text: '一番高い料理',
        is_correct: false,
        explanation: '高いとは限りません。'
      },
      {
        choice_id: 'quiz-7-2-3',
        choice_text: '一番安い料理',
        is_correct: false,
        explanation: '安いとは限りません。'
      },
      {
        choice_id: 'quiz-7-2-4',
        choice_text: '辛い料理',
        is_correct: false,
        explanation: '辛さは関係ありません。'
      }
    ]
  },
  {
    quiz_id: 'quiz-7-3',
    story_id: '7',
    question_text: '日本のレストランで食事を始める前に何と言いますか？',
    question_type: '文化',
    difficulty_level: 'N4',
    choices: [
      {
        choice_id: 'quiz-7-3-1',
        choice_text: 'いただきます',
        is_correct: true,
        explanation: '日本では食事の前に「いただきます」と言います。'
      },
      {
        choice_id: 'quiz-7-3-2',
        choice_text: 'ごちそうさま',
        is_correct: false,
        explanation: 'これは食後に言います。'
      },
      {
        choice_id: 'quiz-7-3-3',
        choice_text: 'おいしい',
        is_correct: false,
        explanation: 'これは食べている間に言います。'
      },
      {
        choice_id: 'quiz-7-3-4',
        choice_text: 'お願いします',
        is_correct: false,
        explanation: 'これは注文する時に言います。'
      }
    ]
  },

  // ============================================================
  // Story 8: 病院で (At the Hospital) - N4/A2
  // ============================================================
  {
    quiz_id: 'quiz-8-1',
    story_id: '8',
    question_text: '「調子が悪い」の意味は？',
    question_type: '語彙',
    difficulty_level: 'N4',
    choices: [
      {
        choice_id: 'quiz-8-1-1',
        choice_text: '体の具合が良くない',
        is_correct: true,
        explanation: '「調子が悪い」は体調や気分が良くないという意味です。'
      },
      {
        choice_id: 'quiz-8-1-2',
        choice_text: '機械が壊れた',
        is_correct: false,
        explanation: '機械にも使えますが、ここでは体調の意味です。'
      },
      {
        choice_id: 'quiz-8-1-3',
        choice_text: '天気が悪い',
        is_correct: false,
        explanation: '天気には「天気が悪い」と言います。'
      },
      {
        choice_id: 'quiz-8-1-4',
        choice_text: '成績が悪い',
        is_correct: false,
        explanation: '成績には「成績が悪い」と言います。'
      }
    ]
  },
  {
    quiz_id: 'quiz-8-2',
    story_id: '8',
    question_text: '「～てしまいました」は何を表しますか？',
    question_type: '文法',
    difficulty_level: 'N4',
    choices: [
      {
        choice_id: 'quiz-8-2-1',
        choice_text: '完了や後悔',
        is_correct: true,
        explanation: '「～てしまいました」は行為の完了や、残念な気持ちを表します。'
      },
      {
        choice_id: 'quiz-8-2-2',
        choice_text: '未来の予定',
        is_correct: false,
        explanation: '未来は「～ます」や「～でしょう」を使います。'
      },
      {
        choice_id: 'quiz-8-2-3',
        choice_text: '継続',
        is_correct: false,
        explanation: '継続は「～ています」を使います。'
      },
      {
        choice_id: 'quiz-8-2-4',
        choice_text: '依頼',
        is_correct: false,
        explanation: '依頼は「～てください」を使います。'
      }
    ]
  },
  {
    quiz_id: 'quiz-8-3',
    story_id: '8',
    question_text: '日本の病院で、診察の順番を待つ時は？',
    question_type: '文化',
    difficulty_level: 'N4',
    choices: [
      {
        choice_id: 'quiz-8-3-1',
        choice_text: '静かに待つ',
        is_correct: true,
        explanation: '日本では待合室で静かに順番を待つのがマナーです。'
      },
      {
        choice_id: 'quiz-8-3-2',
        choice_text: '大声で話す',
        is_correct: false,
        explanation: '病院では静かにするのがマナーです。'
      },
      {
        choice_id: 'quiz-8-3-3',
        choice_text: '電話で話す',
        is_correct: false,
        explanation: '電話は外でかけます。'
      },
      {
        choice_id: 'quiz-8-3-4',
        choice_text: '音楽を流す',
        is_correct: false,
        explanation: 'イヤホンを使わない限り、音楽は流しません。'
      }
    ]
  },

  // ============================================================
  // Story 9: 郵便局で (At the Post Office) - N4/A2
  // ============================================================
  {
    quiz_id: 'quiz-9-1',
    story_id: '9',
    question_text: '「～を送りたいのですが」は何の意味ですか？',
    question_type: '文法',
    difficulty_level: 'N4',
    choices: [
      {
        choice_id: 'quiz-9-1-1',
        choice_text: '～を送りたいです（丁寧）',
        is_correct: true,
        explanation: '「～のですが」は前置きや柔らかい表現にする言い方です。'
      },
      {
        choice_id: 'quiz-9-1-2',
        choice_text: '～を送ってください',
        is_correct: false,
        explanation: 'これは依頼の表現です。'
      },
      {
        choice_id: 'quiz-9-1-3',
        choice_text: '～を送りました',
        is_correct: false,
        explanation: 'これは過去形です。'
      },
      {
        choice_id: 'quiz-9-1-4',
        choice_text: '～を送りませんか',
        is_correct: false,
        explanation: 'これは勧誘の表現です。'
      }
    ]
  },
  {
    quiz_id: 'quiz-9-2',
    story_id: '9',
    question_text: '「切手」の意味は？',
    question_type: '語彙',
    difficulty_level: 'N4',
    choices: [
      {
        choice_id: 'quiz-9-2-1',
        choice_text: '郵便料金を示すシール',
        is_correct: true,
        explanation: '「切手」は手紙やはがきに貼る、郵便料金を示すシールです。'
      },
      {
        choice_id: 'quiz-9-2-2',
        choice_text: 'はさみ',
        is_correct: false,
        explanation: 'はさみは別の道具です。'
      },
      {
        choice_id: 'quiz-9-2-3',
        choice_text: '封筒',
        is_correct: false,
        explanation: '封筒は手紙を入れるものです。'
      },
      {
        choice_id: 'quiz-9-2-4',
        choice_text: 'お金',
        is_correct: false,
        explanation: '切手はお金の代わりに使いますが、お金ではありません。'
      }
    ]
  },
  {
    quiz_id: 'quiz-9-3',
    story_id: '9',
    question_text: '日本の郵便局で、年賀状を送るのはいつですか？',
    question_type: '文化',
    difficulty_level: 'N4',
    choices: [
      {
        choice_id: 'quiz-9-3-1',
        choice_text: '12月（年末）',
        is_correct: true,
        explanation: '年賀状は12月に出して、1月1日に届くようにします。'
      },
      {
        choice_id: 'quiz-9-3-2',
        choice_text: '1月（年始）',
        is_correct: false,
        explanation: '1月1日に届くように12月に出します。'
      },
      {
        choice_id: 'quiz-9-3-3',
        choice_text: '春',
        is_correct: false,
        explanation: '春ではありません。'
      },
      {
        choice_id: 'quiz-9-3-4',
        choice_text: '夏',
        is_correct: false,
        explanation: '夏ではありません。暑中見舞いは夏です。'
      }
    ]
  },

  // ============================================================
  // Story 10: 朝のあいさつ (Morning Greetings) - N5/A1
  // ============================================================
  {
    quiz_id: 'quiz-10-1',
    story_id: '10',
    question_text: '「おはよう」はいつ使いますか？',
    question_type: '語彙',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-10-1-1',
        choice_text: '朝',
        is_correct: true,
        explanation: '「おはよう」は朝のあいさつです。'
      },
      {
        choice_id: 'quiz-10-1-2',
        choice_text: '昼',
        is_correct: false,
        explanation: '昼は「こんにちは」を使います。'
      },
      {
        choice_id: 'quiz-10-1-3',
        choice_text: '夜',
        is_correct: false,
        explanation: '夜は「こんばんは」を使います。'
      },
      {
        choice_id: 'quiz-10-1-4',
        choice_text: '寝る前',
        is_correct: false,
        explanation: '寝る前は「おやすみなさい」を使います。'
      }
    ]
  },
  {
    quiz_id: 'quiz-10-2',
    story_id: '10',
    question_text: '「いい天気ですね」の「ですね」は何を表しますか？',
    question_type: '文法',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-10-2-1',
        choice_text: '同意を求める／確認する',
        is_correct: true,
        explanation: '「ですね」は相手に同意を求めたり、確認したりする表現です。'
      },
      {
        choice_id: 'quiz-10-2-2',
        choice_text: '質問する',
        is_correct: false,
        explanation: '質問は「ですか」を使います。'
      },
      {
        choice_id: 'quiz-10-2-3',
        choice_text: '命令する',
        is_correct: false,
        explanation: '命令は「てください」などを使います。'
      },
      {
        choice_id: 'quiz-10-2-4',
        choice_text: '否定する',
        is_correct: false,
        explanation: '否定は「ではありません」などを使います。'
      }
    ]
  },
  {
    quiz_id: 'quiz-10-3',
    story_id: '10',
    question_text: '「がんばりましょう」はどんな時に使いますか？',
    question_type: '文化',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-10-3-1',
        choice_text: '励ます時',
        is_correct: true,
        explanation: '「がんばりましょう」は一緒に頑張ろうという励ましの言葉です。'
      },
      {
        choice_id: 'quiz-10-3-2',
        choice_text: '別れる時',
        is_correct: false,
        explanation: '別れる時は「さようなら」などを使います。'
      },
      {
        choice_id: 'quiz-10-3-3',
        choice_text: '食べる前',
        is_correct: false,
        explanation: '食べる前は「いただきます」を使います。'
      },
      {
        choice_id: 'quiz-10-3-4',
        choice_text: '謝る時',
        is_correct: false,
        explanation: '謝る時は「すみません」や「ごめんなさい」を使います。'
      }
    ]
  },

  // ============================================================
  // Story 11: 電車に乗る (Taking the Train) - N5/A1
  // ============================================================
  {
    quiz_id: 'quiz-11-1',
    story_id: '11',
    question_text: '「切符」の意味は？',
    question_type: '語彙',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-11-1-1',
        choice_text: '乗車券',
        is_correct: true,
        explanation: '「切符」は電車やバスに乗るためのチケットです。'
      },
      {
        choice_id: 'quiz-11-1-2',
        choice_text: '時刻表',
        is_correct: false,
        explanation: '時刻表は別のものです。'
      },
      {
        choice_id: 'quiz-11-1-3',
        choice_text: '改札',
        is_correct: false,
        explanation: '改札は切符を通す場所です。'
      },
      {
        choice_id: 'quiz-11-1-4',
        choice_text: '駅',
        is_correct: false,
        explanation: '駅は電車に乗る場所です。'
      }
    ]
  },
  {
    quiz_id: 'quiz-11-2',
    story_id: '11',
    question_text: '「～まで」は何を表しますか？',
    question_type: '文法',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-11-2-1',
        choice_text: '目的地',
        is_correct: true,
        explanation: '「～まで」は終点や目的地を表します。'
      },
      {
        choice_id: 'quiz-11-2-2',
        choice_text: '出発地',
        is_correct: false,
        explanation: '出発地は「～から」を使います。'
      },
      {
        choice_id: 'quiz-11-2-3',
        choice_text: '方法',
        is_correct: false,
        explanation: '方法は「～で」を使います。'
      },
      {
        choice_id: 'quiz-11-2-4',
        choice_text: '理由',
        is_correct: false,
        explanation: '理由は「～から」を使います（文脈で区別）。'
      }
    ]
  },
  {
    quiz_id: 'quiz-11-3',
    story_id: '11',
    question_text: '日本の電車で、優先席は誰のためですか？',
    question_type: '文化',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-11-3-1',
        choice_text: '高齢者、妊婦、障害者など',
        is_correct: true,
        explanation: '優先席は体の不自由な人や高齢者、妊婦のための席です。'
      },
      {
        choice_id: 'quiz-11-3-2',
        choice_text: '子供だけ',
        is_correct: false,
        explanation: '子供だけではありません。'
      },
      {
        choice_id: 'quiz-11-3-3',
        choice_text: '誰でも自由に座れる',
        is_correct: false,
        explanation: '優先席は特定の人のための席です。'
      },
      {
        choice_id: 'quiz-11-3-4',
        choice_text: '駅員専用',
        is_correct: false,
        explanation: '駅員専用ではありません。'
      }
    ]
  },

  // ============================================================
  // Story 12: 図書館で (At the Library) - N5/A1
  // ============================================================
  {
    quiz_id: 'quiz-12-1',
    story_id: '12',
    question_text: '「借りる」の意味は？',
    question_type: '語彙',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-12-1-1',
        choice_text: '他人の物を一時的に使う',
        is_correct: true,
        explanation: '「借りる」は他人の物を一時的に使って、後で返すことです。'
      },
      {
        choice_id: 'quiz-12-1-2',
        choice_text: '買う',
        is_correct: false,
        explanation: '買うは所有権が移ります。'
      },
      {
        choice_id: 'quiz-12-1-3',
        choice_text: 'あげる',
        is_correct: false,
        explanation: 'あげるは与えることです。'
      },
      {
        choice_id: 'quiz-12-1-4',
        choice_text: '売る',
        is_correct: false,
        explanation: '売るはお金をもらって渡すことです。'
      }
    ]
  },
  {
    quiz_id: 'quiz-12-2',
    story_id: '12',
    question_text: '「～てもいいですか」は何を表しますか？',
    question_type: '文法',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-12-2-1',
        choice_text: '許可を求める',
        is_correct: true,
        explanation: '「～てもいいですか」は何かをしてもいいか許可を求める表現です。'
      },
      {
        choice_id: 'quiz-12-2-2',
        choice_text: '命令する',
        is_correct: false,
        explanation: '命令は「～なさい」などを使います。'
      },
      {
        choice_id: 'quiz-12-2-3',
        choice_text: '禁止する',
        is_correct: false,
        explanation: '禁止は「～てはいけません」を使います。'
      },
      {
        choice_id: 'quiz-12-2-4',
        choice_text: '過去を表す',
        is_correct: false,
        explanation: '過去は「～ました」を使います。'
      }
    ]
  },
  {
    quiz_id: 'quiz-12-3',
    story_id: '12',
    question_text: '日本の図書館で大切なマナーは？',
    question_type: '文化',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-12-3-1',
        choice_text: '静かにする',
        is_correct: true,
        explanation: '図書館では他の人のために静かにするのがマナーです。'
      },
      {
        choice_id: 'quiz-12-3-2',
        choice_text: '大きな声で話す',
        is_correct: false,
        explanation: '図書館では静かにします。'
      },
      {
        choice_id: 'quiz-12-3-3',
        choice_text: '音楽を流す',
        is_correct: false,
        explanation: 'イヤホンなしで音楽を流してはいけません。'
      },
      {
        choice_id: 'quiz-12-3-4',
        choice_text: '食事をする',
        is_correct: false,
        explanation: '図書館では食事は禁止です。'
      }
    ]
  },

  // ============================================================
  // Story 13: 公園で遊ぶ (Playing in the Park) - N5/A1
  // ============================================================
  {
    quiz_id: 'quiz-13-1',
    story_id: '13',
    question_text: '「一緒に」の意味は？',
    question_type: '語彙',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-13-1-1',
        choice_text: '共に、同じ時に',
        is_correct: true,
        explanation: '「一緒に」は他の人と共に何かをすることです。'
      },
      {
        choice_id: 'quiz-13-1-2',
        choice_text: '一人で',
        is_correct: false,
        explanation: '一人では「一緒に」の反対です。'
      },
      {
        choice_id: 'quiz-13-1-3',
        choice_text: '後で',
        is_correct: false,
        explanation: '後では時間の表現です。'
      },
      {
        choice_id: 'quiz-13-1-4',
        choice_text: '別々に',
        is_correct: false,
        explanation: '別々には「一緒に」の反対です。'
      }
    ]
  },
  {
    quiz_id: 'quiz-13-2',
    story_id: '13',
    question_text: '「～ましょう」は何を表しますか？',
    question_type: '文法',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-13-2-1',
        choice_text: '誘い、提案',
        is_correct: true,
        explanation: '「～ましょう」は一緒に何かをしようと誘う表現です。'
      },
      {
        choice_id: 'quiz-13-2-2',
        choice_text: '質問',
        is_correct: false,
        explanation: '質問は「ですか」を使います。'
      },
      {
        choice_id: 'quiz-13-2-3',
        choice_text: '過去',
        is_correct: false,
        explanation: '過去は「ました」を使います。'
      },
      {
        choice_id: 'quiz-13-2-4',
        choice_text: '否定',
        is_correct: false,
        explanation: '否定は「ません」を使います。'
      }
    ]
  },
  {
    quiz_id: 'quiz-13-3',
    story_id: '13',
    question_text: '日本の公園で、ゴミはどうしますか？',
    question_type: '文化',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-13-3-1',
        choice_text: 'ゴミ箱に捨てるか持ち帰る',
        is_correct: true,
        explanation: '日本では公園のゴミは自分で持ち帰るか、ゴミ箱に捨てます。'
      },
      {
        choice_id: 'quiz-13-3-2',
        choice_text: '地面に捨てる',
        is_correct: false,
        explanation: '地面に捨ててはいけません。'
      },
      {
        choice_id: 'quiz-13-3-3',
        choice_text: '木の下に置く',
        is_correct: false,
        explanation: '木の下に置いてはいけません。'
      },
      {
        choice_id: 'quiz-13-3-4',
        choice_text: '池に捨てる',
        is_correct: false,
        explanation: '池に捨ててはいけません。'
      }
    ]
  },

  // ============================================================
  // Story 14: 家族の紹介 (Introducing Family) - N5/A1
  // ============================================================
  {
    quiz_id: 'quiz-14-1',
    story_id: '14',
    question_text: '「家族」の意味は？',
    question_type: '語彙',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-14-1-1',
        choice_text: '親や兄弟など一緒に住む人々',
        is_correct: true,
        explanation: '「家族」は親、兄弟、祖父母など血縁関係のある人々です。'
      },
      {
        choice_id: 'quiz-14-1-2',
        choice_text: '友達',
        is_correct: false,
        explanation: '友達は家族ではありません。'
      },
      {
        choice_id: 'quiz-14-1-3',
        choice_text: '先生',
        is_correct: false,
        explanation: '先生は家族ではありません。'
      },
      {
        choice_id: 'quiz-14-1-4',
        choice_text: '隣の人',
        is_correct: false,
        explanation: '隣の人は家族ではありません。'
      }
    ]
  },
  {
    quiz_id: 'quiz-14-2',
    story_id: '14',
    question_text: '「兄」と「お兄さん」の違いは？',
    question_type: '文法',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-14-2-1',
        choice_text: '「兄」は自分の、「お兄さん」は他人の',
        is_correct: true,
        explanation: '自分の家族は「兄」、他人の家族は「お兄さん」と言います。'
      },
      {
        choice_id: 'quiz-14-2-2',
        choice_text: '同じ意味',
        is_correct: false,
        explanation: '使い分けがあります。'
      },
      {
        choice_id: 'quiz-14-2-3',
        choice_text: '「兄」は年上、「お兄さん」は年下',
        is_correct: false,
        explanation: '年齢は関係ありません。'
      },
      {
        choice_id: 'quiz-14-2-4',
        choice_text: '「兄」は敬語',
        is_correct: false,
        explanation: '「お兄さん」の方が丁寧です。'
      }
    ]
  },
  {
    quiz_id: 'quiz-14-3',
    story_id: '14',
    question_text: '日本で家族を紹介する時、敬語を使いますか？',
    question_type: '文化',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-14-3-1',
        choice_text: '自分の家族には使わない',
        is_correct: true,
        explanation: '他人に自分の家族を紹介する時は、謙遜して敬語を使いません。'
      },
      {
        choice_id: 'quiz-14-3-2',
        choice_text: '必ず使う',
        is_correct: false,
        explanation: '自分の家族には使いません。'
      },
      {
        choice_id: 'quiz-14-3-3',
        choice_text: '両親だけ使う',
        is_correct: false,
        explanation: '両親にも使いません。'
      },
      {
        choice_id: 'quiz-14-3-4',
        choice_text: '祖父母だけ使う',
        is_correct: false,
        explanation: '祖父母にも使いません。'
      }
    ]
  },

  // ============================================================
  // Story 15: 誕生日パーティー (Birthday Party) - N5/A1
  // ============================================================
  {
    quiz_id: 'quiz-15-1',
    story_id: '15',
    question_text: '「おめでとう」はいつ使いますか？',
    question_type: '語彙',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-15-1-1',
        choice_text: 'お祝いの時',
        is_correct: true,
        explanation: '「おめでとう」は誕生日や合格など、おめでたいことを祝う言葉です。'
      },
      {
        choice_id: 'quiz-15-1-2',
        choice_text: '悲しい時',
        is_correct: false,
        explanation: '悲しい時には使いません。'
      },
      {
        choice_id: 'quiz-15-1-3',
        choice_text: '怒っている時',
        is_correct: false,
        explanation: '怒っている時には使いません。'
      },
      {
        choice_id: 'quiz-15-1-4',
        choice_text: '別れる時',
        is_correct: false,
        explanation: '別れる時は「さようなら」を使います。'
      }
    ]
  },
  {
    quiz_id: 'quiz-15-2',
    story_id: '15',
    question_text: '「～歳」の読み方は？',
    question_type: '文法',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-15-2-1',
        choice_text: 'さい',
        is_correct: true,
        explanation: '年齢を表す時は「～歳（さい）」と読みます。例：20歳（はたち）は例外。'
      },
      {
        choice_id: 'quiz-15-2-2',
        choice_text: 'とし',
        is_correct: false,
        explanation: '「歳」単独では「とし」と読みますが、年齢では「さい」です。'
      },
      {
        choice_id: 'quiz-15-2-3',
        choice_text: 'ねん',
        is_correct: false,
        explanation: '「年」は「ねん」ですが、年齢では「さい」を使います。'
      },
      {
        choice_id: 'quiz-15-2-4',
        choice_text: 'さつ',
        is_correct: false,
        explanation: '「さつ」は本などの数え方です。'
      }
    ]
  },
  {
    quiz_id: 'quiz-15-3',
    story_id: '15',
    question_text: '日本の誕生日パーティーで、ケーキをどうしますか？',
    question_type: '文化',
    difficulty_level: 'N5',
    choices: [
      {
        choice_id: 'quiz-15-3-1',
        choice_text: 'ろうそくを吹き消してから切る',
        is_correct: true,
        explanation: '日本でもケーキにろうそくを立てて、吹き消してから切り分けます。'
      },
      {
        choice_id: 'quiz-15-3-2',
        choice_text: 'そのまま食べる',
        is_correct: false,
        explanation: '切り分けて食べます。'
      },
      {
        choice_id: 'quiz-15-3-3',
        choice_text: '飾るだけ',
        is_correct: false,
        explanation: 'ケーキは食べます。'
      },
      {
        choice_id: 'quiz-15-3-4',
        choice_text: '投げる',
        is_correct: false,
        explanation: 'ケーキは投げません。'
      }
    ]
  },
];

async function createQuizzes() {
  console.log('Creating quizzes for all stories (1-15)...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const quizData of allQuizzes) {
    try {
      // Create quiz
      await prisma.quiz.create({
        data: {
          quiz_id: quizData.quiz_id,
          story_id: quizData.story_id,
          question_text: quizData.question_text,
          question_type: quizData.question_type,
          difficulty_level: quizData.difficulty_level,
          is_ai_generated: false,
          source_text: `Story ${quizData.story_id}`,
        },
      });

      // Create choices
      await prisma.quizChoice.createMany({
        data: quizData.choices.map((choice) => ({
          choice_id: choice.choice_id,
          quiz_id: quizData.quiz_id,
          choice_text: choice.choice_text,
          is_correct: choice.is_correct,
          explanation: choice.explanation,
        })),
      });

      console.log(`✓ Created ${quizData.quiz_id}: ${quizData.question_text.substring(0, 40)}...`);
      successCount++;
    } catch (error: any) {
      console.error(`✗ Error creating ${quizData.quiz_id}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n✅ Quiz creation complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total: ${allQuizzes.length}`);
}

// Execute
createQuizzes()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
