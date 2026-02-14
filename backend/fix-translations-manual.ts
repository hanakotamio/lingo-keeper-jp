import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ManualTranslation {
  storyId: string;
  chapters: Record<number, string>; // chapter_number -> English translation
}

// Manual translations based on the Japanese content
// These are accurate translations of the actual Japanese text
const manualTranslations: ManualTranslation[] = [
  // Story 3: 家族の紹介 (Family Introduction) - N5
  {
    storyId: '3',
    chapters: {
      1: `I will introduce my family.

There are four people in my family. My father, my older sister, and me.

Everyone is healthy.`,
      2: `My father's name is Tanaka Ken.

He is 45 years old. He is a company employee.

He goes to work every morning.`,
      3: `My mother's name is Tanaka Yuki.

She is 42 years old. She is a teacher.

She is kind.`,
      4: `My older sister's name is Tanaka Emi.

She is 20 years old. She is a university student.

She studies every day.`,
      5: `I am 18 years old. I am a high school student.

I like my family.

Everyone is very kind.`,
    },
  },

  // Story 4: コンビニで買い物 (Convenience Store Shopping) - N5
  {
    storyId: '4',
    chapters: {
      1: `Today I'm going to a convenience store.

I will shop. What should I buy?

The convenience store is near my house.`,
      2: `I arrived at the convenience store.

There are many things. Food, drinks, magazines.

I look at various things.`,
      3: `I buy rice balls. I also buy juice.

There are many types of rice balls.

I choose salmon rice balls.`,
      4: `I go to the cash register. The clerk is kind.

"That will be 300 yen," they say.

I pay the money.`,
      5: `I received the items.

"Thank you very much," I say.

I leave the convenience store.`,
    },
  },

  // Story 5: 好きな食べ物 (Favorite Food) - N5
  {
    storyId: '5',
    chapters: {
      1: `I like food.

I especially like Japanese food.

Today I will talk about my favorite food.`,
      2: `I like sushi. Sushi is delicious.

There are many types of sushi.

I like tuna.`,
      3: `I also like ramen. Ramen is hot.

There are various flavors.

I like miso ramen.`,
      4: `I like tempura too. Tempura is crispy.

Shrimp tempura is especially delicious.

I eat it with rice.`,
      5: `I like Japanese food very much.

It's delicious and healthy.

What food do you like?`,
    },
  },

  // Story 6: 公園での散歩 (Walk in the Park) - N5
  {
    storyId: '6',
    chapters: {
      1: `Today the weather is nice. I'm going to the park.

There are many beautiful flowers in the park. Red flowers, yellow flowers, and white flowers are blooming.

There are birds too. Small birds are singing. They have very beautiful voices.`,
      2: `There are many people in the park.

Children are playing. They look happy.

Old people are walking.`,
      3: `There is a pond in the park.

There are fish in the pond. There are also ducks.

The ducks are swimming.`,
      4: `There are big trees in the park.

The trees have green leaves.

The trees provide shade. It's cool.`,
      5: `I sat on a bench.

I rested. The park is quiet.

I like the park.`,
    },
  },

  // Story 10: 週末の計画 (Weekend Plans) - N4
  {
    storyId: '10',
    chapters: {
      1: `Today is Friday. The weekend starts tomorrow. I'm thinking about what to do on the weekend.

Every week, I want to do fun things on the weekend. But this week, I haven't planned anything yet.

I called my friend. "Do you have any plans tomorrow?" I asked. "No, nothing special," my friend answered.

"Then, shall we go somewhere together?" I asked. "Sounds good. Where shall we go?" my friend said.

"How about a picnic in the park? I checked the weather forecast and it looks like it will be sunny tomorrow," I suggested.`,
      2: `"A picnic sounds nice! What should we bring?" my friend asked.

"I'm thinking of making lunch boxes. I'll bring drinks too," I answered.

"I'll bring snacks. And I'll bring a picnic blanket too," my friend said.

"Thanks. So what time shall we meet?" I asked. "Let's meet at the park entrance at 10 o'clock," my friend answered.

"Got it. Then tomorrow at 10. I'm looking forward to it," I said.`,
      3: `Saturday morning, I woke up early. The weather was very good. The sun was out and it was warm.

I made lunch boxes in the kitchen. I made sandwiches and rice balls. I also cut some fruit.

For drinks, I prepared tea and juice. I put everything in a bag.

I left home at 9:30. It's a 15-minute walk to the park.

When I arrived at the park, my friend was already waiting. "Good morning! You're early," I said. "Yeah, I was excited so I came early," my friend answered.`,
      4: `We walked through the park. We found a good spot under a big tree.

My friend spread out the picnic blanket. We both sat on the blanket.

"Nice weather, isn't it? It feels good," my friend said. "Really. Perfect weather for a picnic," I said too.

First we ate our lunch boxes. "The sandwiches are delicious!" my friend said. "Thank you. Try the rice balls too," I said.

After eating the lunch boxes, we ate my friend's snacks. We chatted and relaxed.`,
      5: `After eating, we took a walk in the park. Many beautiful flowers were blooming. We took lots of photos.

"There's a pond over there. Let's go check it out," my friend said. There were ducks in the pond.

"They're cute," I said. "Yeah. I'd like to feed them," my friend said.

Around 3 o'clock, we decided to go home. "Today was fun. I'd like to come again," my friend said.

"Yeah, let's come again. Let's go somewhere next weekend too," I said. It was a very good weekend.`,
    },
  },

  // Story 11: 図書館での勉強 (Studying at the Library) - N4
  {
    storyId: '11',
    chapters: {
      1: `There's an exam next week. It's a Japanese exam. So I have to study every day.

Today I decided to study at the library. The library is quiet and easy to study in.

I went to the library at 2 PM. The library is near the school. It's a 5-minute walk.

When I entered the library, there were many books. There were also many people studying.

At the reception, I asked, "I'd like to study. Are there any seats available?" "Yes, the study room on the second floor is available. Please use it," they said.`,
      2: `I went up to the second floor. The study room was very quiet. Everyone was studying seriously.

I found an empty seat and sat down. I took out my textbook and notebook from my bag.

First, I studied kanji. I have to memorize 50 new kanji characters.

I wrote the kanji many times in my notebook. While writing, I also memorized how to read them.

After studying for an hour, I got a little tired. I decided to take a break.`,
      3: `I went down to the first floor. There's a cafe inside the library. I bought coffee there.

I sat in a cafe seat and drank coffee. When I looked out the window, I could see a beautiful garden.

After resting for 10 minutes, I went back to the second floor. This time I decided to study grammar.

I opened my grammar book. There was a lot of difficult grammar. I tried to understand the meaning by reading example sentences.

There were words I didn't understand, so I looked them up in a dictionary. After checking the meaning in the dictionary, I wrote the word in my notebook.`,
      4: `I studied for 2 hours. I gradually started to understand. I was happy.

When I looked at the clock, it was 5 PM. I want to study a bit more, but the library closes at 6.

Finally, I reviewed what I studied today. I checked the kanji and grammar one more time.

A little before 6, I packed my things. I put my textbook and notebook in my bag.

I went down to the first floor and left the library. "I was able to study a lot today. I'll come again tomorrow," I thought.`,
      5: `On my way home, I met my friend. "Oh, were you at the library?" my friend asked.

"Yeah, I was studying for the exam," I answered. "I need to study for the exam too. How was it?" my friend asked.

"The library was quiet and good. Want to go together? I'm planning to go tomorrow too," I said.

"Sounds good. Then let's go together tomorrow. What time?" my friend asked.

"How about around 2?" I answered. "Okay. Let's meet at the library entrance at 2. Study hard together," my friend said.

I'm looking forward to tomorrow. Studying with a friend will be more fun. Let's do our best on the exam.`,
    },
  },

  // Story 12: アルバイトの面接 (Part-time Job Interview) - N3
  {
    storyId: '12',
    chapters: {
      1: `As a university student, I was looking for a part-time job. This was because I had to earn my tuition and living expenses myself.

Last week, I found a cafe job posting. It said, "3 days a week, 4 hours a day, 1000 yen per hour." The conditions seemed good, so I decided to apply.

I called the cafe. When I said, "I'm calling about the part-time job posting," the manager said, "Could you come for an interview tomorrow at 3 PM?"

"Yes, that's fine. Thank you very much," I replied. The next day, I went to the cafe for the interview.`,
      2: `At 3 o'clock, I entered the cafe. When I said "I'm here for the interview" at the reception, I was told "Please wait a moment."

5 minutes later, a man wearing an apron came out. "I'm Manager Tanaka. Please come this way," he showed me.

I sat at a table in the back. While looking at my resume, the manager asked, "You're a second-year university student. What's your major?"

"I'm majoring in business administration," I answered. "That's good. What do you want to do in the future?" the manager continued.

"If possible, I'd like to start my own business. So I want to learn about the food and beverage industry and customer service through this part-time job," I answered.`,
      3: `The manager nodded with satisfaction. "It's good that you're motivated. By the way, do you have customer service experience?"

"No, I don't. But I like talking to people. I'll make an effort to serve customers with a smile," I answered.

"That's important. Now, let me explain about shifts," the manager said.

"The morning shift is from 7 to 11, the lunch shift is from 11 to 3, and the evening shift is from 5 to 9. Which shift do you prefer?"

I checked my class schedule and answered. "I can work the evening shift on weekdays, and any shift on weekends."`,
      4: `"Understood. Now I'll ask you a few simple questions," the manager continued.

The question was, "How would you respond if a customer is angry?" I thought for a moment and answered.

"First, I would apologize sincerely. Then I would listen carefully to the customer's complaint. I would report to the manager and respond together. If it's my fault, I would reflect deeply and be careful not to make the same mistake again."

The manager listened to my answer and nodded. "Good. You think calmly. One more question."`,
      5: `"If you're very busy and can't keep up with customer orders, what would you do?" the manager asked.

"I would prioritize the order of tasks and do what needs to be done first. If I can't handle it alone, I would ask colleagues for help. And I would inform customers who are waiting that their food will take a little longer."

"Excellent. That's a very good answer. So, can you start working from next week?" the manager said with a smile.

I was very happy. "Yes! I'll do my best. Thank you very much," I replied. This is how I got my first part-time job.`,
    },
  },

  // Story 20: 環境問題について (Environmental Issues) - N2
  {
    storyId: '20',
    chapters: {
      1: `In my university seminar, I was assigned to write a report on environmental issues. The theme is "Current Status and Challenges of Climate Change Measures in Japan."

First, I read the government's environmental white paper. Japan has set a goal to achieve carbon neutrality by 2050.

However, there are many challenges at present. Although the introduction of renewable energy is progressing, dependence on fossil fuels is still high.

Next, I researched corporate initiatives. Many major companies are promoting ESG management and setting carbon reduction targets.`,
      2: `I conducted interviews with environmental NPOs. A staff member said, "Government and corporate initiatives are important, but individual actions are also crucial."

He explained specific initiatives. Reducing plastic use, choosing public transportation, energy saving at home - these small efforts accumulate into significant effects.

I also researched the environmental education system. In elementary and junior high schools, classes on SDGs and sustainability are being conducted.

Young people are developing environmental awareness from an early age. This is expected to have long-term benefits.`,
      3: `From an international perspective, I compared Japan with other countries. European countries, especially Nordic countries, are advanced in environmental measures.

Denmark obtains more than half of its electricity from renewable energy. Sweden has implemented a carbon tax and is promoting a shift to a decarbonized society.

What Japan can learn from these countries is thorough policy implementation and citizen participation.

I also researched environmental technology innovations. Development of hydrogen energy and carbon capture technology is progressing.`,
      4: `I compiled what I learned through this research into a report. I organized it into three points: current status, challenges, and future prospects.

The current status is that measures are progressing, but fossil fuel dependence is still high. The challenge is to accelerate renewable energy introduction and promote behavior change among citizens.

Future prospects include expectations for technological innovation and increased environmental awareness among the younger generation.

I submitted the report to my professor. He gave me the evaluation that "you analyzed from multiple perspectives and came up with concrete proposals."`,
      5: `Through this research, I thought deeply about what I can do individually. I decided to start with things I can do immediately.

I'm practicing bringing my own shopping bag, turning off unnecessary lights, and sorting garbage thoroughly.

I also started participating in local environmental protection activities. On weekends, I participate in beach cleanups and tree-planting activities.

Environmental issues cannot be solved by one person. But if each person is conscious and acts, it will become a big force. I want to continue thinking about the earth's future.`,
    },
  },

  // Story 21: 就職活動の準備 (Job Hunting Preparation) - N2
  {
    storyId: '21',
    chapters: {
      1: `In the fall of my third year of university, I started preparing for full-scale job hunting. Company recruitment selection starts in the spring of next year, so careful preparation is necessary from now.

First, I went to the career center for consultation. The staff advised me to "start with self-analysis."

Self-analysis is the work of clarifying your strengths, weaknesses, values, interests, etc. Without doing this properly, you can't find companies that suit you.

Using worksheets, I reflected on my past experiences. I organized my successes, failures, what I worked hard on, and what I enjoyed.`,
      2: `Next, I started researching industries and companies. Japan has various industries such as manufacturing, finance, IT, service industry, etc.

I thought about which industry I want to work in. I value whether I can use what I learned, whether it matches my values, and whether I can grow.

As a result of research, I became interested in the IT industry. It's an industry where innovation is active and new technologies are constantly being born.

I researched specific companies. I checked the company's philosophy, business content, work environment, employee reviews, etc.`,
      3: `I attended company information sessions. There are two types: online and face-to-face. I participated in both to get information.

At information sessions, you can hear directly from employees. You can understand the company atmosphere and actual work content.

I also participated in internships. I experienced actual work for one week at the company I was interested in.

Through the internship, I realized the gap between the ideal and reality. Office work was more地 challenging than I imagined, but it was also rewarding.`,
      4: `I started preparing my resume and entry sheet. This is an important document that conveys your appeal to the company.

It's important to write specifically what you worked hard on during your student days, what you learned from it, and how you want to utilize it at the company.

I revised it many times. I had the career center staff and seminar professor check it and brushed it up.

I also started interview preparation. I prepared answers to frequently asked questions and practiced speaking clearly.`,
      5: `I participated in mock interviews. This is training conducted at the career center assuming actual interviews.

I received strict feedback. "Eye contact is not enough," "voice is too small," "answers are too long" - various points were pointed out.

I repeated practice. Gradually, I became able to speak naturally and confidently.

Job hunting is a tough process. But it's also an important period to think about my future. I want to do my best to find a job I'm satisfied with.`,
    },
  },

  // Story 22: 経済政策の分析 (Economic Policy Analysis) - N1
  {
    storyId: '22',
    chapters: {
      1: `For my economics thesis, I chose the theme "The Impact of Japan's Monetary Policy on the Real Economy." My advisor evaluated it as "ambitious, but worth challenging."

First, I started with a review of prior research. It's necessary to trace the transition of monetary policy over the past 30 years and verify what impact each policy had on economic indicators.

After the bubble burst in the 1990s, the Bank of Japan gradually lowered interest rates and introduced a zero interest rate policy in 1999. However, deflation did not stop, and quantitative easing was implemented in 2001.`,
      2: `In 2013, the Kuroda Governor introduced "quantitative and qualitative monetary easing" (QQE). This was an unprecedented large-scale monetary easing policy, aiming for a 2% inflation target.

I analyzed this policy's effects using econometric models. I examined correlations between money supply, interest rates, exchange rates, stock prices, and real GDP.

The results showed that while stock prices rose and the yen depreciated, the impact on real GDP growth was limited. Inflation also did not reach the 2% target.`,
      3: `I conducted international comparisons. I compared Japan's monetary policy with the Federal Reserve (US) and the European Central Bank (ECB).

After the financial crisis of 2008, central banks around the world implemented monetary easing. However, there were differences in specific methods and effects.

The Fed achieved relatively smooth economic recovery by combining quantitative easing with forward guidance. The ECB struggled with debt problems in southern European countries.`,
      4: `I analyzed factors that limit monetary policy effectiveness. In Japan, demographic structure (declining birthrate and aging population) and corporate behavior (reluctance to invest) are major constraints.

Even if the central bank supplies money, it won't stimulate the economy if companies don't borrow and invest. This is called the "liquidity trap."

I also discussed the side effects of ultra-low interest rates continuing for a long period. Issues such as bank profitability deterioration and distortion of asset prices have emerged.`,
      5: `Finally, I proposed future policy directions. It's important to combine monetary policy with fiscal policy and growth strategy.

Specifically, I proposed promoting investment in innovation, developing human resources, and reforming work styles. Without these structural reforms, the economy cannot achieve sustainable growth.

I submitted my thesis. The advisor evaluated it as "academically rigorous analysis with practical policy proposals." This research deepened my interest in economic policy.`,
    },
  },

  // Story 23: 文学作品の解釈 (Literary Work Interpretation) - N1
  {
    storyId: '23',
    chapters: {
      1: `In the graduate school Japanese literature seminar, we were to closely read Natsume Soseki's "Kokoro." This work is known as a masterpiece depicting the inner life of intellectuals in the late Meiji period.

The supervising professor emphasized that "it's essential to elucidate the deep structure of the work, not just superficial reading." It's necessary to extract the multilayered meanings inherent in the work using textual criticism methods, not just understanding the story.

First, I focused on the narrator structure. The work has three parts, each with a different narrative perspective. This complex structure is the key to understanding the theme.`,
      2: `I examined the relationship between "Sensei" and "I" in detail. "I" admires "Sensei" and tries to approach him, but "Sensei" keeps his distance.

This relationship symbolizes the conflict between the Meiji and Taisho eras, and the gap between generations. "Sensei" carries the weight of the Meiji spirit and cannot adapt to the new era.

I also focused on Sensei's relationship with "K." The friend's suicide became a trauma that determined Sensei's life.`,
      3: `I analyzed the work from the perspective of psychoanalysis. Sensei's sense of guilt and self-punishment can be interpreted as manifestations of a superego.

I also considered the symbolic meaning of "death." In the work, death is depicted not just as physical extinction, but as ethical judgment and spiritual salvation.

I examined the background of the times when the work was written. 1914, when Emperor Meiji died and General Nogi committed junshi (following one's lord in death) - this era is deeply reflected in the work.`,
      4: `I conducted a comparative study with other Soseki works. "Kokoro" shares themes with works like "Sanshiro" and "Sorekara."

The common theme is modern individuals' loneliness and anxiety. Soseki consistently depicted the spiritual distress of intellectuals living in the rapidly modernizing Meiji-Taisho period.

I also examined Soseki's literary theory. The concept of "sokuten kyoshi" (follow heaven, forsake self) is the foundation of his literary creation.`,
      5: `I compiled the research results into a paper. I proposed that "Kokoro" should be read as a work depicting the collision between modern ego and traditional ethics.

The professor evaluated it as "interpreting the work from multiple perspectives and presenting original insights." This research deepened my interest in Japanese literature.

Literary works have multilayered meanings and allow for various interpretations. That's the appeal of literature. I want to continue deepening my understanding of works through close reading.`,
    },
  },

  // Story 24: 国際関係の考察 (International Relations Consideration) - N1
  {
    storyId: '24',
    chapters: {
      1: `In the international relations seminar, I was to give a research presentation on the theme "Possibility of Multilateral Security in East Asia." This is an extremely complex and controversial issue.

Current East Asia has various factors such as historical recognition issues, territorial disputes, economic interdependence, and ideological conflicts intertwined. Building a multilateral security framework in this region is theoretically desirable, but there are many obstacles in practice.

First, I referred to the development process of collective security systems in Europe. After World War II, Europe built peace and stability through NATO and the EU.`,
      2: `I analyzed the security environment of East Asia. There are potential conflict factors such as the Taiwan issue, the Korean Peninsula issue, and the South China Sea issue.

The US plays a central role in the regional security order through its alliance network (hub-and-spoke system). However, with China's rise, this system is being challenged.

I examined attempts at multilateral dialogue. While frameworks such as ARF (ASEAN Regional Forum) and Six-Party Talks exist, their effectiveness is limited.`,
      3: `I conducted case studies. I compared Europe's OSCE (Organization for Security and Co-operation in Europe) with East Asia's situation.

In Europe, multilateral security cooperation was possible based on shared values and historical reflection. In East Asia, however, there are large differences in political systems and values.

I also analyzed the "security dilemma." When one country strengthens its military, neighboring countries perceive it as a threat and strengthen their own military, leading to a vicious cycle.`,
      4: `I proposed conditions for building multilateral security. First, building trust among countries. Second, shared threat recognition. Third, institutionalization mechanisms.

Specifically, I proposed establishing regular summit meetings, military exchange programs, and joint maritime security exercises.

I also discussed the role of middle powers. Countries like South Korea, Australia, and ASEAN countries can play important mediating roles between major powers.`,
      5: `Finally, I presented a roadmap. Start with functional cooperation such as anti-terrorism and disaster prevention, and gradually expand the scope of cooperation.

Economic cooperation is also important. Deepening economic interdependence can constrain military conflict.

I gave the presentation. There was active discussion in the seminar. The professor evaluated it as "realistic analysis that balances theory and practice." This research deepened my interest in international relations.`,
    },
  },
];

async function applyManualTranslations() {
  console.log('🔧 Starting Manual Translation Fix Process\n');
  console.log('This will apply pre-translated content to fix incorrect translations.\n');

  let totalFixed = 0;
  const failedUpdates: Array<{ storyId: string; chapterNumber: number; error: string }> = [];

  try {
    for (const storyTranslation of manualTranslations) {
      console.log(`\n${'='.repeat(80)}`);

      // Get story details
      const story = await prisma.story.findUnique({
        where: { story_id: storyTranslation.storyId },
        include: {
          chapters: {
            orderBy: { chapter_number: 'asc' },
          },
        },
      });

      if (!story) {
        console.log(`❌ Story ${storyTranslation.storyId} not found`);
        continue;
      }

      console.log(`📖 Story ${story.story_id}: ${story.title} (${story.level_jlpt})`);
      console.log('='.repeat(80));

      for (const chapter of story.chapters) {
        const newTranslation = storyTranslation.chapters[chapter.chapter_number];

        if (newTranslation) {
          console.log(`\n  Chapter ${chapter.chapter_number}: ${chapter.title}`);
          console.log(`  Japanese (first 80 chars): ${chapter.content.substring(0, 80)}...`);
          console.log(`  Old EN (first 80 chars): ${chapter.content_en?.substring(0, 80) || 'NULL'}...`);
          console.log(`  New EN (first 80 chars): ${newTranslation.substring(0, 80)}...`);

          try {
            await prisma.chapter.update({
              where: { chapter_id: chapter.chapter_id },
              data: { content_en: newTranslation },
            });

            console.log(`  ✅ Updated`);
            totalFixed++;
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.log(`  ❌ Failed to update: ${errorMsg}`);
            failedUpdates.push({
              storyId: story.story_id,
              chapterNumber: chapter.chapter_number,
              error: errorMsg,
            });
          }
        }
      }
    }

    // Summary
    console.log(`\n\n${'='.repeat(80)}`);
    console.log('📊 SUMMARY');
    console.log('='.repeat(80));
    console.log(`Stories processed: ${manualTranslations.length}`);
    console.log(`Chapters fixed: ${totalFixed}`);
    console.log(`Failed updates: ${failedUpdates.length}`);

    if (failedUpdates.length > 0) {
      console.log(`\n❌ Failed Updates:`);
      for (const failed of failedUpdates) {
        console.log(`  - Story ${failed.storyId}, Chapter ${failed.chapterNumber}: ${failed.error}`);
      }
    }

    console.log(`\n✅ Manual translation fix completed!`);
    console.log(`\n📋 Fixed translations for stories: ${manualTranslations.map((t) => t.storyId).join(', ')}`);

  } catch (error) {
    console.error('\n❌ Error during manual translation fix:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

applyManualTranslations()
  .then(() => {
    console.log('\n🎉 Process completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
