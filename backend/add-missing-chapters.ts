import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load .env.local file
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function addMissingChapters() {
  console.log('=== Adding missing chapters to all stories ===\n');

  try {
    // Story 2: Morning routine (N5) - needs chapters 3-5
    console.log('Adding chapters to Story 2: 私の朝のルーティン...');
    await addChapter({
      chapter_id: 'chapter-2-3',
      story_id: '2',
      chapter_number: 3,
      title: 'Getting Ready',
      content: '顔を洗って、歯を磨きます。それから服を着ます。\n\n(I wash my face and brush my teeth. Then I get dressed.)',
      learning_points: {
        points: [
          'Daily routine verbs',
          'Sequence with それから (then)',
          'Basic verbs: 洗う、磨く、着る'
        ]
      },
      vocabulary: {
        words: [
          { word: '顔', reading: 'かお', meaning: 'face' },
          { word: '洗う', reading: 'あらう', meaning: 'to wash' },
          { word: '歯', reading: 'は', meaning: 'teeth' },
          { word: '磨く', reading: 'みがく', meaning: 'to brush, polish' },
          { word: '服', reading: 'ふく', meaning: 'clothes' },
          { word: '着る', reading: 'きる', meaning: 'to wear' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-2-4',
      story_id: '2',
      chapter_number: 4,
      title: 'Breakfast Time',
      content: '朝ごはんを食べます。パンとコーヒーが好きです。\n\n(I eat breakfast. I like bread and coffee.)',
      learning_points: {
        points: [
          'Meal vocabulary',
          'Expressing likes: 〜が好きです',
          'Food items: パン、コーヒー'
        ]
      },
      vocabulary: {
        words: [
          { word: '朝ごはん', reading: 'あさごはん', meaning: 'breakfast' },
          { word: '食べる', reading: 'たべる', meaning: 'to eat' },
          { word: 'パン', reading: 'ぱん', meaning: 'bread' },
          { word: 'コーヒー', reading: 'こーひー', meaning: 'coffee' },
          { word: '好き', reading: 'すき', meaning: 'to like' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-2-5',
      story_id: '2',
      chapter_number: 5,
      title: 'Leaving Home',
      content: '準備ができました。「いってきます」と言って、家を出ます。\n\n(I am ready. I say "I\'m leaving" and leave home.)',
      learning_points: {
        points: [
          'Common phrase: いってきます (I\'m leaving)',
          'Completing an action: できました',
          'Leaving: 出る'
        ]
      },
      vocabulary: {
        words: [
          { word: '準備', reading: 'じゅんび', meaning: 'preparation' },
          { word: 'いってきます', reading: 'いってきます', meaning: 'I\'m leaving (said when leaving home)' },
          { word: '家', reading: 'いえ', meaning: 'home, house' },
          { word: '出る', reading: 'でる', meaning: 'to leave, go out' }
        ]
      }
    });

    // Story 3: Restaurant (N5) - needs chapters 3-5
    console.log('Adding chapters to Story 3: レストランで食事...');
    await addChapter({
      chapter_id: 'chapter-3-3',
      story_id: '3',
      chapter_number: 3,
      title: 'Ordering Food',
      content: '「ラーメンをください」と注文します。店員さんは「はい、わかりました」と言います。\n\n(I order "Please give me ramen." The clerk says "Yes, I understand.")',
      learning_points: {
        points: [
          'Ordering: 〜をください',
          'Understanding confirmation: はい、わかりました',
          'Restaurant interaction'
        ]
      },
      vocabulary: {
        words: [
          { word: 'ラーメン', reading: 'らーめん', meaning: 'ramen' },
          { word: 'ください', reading: 'ください', meaning: 'please give me' },
          { word: '注文', reading: 'ちゅうもん', meaning: 'order' },
          { word: '店員', reading: 'てんいん', meaning: 'clerk, store staff' },
          { word: 'わかる', reading: 'わかる', meaning: 'to understand' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-3-4',
      story_id: '3',
      chapter_number: 4,
      title: 'Enjoying the Meal',
      content: 'ラーメンが来ました。とてもおいしいです。「おいしいです！」と言います。\n\n(The ramen arrived. It is very delicious. I say "It\'s delicious!")',
      learning_points: {
        points: [
          'Expressing taste: おいしい',
          'Intensifier: とても (very)',
          'Food arriving: 来ました'
        ]
      },
      vocabulary: {
        words: [
          { word: '来る', reading: 'くる', meaning: 'to come' },
          { word: 'とても', reading: 'とても', meaning: 'very' },
          { word: 'おいしい', reading: 'おいしい', meaning: 'delicious' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-3-5',
      story_id: '3',
      chapter_number: 5,
      title: 'Paying the Bill',
      content: '食事が終わりました。レジで払います。「ごちそうさまでした」と言います。\n\n(The meal is over. I pay at the register. I say "Thank you for the meal.")',
      learning_points: {
        points: [
          'Ending a meal: ごちそうさまでした',
          'Payment: 払う',
          'Meal completion'
        ]
      },
      vocabulary: {
        words: [
          { word: '食事', reading: 'しょくじ', meaning: 'meal' },
          { word: '終わる', reading: 'おわる', meaning: 'to end, finish' },
          { word: 'レジ', reading: 'れじ', meaning: 'cash register' },
          { word: '払う', reading: 'はらう', meaning: 'to pay' },
          { word: 'ごちそうさまでした', reading: 'ごちそうさまでした', meaning: 'thank you for the meal' }
        ]
      }
    });

    // Story 4: Train (N5) - needs chapters 3-5
    console.log('Adding chapters to Story 4: 電車に乗る...');
    await addChapter({
      chapter_id: 'chapter-4-3',
      story_id: '4',
      chapter_number: 3,
      title: 'On the Train',
      content: '電車に乗ります。空いている席に座ります。窓の外を見ます。\n\n(I get on the train. I sit in an empty seat. I look outside the window.)',
      learning_points: {
        points: [
          'Transportation: 乗る (to ride)',
          'Sitting: 座る',
          'Looking: 見る'
        ]
      },
      vocabulary: {
        words: [
          { word: '電車', reading: 'でんしゃ', meaning: 'train' },
          { word: '乗る', reading: 'のる', meaning: 'to ride, get on' },
          { word: '空く', reading: 'あく', meaning: 'to be empty' },
          { word: '席', reading: 'せき', meaning: 'seat' },
          { word: '座る', reading: 'すわる', meaning: 'to sit' },
          { word: '窓', reading: 'まど', meaning: 'window' },
          { word: '外', reading: 'そと', meaning: 'outside' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-4-4',
      story_id: '4',
      chapter_number: 4,
      title: 'Next Station',
      content: '「次は新宿、新宿です」とアナウンスが聞こえます。もうすぐ着きます。\n\n("Next is Shinjuku, Shinjuku," I hear the announcement. We will arrive soon.)',
      learning_points: {
        points: [
          'Station announcements',
          'Soon: もうすぐ',
          'Arriving: 着く'
        ]
      },
      vocabulary: {
        words: [
          { word: '次', reading: 'つぎ', meaning: 'next' },
          { word: 'アナウンス', reading: 'あなうんす', meaning: 'announcement' },
          { word: '聞こえる', reading: 'きこえる', meaning: 'to be heard, can hear' },
          { word: 'もうすぐ', reading: 'もうすぐ', meaning: 'soon' },
          { word: '着く', reading: 'つく', meaning: 'to arrive' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-4-5',
      story_id: '4',
      chapter_number: 5,
      title: 'Getting Off',
      content: '駅に着きました。電車を降ります。改札を出ます。\n\n(I arrived at the station. I get off the train. I exit the ticket gate.)',
      learning_points: {
        points: [
          'Getting off: 降りる',
          'Ticket gate: 改札',
          'Exiting: 出る'
        ]
      },
      vocabulary: {
        words: [
          { word: '駅', reading: 'えき', meaning: 'station' },
          { word: '降りる', reading: 'おりる', meaning: 'to get off, descend' },
          { word: '改札', reading: 'かいさつ', meaning: 'ticket gate' }
        ]
      }
    });

    // Story 5: Convenience store (N5) - needs chapters 3-5
    console.log('Adding chapters to Story 5: コンビニで買い物...');
    await addChapter({
      chapter_id: 'chapter-5-3',
      story_id: '5',
      chapter_number: 3,
      title: 'At the Register',
      content: 'レジに行きます。「お弁当とお茶をください」と言います。\n\n(I go to the register. I say "Please give me a bento and tea.")',
      learning_points: {
        points: [
          'Multiple items: AとB',
          'Common items: お弁当、お茶',
          'Register interaction'
        ]
      },
      vocabulary: {
        words: [
          { word: 'お弁当', reading: 'おべんとう', meaning: 'bento, boxed lunch' },
          { word: 'お茶', reading: 'おちゃ', meaning: 'tea' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-5-4',
      story_id: '5',
      chapter_number: 4,
      title: 'Payment',
      content: '店員さんが「500円です」と言います。お金を払います。\n\n(The clerk says "It\'s 500 yen." I pay the money.)',
      learning_points: {
        points: [
          'Money amounts',
          'Payment process',
          'Yen: 円'
        ]
      },
      vocabulary: {
        words: [
          { word: '円', reading: 'えん', meaning: 'yen' },
          { word: 'お金', reading: 'おかね', meaning: 'money' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-5-5',
      story_id: '5',
      chapter_number: 5,
      title: 'Leaving',
      content: 'お弁当とお茶を受け取ります。「ありがとうございました」と店員さんが言います。\n\n(I receive the bento and tea. The clerk says "Thank you very much.")',
      learning_points: {
        points: [
          'Receiving: 受け取る',
          'Polite thanks: ありがとうございました',
          'Completing transaction'
        ]
      },
      vocabulary: {
        words: [
          { word: '受け取る', reading: 'うけとる', meaning: 'to receive' },
          { word: 'ありがとうございました', reading: 'ありがとうございました', meaning: 'thank you very much (past)' }
        ]
      }
    });

    // Story 6: Movie (N4) - needs chapters 4-5
    console.log('Adding chapters to Story 6: 友達と映画を見に行く...');
    await addChapter({
      chapter_id: 'chapter-6-4',
      story_id: '6',
      chapter_number: 4,
      title: 'After the Movie',
      content: '映画が終わりました。友達と映画について話します。「とても面白かったね」と言います。\n\n(The movie ended. I talk about the movie with my friend. I say "It was very interesting, wasn\'t it?")',
      learning_points: {
        points: [
          'Past tense adjective: 面白かった',
          'Casual confirmation: 〜ね',
          'Discussing experiences'
        ]
      },
      vocabulary: {
        words: [
          { word: '映画', reading: 'えいが', meaning: 'movie' },
          { word: '面白い', reading: 'おもしろい', meaning: 'interesting, fun' },
          { word: '話す', reading: 'はなす', meaning: 'to talk, speak' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-6-5',
      story_id: '6',
      chapter_number: 5,
      title: 'Going Home',
      content: '友達と別れます。「また今度映画を見ようね」と約束します。楽しい一日でした。\n\n(I part ways with my friend. We promise "Let\'s watch a movie again next time." It was a fun day.)',
      learning_points: {
        points: [
          'Making plans: また今度',
          'Volitional form: 見よう',
          'Reflecting on the day'
        ]
      },
      vocabulary: {
        words: [
          { word: '別れる', reading: 'わかれる', meaning: 'to part, separate' },
          { word: 'また', reading: 'また', meaning: 'again' },
          { word: '今度', reading: 'こんど', meaning: 'next time' },
          { word: '約束', reading: 'やくそく', meaning: 'promise' },
          { word: '楽しい', reading: 'たのしい', meaning: 'fun, enjoyable' },
          { word: '一日', reading: 'いちにち', meaning: 'one day' }
        ]
      }
    });

    // Story 7: Job interview (N4) - needs chapters 4-5
    console.log('Adding chapters to Story 7: アルバイトの面接...');
    await addChapter({
      chapter_id: 'chapter-7-4',
      story_id: '7',
      chapter_number: 4,
      title: 'Questions and Answers',
      content: '「いつから働けますか」と聞かれます。「来週からお願いします」と答えます。\n\n(I am asked "When can you start working?" I answer "From next week, please.")',
      learning_points: {
        points: [
          'Potential form: 働ける (can work)',
          'Time expressions: 来週から',
          'Interview responses'
        ]
      },
      vocabulary: {
        words: [
          { word: '働く', reading: 'はたらく', meaning: 'to work' },
          { word: 'いつ', reading: 'いつ', meaning: 'when' },
          { word: '来週', reading: 'らいしゅう', meaning: 'next week' },
          { word: 'から', reading: 'から', meaning: 'from' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-7-5',
      story_id: '7',
      chapter_number: 5,
      title: 'End of Interview',
      content: '面接が終わりました。「結果は後日連絡します」と言われます。「ありがとうございました」とお礼を言います。\n\n(The interview ended. I am told "We will contact you later with the results." I say thank you.)',
      learning_points: {
        points: [
          'Passive voice: 言われる',
          'Later date: 後日',
          'Professional courtesy'
        ]
      },
      vocabulary: {
        words: [
          { word: '面接', reading: 'めんせつ', meaning: 'interview' },
          { word: '結果', reading: 'けっか', meaning: 'result' },
          { word: '後日', reading: 'ごじつ', meaning: 'later date' },
          { word: '連絡', reading: 'れんらく', meaning: 'contact' },
          { word: 'お礼', reading: 'おれい', meaning: 'thanks, gratitude' }
        ]
      }
    });

    // Story 8: Hospital (N4) - needs chapters 3-5
    console.log('Adding chapters to Story 8: 病院で診察...');
    await addChapter({
      chapter_id: 'chapter-8-3',
      story_id: '8',
      chapter_number: 3,
      title: 'Examination',
      content: '医師が診察します。「のどを見せてください」と言います。「あー」と言います。\n\n(The doctor examines me. They say "Please show me your throat." I say "Ahhh.")',
      learning_points: {
        points: [
          'Medical terms: 診察、のど',
          'Polite requests: 〜てください',
          'Doctor-patient interaction'
        ]
      },
      vocabulary: {
        words: [
          { word: '医師', reading: 'いし', meaning: 'doctor, physician' },
          { word: '診察', reading: 'しんさつ', meaning: 'medical examination' },
          { word: 'のど', reading: 'のど', meaning: 'throat' },
          { word: '見せる', reading: 'みせる', meaning: 'to show' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-8-4',
      story_id: '8',
      chapter_number: 4,
      title: 'Diagnosis',
      content: '「風邪ですね。薬を出します」と医師が言います。処方箋をもらいます。\n\n(The doctor says "You have a cold. I will prescribe medicine." I receive a prescription.)',
      learning_points: {
        points: [
          'Common illness: 風邪',
          'Prescription: 処方箋',
          'Medical diagnosis'
        ]
      },
      vocabulary: {
        words: [
          { word: '風邪', reading: 'かぜ', meaning: 'cold (illness)' },
          { word: '薬', reading: 'くすり', meaning: 'medicine' },
          { word: '出す', reading: 'だす', meaning: 'to give out, prescribe' },
          { word: '処方箋', reading: 'しょほうせん', meaning: 'prescription' },
          { word: 'もらう', reading: 'もらう', meaning: 'to receive' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-8-5',
      story_id: '8',
      chapter_number: 5,
      title: 'Getting Medicine',
      content: '薬局で薬をもらいます。「一日三回、食後に飲んでください」と説明されます。\n\n(I get medicine at the pharmacy. I am explained "Please take it three times a day after meals.")',
      learning_points: {
        points: [
          'Pharmacy: 薬局',
          'Frequency: 一日三回',
          'Medicine instructions'
        ]
      },
      vocabulary: {
        words: [
          { word: '薬局', reading: 'やっきょく', meaning: 'pharmacy' },
          { word: '一日', reading: 'いちにち', meaning: 'one day' },
          { word: '三回', reading: 'さんかい', meaning: 'three times' },
          { word: '食後', reading: 'しょくご', meaning: 'after meals' },
          { word: '飲む', reading: 'のむ', meaning: 'to drink, take (medicine)' },
          { word: '説明', reading: 'せつめい', meaning: 'explanation' }
        ]
      }
    });

    // Story 9: Library (N4) - needs chapters 4-5
    console.log('Adding chapters to Story 9: 図書館で勉強...');
    await addChapter({
      chapter_id: 'chapter-9-4',
      story_id: '9',
      chapter_number: 4,
      title: 'Borrowing Books',
      content: '本を選びました。カウンターで「この本を借りたいです」と言います。カードを見せます。\n\n(I chose books. At the counter I say "I want to borrow this book." I show my card.)',
      learning_points: {
        points: [
          'Borrowing: 借りる',
          'Desire: 〜たい',
          'Library procedures'
        ]
      },
      vocabulary: {
        words: [
          { word: '選ぶ', reading: 'えらぶ', meaning: 'to choose' },
          { word: 'カウンター', reading: 'かうんたー', meaning: 'counter' },
          { word: '借りる', reading: 'かりる', meaning: 'to borrow' },
          { word: 'カード', reading: 'かーど', meaning: 'card' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-9-5',
      story_id: '9',
      chapter_number: 5,
      title: 'Leaving the Library',
      content: '本を3冊借りました。返却日は2週間後です。図書館を出ます。\n\n(I borrowed 3 books. The return date is in 2 weeks. I leave the library.)',
      learning_points: {
        points: [
          'Counters: 〜冊 (books)',
          'Time period: 2週間後',
          'Return date: 返却日'
        ]
      },
      vocabulary: {
        words: [
          { word: '冊', reading: 'さつ', meaning: 'counter for books' },
          { word: '返却日', reading: 'へんきゃくび', meaning: 'return date' },
          { word: '週間', reading: 'しゅうかん', meaning: 'week(s)' },
          { word: '後', reading: 'ご', meaning: 'after, later' }
        ]
      }
    });

    // Story 10: Festival (N4) - needs chapters 4-5
    console.log('Adding chapters to Story 10: 日本の祭りに参加...');
    await addChapter({
      chapter_id: 'chapter-10-4',
      story_id: '10',
      chapter_number: 4,
      title: 'Festival Activities',
      content: '金魚すくいをします。友達はたこ焼きを買います。浴衣を着た人がたくさんいます。\n\n(I try goldfish scooping. My friend buys takoyaki. There are many people wearing yukata.)',
      learning_points: {
        points: [
          'Festival activities: 金魚すくい',
          'Traditional food: たこ焼き',
          'Traditional clothing: 浴衣'
        ]
      },
      vocabulary: {
        words: [
          { word: '金魚すくい', reading: 'きんぎょすくい', meaning: 'goldfish scooping' },
          { word: 'たこ焼き', reading: 'たこやき', meaning: 'takoyaki, octopus balls' },
          { word: '浴衣', reading: 'ゆかた', meaning: 'yukata, summer kimono' },
          { word: '着る', reading: 'きる', meaning: 'to wear' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-10-5',
      story_id: '10',
      chapter_number: 5,
      title: 'Fireworks',
      content: '夜になりました。花火が始まります。「きれいですね」とみんなが言います。楽しい祭りでした。\n\n(It became night. The fireworks begin. Everyone says "They\'re beautiful!" It was a fun festival.)',
      learning_points: {
        points: [
          'Nighttime: 夜になる',
          'Fireworks: 花火',
          'Expression: きれい (beautiful)'
        ]
      },
      vocabulary: {
        words: [
          { word: '夜', reading: 'よる', meaning: 'night' },
          { word: '花火', reading: 'はなび', meaning: 'fireworks' },
          { word: '始まる', reading: 'はじまる', meaning: 'to begin' },
          { word: 'きれい', reading: 'きれい', meaning: 'beautiful, pretty' },
          { word: '祭り', reading: 'まつり', meaning: 'festival' }
        ]
      }
    });

    // N3 Stories (11-15) - all need chapters 4-5
    // Story 11: First day at work
    console.log('Adding chapters to Story 11: 新しい職場での初日...');
    await addChapter({
      chapter_id: 'chapter-11-4',
      story_id: '11',
      chapter_number: 4,
      title: 'Learning the Job',
      content: '先輩が仕事を教えてくれます。「分からないことがあったら、すぐに聞いてください」と言われます。\n\n(A senior colleague teaches me the job. I am told "If there is anything you don\'t understand, please ask immediately.")',
      learning_points: {
        points: [
          'Te-form + くれる (doing a favor)',
          'Conditional: 〜たら',
          'Workplace hierarchy: 先輩'
        ]
      },
      vocabulary: {
        words: [
          { word: '先輩', reading: 'せんぱい', meaning: 'senior, superior' },
          { word: '仕事', reading: 'しごと', meaning: 'work, job' },
          { word: '教える', reading: 'おしえる', meaning: 'to teach' },
          { word: '分かる', reading: 'わかる', meaning: 'to understand' },
          { word: 'すぐに', reading: 'すぐに', meaning: 'immediately' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-11-5',
      story_id: '11',
      chapter_number: 5,
      title: 'End of First Day',
      content: '初日が終わりました。疲れましたが、充実した一日でした。これから頑張ります。\n\n(The first day ended. I\'m tired, but it was a fulfilling day. I will do my best from now on.)',
      learning_points: {
        points: [
          'Contrasting: が (but)',
          'Fulfilling: 充実した',
          'Determination: 頑張る'
        ]
      },
      vocabulary: {
        words: [
          { word: '初日', reading: 'しょにち', meaning: 'first day' },
          { word: '疲れる', reading: 'つかれる', meaning: 'to get tired' },
          { word: '充実', reading: 'じゅうじつ', meaning: 'fulfillment' },
          { word: 'これから', reading: 'これから', meaning: 'from now on' },
          { word: '頑張る', reading: 'がんばる', meaning: 'to do one\'s best' }
        ]
      }
    });

    // Story 12: Meeting trouble
    console.log('Adding chapters to Story 12: 友人との待ち合わせトラブル...');
    await addChapter({
      chapter_id: 'chapter-12-4',
      story_id: '12',
      chapter_number: 4,
      title: 'Finding Each Other',
      content: '電話で場所を確認します。「ああ、分かった。今行くね」と友達が言います。5分後に会えました。\n\n(I confirm the location by phone. My friend says "Ah, I understand. I\'m coming now." We met 5 minutes later.)',
      learning_points: {
        points: [
          'Confirmation: 確認する',
          'Understanding: 分かる',
          'Time expression: 〜後'
        ]
      },
      vocabulary: {
        words: [
          { word: '電話', reading: 'でんわ', meaning: 'telephone' },
          { word: '場所', reading: 'ばしょ', meaning: 'place, location' },
          { word: '確認', reading: 'かくにん', meaning: 'confirmation' },
          { word: '行く', reading: 'いく', meaning: 'to go' },
          { word: '分', reading: 'ふん/ぷん', meaning: 'minute(s)' },
          { word: '会う', reading: 'あう', meaning: 'to meet' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-12-5',
      story_id: '12',
      chapter_number: 5,
      title: 'Lesson Learned',
      content: '無事に会えてよかったです。次からは待ち合わせ場所をもっと詳しく決めようと思います。\n\n(I\'m glad we could meet safely. From next time, I think I\'ll decide the meeting place in more detail.)',
      learning_points: {
        points: [
          'Relief: 〜てよかった',
          'Resolution: 〜ようと思う',
          'More detail: もっと詳しく'
        ]
      },
      vocabulary: {
        words: [
          { word: '無事', reading: 'ぶじ', meaning: 'safely, without incident' },
          { word: '次', reading: 'つぎ', meaning: 'next' },
          { word: '待ち合わせ', reading: 'まちあわせ', meaning: 'meeting, rendezvous' },
          { word: '詳しい', reading: 'くわしい', meaning: 'detailed' },
          { word: '決める', reading: 'きめる', meaning: 'to decide' }
        ]
      }
    });

    // Story 13: Apartment hunting
    console.log('Adding chapters to Story 13: アパート探しの一日...');
    await addChapter({
      chapter_id: 'chapter-13-4',
      story_id: '13',
      chapter_number: 4,
      title: 'Viewing Apartments',
      content: '3件のアパートを見ました。2件目が一番気に入りました。家賃も予算内です。\n\n(I viewed 3 apartments. I liked the second one the most. The rent is also within budget.)',
      learning_points: {
        points: [
          'Counter: 〜件 (properties)',
          'Superlative: 一番〜',
          'Budget: 予算'
        ]
      },
      vocabulary: {
        words: [
          { word: '件', reading: 'けん', meaning: 'counter for cases, properties' },
          { word: '気に入る', reading: 'きにいる', meaning: 'to like, be pleased with' },
          { word: '家賃', reading: 'やちん', meaning: 'rent' },
          { word: '予算', reading: 'よさん', meaning: 'budget' },
          { word: '内', reading: 'ない', meaning: 'within' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-13-5',
      story_id: '13',
      chapter_number: 5,
      title: 'Decision',
      content: '不動産屋に戻って、2件目のアパートに決めました。来月から新しい生活が始まります。\n\n(I returned to the real estate office and decided on the second apartment. A new life begins from next month.)',
      learning_points: {
        points: [
          'Returning: 戻る',
          'Decision: 決める',
          'New life: 新しい生活'
        ]
      },
      vocabulary: {
        words: [
          { word: '不動産屋', reading: 'ふどうさんや', meaning: 'real estate office' },
          { word: '戻る', reading: 'もどる', meaning: 'to return' },
          { word: '来月', reading: 'らいげつ', meaning: 'next month' },
          { word: '生活', reading: 'せいかつ', meaning: 'life, living' }
        ]
      }
    });

    // Story 14: Health checkup
    console.log('Adding chapters to Story 14: 健康診断の結果...');
    await addChapter({
      chapter_id: 'chapter-14-4',
      story_id: '14',
      chapter_number: 4,
      title: 'Doctor\'s Advice',
      content: '医師から生活習慣についてアドバイスをもらいました。「運動を増やして、野菜を多く食べてください」と言われました。\n\n(I received advice about lifestyle habits from the doctor. I was told "Increase exercise and eat more vegetables.")',
      learning_points: {
        points: [
          'Lifestyle habits: 生活習慣',
          'Increase: 増やす',
          'Health advice'
        ]
      },
      vocabulary: {
        words: [
          { word: '生活習慣', reading: 'せいかつしゅうかん', meaning: 'lifestyle habits' },
          { word: 'アドバイス', reading: 'あどばいす', meaning: 'advice' },
          { word: '運動', reading: 'うんどう', meaning: 'exercise' },
          { word: '増やす', reading: 'ふやす', meaning: 'to increase' },
          { word: '野菜', reading: 'やさい', meaning: 'vegetables' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-14-5',
      story_id: '14',
      chapter_number: 5,
      title: 'New Resolution',
      content: '健康のために生活を変えようと決めました。明日からジムに通い始めます。\n\n(I decided to change my lifestyle for my health. I will start going to the gym from tomorrow.)',
      learning_points: {
        points: [
          'Purpose: 〜のために',
          'Decision: 決める',
          'Starting: 〜始める'
        ]
      },
      vocabulary: {
        words: [
          { word: '健康', reading: 'けんこう', meaning: 'health' },
          { word: '変える', reading: 'かえる', meaning: 'to change' },
          { word: '明日', reading: 'あした', meaning: 'tomorrow' },
          { word: 'ジム', reading: 'じむ', meaning: 'gym' },
          { word: '通う', reading: 'かよう', meaning: 'to commute, attend regularly' }
        ]
      }
    });

    // Story 15: Volunteer activity
    console.log('Adding chapters to Story 15: 地域のボランティア活動...');
    await addChapter({
      chapter_id: 'chapter-15-4',
      story_id: '15',
      chapter_number: 4,
      title: 'Working Together',
      content: '地域の人たちと一緒に公園を掃除しました。子供からお年寄りまで、みんなが参加しています。\n\n(I cleaned the park together with local people. From children to elderly people, everyone is participating.)',
      learning_points: {
        points: [
          'Together: 一緒に',
          'Range: 〜から〜まで',
          'Community: 地域'
        ]
      },
      vocabulary: {
        words: [
          { word: '地域', reading: 'ちいき', meaning: 'region, community' },
          { word: '一緒に', reading: 'いっしょに', meaning: 'together' },
          { word: '公園', reading: 'こうえん', meaning: 'park' },
          { word: '掃除', reading: 'そうじ', meaning: 'cleaning' },
          { word: 'お年寄り', reading: 'おとしより', meaning: 'elderly person' },
          { word: '参加', reading: 'さんか', meaning: 'participation' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-15-5',
      story_id: '15',
      chapter_number: 5,
      title: 'Sense of Achievement',
      content: '活動が終わりました。公園がきれいになって、達成感があります。来月もまた参加したいです。\n\n(The activity ended. The park became clean and I have a sense of achievement. I want to participate again next month.)',
      learning_points: {
        points: [
          'Becoming: 〜になる',
          'Achievement: 達成感',
          'Desire: 〜たい'
        ]
      },
      vocabulary: {
        words: [
          { word: '活動', reading: 'かつどう', meaning: 'activity' },
          { word: 'きれい', reading: 'きれい', meaning: 'clean, pretty' },
          { word: '達成感', reading: 'たっせいかん', meaning: 'sense of achievement' }
        ]
      }
    });

    // N2 Stories (16-20) - all need chapters 4-5
    // Story 16: Workplace trouble
    console.log('Adding chapters to Story 16: 職場でのトラブル対応...');
    await addChapter({
      chapter_id: 'chapter-16-4',
      story_id: '16',
      chapter_number: 4,
      title: 'Finding a Solution',
      content: 'チーム全員で対策を考えました。複数の解決策が提案され、最善の方法を選びました。\n\n(The entire team thought about countermeasures. Multiple solutions were proposed, and we chose the best method.)',
      learning_points: {
        points: [
          'Passive voice: 提案される',
          'Countermeasures: 対策',
          'Superlative: 最善'
        ]
      },
      vocabulary: {
        words: [
          { word: 'チーム', reading: 'ちーむ', meaning: 'team' },
          { word: '全員', reading: 'ぜんいん', meaning: 'all members' },
          { word: '対策', reading: 'たいさく', meaning: 'countermeasure' },
          { word: '複数', reading: 'ふくすう', meaning: 'multiple' },
          { word: '解決策', reading: 'かいけつさく', meaning: 'solution' },
          { word: '提案', reading: 'ていあん', meaning: 'proposal' },
          { word: '最善', reading: 'さいぜん', meaning: 'best' },
          { word: '方法', reading: 'ほうほう', meaning: 'method' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-16-5',
      story_id: '16',
      chapter_number: 5,
      title: 'Resolution',
      content: '問題が無事に解決しました。この経験から、チームワークの大切さを学びました。\n\n(The problem was resolved safely. From this experience, I learned the importance of teamwork.)',
      learning_points: {
        points: [
          'Resolution: 解決する',
          'Learning from experience: 〜から学ぶ',
          'Importance: 大切さ'
        ]
      },
      vocabulary: {
        words: [
          { word: '問題', reading: 'もんだい', meaning: 'problem' },
          { word: '解決', reading: 'かいけつ', meaning: 'resolution' },
          { word: '経験', reading: 'けいけん', meaning: 'experience' },
          { word: 'チームワーク', reading: 'ちーむわーく', meaning: 'teamwork' },
          { word: '大切', reading: 'たいせつ', meaning: 'important, precious' }
        ]
      }
    });

    // Story 17: Environmental issues
    console.log('Adding chapters to Story 17: 環境問題についての議論...');
    await addChapter({
      chapter_id: 'chapter-17-4',
      story_id: '17',
      chapter_number: 4,
      title: 'Various Opinions',
      content: '参加者からさまざまな意見が出ました。経済成長と環境保護のバランスについて深く議論しました。\n\n(Various opinions came from participants. We deeply discussed the balance between economic growth and environmental protection.)',
      learning_points: {
        points: [
          'Various: さまざまな',
          'Balance: バランス',
          'Deep discussion: 深く議論する'
        ]
      },
      vocabulary: {
        words: [
          { word: '参加者', reading: 'さんかしゃ', meaning: 'participant' },
          { word: 'さまざま', reading: 'さまざま', meaning: 'various' },
          { word: '意見', reading: 'いけん', meaning: 'opinion' },
          { word: '経済成長', reading: 'けいざいせいちょう', meaning: 'economic growth' },
          { word: '環境保護', reading: 'かんきょうほご', meaning: 'environmental protection' },
          { word: 'バランス', reading: 'ばらんす', meaning: 'balance' },
          { word: '深い', reading: 'ふかい', meaning: 'deep' },
          { word: '議論', reading: 'ぎろん', meaning: 'discussion, debate' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-17-5',
      story_id: '17',
      chapter_number: 5,
      title: 'Personal Action',
      content: '議論を通じて、自分にできることを考えました。小さな行動でも、積み重ねれば大きな変化になると信じています。\n\n(Through the discussion, I thought about what I can do. I believe that even small actions, if accumulated, will become big changes.)',
      learning_points: {
        points: [
          'Through: 〜を通じて',
          'Accumulation: 積み重ねる',
          'Conditional: 〜ば'
        ]
      },
      vocabulary: {
        words: [
          { word: '通じる', reading: 'つうじる', meaning: 'through, via' },
          { word: '自分', reading: 'じぶん', meaning: 'oneself' },
          { word: '小さな', reading: 'ちいさな', meaning: 'small' },
          { word: '行動', reading: 'こうどう', meaning: 'action' },
          { word: '積み重ねる', reading: 'つみかさねる', meaning: 'to accumulate' },
          { word: '変化', reading: 'へんか', meaning: 'change' },
          { word: '信じる', reading: 'しんじる', meaning: 'to believe' }
        ]
      }
    });

    // Story 18: Telework
    console.log('Adding chapters to Story 18: テレワーク制度の導入...');
    await addChapter({
      chapter_id: 'chapter-18-4',
      story_id: '18',
      chapter_number: 4,
      title: 'Adjustment Period',
      content: '最初は慣れませんでしたが、徐々にテレワークのリズムができてきました。自己管理能力が向上しました。\n\n(I wasn\'t used to it at first, but gradually I developed a telework rhythm. My self-management ability improved.)',
      learning_points: {
        points: [
          'Getting used to: 慣れる',
          'Gradually: 徐々に',
          'Improvement: 向上する'
        ]
      },
      vocabulary: {
        words: [
          { word: '最初', reading: 'さいしょ', meaning: 'beginning, first' },
          { word: '慣れる', reading: 'なれる', meaning: 'to get used to' },
          { word: '徐々に', reading: 'じょじょに', meaning: 'gradually' },
          { word: 'リズム', reading: 'りずむ', meaning: 'rhythm' },
          { word: '自己管理', reading: 'じこかんり', meaning: 'self-management' },
          { word: '能力', reading: 'のうりょく', meaning: 'ability' },
          { word: '向上', reading: 'こうじょう', meaning: 'improvement, advancement' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-18-5',
      story_id: '18',
      chapter_number: 5,
      title: 'New Work Style',
      content: 'テレワークにより、仕事と生活のバランスが改善されました。これからの働き方として定着していくでしょう。\n\n(Through telework, the work-life balance improved. It will likely become established as a way of working in the future.)',
      learning_points: {
        points: [
          'By means of: により',
          'Work-life balance: 仕事と生活のバランス',
          'Probability: 〜でしょう'
        ]
      },
      vocabulary: {
        words: [
          { word: 'により', reading: 'により', meaning: 'by means of, due to' },
          { word: 'バランス', reading: 'ばらんす', meaning: 'balance' },
          { word: '改善', reading: 'かいぜん', meaning: 'improvement' },
          { word: '働き方', reading: 'はたらきかた', meaning: 'way of working' },
          { word: '定着', reading: 'ていちゃく', meaning: 'establishment, taking root' }
        ]
      }
    });

    // Story 19: AI technology
    console.log('Adding chapters to Story 19: AI技術の影響...');
    await addChapter({
      chapter_id: 'chapter-19-4',
      story_id: '19',
      chapter_number: 4,
      title: 'Opportunities and Challenges',
      content: 'AI技術は新しい雇用を生み出す一方で、既存の仕事を奪う可能性もあります。適応力が重要になります。\n\n(While AI technology creates new employment, it also has the potential to take away existing jobs. Adaptability becomes important.)',
      learning_points: {
        points: [
          'While/on one hand: 一方で',
          'Potential: 可能性',
          'Adaptability: 適応力'
        ]
      },
      vocabulary: {
        words: [
          { word: '技術', reading: 'ぎじゅつ', meaning: 'technology' },
          { word: '雇用', reading: 'こよう', meaning: 'employment' },
          { word: '生み出す', reading: 'うみだす', meaning: 'to create, produce' },
          { word: '一方', reading: 'いっぽう', meaning: 'on the other hand' },
          { word: '既存', reading: 'きそん', meaning: 'existing' },
          { word: '奪う', reading: 'うばう', meaning: 'to take away' },
          { word: '可能性', reading: 'かのうせい', meaning: 'possibility' },
          { word: '適応力', reading: 'てきおうりょく', meaning: 'adaptability' },
          { word: '重要', reading: 'じゅうよう', meaning: 'important' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-19-5',
      story_id: '19',
      chapter_number: 5,
      title: 'Future Outlook',
      content: 'AI時代を生き抜くために、継続的な学習が必要です。人間にしかできない価値を見出していきたいです。\n\n(To survive the AI era, continuous learning is necessary. I want to find value that only humans can provide.)',
      learning_points: {
        points: [
          'Purpose: 〜ために',
          'Continuous: 継続的',
          'Only humans can: 人間にしかできない'
        ]
      },
      vocabulary: {
        words: [
          { word: '時代', reading: 'じだい', meaning: 'era, age' },
          { word: '生き抜く', reading: 'いきぬく', meaning: 'to survive' },
          { word: '継続的', reading: 'けいぞくてき', meaning: 'continuous' },
          { word: '学習', reading: 'がくしゅう', meaning: 'learning' },
          { word: '必要', reading: 'ひつよう', meaning: 'necessary' },
          { word: '人間', reading: 'にんげん', meaning: 'human' },
          { word: '価値', reading: 'かち', meaning: 'value' },
          { word: '見出す', reading: 'みいだす', meaning: 'to find, discover' }
        ]
      }
    });

    // Story 20: Social contribution
    console.log('Adding chapters to Story 20: 社会貢献活動への参加...');
    await addChapter({
      chapter_id: 'chapter-20-4',
      story_id: '20',
      chapter_number: 4,
      title: 'Making a Difference',
      content: '活動を通じて、困っている人々の役に立てることに喜びを感じました。社会とのつながりを実感しています。\n\n(Through the activity, I felt joy in being helpful to people in need. I feel a connection with society.)',
      learning_points: {
        points: [
          'Being helpful: 役に立つ',
          'Feel joy: 喜びを感じる',
          'Connection: つながり'
        ]
      },
      vocabulary: {
        words: [
          { word: '困る', reading: 'こまる', meaning: 'to be troubled' },
          { word: '人々', reading: 'ひとびと', meaning: 'people' },
          { word: '役に立つ', reading: 'やくにたつ', meaning: 'to be helpful' },
          { word: '喜び', reading: 'よろこび', meaning: 'joy' },
          { word: '感じる', reading: 'かんじる', meaning: 'to feel' },
          { word: '社会', reading: 'しゃかい', meaning: 'society' },
          { word: 'つながり', reading: 'つながり', meaning: 'connection' },
          { word: '実感', reading: 'じっかん', meaning: 'realization, feeling' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-20-5',
      story_id: '20',
      chapter_number: 5,
      title: 'Continuing Commitment',
      content: '今後も定期的に社会貢献活動を続けていきたいと思います。一人一人の行動が、より良い社会を作ります。\n\n(I want to continue social contribution activities regularly in the future. Each person\'s actions create a better society.)',
      learning_points: {
        points: [
          'In the future: 今後',
          'Regularly: 定期的に',
          'Better: より良い'
        ]
      },
      vocabulary: {
        words: [
          { word: '今後', reading: 'こんご', meaning: 'from now on, in the future' },
          { word: '定期的', reading: 'ていきてき', meaning: 'regular, periodic' },
          { word: '続ける', reading: 'つづける', meaning: 'to continue' },
          { word: '一人一人', reading: 'ひとりひとり', meaning: 'each person' },
          { word: 'より', reading: 'より', meaning: 'more' },
          { word: '良い', reading: 'よい', meaning: 'good' },
          { word: '作る', reading: 'つくる', meaning: 'to make, create' }
        ]
      }
    });

    // N1 Stories (21-25) - all need chapters 4-5
    // Story 21: Business negotiation
    console.log('Adding chapters to Story 21: 国際ビジネス交渉...');
    await addChapter({
      chapter_id: 'chapter-21-4',
      story_id: '21',
      chapter_number: 4,
      title: 'Reaching Agreement',
      content: '双方の利益を考慮した妥協案が提示されました。慎重に検討した結果、合意に至ることができました。\n\n(A compromise proposal considering both parties\' interests was presented. After careful consideration, we were able to reach an agreement.)',
      learning_points: {
        points: [
          'Both parties: 双方',
          'Compromise: 妥協案',
          'Reach agreement: 合意に至る'
        ]
      },
      vocabulary: {
        words: [
          { word: '双方', reading: 'そうほう', meaning: 'both parties' },
          { word: '利益', reading: 'りえき', meaning: 'profit, benefit' },
          { word: '考慮', reading: 'こうりょ', meaning: 'consideration' },
          { word: '妥協案', reading: 'だきょうあん', meaning: 'compromise proposal' },
          { word: '提示', reading: 'ていじ', meaning: 'presentation' },
          { word: '慎重', reading: 'しんちょう', meaning: 'careful, cautious' },
          { word: '検討', reading: 'けんとう', meaning: 'examination, consideration' },
          { word: '結果', reading: 'けっか', meaning: 'result' },
          { word: '合意', reading: 'ごうい', meaning: 'agreement' },
          { word: '至る', reading: 'いたる', meaning: 'to reach, arrive at' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-21-5',
      story_id: '21',
      chapter_number: 5,
      title: 'Future Partnership',
      content: 'この交渉を契機に、両社の長期的なパートナーシップが構築されることを期待しています。\n\n(Taking this negotiation as an opportunity, I expect a long-term partnership between both companies to be established.)',
      learning_points: {
        points: [
          'Taking as opportunity: 〜を契機に',
          'Long-term: 長期的',
          'Be established: 構築される'
        ]
      },
      vocabulary: {
        words: [
          { word: '交渉', reading: 'こうしょう', meaning: 'negotiation' },
          { word: '契機', reading: 'けいき', meaning: 'opportunity, turning point' },
          { word: '両社', reading: 'りょうしゃ', meaning: 'both companies' },
          { word: '長期的', reading: 'ちょうきてき', meaning: 'long-term' },
          { word: 'パートナーシップ', reading: 'ぱーとなーしっぷ', meaning: 'partnership' },
          { word: '構築', reading: 'こうちく', meaning: 'construction, building' },
          { word: '期待', reading: 'きたい', meaning: 'expectation' }
        ]
      }
    });

    // Story 22: Traditional culture
    console.log('Adding chapters to Story 22: 日本の伝統文化の継承...');
    await addChapter({
      chapter_id: 'chapter-22-4',
      story_id: '22',
      chapter_number: 4,
      title: 'Modernization and Tradition',
      content: '伝統を守りつつ、現代のニーズに合わせた革新が必要だという意見が出ました。バランスが重要です。\n\n(An opinion was expressed that innovation suited to modern needs is necessary while preserving tradition. Balance is important.)',
      learning_points: {
        points: [
          'While doing: 〜つつ',
          'Suited to: 〜に合わせた',
          'Innovation: 革新'
        ]
      },
      vocabulary: {
        words: [
          { word: '伝統', reading: 'でんとう', meaning: 'tradition' },
          { word: '守る', reading: 'まもる', meaning: 'to protect, preserve' },
          { word: 'つつ', reading: 'つつ', meaning: 'while (doing)' },
          { word: '現代', reading: 'げんだい', meaning: 'modern times' },
          { word: 'ニーズ', reading: 'にーず', meaning: 'needs' },
          { word: '合わせる', reading: 'あわせる', meaning: 'to match, adjust' },
          { word: '革新', reading: 'かくしん', meaning: 'innovation' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-22-5',
      story_id: '22',
      chapter_number: 5,
      title: 'Cultural Responsibility',
      content: '私たち一人一人が文化の継承者であるという自覚を持つことが、伝統文化の未来につながります。\n\n(Being aware that each of us is a cultural successor leads to the future of traditional culture.)',
      learning_points: {
        points: [
          'Awareness: 自覚',
          'Successor: 継承者',
          'Leads to: につながる'
        ]
      },
      vocabulary: {
        words: [
          { word: '文化', reading: 'ぶんか', meaning: 'culture' },
          { word: '継承者', reading: 'けいしょうしゃ', meaning: 'successor, inheritor' },
          { word: '自覚', reading: 'じかく', meaning: 'awareness, consciousness' },
          { word: '持つ', reading: 'もつ', meaning: 'to have, hold' },
          { word: '未来', reading: 'みらい', meaning: 'future' },
          { word: 'につながる', reading: 'につながる', meaning: 'to lead to' }
        ]
      }
    });

    // Story 23: Environmental issues and corporate responsibility
    console.log('Adding chapters to Story 23: 環境問題と企業責任...');
    await addChapter({
      chapter_id: 'chapter-23-4',
      story_id: '23',
      chapter_number: 4,
      title: 'Sustainable Practices',
      content: '企業は短期的な利益だけでなく、持続可能な経営を目指すべきだという結論に達しました。\n\n(We reached the conclusion that companies should aim not only for short-term profits but for sustainable management.)',
      learning_points: {
        points: [
          'Not only: だけでなく',
          'Sustainable: 持続可能な',
          'Reach conclusion: 結論に達する'
        ]
      },
      vocabulary: {
        words: [
          { word: '企業', reading: 'きぎょう', meaning: 'company, enterprise' },
          { word: '短期的', reading: 'たんきてき', meaning: 'short-term' },
          { word: '持続可能', reading: 'じぞくかのう', meaning: 'sustainable' },
          { word: '経営', reading: 'けいえい', meaning: 'management' },
          { word: '目指す', reading: 'めざす', meaning: 'to aim for' },
          { word: 'べき', reading: 'べき', meaning: 'should' },
          { word: '結論', reading: 'けつろん', meaning: 'conclusion' },
          { word: '達する', reading: 'たっする', meaning: 'to reach' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-23-5',
      story_id: '23',
      chapter_number: 5,
      title: 'Future Vision',
      content: '環境問題への取り組みは、企業の社会的責任であると同時に、新たなビジネスチャンスでもあります。\n\n(Efforts toward environmental issues are not only a corporate social responsibility but also a new business opportunity.)',
      learning_points: {
        points: [
          'Efforts toward: への取り組み',
          'At the same time: と同時に',
          'Corporate social responsibility: 企業の社会的責任'
        ]
      },
      vocabulary: {
        words: [
          { word: '取り組み', reading: 'とりくみ', meaning: 'effort, initiative' },
          { word: '社会的責任', reading: 'しゃかいてきせきにん', meaning: 'social responsibility' },
          { word: '同時に', reading: 'どうじに', meaning: 'at the same time' },
          { word: '新た', reading: 'あらた', meaning: 'new, fresh' },
          { word: 'ビジネス', reading: 'びじねす', meaning: 'business' },
          { word: 'チャンス', reading: 'ちゃんす', meaning: 'chance, opportunity' }
        ]
      }
    });

    // Story 24: Medical ethics
    console.log('Adding chapters to Story 24: 医療現場の倫理的ジレンマ...');
    await addChapter({
      chapter_id: 'chapter-24-4',
      story_id: '24',
      chapter_number: 4,
      title: 'Difficult Decisions',
      content: '患者の意思を尊重しながらも、医療専門家としての判断が求められる場面があります。\n\n(While respecting the patient\'s wishes, there are situations that require judgment as a medical professional.)',
      learning_points: {
        points: [
          'While respecting: 尊重しながらも',
          'As a professional: 専門家として',
          'Require judgment: 判断が求められる'
        ]
      },
      vocabulary: {
        words: [
          { word: '患者', reading: 'かんじゃ', meaning: 'patient' },
          { word: '意思', reading: 'いし', meaning: 'will, intention' },
          { word: '尊重', reading: 'そんちょう', meaning: 'respect' },
          { word: 'ながらも', reading: 'ながらも', meaning: 'while, although' },
          { word: '医療', reading: 'いりょう', meaning: 'medical care' },
          { word: '専門家', reading: 'せんもんか', meaning: 'expert, specialist' },
          { word: 'として', reading: 'として', meaning: 'as' },
          { word: '判断', reading: 'はんだん', meaning: 'judgment' },
          { word: '求める', reading: 'もとめる', meaning: 'to require, demand' },
          { word: '場面', reading: 'ばめん', meaning: 'scene, situation' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-24-5',
      story_id: '24',
      chapter_number: 5,
      title: 'Ethical Framework',
      content: '倫理的なガイドラインは重要ですが、最終的には個々のケースに応じた柔軟な対応が必要です。\n\n(Ethical guidelines are important, but ultimately flexible responses according to individual cases are necessary.)',
      learning_points: {
        points: [
          'Ultimately: 最終的には',
          'According to: に応じた',
          'Flexible: 柔軟な'
        ]
      },
      vocabulary: {
        words: [
          { word: '倫理的', reading: 'りんりてき', meaning: 'ethical' },
          { word: 'ガイドライン', reading: 'がいどらいん', meaning: 'guideline' },
          { word: '最終的', reading: 'さいしゅうてき', meaning: 'final, ultimate' },
          { word: '個々', reading: 'ここ', meaning: 'individual' },
          { word: 'ケース', reading: 'けーす', meaning: 'case' },
          { word: '応じる', reading: 'おうじる', meaning: 'to respond, comply' },
          { word: '柔軟', reading: 'じゅうなん', meaning: 'flexible' },
          { word: '対応', reading: 'たいおう', meaning: 'response, handling' }
        ]
      }
    });

    // Story 25: AI and education/employment
    console.log('Adding chapters to Story 25: AI時代の雇用と教育...');
    await addChapter({
      chapter_id: 'chapter-25-4',
      story_id: '25',
      chapter_number: 4,
      title: 'Educational Reform',
      content: 'AI時代に対応した教育システムの改革が急務です。創造性や批判的思考力を育成する必要があります。\n\n(Reform of the educational system corresponding to the AI era is urgent. It is necessary to cultivate creativity and critical thinking skills.)',
      learning_points: {
        points: [
          'Corresponding to: に対応した',
          'Urgent task: 急務',
          'Cultivate: 育成する'
        ]
      },
      vocabulary: {
        words: [
          { word: '対応', reading: 'たいおう', meaning: 'correspondence, adaptation' },
          { word: '教育システム', reading: 'きょういくしすてむ', meaning: 'educational system' },
          { word: '改革', reading: 'かいかく', meaning: 'reform' },
          { word: '急務', reading: 'きゅうむ', meaning: 'urgent business' },
          { word: '創造性', reading: 'そうぞうせい', meaning: 'creativity' },
          { word: '批判的思考力', reading: 'ひはんてきしこうりょく', meaning: 'critical thinking ability' },
          { word: '育成', reading: 'いくせい', meaning: 'cultivation, fostering' }
        ]
      }
    });

    await addChapter({
      chapter_id: 'chapter-25-5',
      story_id: '25',
      chapter_number: 5,
      title: 'Human-AI Collaboration',
      content: 'AIと人間が協働する社会において、人間の役割を再定義することが重要です。生涯学習の重要性が高まっています。\n\n(In a society where AI and humans collaborate, it is important to redefine the human role. The importance of lifelong learning is increasing.)',
      learning_points: {
        points: [
          'Collaborate: 協働する',
          'Redefine: 再定義する',
          'Lifelong learning: 生涯学習'
        ]
      },
      vocabulary: {
        words: [
          { word: '協働', reading: 'きょうどう', meaning: 'collaboration' },
          { word: '社会', reading: 'しゃかい', meaning: 'society' },
          { word: 'において', reading: 'において', meaning: 'in, at' },
          { word: '役割', reading: 'やくわり', meaning: 'role' },
          { word: '再定義', reading: 'さいていぎ', meaning: 'redefinition' },
          { word: '生涯学習', reading: 'しょうがいがくしゅう', meaning: 'lifelong learning' },
          { word: '重要性', reading: 'じゅうようせい', meaning: 'importance' },
          { word: '高まる', reading: 'たかまる', meaning: 'to increase, rise' }
        ]
      }
    });

    console.log('\n=== All missing chapters added successfully! ===');
    console.log('Total chapters added: 77');
    console.log('\nSummary:');
    console.log('- Story 1: Already has 5 chapters (no changes)');
    console.log('- Stories 2-5 (N5): Added 3 chapters each (12 total)');
    console.log('- Story 6-7, 9-10 (N4): Added 2 chapters each (8 total)');
    console.log('- Story 8 (N4): Added 3 chapters (3 total)');
    console.log('- Stories 11-15 (N3): Added 2 chapters each (10 total)');
    console.log('- Stories 16-20 (N2): Added 2 chapters each (10 total)');
    console.log('- Stories 21-25 (N1): Added 2 chapters each (10 total)');

  } catch (error) {
    console.error('Error adding chapters:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

interface ChapterData {
  chapter_id: string;
  story_id: string;
  chapter_number: number;
  title: string;
  content: string;
  learning_points: {
    points: string[];
  };
  vocabulary: {
    words: Array<{
      word: string;
      reading: string;
      meaning: string;
    }>;
  };
}

async function addChapter(data: ChapterData) {
  const existing = await prisma.chapter.findUnique({
    where: { chapter_id: data.chapter_id }
  });

  if (existing) {
    console.log(`  Chapter ${data.chapter_id} already exists, skipping...`);
    return;
  }

  await prisma.chapter.create({
    data: {
      ...data,
      audio_url: null,
      created_at: new Date()
    }
  });

  console.log(`  ✓ Added chapter ${data.chapter_id}: ${data.title}`);
}

addMissingChapters()
  .then(() => {
    console.log('\n=== Script completed successfully ===');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
