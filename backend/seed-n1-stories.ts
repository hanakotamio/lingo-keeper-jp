import prisma from './src/lib/db.js';

/**
 * Seed N1/C1 level stories with advanced grammar and sophisticated topics
 * Total: 5 stories (IDs: 21-25)
 */
async function seedN1Stories() {
  console.log('Creating N1/C1 level stories...\n');

  try {
    // ============================================================
    // N1 / C1 Level Stories (5 stories)
    // ============================================================

    const n1Stories = [
      {
        id: '21',
        title: '国際ビジネス交渉',
        description: '異文化間のビジネス交渉で成功を目指します。',
        rootChapter: 'chapter-21-1',
        chapters: [
          {
            id: 'chapter-21-1',
            number: 1,
            title: '交渉前の準備',
            content: '明日の商談をもって、今期の売上目標が決まる。相手企業は業界随一の実績を誇る大手だ。いかに優位な条件を引き出せるかが鍵となる。\n\n(Tomorrow\'s business negotiation will determine this quarter\'s sales target. The other company is a major player boasting the industry\'s top track record. The key is how to extract favorable conditions.)',
            learningPoints: {
              points: [
                '～をもって: indicates means/basis for something',
                '～随一: the best/foremost in ~',
                '～を誇る: to boast/take pride in ~',
                'いかに～か: how/in what way ~'
              ]
            },
            vocabulary: {
              words: [
                { word: '商談', reading: 'しょうだん', meaning: 'business negotiation' },
                { word: '売上', reading: 'うりあげ', meaning: 'sales revenue' },
                { word: '随一', reading: 'ずいいち', meaning: 'the best, number one' },
                { word: '実績', reading: 'じっせき', meaning: 'track record, achievements' },
                { word: '優位', reading: 'ゆうい', meaning: 'superiority, advantage' },
                { word: '条件', reading: 'じょうけん', meaning: 'conditions, terms' },
                { word: '引き出す', reading: 'ひきだす', meaning: 'to extract, draw out' }
              ]
            },
            choices: [
              {
                text: '徹底的な市場調査を行う (Conduct thorough market research)',
                nextChapter: 'chapter-21-2',
                difficulty: 0
              },
              {
                text: '過去の交渉事例を分析する (Analyze past negotiation cases)',
                nextChapter: 'chapter-21-3',
                difficulty: 1
              }
            ]
          },
          {
            id: 'chapter-21-2',
            number: 2,
            title: '交渉当日',
            content: '相手の提案は我々の予想を上回るものだった。とはいえ、このまま受け入れるわけにはいかない。長期的な利益と相まって、戦略的な判断が求められる。\n\n(The other party\'s proposal exceeded our expectations. That said, we cannot simply accept it as is. Combined with long-term profits, strategic judgment is required.)',
            learningPoints: {
              points: [
                '～を上回る: to exceed/surpass ~',
                '～とはいえ: even though/although ~',
                '～と相まって: combined with/coupled with ~',
                '～が求められる: ~ is required/demanded'
              ]
            },
            vocabulary: {
              words: [
                { word: '提案', reading: 'ていあん', meaning: 'proposal' },
                { word: '予想', reading: 'よそう', meaning: 'expectation, prediction' },
                { word: '上回る', reading: 'うわまわる', meaning: 'to exceed' },
                { word: '受け入れる', reading: 'うけいれる', meaning: 'to accept' },
                { word: '長期的', reading: 'ちょうきてき', meaning: 'long-term' },
                { word: '戦略的', reading: 'せんりゃくてき', meaning: 'strategic' },
                { word: '判断', reading: 'はんだん', meaning: 'judgment, decision' }
              ]
            },
            choices: []
          },
          {
            id: 'chapter-21-3',
            number: 3,
            title: '戦略的アプローチ',
            content: '過去の失敗事例を踏まえ、慎重に交渉を進めた。競合他社との比較を持ち出すことで、相手側の譲歩を引き出すことに成功した。\n\n(Based on past failure cases, we proceeded with the negotiation carefully. By bringing up comparisons with competitors, we succeeded in drawing out concessions from the other side.)',
            learningPoints: {
              points: [
                '～を踏まえ: based on/in light of ~',
                '～を持ち出す: to bring up/mention ~',
                '～ことに成功する: succeed in doing ~',
                '譲歩を引き出す: to draw out concessions'
              ]
            },
            vocabulary: {
              words: [
                { word: '失敗', reading: 'しっぱい', meaning: 'failure' },
                { word: '事例', reading: 'じれい', meaning: 'case, example' },
                { word: '踏まえる', reading: 'ふまえる', meaning: 'to be based on' },
                { word: '慎重', reading: 'しんちょう', meaning: 'careful, cautious' },
                { word: '競合', reading: 'きょうごう', meaning: 'competition, rival' },
                { word: '譲歩', reading: 'じょうほ', meaning: 'concession' }
              ]
            },
            choices: []
          }
        ]
      },
      {
        id: '22',
        title: '日本の伝統文化の継承',
        description: '伝統工芸の後継者不足問題に直面する職人の物語。',
        rootChapter: 'chapter-22-1',
        chapters: [
          {
            id: 'chapter-22-1',
            number: 1,
            title: '伝統の重み',
            content: '五代続く陶芸工房の当主として、伝統技術の継承を余儀なくされている。しかしながら、現代社会においては伝統工芸ならではの価値を理解する若者は少ない。\n\n(As the head of a five-generation pottery workshop, I am forced to pass down traditional techniques. However, in modern society, there are few young people who understand the unique value of traditional crafts.)',
            learningPoints: {
              points: [
                '～を余儀なくされる: to be forced/compelled to do ~',
                'しかしながら: however, nevertheless',
                '～ならでは: unique to/characteristic of ~',
                '～においては: in/regarding ~'
              ]
            },
            vocabulary: {
              words: [
                { word: '五代', reading: 'ごだい', meaning: 'five generations' },
                { word: '続く', reading: 'つづく', meaning: 'to continue' },
                { word: '陶芸', reading: 'とうげい', meaning: 'pottery, ceramics' },
                { word: '工房', reading: 'こうぼう', meaning: 'workshop, studio' },
                { word: '当主', reading: 'とうしゅ', meaning: 'head of family/business' },
                { word: '継承', reading: 'けいしょう', meaning: 'succession, inheritance' },
                { word: '余儀なくされる', reading: 'よぎなくされる', meaning: 'to be compelled to' }
              ]
            },
            choices: [
              {
                text: '伝統を守り抜く道を選ぶ (Choose to preserve tradition)',
                nextChapter: 'chapter-22-2',
                difficulty: 0
              },
              {
                text: '現代風にアレンジする道を探る (Explore modernization)',
                nextChapter: 'chapter-22-3',
                difficulty: 1
              }
            ]
          },
          {
            id: 'chapter-22-2',
            number: 2,
            title: '伝統の価値',
            content: '伝統技術といえども、時代に合わせた進化が必要だという意見もある。だが、安易な妥協は先祖代々受け継がれてきた技を損なうことになりかねない。\n\n(Even with traditional techniques, there are opinions that evolution to match the times is necessary. However, easy compromise could potentially damage the skills passed down through generations.)',
            learningPoints: {
              points: [
                '～といえども: even though/although ~',
                '～に合わせた: adapted to/matching ~',
                '先祖代々: from generation to generation',
                '～ことになりかねない: could possibly result in ~'
              ]
            },
            vocabulary: {
              words: [
                { word: '進化', reading: 'しんか', meaning: 'evolution' },
                { word: '安易', reading: 'あんい', meaning: 'easy, simple-minded' },
                { word: '妥協', reading: 'だきょう', meaning: 'compromise' },
                { word: '先祖', reading: 'せんぞ', meaning: 'ancestors' },
                { word: '代々', reading: 'だいだい', meaning: 'for generations' },
                { word: '受け継ぐ', reading: 'うけつぐ', meaning: 'to inherit' },
                { word: '損なう', reading: 'そこなう', meaning: 'to damage, impair' }
              ]
            },
            choices: []
          },
          {
            id: 'chapter-22-3',
            number: 3,
            title: '新たな挑戦',
            content: '伝統を踏襲しつつ、現代のニーズに応える製品開発に着手した。SNSを通じた情報発信と相まって、若い世代の関心を集めることができた。\n\n(While following tradition, we started developing products that meet modern needs. Combined with information dissemination through social media, we were able to attract the interest of younger generations.)',
            learningPoints: {
              points: [
                '～を踏襲する: to follow/adhere to (tradition)',
                '～に応える: to meet/respond to ~',
                '～に着手する: to start/embark on ~',
                '～を集める: to gather/attract ~'
              ]
            },
            vocabulary: {
              words: [
                { word: '踏襲', reading: 'とうしゅう', meaning: 'following precedent' },
                { word: 'ニーズ', reading: 'にーず', meaning: 'needs' },
                { word: '製品', reading: 'せいひん', meaning: 'product' },
                { word: '開発', reading: 'かいはつ', meaning: 'development' },
                { word: '着手', reading: 'ちゃくしゅ', meaning: 'starting, beginning' },
                { word: '発信', reading: 'はっしん', meaning: 'transmission, dissemination' },
                { word: '関心', reading: 'かんしん', meaning: 'interest, concern' }
              ]
            },
            choices: []
          }
        ]
      },
      {
        id: '23',
        title: '環境問題と企業責任',
        description: '持続可能な社会の実現に向けた企業の取り組み。',
        rootChapter: 'chapter-23-1',
        chapters: [
          {
            id: 'chapter-23-1',
            number: 1,
            title: '社会的責任',
            content: '気候変動への対応なくして、企業の持続的成長はあり得ない。利益追求のみならず、環境保護と経済発展の両立が求められる時代となった。\n\n(Without addressing climate change, sustainable corporate growth is impossible. We have entered an era where not only profit-seeking but also the balance between environmental protection and economic development is required.)',
            learningPoints: {
              points: [
                '～なくして: without ~',
                '～あり得ない: impossible, cannot exist',
                '～のみならず: not only ~ but also',
                '～が求められる: ~ is required/demanded'
              ]
            },
            vocabulary: {
              words: [
                { word: '気候変動', reading: 'きこうへんどう', meaning: 'climate change' },
                { word: '対応', reading: 'たいおう', meaning: 'response, handling' },
                { word: '持続的', reading: 'じぞくてき', meaning: 'sustainable' },
                { word: '成長', reading: 'せいちょう', meaning: 'growth' },
                { word: '利益', reading: 'りえき', meaning: 'profit' },
                { word: '追求', reading: 'ついきゅう', meaning: 'pursuit' },
                { word: '両立', reading: 'りょうりつ', meaning: 'compatibility, balance' }
              ]
            },
            choices: [
              {
                text: '再生可能エネルギーへの転換 (Shift to renewable energy)',
                nextChapter: 'chapter-23-2',
                difficulty: 0
              },
              {
                text: 'カーボンニュートラル実現 (Achieve carbon neutrality)',
                nextChapter: 'chapter-23-3',
                difficulty: 1
              }
            ]
          },
          {
            id: 'chapter-23-2',
            number: 2,
            title: '変革の決断',
            content: '短期的には収益の低下を招くにせよ、長期的視点に立てば必要不可欠な投資である。ステークホルダーの理解を得るべく、丁寧な説明を重ねた。\n\n(Even if it leads to decreased revenue in the short term, from a long-term perspective it is an essential investment. We repeatedly provided careful explanations to gain stakeholder understanding.)',
            learningPoints: {
              points: [
                '～にせよ: even if/even though ~',
                '～に立てば: from the standpoint of ~',
                '必要不可欠: absolutely necessary',
                '～を得るべく: in order to obtain ~'
              ]
            },
            vocabulary: {
              words: [
                { word: '短期的', reading: 'たんきてき', meaning: 'short-term' },
                { word: '収益', reading: 'しゅうえき', meaning: 'revenue, earnings' },
                { word: '低下', reading: 'ていか', meaning: 'decline, drop' },
                { word: '招く', reading: 'まねく', meaning: 'to invite, cause' },
                { word: '視点', reading: 'してん', meaning: 'viewpoint, perspective' },
                { word: '不可欠', reading: 'ふかけつ', meaning: 'essential, indispensable' },
                { word: '投資', reading: 'とうし', meaning: 'investment' }
              ]
            },
            choices: []
          },
          {
            id: 'chapter-23-3',
            number: 3,
            title: '持続可能な未来',
            content: '技術革新に伴い、予想を超える成果を上げることができた。環境への配慮が競争優位性につながるという認識が、業界全体に広がりつつある。\n\n(With technological innovation, we achieved results beyond expectations. The recognition that environmental consideration leads to competitive advantage is spreading throughout the industry.)',
            learningPoints: {
              points: [
                '～に伴い: along with/accompanying ~',
                '～を超える: to exceed/surpass ~',
                '～につながる: to lead to/connect to ~',
                '～つつある: to be in the process of ~'
              ]
            },
            vocabulary: {
              words: [
                { word: '技術', reading: 'ぎじゅつ', meaning: 'technology' },
                { word: '革新', reading: 'かくしん', meaning: 'innovation' },
                { word: '成果', reading: 'せいか', meaning: 'results, achievements' },
                { word: '配慮', reading: 'はいりょ', meaning: 'consideration, concern' },
                { word: '競争', reading: 'きょうそう', meaning: 'competition' },
                { word: '優位性', reading: 'ゆういせい', meaning: 'superiority, advantage' },
                { word: '認識', reading: 'にんしき', meaning: 'recognition, awareness' }
              ]
            },
            choices: []
          }
        ]
      },
      {
        id: '24',
        title: '医療現場の倫理的ジレンマ',
        description: '最先端医療技術と倫理観の狭間で葛藤する医師の物語。',
        rootChapter: 'chapter-24-1',
        chapters: [
          {
            id: 'chapter-24-1',
            number: 1,
            title: '難しい選択',
            content: '新薬の治験において、予期せぬ副作用が報告された。患者の命を救う可能性がある一方で、リスクを伴うことは否めない。医師として、いかなる判断を下すべきか。\n\n(Unexpected side effects were reported in the new drug trial. While there is potential to save patient lives, the accompanying risks are undeniable. As a physician, what judgment should be made?)',
            learningPoints: {
              points: [
                '～において: in/at/regarding ~',
                '～一方で: while/on the other hand ~',
                '～は否めない: cannot deny that ~',
                'いかなる: what kind of/any'
              ]
            },
            vocabulary: {
              words: [
                { word: '新薬', reading: 'しんやく', meaning: 'new drug' },
                { word: '治験', reading: 'ちけん', meaning: 'clinical trial' },
                { word: '予期', reading: 'よき', meaning: 'expectation, anticipation' },
                { word: '副作用', reading: 'ふくさよう', meaning: 'side effect' },
                { word: '報告', reading: 'ほうこく', meaning: 'report' },
                { word: '可能性', reading: 'かのうせい', meaning: 'possibility' },
                { word: '否めない', reading: 'いなめない', meaning: 'undeniable' }
              ]
            },
            choices: [
              {
                text: '治験を継続する (Continue the trial)',
                nextChapter: 'chapter-24-2',
                difficulty: 1
              },
              {
                text: '倫理委員会に諮る (Consult ethics committee)',
                nextChapter: 'chapter-24-3',
                difficulty: 0
              }
            ]
          },
          {
            id: 'chapter-24-2',
            number: 2,
            title: '決断の重み',
            content: '患者の同意を得た上で治験を続行した。万が一の事態に備え、監視体制を強化せざるを得なかった。生命倫理の観点から、常に自問自答が求められる。\n\n(We continued the trial after obtaining patient consent. We had no choice but to strengthen the monitoring system in preparation for any emergency. From a bioethics perspective, constant self-questioning is required.)',
            learningPoints: {
              points: [
                '～を得た上で: after obtaining/gaining ~',
                '万が一: in case of emergency',
                '～せざるを得ない: have no choice but to ~',
                '～の観点から: from the perspective of ~'
              ]
            },
            vocabulary: {
              words: [
                { word: '同意', reading: 'どうい', meaning: 'consent, agreement' },
                { word: '続行', reading: 'ぞっこう', meaning: 'continuation' },
                { word: '事態', reading: 'じたい', meaning: 'situation, circumstances' },
                { word: '備える', reading: 'そなえる', meaning: 'to prepare' },
                { word: '監視', reading: 'かんし', meaning: 'monitoring, surveillance' },
                { word: '体制', reading: 'たいせい', meaning: 'system, structure' },
                { word: '倫理', reading: 'りんり', meaning: 'ethics' }
              ]
            },
            choices: []
          },
          {
            id: 'chapter-24-3',
            number: 3,
            title: '倫理的考察',
            content: '委員会の審議を経て、より厳格な安全基準が設けられた。医学の進歩と患者の安全、この二つの要素をいかにバランスさせるかが、現代医療の課題である。\n\n(Through committee deliberation, stricter safety standards were established. How to balance these two elements - medical progress and patient safety - is the challenge of modern medicine.)',
            learningPoints: {
              points: [
                '～を経て: through/via/after ~',
                '～が設けられる: ~ is established/set up',
                'いかに～か: how to ~',
                'バランスさせる: to balance'
              ]
            },
            vocabulary: {
              words: [
                { word: '委員会', reading: 'いいんかい', meaning: 'committee' },
                { word: '審議', reading: 'しんぎ', meaning: 'deliberation' },
                { word: '厳格', reading: 'げんかく', meaning: 'strict, rigorous' },
                { word: '基準', reading: 'きじゅん', meaning: 'standard, criterion' },
                { word: '進歩', reading: 'しんぽ', meaning: 'progress, advancement' },
                { word: '要素', reading: 'ようそ', meaning: 'element, factor' },
                { word: '課題', reading: 'かだい', meaning: 'challenge, issue' }
              ]
            },
            choices: []
          }
        ]
      },
      {
        id: '25',
        title: 'AI時代の雇用と教育',
        description: '人工知能の発展が社会にもたらす影響を考察する。',
        rootChapter: 'chapter-25-1',
        chapters: [
          {
            id: 'chapter-25-1',
            number: 1,
            title: '変わる労働市場',
            content: 'AIの急速な発展に伴い、従来の職業の多くが自動化される可能性がある。人間にしかできない仕事とは何か。教育の在り方そのものを見直す必要に迫られている。\n\n(With the rapid development of AI, many traditional jobs may be automated. What are jobs that only humans can do? We are forced to reconsider the very nature of education.)',
            learningPoints: {
              points: [
                '～に伴い: along with/accompanying ~',
                '～される可能性がある: may be ~ed',
                '～にしかできない: only ~ can do',
                '～に迫られる: to be pressed/forced to ~'
              ]
            },
            vocabulary: {
              words: [
                { word: '急速', reading: 'きゅうそく', meaning: 'rapid, swift' },
                { word: '発展', reading: 'はってん', meaning: 'development' },
                { word: '従来', reading: 'じゅうらい', meaning: 'conventional, traditional' },
                { word: '職業', reading: 'しょくぎょう', meaning: 'occupation, profession' },
                { word: '自動化', reading: 'じどうか', meaning: 'automation' },
                { word: '在り方', reading: 'ありかた', meaning: 'way of being, nature' },
                { word: '見直す', reading: 'みなおす', meaning: 'to reconsider, review' }
              ]
            },
            choices: [
              {
                text: '創造性を重視した教育改革 (Education reform emphasizing creativity)',
                nextChapter: 'chapter-25-2',
                difficulty: 0
              },
              {
                text: 'AIとの共生を前提とした訓練 (Training assuming AI coexistence)',
                nextChapter: 'chapter-25-3',
                difficulty: 1
              }
            ]
          },
          {
            id: 'chapter-25-2',
            number: 2,
            title: '人間の価値',
            content: '知識の暗記に頼る教育は時代遅れとなりつつある。むしろ、批判的思考力や問題解決能力といった、AIには代替し難い能力の育成が重要である。\n\n(Education relying on memorization of knowledge is becoming outdated. Rather, nurturing abilities that are difficult for AI to replace, such as critical thinking and problem-solving skills, is important.)',
            learningPoints: {
              points: [
                '～に頼る: to rely on/depend on ~',
                '～となりつつある: is becoming ~',
                'むしろ: rather, instead',
                '～し難い: difficult to ~'
              ]
            },
            vocabulary: {
              words: [
                { word: '知識', reading: 'ちしき', meaning: 'knowledge' },
                { word: '暗記', reading: 'あんき', meaning: 'memorization' },
                { word: '時代遅れ', reading: 'じだいおくれ', meaning: 'outdated' },
                { word: '批判的', reading: 'ひはんてき', meaning: 'critical' },
                { word: '思考力', reading: 'しこうりょく', meaning: 'thinking ability' },
                { word: '代替', reading: 'だいたい', meaning: 'substitution, replacement' },
                { word: '育成', reading: 'いくせい', meaning: 'nurturing, cultivation' }
              ]
            },
            choices: []
          },
          {
            id: 'chapter-25-3',
            number: 3,
            title: '共生の道',
            content: 'AIを敵視するのではなく、協働のパートナーとして捉える視点が必要だ。人間の感性と機械の正確さを組み合わせることで、より良い社会の実現が可能となる。\n\n(Rather than viewing AI as an enemy, we need a perspective that sees it as a collaborative partner. By combining human sensitivity with machine accuracy, a better society can be realized.)',
            learningPoints: {
              points: [
                '～を敵視する: to regard ~ as enemy',
                '～として捉える: to view/perceive as ~',
                '～を組み合わせる: to combine ~',
                '～が可能となる: ~ becomes possible'
              ]
            },
            vocabulary: {
              words: [
                { word: '敵視', reading: 'てきし', meaning: 'hostility, antagonism' },
                { word: '協働', reading: 'きょうどう', meaning: 'collaboration' },
                { word: '捉える', reading: 'とらえる', meaning: 'to perceive, grasp' },
                { word: '視点', reading: 'してん', meaning: 'viewpoint, perspective' },
                { word: '感性', reading: 'かんせい', meaning: 'sensitivity, sensibility' },
                { word: '正確', reading: 'せいかく', meaning: 'accuracy, precision' },
                { word: '実現', reading: 'じつげん', meaning: 'realization, achievement' }
              ]
            },
            choices: []
          }
        ]
      }
    ];

    // Insert N1/C1 stories
    for (const storyData of n1Stories) {
      const story = await prisma.story.create({
        data: {
          story_id: storyData.id,
          title: storyData.title,
          description: storyData.description,
          category: storyData.id === '21' ? 'business' : storyData.id === '22' ? 'culture' : 'society',
          difficulty_level: 'expert',
          level_jlpt: 'N1',
          level_cefr: 'C1',
          estimated_time: 20,
          estimated_duration_minutes: 20,
          root_chapter_id: storyData.rootChapter,
          is_active: true,
        },
      });

      for (const chapterData of storyData.chapters) {
        const chapter = await prisma.chapter.create({
          data: {
            chapter_id: chapterData.id,
            story_id: story.story_id,
            chapter_number: chapterData.number,
            title: chapterData.title,
            content: chapterData.content,
            learning_points: chapterData.learningPoints,
            vocabulary: chapterData.vocabulary,
          },
        });

        if (chapterData.choices && chapterData.choices.length > 0) {
          for (const choiceData of chapterData.choices) {
            await prisma.choice.create({
              data: {
                chapter_id: chapter.chapter_id,
                choice_text: choiceData.text,
                next_chapter_id: choiceData.nextChapter || null,
                difficulty_adjustment: choiceData.difficulty,
              },
            });
          }
        }
      }

      console.log(`✅ Created: ${story.title}`);
    }

    console.log('\n✅ N1/C1 level stories created successfully!');
    console.log('Total stories: 5 (IDs: 21-25)');
    console.log('\nStory details:');
    console.log('- Story 21: 国際ビジネス交渉 (International Business Negotiation)');
    console.log('- Story 22: 日本の伝統文化の継承 (Preserving Japanese Traditional Culture)');
    console.log('- Story 23: 環境問題と企業責任 (Environmental Issues and Corporate Responsibility)');
    console.log('- Story 24: 医療現場の倫理的ジレンマ (Ethical Dilemmas in Medical Settings)');
    console.log('- Story 25: AI時代の雇用と教育 (Employment and Education in the AI Era)');

  } catch (error) {
    console.error('❌ Error creating N1/C1 stories:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedN1Stories();
