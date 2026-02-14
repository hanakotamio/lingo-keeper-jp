import prisma from './src/lib/db.js';

/**
 * Seed N2/B2 level Japanese learning stories
 * Total: 5 stories (IDs: 16-20)
 * Topics: Work situations, news/society, abstract concepts
 * Grammar: Advanced N2 patterns (～によって、～に対して、～にとって、etc.)
 */
async function seedN2Stories() {
  console.log('Creating N2/B2 level stories...\n');

  try {
    // ============================================================
    // N2 / B2 Level Stories (5 stories, IDs 16-20)
    // ============================================================

    const n2Stories = [
      {
        id: '16',
        title: '職場でのトラブル対応',
        description: '職場でクライアントからのクレームが発生し、適切な対応が求められます。',
        rootChapter: 'chapter-16-1',
        chapters: [
          {
            id: 'chapter-16-1',
            number: 1,
            title: 'クレームの発生',
            content: 'あなたは営業部の社員です。突然、クライアントから重大なクレームが入りました。製品の納期が遅れたことによって、クライアント側の事業に影響が出たとのことです。上司に報告するべきか、まず自分で対応するべきか判断が必要です。\n\n(You are an employee in the sales department. Suddenly, a serious complaint came in from a client. Due to the delay in product delivery, it has affected the client\'s business operations. You need to decide whether to report to your supervisor first or handle it yourself.)',
            learningPoints: {
              points: [
                '～によって: Expresses means/cause (製品の納期が遅れたことによって = due to the delayed product delivery)',
                '～べきか: Should/ought to (報告するべきか = should I report)',
                '～とのことです: Hearsay/report (影響が出たとのことです = it is said that there was an impact)',
                'Business vocabulary: 営業部、クライアント、納期、クレーム'
              ]
            },
            vocabulary: {
              words: [
                { word: '営業部', reading: 'えいぎょうぶ', meaning: 'sales department' },
                { word: 'クレーム', reading: 'くれーむ', meaning: 'complaint, claim' },
                { word: '納期', reading: 'のうき', meaning: 'delivery date, deadline' },
                { word: '事業', reading: 'じぎょう', meaning: 'business, enterprise' },
                { word: '影響', reading: 'えいきょう', meaning: 'influence, impact' },
                { word: '判断', reading: 'はんだん', meaning: 'judgment, decision' },
                { word: '重大', reading: 'じゅうだい', meaning: 'serious, grave' },
                { word: '対応', reading: 'たいおう', meaning: 'response, correspondence' }
              ]
            },
            choices: [
              {
                text: 'すぐに上司に報告する (Report to supervisor immediately)',
                nextChapter: 'chapter-16-2',
                difficulty: 0
              },
              {
                text: '自分でまず事実確認をする (Verify facts yourself first)',
                nextChapter: 'chapter-16-3',
                difficulty: 1
              }
            ]
          },
          {
            id: 'chapter-16-2',
            number: 2,
            title: '上司への報告',
            content: '上司に状況を報告しました。上司は「このような重要な案件に対しては、チーム全体で対応する必要がある」と言いました。緊急会議が開かれることになり、あなたは状況説明を任されました。クライアントにとって、この問題は非常に深刻なものです。\n\n(You reported the situation to your supervisor. Your supervisor said, "For important matters like this, the entire team needs to respond." An emergency meeting will be held, and you were assigned to explain the situation. For the client, this problem is very serious.)',
            learningPoints: {
              points: [
                '～に対しては: With regard to/concerning (案件に対しては = concerning this matter)',
                '～ことになる: It has been decided that (開かれることになり = it was decided to be held)',
                '～にとって: For/to someone (クライアントにとって = for the client)',
                'Formal business expressions: 案件、状況説明、非常に深刻'
              ]
            },
            vocabulary: {
              words: [
                { word: '案件', reading: 'あんけん', meaning: 'matter, case, project' },
                { word: '緊急', reading: 'きんきゅう', meaning: 'emergency, urgent' },
                { word: '会議', reading: 'かいぎ', meaning: 'meeting, conference' },
                { word: '状況', reading: 'じょうきょう', meaning: 'situation, circumstances' },
                { word: '説明', reading: 'せつめい', meaning: 'explanation' },
                { word: '任せる', reading: 'まかせる', meaning: 'to entrust, to leave to' },
                { word: '深刻', reading: 'しんこく', meaning: 'serious, grave' },
                { word: '非常に', reading: 'ひじょうに', meaning: 'extremely, very' }
              ]
            },
            choices: []
          },
          {
            id: 'chapter-16-3',
            number: 3,
            title: '独自調査',
            content: 'まず事実を確認するために、製造部門に連絡を取りました。製造部門によれば、原材料の不足によって生産が遅れたとのことです。しかし、この事実を隠すわけにはいきません。あなたは上司に報告し、クライアントへの謝罪と今後の対策を提案することにしました。\n\n(First, to verify the facts, you contacted the manufacturing department. According to manufacturing, production was delayed due to a shortage of raw materials. However, you cannot hide this fact. You decided to report to your supervisor and propose an apology to the client and future countermeasures.)',
            learningPoints: {
              points: [
                '～によれば: According to (製造部門によれば = according to manufacturing)',
                '～わけにはいかない: Cannot do (隠すわけにはいきません = cannot hide)',
                '～ことにした: Decided to (提案することにしました = decided to propose)',
                'Business problem-solving: 事実確認、対策、謝罪'
              ]
            },
            vocabulary: {
              words: [
                { word: '製造', reading: 'せいぞう', meaning: 'manufacturing, production' },
                { word: '部門', reading: 'ぶもん', meaning: 'department, division' },
                { word: '原材料', reading: 'げんざいりょう', meaning: 'raw materials' },
                { word: '不足', reading: 'ふそく', meaning: 'shortage, deficiency' },
                { word: '謝罪', reading: 'しゃざい', meaning: 'apology' },
                { word: '対策', reading: 'たいさく', meaning: 'countermeasure, measure' },
                { word: '提案', reading: 'ていあん', meaning: 'proposal, suggestion' },
                { word: '隠す', reading: 'かくす', meaning: 'to hide, to conceal' }
              ]
            },
            choices: []
          }
        ]
      },
      {
        id: '17',
        title: '環境問題についての議論',
        description: '職場で環境保護に関する新しい方針が発表され、社員間で議論が起こります。',
        rootChapter: 'chapter-17-1',
        chapters: [
          {
            id: 'chapter-17-1',
            number: 1,
            title: '新方針の発表',
            content: '会社が環境保護のため、プラスチック使用を大幅に削減する方針を発表しました。これに伴い、社員食堂では使い捨ての容器が廃止され、マイボトルの持参が義務化されます。同僚の中には「環境のためには当然だ」という意見もあれば、「不便になるばかりだ」と反対する声もあります。\n\n(The company announced a policy to significantly reduce plastic use for environmental protection. Along with this, disposable containers will be abolished in the employee cafeteria, and bringing your own bottle will be mandatory. Among colleagues, some have the opinion that "it\'s natural for the environment," while others oppose it, saying "it will only become inconvenient.")',
            learningPoints: {
              points: [
                '～に伴い: Along with/accompanying (これに伴い = along with this)',
                '～ばかりだ: Only/nothing but (不便になるばかりだ = will only become inconvenient)',
                '当然だ: Natural/obvious (環境のためには当然だ = it\'s natural for the environment)',
                'Environmental vocabulary: 環境保護、削減、使い捨て、義務化'
              ]
            },
            vocabulary: {
              words: [
                { word: '環境保護', reading: 'かんきょうほご', meaning: 'environmental protection' },
                { word: '方針', reading: 'ほうしん', meaning: 'policy, principle' },
                { word: '大幅', reading: 'おおはば', meaning: 'large-scale, drastic' },
                { word: '削減', reading: 'さくげん', meaning: 'reduction, cutback' },
                { word: '使い捨て', reading: 'つかいすて', meaning: 'disposable' },
                { word: '容器', reading: 'ようき', meaning: 'container, vessel' },
                { word: '廃止', reading: 'はいし', meaning: 'abolition, repeal' },
                { word: '義務化', reading: 'ぎむか', meaning: 'making mandatory' },
                { word: '当然', reading: 'とうぜん', meaning: 'natural, obvious' },
                { word: '不便', reading: 'ふべん', meaning: 'inconvenient' }
              ]
            },
            choices: [
              {
                text: '環境保護を支持する立場で発言する (Speak in support of environmental protection)',
                nextChapter: 'chapter-17-2',
                difficulty: 0
              },
              {
                text: '実用性の観点から意見を述べる (Express opinion from practicality perspective)',
                nextChapter: 'chapter-17-3',
                difficulty: 1
              }
            ]
          },
          {
            id: 'chapter-17-2',
            number: 2,
            title: '環境保護派の主張',
            content: 'あなたは「地球温暖化が進む中、企業は環境問題に対して積極的に取り組むべきだ」と発言しました。「個人の利便性よりも、将来の世代のために行動することが重要だ」とも付け加えました。多くの若手社員があなたの意見に賛同しましたが、ベテラン社員からは「理想論だけでは現実は変わらない」という反論もありました。\n\n(You stated that "As global warming progresses, companies should actively tackle environmental issues." You also added that "It is important to act for future generations rather than individual convenience." Many young employees agreed with your opinion, but veteran employees countered that "Reality won\'t change with idealism alone.")',
            learningPoints: {
              points: [
                '～べきだ: Should/ought to (取り組むべきだ = should tackle)',
                '～よりも: Rather than/more than (利便性よりも = rather than convenience)',
                '～だけでは: With only/just with (理想論だけでは = with idealism alone)',
                'Abstract concepts: 地球温暖化、将来の世代、理想論'
              ]
            },
            vocabulary: {
              words: [
                { word: '地球温暖化', reading: 'ちきゅうおんだんか', meaning: 'global warming' },
                { word: '進む', reading: 'すすむ', meaning: 'to progress, to advance' },
                { word: '積極的', reading: 'せっきょくてき', meaning: 'active, positive' },
                { word: '取り組む', reading: 'とりくむ', meaning: 'to tackle, to work on' },
                { word: '利便性', reading: 'りべんせい', meaning: 'convenience, usability' },
                { word: '将来', reading: 'しょうらい', meaning: 'future' },
                { word: '世代', reading: 'せだい', meaning: 'generation' },
                { word: '賛同', reading: 'さんどう', meaning: 'approval, agreement' },
                { word: '理想論', reading: 'りそうろん', meaning: 'idealism, idealistic argument' },
                { word: '反論', reading: 'はんろん', meaning: 'counterargument, rebuttal' }
              ]
            },
            choices: []
          },
          {
            id: 'chapter-17-3',
            number: 3,
            title: '現実的な提案',
            content: 'あなたは「環境保護の重要性は理解できるが、急激な変化は混乱を招くおそれがある」と述べました。「段階的に移行することによって、社員の理解を得ながら進めるべきだ」と提案しました。この意見は現実的だと評価され、会社は移行期間を設けることを決定しました。\n\n(You stated that "I understand the importance of environmental protection, but sudden changes may cause confusion." You proposed that "By transitioning gradually, we should proceed while gaining employees\' understanding." This opinion was evaluated as realistic, and the company decided to establish a transition period.)',
            learningPoints: {
              points: [
                '～おそれがある: There is a risk/fear that (招くおそれがある = may cause)',
                '～ことによって: By doing (移行することによって = by transitioning)',
                '～ながら: While doing (理解を得ながら = while gaining understanding)',
                'Business negotiation: 段階的、移行期間、評価される'
              ]
            },
            vocabulary: {
              words: [
                { word: '急激', reading: 'きゅうげき', meaning: 'sudden, rapid' },
                { word: '混乱', reading: 'こんらん', meaning: 'confusion, disorder' },
                { word: '招く', reading: 'まねく', meaning: 'to invite, to cause' },
                { word: '段階的', reading: 'だんかいてき', meaning: 'gradual, step-by-step' },
                { word: '移行', reading: 'いこう', meaning: 'transition, shift' },
                { word: '理解', reading: 'りかい', meaning: 'understanding, comprehension' },
                { word: '評価', reading: 'ひょうか', meaning: 'evaluation, assessment' },
                { word: '現実的', reading: 'げんじつてき', meaning: 'realistic, practical' },
                { word: '期間', reading: 'きかん', meaning: 'period, term' }
              ]
            },
            choices: []
          }
        ]
      },
      {
        id: '18',
        title: 'テレワーク制度の導入',
        description: '会社でテレワーク制度が導入され、新しい働き方への適応が求められます。',
        rootChapter: 'chapter-18-1',
        chapters: [
          {
            id: 'chapter-18-1',
            number: 1,
            title: '制度導入の通知',
            content: '人事部から、来月よりテレワーク制度が本格的に導入されるとの通知がありました。週3日まで在宅勤務が認められますが、チームの業務に支障をきたさないよう、各自で調整する必要があります。あなたのチームでは、メンバーの意見が分かれています。積極的に活用したい人もいれば、対面でのコミュニケーションを重視する人もいます。\n\n(There was a notification from HR that a telework system will be fully implemented starting next month. Work from home up to three days a week will be permitted, but you need to coordinate individually so as not to hinder the team\'s work. Opinions are divided among members of your team. Some want to actively utilize it, while others value face-to-face communication.)',
            learningPoints: {
              points: [
                '～との通知: Notification that (導入されるとの通知 = notification that it will be implemented)',
                '～よう: So that/in order to (支障をきたさないよう = so as not to cause problems)',
                '～に対して: Towards/regarding (意見が分かれる = opinions are divided)',
                'Work culture: テレワーク、在宅勤務、支障をきたす'
              ]
            },
            vocabulary: {
              words: [
                { word: '人事部', reading: 'じんじぶ', meaning: 'HR department, personnel' },
                { word: '本格的', reading: 'ほんかくてき', meaning: 'full-scale, genuine' },
                { word: '導入', reading: 'どうにゅう', meaning: 'introduction, implementation' },
                { word: '在宅勤務', reading: 'ざいたくきんむ', meaning: 'work from home' },
                { word: '認める', reading: 'みとめる', meaning: 'to permit, to recognize' },
                { word: '支障', reading: 'ししょう', meaning: 'hindrance, obstacle' },
                { word: 'きたす', reading: 'きたす', meaning: 'to cause, to bring about' },
                { word: '調整', reading: 'ちょうせい', meaning: 'adjustment, coordination' },
                { word: '対面', reading: 'たいめん', meaning: 'face-to-face' },
                { word: '重視', reading: 'じゅうし', meaning: 'emphasis, importance' }
              ]
            },
            choices: [
              {
                text: 'テレワークを最大限活用したい (Want to utilize telework to the fullest)',
                nextChapter: 'chapter-18-2',
                difficulty: 0
              },
              {
                text: 'バランスを考えた提案をする (Propose a balanced approach)',
                nextChapter: 'chapter-18-3',
                difficulty: 1
              }
            ]
          },
          {
            id: 'chapter-18-2',
            number: 2,
            title: 'テレワーク推進派',
            content: 'あなたは「通勤時間が削減されることにより、業務の効率が向上するはずだ」と主張しました。「オンラインツールを活用すれば、コミュニケーションの質は低下しない」とも述べました。しかし、上司からは「対面でしか伝わらない情報もある。完全にテレワークに頼るわけにはいかない」との指摘がありました。結果として、週2日のテレワークで試験的に始めることになりました。\n\n(You argued that "Efficiency should improve as commute time is reduced." You also stated that "If we utilize online tools, communication quality won\'t decline." However, your supervisor pointed out that "There is information that can only be conveyed face-to-face. We can\'t rely entirely on telework." As a result, it was decided to start on a trial basis with two days of telework per week.)',
            learningPoints: {
              points: [
                '～ことにより: By doing/through (削減されることにより = by being reduced)',
                '～はずだ: Should/expected to (向上するはずだ = should improve)',
                '～わけにはいかない: Cannot afford to (頼るわけにはいかない = cannot rely on)',
                'Workplace efficiency: 通勤時間、業務の効率、試験的'
              ]
            },
            vocabulary: {
              words: [
                { word: '通勤時間', reading: 'つうきんじかん', meaning: 'commute time' },
                { word: '削減', reading: 'さくげん', meaning: 'reduction, cut' },
                { word: '効率', reading: 'こうりつ', meaning: 'efficiency' },
                { word: '向上', reading: 'こうじょう', meaning: 'improvement, enhancement' },
                { word: '活用', reading: 'かつよう', meaning: 'utilization, effective use' },
                { word: '低下', reading: 'ていか', meaning: 'decline, deterioration' },
                { word: '伝わる', reading: 'つたわる', meaning: 'to be conveyed, to be transmitted' },
                { word: '頼る', reading: 'たよる', meaning: 'to rely on, to depend on' },
                { word: '試験的', reading: 'しけんてき', meaning: 'experimental, trial' }
              ]
            },
            choices: []
          },
          {
            id: 'chapter-18-3',
            number: 3,
            title: 'ハイブリッド型の提案',
            content: 'あなたは「テレワークと出社のバランスを取ることが重要だ」と提案しました。「定例会議は対面で行い、個人作業はテレワークで行うという使い分けはどうか」という具体案を示しました。この提案は多くのメンバーに支持され、チーム全体のルールとして採用されることになりました。「柔軟な働き方によって、生産性を高めつつ、チームの団結も維持できる」という評価を得ました。\n\n(You proposed that "It\'s important to balance telework and office attendance." You presented a specific plan: "How about distinguishing by holding regular meetings face-to-face and doing individual work via telework?" This proposal was supported by many members and was adopted as a rule for the entire team. You received an evaluation that "Through flexible work styles, we can increase productivity while maintaining team unity.")',
            learningPoints: {
              points: [
                '～ことが重要だ: It is important that (バランスを取ることが重要だ = it is important to balance)',
                '～はどうか: How about (使い分けはどうか = how about distinguishing)',
                '～つつ: While doing (高めつつ = while increasing)',
                'Modern work concepts: 柔軟な働き方、生産性、団結'
              ]
            },
            vocabulary: {
              words: [
                { word: '出社', reading: 'しゅっしゃ', meaning: 'going to work, attendance' },
                { word: 'バランス', reading: 'ばらんす', meaning: 'balance' },
                { word: '定例会議', reading: 'ていれいかいぎ', meaning: 'regular meeting' },
                { word: '個人作業', reading: 'こじんさぎょう', meaning: 'individual work' },
                { word: '使い分け', reading: 'つかいわけ', meaning: 'proper use, distinction' },
                { word: '採用', reading: 'さいよう', meaning: 'adoption, employment' },
                { word: '柔軟', reading: 'じゅうなん', meaning: 'flexible' },
                { word: '生産性', reading: 'せいさんせい', meaning: 'productivity' },
                { word: '団結', reading: 'だんけつ', meaning: 'unity, solidarity' },
                { word: '維持', reading: 'いじ', meaning: 'maintenance, preservation' }
              ]
            },
            choices: []
          }
        ]
      },
      {
        id: '19',
        title: 'AI技術の影響',
        description: 'AI技術の急速な発展により、職場での仕事のあり方が変化しています。',
        rootChapter: 'chapter-19-1',
        chapters: [
          {
            id: 'chapter-19-1',
            number: 1,
            title: 'AI導入の検討',
            content: '会社が業務効率化のため、AI技術の導入を検討しています。特にデータ分析や顧客対応の自動化が提案されています。しかし、社員の中には「AIによって仕事が奪われるのではないか」と不安を感じる人もいます。一方で、「AIを活用することで、より創造的な仕事に集中できる」という前向きな意見もあります。あなたは、この問題についてどう考えますか。\n\n(The company is considering introducing AI technology to improve operational efficiency. In particular, automation of data analysis and customer service has been proposed. However, some employees feel anxious that "jobs might be taken away by AI." On the other hand, there are also positive opinions that "By utilizing AI, we can focus on more creative work." What do you think about this issue?)',
            learningPoints: {
              points: [
                '～ではないか: Might/probably (奪われるのではないか = might be taken away)',
                '～ことで: By doing (活用することで = by utilizing)',
                '～について: About/regarding (この問題について = about this issue)',
                'Technology vocabulary: AI技術、自動化、データ分析'
              ]
            },
            vocabulary: {
              words: [
                { word: '業務効率化', reading: 'ぎょうむこうりつか', meaning: 'operational efficiency improvement' },
                { word: '検討', reading: 'けんとう', meaning: 'consideration, examination' },
                { word: 'データ分析', reading: 'でーたぶんせき', meaning: 'data analysis' },
                { word: '顧客対応', reading: 'こきゃくたいおう', meaning: 'customer service' },
                { word: '自動化', reading: 'じどうか', meaning: 'automation' },
                { word: '奪う', reading: 'うばう', meaning: 'to take away, to rob' },
                { word: '不安', reading: 'ふあん', meaning: 'anxiety, unease' },
                { word: '創造的', reading: 'そうぞうてき', meaning: 'creative' },
                { word: '前向き', reading: 'まえむき', meaning: 'positive, forward-looking' }
              ]
            },
            choices: [
              {
                text: 'AI導入に賛成する立場で発言 (Speak in favor of AI introduction)',
                nextChapter: 'chapter-19-2',
                difficulty: 0
              },
              {
                text: '慎重な導入を求める立場で発言 (Speak for cautious introduction)',
                nextChapter: 'chapter-19-3',
                difficulty: 1
              }
            ]
          },
          {
            id: 'chapter-19-2',
            number: 2,
            title: 'AI活用の推進',
            content: 'あなたは「AIは人間の仕事を奪うのではなく、補完するものだ」と主張しました。「単純作業を自動化することにより、社員はより高度な業務に専念できる。結果として、会社全体の競争力が高まるはずだ」と説明しました。さらに「AIに関するリスキリング研修を実施すれば、社員の不安も軽減できる」と提案しました。経営陣はこの提案を評価し、研修プログラムの開発が決定されました。\n\n(You argued that "AI does not take away human jobs, but complements them." You explained that "By automating simple tasks, employees can concentrate on more advanced work. As a result, the company\'s overall competitiveness should increase." You further proposed that "If we implement reskilling training on AI, we can also reduce employees\' anxiety." Management evaluated this proposal, and development of a training program was decided.)',
            learningPoints: {
              points: [
                '～のではなく: Not...but (奪うのではなく = not take away but)',
                '～ことにより: By doing (自動化することにより = by automating)',
                '～はずだ: Should/expected to (高まるはずだ = should increase)',
                '～ば: If/when conditional (実施すれば = if we implement)',
                'Business strategy: 補完、競争力、リスキリング'
              ]
            },
            vocabulary: {
              words: [
                { word: '補完', reading: 'ほかん', meaning: 'complement, supplement' },
                { word: '単純作業', reading: 'たんじゅんさぎょう', meaning: 'simple task, routine work' },
                { word: '高度', reading: 'こうど', meaning: 'advanced, sophisticated' },
                { word: '専念', reading: 'せんねん', meaning: 'concentration, devotion' },
                { word: '競争力', reading: 'きょうそうりょく', meaning: 'competitiveness' },
                { word: 'リスキリング', reading: 'りすきりんぐ', meaning: 'reskilling' },
                { word: '研修', reading: 'けんしゅう', meaning: 'training' },
                { word: '実施', reading: 'じっし', meaning: 'implementation, execution' },
                { word: '軽減', reading: 'けいげん', meaning: 'reduction, mitigation' },
                { word: '経営陣', reading: 'けいえいじん', meaning: 'management, executives' }
              ]
            },
            choices: []
          },
          {
            id: 'chapter-19-3',
            number: 3,
            title: '段階的導入の提案',
            content: 'あなたは「AIの導入は避けられない流れだが、急速な変化は社員に大きな負担をかける」と述べました。「まず小規模なプロジェクトで試験導入を行い、その結果を踏まえて全社展開を検討するべきだ」と提案しました。また「AI導入に際しては、雇用の安定を保証することが不可欠だ」と強調しました。この慎重なアプローチは多くの社員から支持を得て、段階的な導入計画が策定されました。\n\n(You stated that "AI introduction is an unavoidable trend, but rapid change places a heavy burden on employees." You proposed that "First, we should conduct a trial introduction with a small-scale project, and based on those results, consider company-wide deployment." You also emphasized that "When introducing AI, it is essential to guarantee employment stability." This cautious approach gained support from many employees, and a phased implementation plan was formulated.)',
            learningPoints: {
              points: [
                '～が: But/although (避けられない流れだが = is unavoidable but)',
                '～を踏まえて: Based on (結果を踏まえて = based on results)',
                '～べきだ: Should (検討するべきだ = should consider)',
                '～に際しては: When/on the occasion of (導入に際しては = when introducing)',
                '～ことが不可欠だ: It is essential that (保証することが不可欠だ = it is essential to guarantee)',
                'Change management: 段階的、試験導入、全社展開'
              ]
            },
            vocabulary: {
              words: [
                { word: '避けられない', reading: 'さけられない', meaning: 'unavoidable, inevitable' },
                { word: '流れ', reading: 'ながれ', meaning: 'flow, trend' },
                { word: '負担', reading: 'ふたん', meaning: 'burden, load' },
                { word: '小規模', reading: 'しょうきぼ', meaning: 'small-scale' },
                { word: '試験導入', reading: 'しけんどうにゅう', meaning: 'trial introduction' },
                { word: '踏まえる', reading: 'ふまえる', meaning: 'to be based on' },
                { word: '全社展開', reading: 'ぜんしゃてんかい', meaning: 'company-wide deployment' },
                { word: '雇用', reading: 'こよう', meaning: 'employment' },
                { word: '保証', reading: 'ほしょう', meaning: 'guarantee, assurance' },
                { word: '不可欠', reading: 'ふかけつ', meaning: 'essential, indispensable' },
                { word: '強調', reading: 'きょうちょう', meaning: 'emphasis, stress' },
                { word: '策定', reading: 'さくてい', meaning: 'formulation, drafting' }
              ]
            },
            choices: []
          }
        ]
      },
      {
        id: '20',
        title: '社会貢献活動への参加',
        description: '会社が地域社会への貢献活動を計画し、社員の参加が推奨されています。',
        rootChapter: 'chapter-20-1',
        chapters: [
          {
            id: 'chapter-20-1',
            number: 1,
            title: 'CSR活動の提案',
            content: '会社が企業の社会的責任（CSR）の一環として、地域のボランティア活動への参加を呼びかけています。具体的には、週末を利用した地域清掃や、子供向けの教育支援プログラムなどが提案されています。参加は任意ですが、会社は積極的な参加を奨励しています。あなたのチームでは、「社会貢献は重要だが、プライベートの時間を使うのは負担だ」という意見と、「企業市民としての責任を果たすべきだ」という意見が対立しています。\n\n(The company is calling for participation in local volunteer activities as part of corporate social responsibility (CSR). Specifically, local cleanup using weekends and educational support programs for children have been proposed. Participation is voluntary, but the company encourages active involvement. In your team, there is a conflict between the opinion that "Social contribution is important, but using private time is a burden" and the opinion that "We should fulfill our responsibility as corporate citizens.")',
            learningPoints: {
              points: [
                '～の一環として: As part of (CSRの一環として = as part of CSR)',
                '～を利用した: Using/utilizing (週末を利用した = using weekends)',
                '～のは: The fact that (使うのは = the fact of using)',
                '～としての: As (企業市民としての = as corporate citizens)',
                '～べきだ: Should/ought to (果たすべきだ = should fulfill)',
                'CSR vocabulary: 社会的責任、ボランティア、企業市民'
              ]
            },
            vocabulary: {
              words: [
                { word: '企業', reading: 'きぎょう', meaning: 'company, corporation' },
                { word: '社会的責任', reading: 'しゃかいてきせきにん', meaning: 'social responsibility' },
                { word: '一環', reading: 'いっかん', meaning: 'part, link' },
                { word: 'ボランティア', reading: 'ぼらんてぃあ', meaning: 'volunteer' },
                { word: '呼びかける', reading: 'よびかける', meaning: 'to call for, to appeal' },
                { word: '地域清掃', reading: 'ちいきせいそう', meaning: 'local cleanup' },
                { word: '教育支援', reading: 'きょういくしえん', meaning: 'educational support' },
                { word: '任意', reading: 'にんい', meaning: 'voluntary, optional' },
                { word: '奨励', reading: 'しょうれい', meaning: 'encouragement, promotion' },
                { word: '企業市民', reading: 'きぎょうしみん', meaning: 'corporate citizen' },
                { word: '責任', reading: 'せきにん', meaning: 'responsibility' },
                { word: '果たす', reading: 'はたす', meaning: 'to fulfill, to carry out' },
                { word: '対立', reading: 'たいりつ', meaning: 'conflict, opposition' }
              ]
            },
            choices: [
              {
                text: '積極的な参加を支持する (Support active participation)',
                nextChapter: 'chapter-20-2',
                difficulty: 0
              },
              {
                text: '柔軟な参加方法を提案する (Propose flexible participation methods)',
                nextChapter: 'chapter-20-3',
                difficulty: 1
              }
            ]
          },
          {
            id: 'chapter-20-2',
            number: 2,
            title: '社会貢献の重要性',
            content: 'あなたは「企業が社会に支えられて存在する以上、地域への還元は当然の義務だ」と主張しました。「ボランティア活動を通じて、社員のモチベーション向上や企業イメージの改善にもつながる」と付け加えました。さらに「社会貢献活動への参加によって、普段接することのない人々と交流でき、視野が広がる」というメリットも強調しました。多くの若手社員があなたの意見に共感し、積極的に参加することを決めました。\n\n(You argued that "As long as companies exist supported by society, giving back to the community is a natural obligation." You added that "Through volunteer activities, it also leads to improved employee motivation and enhanced corporate image." You further emphasized the benefit that "By participating in social contribution activities, you can interact with people you don\'t usually meet, and your perspective broadens." Many young employees sympathized with your opinion and decided to participate actively.)',
            learningPoints: {
              points: [
                '～以上: As long as/since (存在する以上 = as long as they exist)',
                '～を通じて: Through (活動を通じて = through activities)',
                '～にもつながる: Also leads to (改善にもつながる = also leads to improvement)',
                '～によって: By/through (参加によって = by participating)',
                'Social concepts: 地域への還元、企業イメージ、視野が広がる'
              ]
            },
            vocabulary: {
              words: [
                { word: '支える', reading: 'ささえる', meaning: 'to support, to sustain' },
                { word: '存在', reading: 'そんざい', meaning: 'existence' },
                { word: '還元', reading: 'かんげん', meaning: 'return, giving back' },
                { word: '義務', reading: 'ぎむ', meaning: 'duty, obligation' },
                { word: 'モチベーション', reading: 'もちべーしょん', meaning: 'motivation' },
                { word: '向上', reading: 'こうじょう', meaning: 'improvement, enhancement' },
                { word: '企業イメージ', reading: 'きぎょういめーじ', meaning: 'corporate image' },
                { word: '改善', reading: 'かいぜん', meaning: 'improvement, reform' },
                { word: '接する', reading: 'せっする', meaning: 'to come into contact with' },
                { word: '交流', reading: 'こうりゅう', meaning: 'interaction, exchange' },
                { word: '視野', reading: 'しや', meaning: 'field of vision, perspective' },
                { word: '共感', reading: 'きょうかん', meaning: 'sympathy, empathy' }
              ]
            },
            choices: []
          },
          {
            id: 'chapter-20-3',
            number: 3,
            title: '多様な参加形態',
            content: 'あなたは「社会貢献の重要性は認めるが、参加の形は多様であるべきだ」と提案しました。「週末の活動だけでなく、勤務時間内でできる活動や、オンラインでの支援なども選択肢に含めるべきだ」と述べました。また「各自の事情に応じて参加できる仕組みを作ることで、より多くの社員が無理なく貢献できる」と説明しました。この提案は経営陣に受け入れられ、多様な参加形態を含むCSRプログラムが策定されることになりました。\n\n(You proposed that "I recognize the importance of social contribution, but the forms of participation should be diverse." You stated that "We should include not only weekend activities, but also activities that can be done during work hours and online support as options." You also explained that "By creating a system that allows participation according to each person\'s circumstances, more employees can contribute comfortably." This proposal was accepted by management, and a CSR program including diverse participation formats was decided to be formulated.)',
            learningPoints: {
              points: [
                '～が: But/although (認めるが = recognize but)',
                '～であるべきだ: Should be (多様であるべきだ = should be diverse)',
                '～だけでなく: Not only (活動だけでなく = not only activities)',
                '～に応じて: According to (事情に応じて = according to circumstances)',
                '～ことで: By doing (作ることで = by creating)',
                'Inclusive approach: 多様な、選択肢、各自の事情'
              ]
            },
            vocabulary: {
              words: [
                { word: '認める', reading: 'みとめる', meaning: 'to recognize, to acknowledge' },
                { word: '多様', reading: 'たよう', meaning: 'diverse, varied' },
                { word: '形態', reading: 'けいたい', meaning: 'form, shape' },
                { word: '勤務時間', reading: 'きんむじかん', meaning: 'working hours' },
                { word: '支援', reading: 'しえん', meaning: 'support, assistance' },
                { word: '選択肢', reading: 'せんたくし', meaning: 'option, choice' },
                { word: '含める', reading: 'ふくめる', meaning: 'to include' },
                { word: '事情', reading: 'じじょう', meaning: 'circumstances, situation' },
                { word: '応じる', reading: 'おうじる', meaning: 'to respond, to comply' },
                { word: '仕組み', reading: 'しくみ', meaning: 'system, mechanism' },
                { word: '無理なく', reading: 'むりなく', meaning: 'comfortably, without strain' },
                { word: '貢献', reading: 'こうけん', meaning: 'contribution' },
                { word: '受け入れる', reading: 'うけいれる', meaning: 'to accept, to receive' }
              ]
            },
            choices: []
          }
        ]
      }
    ];

    // Insert N2/B2 stories
    for (const storyData of n2Stories) {
      const story = await prisma.story.create({
        data: {
          story_id: storyData.id,
          title: storyData.title,
          description: storyData.description,
          category: storyData.id === '16' ? 'work' :
                   storyData.id === '17' || storyData.id === '20' ? 'society' :
                   storyData.id === '18' ? 'work' :
                   'news',
          difficulty_level: 'advanced',
          level_jlpt: 'N2',
          level_cefr: 'B2',
          estimated_time: 15,
          estimated_duration_minutes: 15,
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

    console.log('\n✅ N2/B2 level stories created successfully!');
    console.log('\nStories created (5):');
    console.log('16. 職場でのトラブル対応 (Workplace trouble response)');
    console.log('17. 環境問題についての議論 (Discussion about environmental issues)');
    console.log('18. テレワーク制度の導入 (Introduction of telework system)');
    console.log('19. AI技術の影響 (Impact of AI technology)');
    console.log('20. 社会貢献活動への参加 (Participation in social contribution activities)');

  } catch (error) {
    console.error('❌ Error creating N2/B2 stories:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedN2Stories();
