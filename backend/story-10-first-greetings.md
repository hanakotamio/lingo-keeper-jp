# Story 10: 初めての挨拶 - 設計ドキュメント

**作成日**: 2026-02-12
**JLPTレベル**: N5 / A1
**カテゴリ**: 基本会話
**推定時間**: 8分

---

## 📖 ストーリー概要

### タイトル
- **日本語**: 初めての挨拶
- **英語**: First Greetings

### 説明
- **日本語**: 日本語学校の初日。先生やクラスメートとの挨拶を通じて、基本的な日本語の挨拶表現を学びます。あなたの選択で物語が変わります。
- **英語**: First day at Japanese language school. Learn basic Japanese greeting expressions through greetings with teachers and classmates. Your choices will change the story.

### 学習ポイント
1. 基本的な挨拶（おはよう、こんにちは、こんばんは）
2. 自己紹介の基本（私は〜です、よろしくお願いします）
3. 簡単な質問と答え（お名前は？、どこから来ましたか？）

### 語彙リスト
- おはようございます (ohayou gozaimasu) - Good morning
- こんにちは (konnichiwa) - Hello (afternoon)
- はじめまして (hajimemashite) - Nice to meet you (first time)
- よろしくお願いします (yoroshiku onegaishimasu) - Please treat me well
- 先生 (sensei) - Teacher
- 学生 (gakusei) - Student
- 名前 (namae) - Name
- 国 (kuni) - Country

---

## 🌳 ストーリー構造（9チャプター）

### ツリー構造図
```
Chapter 1 (Root)
├─ Choice A: 大きな声で挨拶 → Chapter 2A
│   ├─ Choice A1: 自己紹介を詳しく → Chapter 3A
│   │   └─ Choice A1a: 趣味を話す → Chapter 4A → Chapter 5 (Convergence)
│   └─ Choice A2: 簡単に自己紹介 → Chapter 3B
│       └─ Choice A2a: 質問する → Chapter 4B → Chapter 5 (Convergence)
│
├─ Choice B: 恥ずかしくて小さな声 → Chapter 2B
│   ├─ Choice B1: もう一度挨拶 → Chapter 3C
│   │   └─ Choice B1a: 頑張って話す → Chapter 4C → Chapter 5 (Convergence)
│   └─ Choice B2: 先生に助けてもらう → Chapter 3D
│       └─ Choice B2a: ゆっくり話す → Chapter 4D → Chapter 5 (Convergence)
│
└─ Choice C: 笑顔で手を振る → Chapter 2C
    └─ Choice C1: 友達を作る → Chapter 3E
        └─ Choice C1a: 一緒に練習 → Chapter 4E → Chapter 5 (Convergence)

Chapter 5 → Chapter 6 → Chapter 7 → Chapter 8 → Chapter 9 (Ending)
```

**合計チャプター数**: 9チャプター（分岐を含む）

---

## 📝 チャプター詳細

### Chapter 1: 日本語学校の初日（Root）
**ID**: ch-10-1

**日本語**:
```
今日は日本語学校の初めての日です。朝、教室に入りました。先生が「おはようございます！」と言いました。他の学生もいます。みんな、私を見ています。どうしますか？
```

**英語**:
```
Today is my first day at Japanese language school. In the morning, I entered the classroom. The teacher said "Good morning!" There are other students too. Everyone is looking at me. What should I do?
```

**選択肢**:
- A: 大きな声で「おはようございます！」と言う
- B: 恥ずかしくて小さな声で挨拶する
- C: 笑顔で手を振る

---

### Chapter 2A: 元気な挨拶
**ID**: ch-10-2a
**Parent**: ch-10-1

**日本語**:
```
「おはようございます！」と大きな声で挨拶しました。先生は嬉しそうに笑いました。「元気がいいですね！はじめまして、私は田中先生です。」みんなも「おはようございます！」と言いました。次に、自己紹介をします。
```

**英語**:
```
I greeted loudly, "Good morning!" The teacher smiled happily. "You're energetic! Nice to meet you, I'm Teacher Tanaka." Everyone also said "Good morning!" Next, I will introduce myself.
```

**選択肢**:
- A1: 詳しく自己紹介する
- A2: 簡単に自己紹介する

---

### Chapter 2B: 小さな声の挨拶
**ID**: ch-10-2b
**Parent**: ch-10-1

**日本語**:
```
恥ずかしくて、小さな声で「おはよう...」と言いました。先生は優しく「大丈夫ですよ。もう一度、一緒に言いましょう。」と言いました。みんなも温かく見守っています。
```

**英語**:
```
Embarrassed, I said "Good morning..." in a small voice. The teacher kindly said, "It's okay. Let's say it together again." Everyone is also watching warmly.
```

**選択肢**:
- B1: もう一度、大きな声で挨拶する
- B2: 先生と一緒に言う

---

### Chapter 2C: 笑顔で手を振る
**ID**: ch-10-2c
**Parent**: ch-10-1

**日本語**:
```
言葉の代わりに、笑顔で手を振りました。先生は笑って「素敵な笑顔ですね！では、日本語で挨拶を練習しましょう。みんなで『おはようございます』と言ってみましょう。」
```

**英語**:
```
Instead of words, I waved with a smile. The teacher laughed and said, "What a lovely smile! Now, let's practice greetings in Japanese. Let's all say 'Good morning' together."
```

**選択肢**:
- C1: みんなと一緒に練習する

---

### Chapter 3A: 詳しい自己紹介
**ID**: ch-10-3a
**Parent**: ch-10-2a

**日本語**:
```
「はじめまして。私はアレックスです。アメリカから来ました。日本のアニメが大好きです。よろしくお願いします。」と言いました。クラスメートは「よろしく！」と言って、拍手してくれました。
```

**英語**:
```
"Nice to meet you. I'm Alex. I came from America. I love Japanese anime. Please treat me well," I said. My classmates said "Nice to meet you!" and clapped.
```

**選択肢**:
- A1a: 趣味についてもっと話す

---

### Chapter 3B: 簡単な自己紹介
**ID**: ch-10-3b
**Parent**: ch-10-2a

**日本語**:
```
「私はアレックスです。アメリカから来ました。よろしくお願いします。」とシンプルに言いました。先生は「上手ですね！」と言いました。
```

**英語**:
```
"I'm Alex. I came from America. Please treat me well," I said simply. The teacher said, "Very good!"
```

**選択肢**:
- A2a: クラスメートに質問する

---

### Chapter 3C: もう一度挨拶
**ID**: ch-10-3c
**Parent**: ch-10-2b

**日本語**:
```
深呼吸して、今度は大きな声で「おはようございます！」と言いました。先生は「素晴らしい！とても上手です。」と褒めてくれました。自信が出てきました。
```

**英語**:
```
I took a deep breath and this time said loudly, "Good morning!" The teacher praised me, "Wonderful! Very good." I gained confidence.
```

**選択肢**:
- B1a: 自己紹介を頑張る

---

### Chapter 3D: 先生と一緒に
**ID**: ch-10-3d
**Parent**: ch-10-2b

**日本語**:
```
先生と一緒に「おはようございます！」と言いました。先生は「いいですよ！少しずつ、慣れていきましょう。」と優しく言いました。
```

**英語**:
```
I said "Good morning!" together with the teacher. The teacher kindly said, "Good! Let's get used to it little by little."
```

**選択肢**:
- B2a: ゆっくり自己紹介する

---

### Chapter 3E: みんなと練習
**ID**: ch-10-3e
**Parent**: ch-10-2c

**日本語**:
```
みんなで「おはようございます！」と言いました。次に「こんにちは！」「こんばんは！」も練習しました。楽しくて、日本語が好きになりました。
```

**英語**:
```
We all said "Good morning!" Next, we also practiced "Hello!" and "Good evening!" It was fun, and I came to like Japanese.
```

**選択肢**:
- C1a: 新しい友達と話す

---

### Chapter 4A-E: 会話の広がり
（各ルートから収束）

**ID**: ch-10-4a, ch-10-4b, ch-10-4c, ch-10-4d, ch-10-4e
**Parent**: 各Chapter 3

**共通の流れ**: 休憩時間になり、クラスメートと話す機会

---

### Chapter 5: 休憩時間（収束ポイント）
**ID**: ch-10-5
**Parent**: 各Chapter 4

**日本語**:
```
休憩時間になりました。隣の席の学生が「こんにちは！私はエミリーです。韓国から来ました。」と話しかけてきました。「こんにちは！私はアレックスです。」と返事をしました。新しい友達ができて嬉しいです。
```

**英語**:
```
It's break time. A student in the next seat spoke to me, "Hello! I'm Emily. I came from Korea." I replied, "Hello! I'm Alex." I'm happy to have made a new friend.
```

**選択肢**:
- A: 一緒にランチを食べる約束をする
- B: 日本語の勉強について話す

---

### Chapter 6: 友情の始まり
**ID**: ch-10-6
**Parent**: ch-10-5

**日本語**:
```
エミリーと一緒にランチを食べることになりました。「日本の食べ物、好きですか？」とエミリーが聞きました。「はい、好きです！特に寿司が好きです。」と答えました。
```

**英語**:
```
I decided to have lunch with Emily. "Do you like Japanese food?" Emily asked. "Yes, I do! I especially like sushi," I answered.
```

---

### Chapter 7: お昼休み
**ID**: ch-10-7
**Parent**: ch-10-6

**日本語**:
```
学校の食堂で一緒に食べました。他のクラスメートも来て、みんなで自己紹介をしました。中国、タイ、フランスから来た学生がいます。国際的なクラスです。
```

**英語**:
```
We ate together in the school cafeteria. Other classmates also came and we all introduced ourselves. There are students from China, Thailand, and France. It's an international class.
```

---

### Chapter 8: 午後の授業
**ID**: ch-10-8
**Parent**: ch-10-7

**日本語**:
```
午後の授業で、先生が「今日は挨拶と自己紹介を勉強しました。明日は、数字と時間を勉強します。」と言いました。たくさん学んだので、少し疲れましたが、とても楽しかったです。
```

**英語**:
```
In the afternoon class, the teacher said, "Today we studied greetings and self-introductions. Tomorrow we will study numbers and time." I learned a lot, so I'm a little tired, but it was very fun.
```

---

### Chapter 9: 初日の終わり（エンディング）
**ID**: ch-10-9
**Parent**: ch-10-8

**日本語**:
```
学校が終わりました。先生とクラスメートに「さようなら！また明日！」と言って、帰りました。今日はたくさんの挨拶を覚えました。新しい友達もできました。日本語の勉強が楽しみです。頑張ります！
```

**英語**:
```
School is over. I said "Goodbye! See you tomorrow!" to the teacher and classmates and went home. Today I learned many greetings. I also made new friends. I'm looking forward to studying Japanese. I'll do my best!
```

---

## 🎓 クイズ（3問）

### Quiz 1: 読解問題
**Question**: アレックスは日本語学校で何を勉強しましたか？
**Question (EN)**: What did Alex study at Japanese language school?

**Choices**:
- A: 挨拶と自己紹介 ✅ **正解**
- B: 数字と時間
- C: 漢字と文法
- D: 料理と文化

**Explanation**: 本文で「今日は挨拶と自己紹介を勉強しました」と書いてあります。
**Explanation (EN)**: The text states "Today we studied greetings and self-introductions."

---

### Quiz 2: 語彙問題
**Question**: 「はじめまして」はいつ使いますか？
**Question (EN)**: When do you use "hajimemashite"?

**Choices**:
- A: 朝の挨拶
- B: 初めて会う人への挨拶 ✅ **正解**
- C: 別れの挨拶
- D: お礼を言う時

**Explanation**: 「はじめまして」は初めて会う人に使う挨拶です。"Nice to meet you"の意味です。
**Explanation (EN)**: "Hajimemashite" is a greeting used when meeting someone for the first time. It means "Nice to meet you."

---

### Quiz 3: 文化・文法問題
**Question**: 自己紹介の最後に何と言いますか？
**Question (EN)**: What do you say at the end of a self-introduction?

**Choices**:
- A: ありがとうございます
- B: すみません
- C: よろしくお願いします ✅ **正解**
- D: さようなら

**Explanation**: 自己紹介の最後には「よろしくお願いします」と言います。これは「これからお世話になります」という意味です。
**Explanation (EN)**: At the end of a self-introduction, you say "yoroshiku onegaishimasu." This means "Please treat me well" or "I look forward to working with you."

---

## 📊 技術仕様

### データベース定義

```typescript
// Story
story_id: '10'
title: '初めての挨拶'
title_en: 'First Greetings'
description: '日本語学校の初日。先生やクラスメートとの挨拶を通じて、基本的な日本語の挨拶表現を学びます。'
description_en: 'First day at Japanese language school. Learn basic Japanese greeting expressions through greetings with teachers and classmates.'
category: 'basic_conversation'
difficulty_level: 'beginner'
level_jlpt: 'N5'
level_cefr: 'A1'
estimated_time: 8
estimated_duration_minutes: 8
is_active: true
root_chapter_id: 'ch-10-1'
```

### チャプターID一覧
- ch-10-1: Root chapter
- ch-10-2a, ch-10-2b, ch-10-2c: Branch level 1
- ch-10-3a, ch-10-3b, ch-10-3c, ch-10-3d, ch-10-3e: Branch level 2
- ch-10-4a, ch-10-4b, ch-10-4c, ch-10-4d, ch-10-4e: Branch level 3
- ch-10-5: Convergence point
- ch-10-6, ch-10-7, ch-10-8, ch-10-9: Linear progression to ending

### クイズID一覧
- quiz-10-1: 読解問題
- quiz-10-2: 語彙問題
- quiz-10-3: 文化・文法問題

---

## ✅ 品質チェックリスト

- [x] JLPTレベルN5に適切な語彙と文法
- [x] 9チャプター構成
- [x] 分岐型ストーリー（ツリー構造）
- [x] 各チャプターに英語翻訳
- [x] 3問のクイズ
- [x] 学習ポイントの明確化
- [x] 文化的配慮（自然な日本語表現）

---

**作成完了**: 2026-02-12
**次のステップ**: seed.tsへの実装
