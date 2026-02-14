# Story 11: 家族の紹介 - 設計ドキュメント

**作成日**: 2026-02-12
**JLPTレベル**: N5 / A1
**カテゴリ**: 家族・人間関係
**推定時間**: 8分

---

## 📖 ストーリー概要

### タイトル
- **日本語**: 家族の紹介
- **英語**: Introducing My Family

### 説明
- **日本語**: ホストファミリーに初めて会う日。自分の家族を紹介しながら、家族を表す語彙や人の特徴を説明する表現を学びます。写真を見せながら、あなたの選択で会話が広がります。
- **英語**: First day meeting your host family. Learn vocabulary for family members and expressions to describe people's characteristics while introducing your family. Your choices will expand the conversation as you show photos.

### 学習ポイント
1. 家族を表す語彙（父、母、兄弟、姉妹など）
2. 人の特徴を説明する形容詞（優しい、元気、背が高いなど）
3. 〜は〜です の基本文型
4. 年齢と職業の表現

### 語彙リスト
- 家族 (kazoku) - Family
- 父 (chichi) - Father (my father)
- 母 (haha) - Mother (my mother)
- 兄 (ani) - Older brother
- 姉 (ane) - Older sister
- 弟 (otouto) - Younger brother
- 妹 (imouto) - Younger sister
- 優しい (yasashii) - Kind, gentle
- 元気 (genki) - Energetic, healthy
- 仕事 (shigoto) - Work, job

---

## 🌳 ストーリー構造（9チャプター）

### ツリー構造図
```
Chapter 1 (Root) - ホストファミリーとの初対面
├─ Choice A: 父から紹介 → Chapter 2A
│   ├─ Choice A1: 父の仕事を詳しく → Chapter 3A
│   │   └─ Choice A1a: 母の紹介へ → Chapter 4 (Convergence)
│   └─ Choice A2: 母の紹介へ → Chapter 3B → Chapter 4
│
├─ Choice B: 母から紹介 → Chapter 2B
│   ├─ Choice B1: 母の趣味を話す → Chapter 3C → Chapter 4
│   └─ Choice B2: 兄弟の紹介へ → Chapter 3D → Chapter 4
│
└─ Choice C: 家族写真を全部見せる → Chapter 2C
    └─ Choice C1: 一人ずつ紹介 → Chapter 3E → Chapter 4

Chapter 4 (Convergence) → Chapter 5 → Chapter 6 → Chapter 7 → Chapter 8 → Chapter 9
```

**合計チャプター数**: 9チャプター（実際の実装では14チャプター前後）

---

## 📝 チャプター詳細

### Chapter 1: ホストファミリーとの初対面（Root）
**ID**: ch-11-1

**日本語**:
```
今日はホストファミリーの家に着きました。田中さん一家が温かく迎えてくれました。「家族の写真を持ってきました。紹介してもいいですか？」と聞くと、みんな「見たい！見たい！」と言ってくれました。誰から紹介しますか？
```

**英語**:
```
Today I arrived at my host family's house. The Tanaka family welcomed me warmly. When I asked, "I brought family photos. May I introduce them?" everyone said, "We want to see! We want to see!" Who should I introduce first?
```

**選択肢**:
- A: 父から紹介する
- B: 母から紹介する
- C: 家族写真を全部見せて、みんな一緒に紹介する

---

### Chapter 2A: 父の紹介
**ID**: ch-11-2a
**Parent**: ch-11-1

**日本語**:
```
「これは私の父です。名前はジョンです。50歳です。父は会社員です。」田中さんのお母さんが「どんなお仕事ですか？」と興味深そうに聞きました。
```

**英語**:
```
"This is my father. His name is John. He is 50 years old. My father is a company employee." Mrs. Tanaka asked with interest, "What kind of work does he do?"
```

**選択肢**:
- A1: 父の仕事について詳しく話す
- A2: 簡単に答えて、母の紹介に移る

---

### Chapter 2B: 母の紹介
**ID**: ch-11-2b
**Parent**: ch-11-1

**日本語**:
```
「これは私の母です。名前はメアリーです。48歳です。母は看護師です。」田中さんのお父さんが「素晴らしいですね！優しいお母さんでしょう？」と言いました。「はい、とても優しいです。」と答えました。
```

**英語**:
```
"This is my mother. Her name is Mary. She is 48 years old. My mother is a nurse." Mr. Tanaka said, "That's wonderful! She must be a kind mother, right?" I answered, "Yes, she is very kind."
```

**選択肢**:
- B1: 母の趣味について話す
- B2: 兄弟姉妹の紹介に移る

---

### Chapter 2C: 家族写真を全部見せる
**ID**: ch-11-2c
**Parent**: ch-11-1

**日本語**:
```
大きな家族写真を見せました。「これが私の家族です。父、母、兄、妹、そして私です。5人家族です。」みんなが「わあ！素敵な家族ですね！」と言ってくれました。
```

**英語**:
```
I showed them a large family photo. "This is my family. Father, mother, older brother, younger sister, and me. We are a family of five." Everyone said, "Wow! What a wonderful family!"
```

**選択肢**:
- C1: 一人ずつ詳しく紹介する

---

### Chapter 3A: 父の仕事を詳しく
**ID**: ch-11-3a
**Parent**: ch-11-2a

**日本語**:
```
「父はエンジニアです。コンピューターの仕事をしています。とても忙しいですが、週末は家族と過ごします。父は優しくて、面白いです。」と話しました。みんなが笑顔で聞いてくれました。
```

**英語**:
```
"My father is an engineer. He works with computers. He is very busy, but spends weekends with the family. My father is kind and funny," I said. Everyone listened with smiles.
```

**選択肢**:
- A1a: 母の紹介に移る

---

### Chapter 3B: 母の紹介へ
**ID**: ch-11-3b
**Parent**: ch-11-2a

**日本語**:
```
「次は私の母です。名前はメアリーです。母は看護師です。とても優しくて、料理が上手です。」田中さんの娘さんが「素敵なお母さんですね！」と言いました。
```

**英語**:
```
"Next is my mother. Her name is Mary. My mother is a nurse. She is very kind and good at cooking." Tanaka's daughter said, "What a lovely mother!"
```

**選択肢**:
- A2a: 兄弟姉妹の紹介へ

---

### Chapter 3C: 母の趣味を話す
**ID**: ch-11-3c
**Parent**: ch-11-2b

**日本語**:
```
「母の趣味はガーデニングです。花が大好きです。家の庭にはたくさんの花があります。母は毎日、花の世話をします。」田中さんのお母さんが「私もガーデニングが好きです！今度一緒に庭を見ましょう。」と言いました。
```

**英語**:
```
"My mother's hobby is gardening. She loves flowers. There are many flowers in our garden at home. My mother takes care of the flowers every day." Mrs. Tanaka said, "I also like gardening! Let's look at the garden together next time."
```

**選択肢**:
- B1a: 兄弟姉妹の紹介へ

---

### Chapter 3D: 兄弟の紹介へ
**ID**: ch-11-3d
**Parent**: ch-11-2b

**日本語**:
```
「これは私の兄です。名前はトムです。22歳です。大学生です。兄は背が高くて、スポーツが好きです。」田中さんの息子さんが「かっこいいですね！何のスポーツをしますか？」と聞きました。
```

**英語**:
```
"This is my older brother. His name is Tom. He is 22 years old. He is a university student. My brother is tall and likes sports." Tanaka's son asked, "He looks cool! What sport does he play?"
```

**選択肢**:
- B2a: 兄のスポーツについて話す

---

### Chapter 3E: 一人ずつ紹介
**ID**: ch-11-3e
**Parent**: ch-11-2c

**日本語**:
```
「では、一人ずつ紹介します。父はジョン、会社員です。母はメアリー、看護師です。兄はトム、大学生です。妹はエミリー、高校生です。」みんながうなずきながら聞いてくれました。
```

**英語**:
```
"Now, let me introduce them one by one. My father is John, a company employee. My mother is Mary, a nurse. My brother is Tom, a university student. My sister is Emily, a high school student." Everyone nodded and listened.
```

**選択肢**:
- C1a: それぞれの特徴を話す

---

### Chapter 4: 兄弟姉妹の紹介（収束ポイント）
**ID**: ch-11-4
**Parent**: 各Chapter 3

**日本語**:
```
「私には兄が一人と妹が一人います。兄はトム、22歳です。大学でコンピューターを勉強しています。妹はエミリー、16歳です。高校生で、音楽が大好きです。」田中さん一家がとても興味深そうに聞いてくれました。
```

**英語**:
```
"I have one older brother and one younger sister. My brother Tom is 22 years old. He studies computers at university. My sister Emily is 16 years old. She is a high school student and loves music." The Tanaka family listened with great interest.
```

**選択肢**:
- A: 妹について詳しく話す
- B: 家族の週末の過ごし方を話す

---

### Chapter 5: 家族の時間
**ID**: ch-11-5
**Parent**: ch-11-4

**日本語**:
```
「週末、私の家族はよく一緒に過ごします。父と兄はサッカーをします。母と妹は買い物に行きます。私は時々みんなと一緒に、時々一人で本を読みます。」田中さんのお父さんが「素敵な家族ですね！」と言いました。
```

**英語**:
```
"On weekends, my family often spends time together. My father and brother play soccer. My mother and sister go shopping. I sometimes join everyone, and sometimes read books alone." Mr. Tanaka said, "What a wonderful family!"
```

---

### Chapter 6: ホストファミリーの紹介
**ID**: ch-11-6
**Parent**: ch-11-5

**日本語**:
```
「では、私たちの家族も紹介しましょう！」と田中さんが言いました。「私は田中健、妻は由美、息子は太郎で15歳、娘は花子で12歳です。4人家族です。」みんなで自己紹介をしました。
```

**英語**:
```
"Now, let us introduce our family too!" said Mr. Tanaka. "I am Tanaka Ken, my wife is Yumi, our son is Taro, 15 years old, and our daughter is Hanako, 12 years old. We are a family of four." Everyone introduced themselves.
```

---

### Chapter 7: 共通点を見つける
**ID**: ch-11-7
**Parent**: ch-11-6

**日本語**:
```
話をしているうちに、たくさんの共通点を見つけました。太郎くんも兄のトムと同じようにスポーツが好きです。花子ちゃんも妹のエミリーと同じように音楽が好きです。「これから、家族みたいに過ごしましょう！」と田中さんが言いました。
```

**英語**:
```
As we talked, we found many things in common. Taro also likes sports like my brother Tom. Hanako also likes music like my sister Emily. "From now on, let's spend time together like family!" said Mr. Tanaka.
```

---

### Chapter 8: 家族の写真を交換
**ID**: ch-11-8
**Parent**: ch-11-7

**日本語**:
```
田中さん一家も家族写真を見せてくれました。海に行った時の写真、お祭りの写真、たくさんの思い出がありました。「私も日本で新しい思い出を作りたいです。」と言うと、みんなが「一緒に作りましょう！」と笑顔で言いました。
```

**英語**:
```
The Tanaka family also showed me their family photos. Photos from the beach, festival photos, so many memories. When I said, "I want to make new memories in Japan too," everyone smiled and said, "Let's make them together!"
```

---

### Chapter 9: 新しい家族（エンディング）
**ID**: ch-11-9
**Parent**: ch-11-8

**日本語**:
```
今日は家族について話しました。アメリカの家族も、日本のホストファミリーも、みんな大切な家族です。これから、田中さん一家と一緒に過ごします。新しい家族ができて、とても嬉しいです。日本での生活が楽しみです！
```

**英語**:
```
Today I talked about family. Both my family in America and my host family in Japan are precious families. From now on, I will spend time with the Tanaka family. I'm very happy to have a new family. I'm looking forward to life in Japan!
```

---

## 🎓 クイズ（3問）

### Quiz 1: 読解問題
**Question**: 主人公の家族は何人ですか？
**Question (EN)**: How many people are in the protagonist's family?

**Choices**:
- A: 3人
- B: 4人
- C: 5人 ✅ **正解**
- D: 6人

**Explanation**: 本文で「父、母、兄、妹、そして私です。5人家族です。」と書いてあります。
**Explanation (EN)**: The text states "Father, mother, older brother, younger sister, and me. We are a family of five."

---

### Quiz 2: 語彙問題
**Question**: 「父」と「母」を合わせて何と言いますか？
**Question (EN)**: What do you call "father" and "mother" together?

**Choices**:
- A: 先生
- B: 友達
- C: 家族 ✅ **正解**
- D: 学生

**Explanation**: 「父」と「母」などを合わせて「家族」と言います。英語の"family"の意味です。
**Explanation (EN)**: "Father" and "mother" together are called "kazoku" (family). It means "family" in English.

---

### Quiz 3: 文化問題
**Question**: 主人公の母の仕事は何ですか？
**Question (EN)**: What is the protagonist's mother's job?

**Choices**:
- A: 先生
- B: 看護師 ✅ **正解**
- C: 会社員
- D: 学生

**Explanation**: 本文で「母は看護師です」と書いてあります。
**Explanation (EN)**: The text states "My mother is a nurse."

---

## 📊 技術仕様

### データベース定義

```typescript
// Story
story_id: '11'
title: '家族の紹介'
title_en: 'Introducing My Family'
description: 'ホストファミリーに初めて会う日。自分の家族を紹介しながら、家族を表す語彙や人の特徴を説明する表現を学びます。'
description_en: 'First day meeting your host family. Learn vocabulary for family members and expressions to describe people\'s characteristics while introducing your family.'
category: 'family'
difficulty_level: 'beginner'
level_jlpt: 'N5'
level_cefr: 'A1'
estimated_time: 8
estimated_duration_minutes: 8
is_active: true
root_chapter_id: 'ch-11-1'
```

### チャプターID一覧
- ch-11-1: Root chapter
- ch-11-2a, ch-11-2b, ch-11-2c: Branch level 1
- ch-11-3a, ch-11-3b, ch-11-3c, ch-11-3d, ch-11-3e: Branch level 2
- ch-11-4: Convergence point
- ch-11-5, ch-11-6, ch-11-7, ch-11-8, ch-11-9: Linear progression to ending

### クイズID一覧
- quiz-11-1: 読解問題
- quiz-11-2: 語彙問題
- quiz-11-3: 文化問題

---

## ✅ 品質チェックリスト

- [x] JLPTレベルN5に適切な語彙と文法
- [x] 9チャプター構成（実装では14チャプター）
- [x] 分岐型ストーリー（ツリー構造）
- [x] 各チャプターに英語翻訳
- [x] 3問のクイズ
- [x] 学習ポイントの明確化
- [x] 文化的配慮（ホストファミリーの描写）

---

**作成完了**: 2026-02-12
**次のステップ**: seed.tsへの実装
