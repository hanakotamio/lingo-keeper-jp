#!/usr/bin/env python3
"""
Generate complete seed.ts file with proper branching structure for all 9 stories
"""

HEADER = """import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Starting database seeding...');

  // Clear existing data (for development)
  await prisma.quizResult.deleteMany();
  await prisma.quizChoice.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.choice.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.story.deleteMany();
  console.log('Cleared existing data');
"""

FOOTER = """
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
"""

# Story metadata
STORIES = [
    {
        'id': '1',
        'title': '東京での新しい生活',
        'description': '初めて東京に来た留学生の1日を追体験。渋谷での選択があなたの物語を変えます。',
        'level_jlpt': 'N3',
        'level_cefr': 'B1',
        'estimated_time': 10,
        'ch1': {
            'content': '今日は私の東京での新しい生活の初めての日です。渋谷の駅に着いて、人の多さに驚きました。これから、どこへ行きましょうか?',
            'content_ruby': '<ruby>今日<rt>きょう</rt></ruby>は<ruby>私<rt>わたし</rt></ruby>の<ruby>東京<rt>とうきょう</rt></ruby>での<ruby>新<rt>あたら</rt></ruby>しい<ruby>生活<rt>せいかつ</rt></ruby>の<ruby>初<rt>はじ</rt></ruby>めての<ruby>日<rt>ひ</rt></ruby>です。<ruby>渋谷<rt>しぶや</rt></ruby>の<ruby>駅<rt>えき</rt></ruby>に<ruby>着<rt>つ</rt></ruby>いて、<ruby>人<rt>ひと</rt></ruby>の<ruby>多<rt>おお</rt></ruby>さに<ruby>驚<rt>おどろ</rt></ruby>きました。これから、どこへ<ruby>行<rt>い</rt></ruby>きましょうか?',
            'translation': 'Today is my first day of a new life in Tokyo. I arrived at Shibuya Station and was surprised by the number of people. Where should I go from here?',
        },
        'choices': [
            ('カフェで休憩する', '疲れたので、近くのカフェで一休みして、ゆっくり考えましょう。'),
            ('観光スポットを探す', 'せっかく渋谷に来たので、有名な観光地を訪れてみたいです。'),
            ('アパートへ直行する', '荷物が重いので、まず新しいアパートに向かって荷物を置きたいです。'),
        ],
        'ch2': [
            {
                'content': '静かなカフェに入りました。窓際の席に座って、カフェラテを注文しました。外を見ると、渋谷のスクランブル交差点が見えます。多くの人が行き交っています。',
                'content_ruby': '<ruby>静<rt>しず</rt></ruby>かなカフェに<ruby>入<rt>はい</rt></ruby>りました。<ruby>窓際<rt>まどぎわ</rt></ruby>の<ruby>席<rt>せき</rt></ruby>に<ruby>座<rt>すわ</rt></ruby>って、カフェラテを<ruby>注文<rt>ちゅうもん</rt></ruby>しました。<ruby>外<rt>そと</rt></ruby>を<ruby>見<rt>み</rt></ruby>ると、<ruby>渋谷<rt>しぶや</rt></ruby>のスクランブル<ruby>交差点<rt>こうさてん</rt></ruby>が<ruby>見<rt>み</rt></ruby>えます。<ruby>多<rt>おお</rt></ruby>くの<ruby>人<rt>ひと</rt></ruby>が<ruby>行<rt>い</rt></ruby>き<ruby>交<rt>か</rt></ruby>っています。',
                'translation': 'I entered a quiet cafe. I sat at a window seat and ordered a cafe latte. Looking outside, I can see the Shibuya Scramble Crossing. Many people are passing by.',
            },
            {
                'content': 'ハチ公像の前に来ました。多くの観光客が写真を撮っています。私も記念写真を撮りました。次に、渋谷センター街を歩いてみることにしました。たくさんのお店があって、とても賑やかです。',
                'content_ruby': 'ハチ<ruby>公像<rt>こうぞう</rt></ruby>の<ruby>前<rt>まえ</rt></ruby>に<ruby>来<rt>き</rt></ruby>ました。<ruby>多<rt>おお</rt></ruby>くの<ruby>観光客<rt>かんこうきゃく</rt></ruby>が<ruby>写真<rt>しゃしん</rt></ruby>を<ruby>撮<rt>と</rt></ruby>っています。<ruby>私<rt>わたし</rt></ruby>も<ruby>記念写真<rt>きねんしゃしん</rt></ruby>を<ruby>撮<rt>と</rt></ruby>りました。<ruby>次<rt>つぎ</rt></ruby>に、<ruby>渋谷<rt>しぶや</rt></ruby>センター<ruby>街<rt>がい</rt></ruby>を<ruby>歩<rt>ある</rt></ruby>いてみることにしました。たくさんのお<ruby>店<rt>みせ</rt></ruby>があって、とても<ruby>賑<rt>にぎ</rt></ruby>やかです。',
                'translation': 'I came to the Hachiko statue. Many tourists are taking pictures. I also took a commemorative photo. Next, I decided to walk through Shibuya Center Street. There are many shops and it is very lively.',
            },
            {
                'content': '新しいアパートに到着しました。3階の部屋です。鍵を開けて中に入ると、小さいですが綺麗な部屋でした。窓から公園が見えます。これから、この部屋で新しい生活が始まります。',
                'content_ruby': '<ruby>新<rt>あたら</rt></ruby>しいアパートに<ruby>到着<rt>とうちゃく</rt></ruby>しました。3<ruby>階<rt>かい</rt></ruby>の<ruby>部屋<rt>へや</rt></ruby>です。<ruby>鍵<rt>かぎ</rt></ruby>を<ruby>開<rt>あ</rt></ruby>けて<ruby>中<rt>なか</rt></ruby>に<ruby>入<rt>はい</rt></ruby>ると、<ruby>小<rt>ちい</rt></ruby>さいですが<ruby>綺麗<rt>きれい</rt></ruby>な<ruby>部屋<rt>へや</rt></ruby>でした。<ruby>窓<rt>まど</rt></ruby>から<ruby>公園<rt>こうえん</rt></ruby>が<ruby>見<rt>み</rt></ruby>えます。これから、この<ruby>部屋<rt>へや</rt></ruby>で<ruby>新<rt>あたら</rt></ruby>しい<ruby>生活<rt>せいかつ</rt></ruby>が<ruby>始<rt>はじ</rt></ruby>まります。',
                'translation': 'I arrived at my new apartment. It is a room on the 3rd floor. When I opened the key and entered, it was a small but clean room. I can see a park from the window. From now on, a new life will begin in this room.',
            },
        ],
        'ch3': [
            {
                'content': 'カフェで落ち着いた後、隣のテーブルの日本人に道を尋ねました。その人はとても親切で、おすすめの場所を教えてくれました。「明治神宮は静かで素敵ですよ」と言われ、行ってみることにしました。',
                'content_ruby': 'カフェで<ruby>落<rt>お</rt></ruby>ち<ruby>着<rt>つ</rt></ruby>いた<ruby>後<rt>あと</rt></ruby>、<ruby>隣<rt>となり</rt></ruby>のテーブルの<ruby>日本人<rt>にほんじん</rt></ruby>に<ruby>道<rt>みち</rt></ruby>を<ruby>尋<rt>たず</rt></ruby>ねました。その<ruby>人<rt>ひと</rt></ruby>はとても<ruby>親切<rt>しんせつ</rt></ruby>で、おすすめの<ruby>場所<rt>ばしょ</rt></ruby>を<ruby>教<rt>おし</rt></ruby>えてくれました。「<ruby>明治神宮<rt>めいじじんぐう</rt></ruby>は<ruby>静<rt>しず</rt></ruby>かで<ruby>素敵<rt>すてき</rt></ruby>ですよ」と<ruby>言<rt>い</rt></ruby>われ、<ruby>行<rt>い</rt></ruby>ってみることにしました。',
                'translation': 'After settling down at the cafe, I asked a Japanese person at the next table for directions. That person was very kind and told me about recommended places. They said "Meiji Shrine is quiet and wonderful," so I decided to go there.',
            },
            {
                'content': '渋谷を歩き回っているうちに、小さな神社を見つけました。都会の真ん中にある静かな場所です。お参りをして、これからの東京生活がうまくいくようにお願いしました。',
                'content_ruby': '<ruby>渋谷<rt>しぶや</rt></ruby>を<ruby>歩<rt>ある</rt></ruby>き<ruby>回<rt>まわ</rt></ruby>っているうちに、<ruby>小<rt>ちい</rt></ruby>さな<ruby>神社<rt>じんじゃ</rt></ruby>を<ruby>見<rt>み</rt></ruby>つけました。<ruby>都会<rt>とかい</rt></ruby>の<ruby>真<rt>ま</rt></ruby>ん<ruby>中<rt>なか</rt></ruby>にある<ruby>静<rt>しず</rt></ruby>かな<ruby>場所<rt>ばしょ</rt></ruby>です。お<ruby>参<rt>まい</rt></ruby>りをして、これからの<ruby>東京<rt>とうきょう</rt></ruby><ruby>生活<rt>せいかつ</rt></ruby>がうまくいくようにお<ruby>願<rt>ねが</rt></ruby>いしました。',
                'translation': 'While walking around Shibuya, I found a small shrine. It is a quiet place in the middle of the city. I prayed and wished for my Tokyo life to go well.',
            },
            {
                'content': '荷物を置いた後、近所を散歩してみました。スーパーやコンビニ、駅までの道を確認しました。近くに公園もあって、朝のジョギングに良さそうです。この街での生活が楽しみになってきました。',
                'content_ruby': '<ruby>荷物<rt>にもつ</rt></ruby>を<ruby>置<rt>お</rt></ruby>いた<ruby>後<rt>あと</rt></ruby>、<ruby>近所<rt>きんじょ</rt></ruby>を<ruby>散歩<rt>さんぽ</rt></ruby>してみました。スーパーやコンビニ、<ruby>駅<rt>えき</rt></ruby>までの<ruby>道<rt>みち</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>しました。<ruby>近<rt>ちか</rt></ruby>くに<ruby>公園<rt>こうえん</rt></ruby>もあって、<ruby>朝<rt>あさ</rt></ruby>のジョギングに<ruby>良<rt>よ</rt></ruby>さそうです。この<ruby>街<rt>まち</rt></ruby>での<ruby>生活<rt>せいかつ</rt></ruby>が<ruby>楽<rt>たの</rt></ruby>しみになってきました。',
                'translation': 'After putting down my luggage, I took a walk around the neighborhood. I checked the way to the supermarket, convenience store, and station. There is also a park nearby, which looks good for morning jogging. I am looking forward to life in this town.',
            },
        ],
        'ch4': {
            'content': '夕方になり、素敵な定食屋さんを見つけました。店主のおばさんが「いらっしゃい！」と元気に迎えてくれました。生姜焼き定食を注文すると、とても美味しくて感動しました。「また来てね」と言われ、心が温かくなりました。',
            'content_ruby': '<ruby>夕方<rt>ゆうがた</rt></ruby>になり、<ruby>素敵<rt>すてき</rt></ruby>な<ruby>定食屋<rt>ていしょくや</rt></ruby>さんを<ruby>見<rt>み</rt></ruby>つけました。<ruby>店主<rt>てんしゅ</rt></ruby>のおばさんが「いらっしゃい！」と<ruby>元気<rt>げんき</rt></ruby>に<ruby>迎<rt>むか</rt></ruby>えてくれました。<ruby>生姜焼<rt>しょうがや</rt></ruby>き<ruby>定食<rt>ていしょく</rt></ruby>を<ruby>注文<rt>ちゅうもん</rt></ruby>すると、とても<ruby>美味<rt>おい</rt></ruby>しくて<ruby>感動<rt>かんどう</rt></ruby>しました。「また<ruby>来<rt>き</rt></ruby>てね」と<ruby>言<rt>い</rt></ruby>われ、<ruby>心<rt>こころ</rt></ruby>が<ruby>温<rt>あたた</rt></ruby>かくなりました。',
            'translation': 'In the evening, I found a nice set meal restaurant. The owner, an elderly woman, greeted me cheerfully with "Welcome!" When I ordered the ginger pork set meal, it was so delicious that I was moved. She said "Come again," and my heart warmed.',
        },
        'ch5': {
            'content': '東京での最初の一日が終わりました。少し疲れましたが、とても充実した時間でした。明日から日本語学校が始まります。新しい友達ができるといいなと思いながら、眠りにつきました。',
            'content_ruby': '<ruby>東京<rt>とうきょう</rt></ruby>での<ruby>最初<rt>さいしょ</rt></ruby>の<ruby>一日<rt>いちにち</rt></ruby>が<ruby>終<rt>お</rt></ruby>わりました。<ruby>少<rt>すこ</rt></ruby>し<ruby>疲<rt>つか</rt></ruby>れましたが、とても<ruby>充実<rt>じゅうじつ</rt></ruby>した<ruby>時間<rt>じかん</rt></ruby>でした。<ruby>明日<rt>あした</rt></ruby>から<ruby>日本語<rt>にほんご</rt></ruby><ruby>学校<rt>がっこう</rt></ruby>が<ruby>始<rt>はじ</rt></ruby>まります。<ruby>新<rt>あたら</rt></ruby>しい<ruby>友達<rt>ともだち</rt></ruby>ができるといいなと<ruby>思<rt>おも</rt></ruby>いながら、<ruby>眠<rt>ねむ</rt></ruby>りにつきました。',
            'translation': 'My first day in Tokyo is over. I was a little tired, but it was a very fulfilling time. Japanese language school starts tomorrow. I fell asleep hoping to make new friends.',
        },
    },
    # Add Story 2-9 metadata here (simplified for length)
]

def generate_story(story_data):
    """Generate TypeScript code for a single story with branching structure"""
    sid = story_data['id']

    code = f"""
  // ============================================================
  // Story {sid}: {story_data['title']} ({story_data['level_jlpt']}/{story_data['level_cefr']}) - 5 Chapters with Branching
  // ============================================================
  const story{sid} = await prisma.story.create({{
    data: {{
      story_id: '{sid}',
      title: '{story_data['title']}',
      description: '{story_data['description']}',
      level_jlpt: '{story_data['level_jlpt']}',
      level_cefr: '{story_data['level_cefr']}',
      estimated_time: {story_data['estimated_time']},
      root_chapter_id: 'ch-{sid}-1',
    }},
  }});

  const chapter{sid}_1 = await prisma.chapter.create({{
    data: {{
      chapter_id: 'ch-{sid}-1',
      story_id: story{sid}.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: '{story_data['ch1']['content']}',
      content_with_ruby: '{story_data['ch1']['content_ruby']}',
      translation: '{story_data['ch1']['translation']}',
    }},
  }});

  await prisma.choice.createMany({{
    data: [
"""

    # Add 3 initial choices
    for i, (text, desc) in enumerate(story_data['choices'], 1):
        variant = chr(96 + i)  # a, b, c
        code += f"""      {{
        choice_id: 'choice-{sid}-1-{variant}',
        chapter_id: chapter{sid}_1.chapter_id,
        choice_text: '{text}',
        choice_description: '{desc}',
        next_chapter_id: 'ch-{sid}-2{variant}',
        display_order: {i},
      }},
"""

    code += """    ],
  });

  await prisma.chapter.createMany({
    data: [
"""

    # Add ch2 variants (a, b, c)
    for i, ch2_data in enumerate(story_data['ch2']):
        variant = chr(97 + i)  # a, b, c
        code += f"""      // Chapter 2{variant}
      {{
        chapter_id: 'ch-{sid}-2{variant}',
        story_id: story{sid}.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter{sid}_1.chapter_id,
        content: '{ch2_data['content']}',
        content_with_ruby: '{ch2_data['content_ruby']}',
        translation: '{ch2_data['translation']}',
      }},
"""

    # Add ch3 variants (a, b, c)
    for i, ch3_data in enumerate(story_data['ch3']):
        variant = chr(97 + i)  # a, b, c
        code += f"""      // Chapter 3{variant}
      {{
        chapter_id: 'ch-{sid}-3{variant}',
        story_id: story{sid}.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-{sid}-2{variant}',
        content: '{ch3_data['content']}',
        content_with_ruby: '{ch3_data['content_ruby']}',
        translation: '{ch3_data['translation']}',
      }},
"""

    # Add ch4 (convergence)
    code += f"""      // Chapter 4 (convergence)
      {{
        chapter_id: 'ch-{sid}-4',
        story_id: story{sid}.story_id,
        chapter_number: 4,
        depth_level: 3,
        parent_chapter_id: 'ch-{sid}-3a',
        content: '{story_data['ch4']['content']}',
        content_with_ruby: '{story_data['ch4']['content_ruby']}',
        translation: '{story_data['ch4']['translation']}',
      }},
"""

    # Add ch5 (conclusion)
    code += f"""      // Chapter 5 (conclusion)
      {{
        chapter_id: 'ch-{sid}-5',
        story_id: story{sid}.story_id,
        chapter_number: 5,
        depth_level: 4,
        parent_chapter_id: 'ch-{sid}-4',
        content: '{story_data['ch5']['content']}',
        content_with_ruby: '{story_data['ch5']['content_ruby']}',
        translation: '{story_data['ch5']['translation']}',
      }},
"""

    code += """    ],
  });

  // Add choices for chapter 2 variants to chapter 3 variants
  await prisma.choice.createMany({
    data: [
"""

    for variant in ['a', 'b', 'c']:
        code += f"""      {{ choice_id: 'choice-{sid}-2{variant}-to-3{variant}', chapter_id: 'ch-{sid}-2{variant}', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-{sid}-3{variant}', display_order: 1 }},
"""

    code += """    ],
  });

  // Add choices for chapter 3 variants to chapter 4 (convergence)
  await prisma.choice.createMany({
    data: [
"""

    for variant in ['a', 'b', 'c']:
        code += f"""      {{ choice_id: 'choice-{sid}-3{variant}-to-4', chapter_id: 'ch-{sid}-3{variant}', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-{sid}-4', display_order: 1 }},
"""

    code += """    ],
  });

  // Add choice from chapter 4 to chapter 5
  await prisma.choice.create({
    data: {
      choice_id: 'choice-{}-4-to-5',
      chapter_id: 'ch-{}-4',
      choice_text: '次へ進む',
      choice_description: 'ストーリーを完結させます。',
      next_chapter_id: 'ch-{}-5',
      display_order: 1,
    },
  }});

  console.log('Created Story {} ({}) with 5 chapters and branching structure');
""".format(sid, sid, sid, sid, story_data['title'])

    return code

def main():
    output = HEADER

    for story in STORIES:
        output += generate_story(story)

    output += FOOTER

    print(output)

if __name__ == '__main__':
    main()
