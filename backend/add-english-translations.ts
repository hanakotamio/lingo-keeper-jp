import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Story translations organized by story_id
const storyTranslations: Record<string, {
  title: string;
  chapters: string[];
}> = {
  // Story 1: 東京での新しい生活 (N3)
  '1': {
    title: 'A New Life in Tokyo',
    chapters: [
      // Chapter 1
      `Today, I moved to Tokyo from Osaka. While watching the scenery change through the shinkansen window, I thought about my new life ahead.

When I arrived at Tokyo Station, I was surprised by the crowds. Osaka is also a big city, but Tokyo's scale felt different. The platform was filled with people, and the sound of announcements echoed everywhere.

I took a taxi to my new apartment. The driver was kind and told me, "It's a good area. Lots of shops and convenient transportation." As I listened to his words, my anxiety about the new environment eased a little.`,

      // Chapter 2
      `I woke up early the next morning. It wasn't jet lag, but perhaps I couldn't sleep well in the new environment. When I opened the window, Tokyo's morning air came in. It had a unique city smell, different from Osaka.

Today I'm planning to buy furniture. There's a large home center nearby, so I decided to go there. After washing my face and getting ready, I left the apartment.

On the way, I saw many people walking briskly. Everyone seemed busy. "This is Tokyo," I thought.`,

      // Chapter 3
      `When I entered the set meal restaurant, a kind-looking woman greeted me with "Welcome." Looking at the menu, everything was reasonably priced.

When I asked "What do you recommend?" she said, "Today's daily special is a good deal. The grilled fish set meal is 800 yen."

I ordered the daily special. The food came out quickly. The rice was delicious, and the miso soup warmed my body. As I ate, the woman asked, "Are you new to this area?"`,

      // Chapter 4
      `Three days after moving, I went to the ward office to complete the moving procedures. The staff were polite and explained everything carefully.

After finishing the procedures, I walked around the neighborhood. I found a library, post office, and supermarket. There was also a park where elderly people were doing radio exercises.

"I think I can live well here," I thought, and my heart felt lighter. Tokyo is a big city, but this neighborhood seems warm.`,

      // Chapter 5
      `A week has passed since moving to Tokyo. I'm gradually getting used to the new life. I've memorized the nearest station and the way to the supermarket.

Yesterday, the neighbor came to greet me. She's a woman about the same age as my mother, and she kindly told me about recommended shops in the area.

"If there's anything you don't understand, please ask anytime," she said, which made me very happy. I'm glad I moved to this town. From now on, I'll cherish the connections with the people here and build my life in Tokyo.`
    ]
  },

  // Story 2: カフェでのアルバイト (N4)
  '2': {
    title: 'Part-time Job at a Cafe',
    chapters: [
      `I started a part-time job at a cafe near the station. This is my first job, so I'm nervous but also looking forward to it.

On the first day, the manager taught me various things. How to use the register, how to make coffee, how to greet customers. There was so much to remember that my head felt full.

But the manager was kind and said, "Don't worry, you'll get used to it gradually." Those words gave me a little courage.`,

      `A week has passed since I started the job. I've gotten used to operating the register, and I can make coffee without mistakes.

Today, a regular customer said to me, "You've gotten better." I was so happy. It's nice to be recognized for my efforts.

However, I still make mistakes sometimes. Yesterday, I got the order wrong and troubled the customer. I need to be more careful.`,

      `It's been a month since I started working. Now I can work with confidence. I enjoy talking with customers and can make delicious coffee.

The manager praised me saying, "You've really improved." I'm glad I continued without giving up.

Through this job, I learned the importance of effort and perseverance. I also learned the joy of serving customers. I want to continue growing from now on.`,

      `Today was my first time training a new employee. I felt the responsibility of teaching someone.

I remembered when I first started and tried to teach carefully. The new person looked nervous, just like I was.

"Don't worry, you'll definitely get used to it," I said. When they smiled, I felt like I had grown a little. Now I'm the one encouraging others.`,

      `I've been working at the cafe for six months. This place has become very important to me.

I have regular customers I look forward to seeing, and my coworkers are like friends. The manager continues to teach me various things.

I learned a lot through this job. Communication skills, responsibility, and the importance of teamwork. These will surely be useful in my future life. I'm grateful for this cafe.`
    ]
  },

  // Story 3: 日本の季節 (N5)
  '3': {
    title: 'Japanese Seasons',
    chapters: [
      `Spring has come. Cherry blossoms are blooming in the park. They are very beautiful.

I went to see the cherry blossoms with my friends. Many people had come. Everyone was enjoying hanami.

We ate bento under the cherry blossoms. It was delicious. Spring in Japan is wonderful.`,

      `Summer has come. It's very hot every day. I go to the pool.

The pool is cold and feels good. I swim for an hour every day. It's good exercise.

I eat watermelon after swimming. Japanese summer watermelon is delicious.`,

      `Autumn has come. The leaves of the trees have turned red and yellow. It's very beautiful.

I walk in the park in autumn. The cool breeze feels good. Many people are reading books on benches.

Japanese autumn is comfortable. Neither hot nor cold. I like autumn.`,

      `Winter has come. It snows and it's very cold. I wear warm clothes.

Japanese winter is beautiful. Especially when it snows, the town becomes quiet. The snow is white and pretty.

I drink hot cocoa. My body warms up. I also like Japanese winter.`,

      `The four seasons of Japan are all wonderful. Spring cherry blossoms, summer sea, autumn leaves, winter snow.

I learned a lot through the seasons. The beauty of nature and the culture of Japan.

I want to continue enjoying Japan's seasons from now on. And I want to make many memories.`
    ]
  },

  // Story 4: 大学生の一日 (N4)
  '4': {
    title: 'A University Student\'s Day',
    chapters: [
      `I'm a university student. I'll introduce a typical day.

I wake up at 7 AM every morning. After washing my face and eating breakfast, I leave home at 8 AM.

It takes 30 minutes by train to university. I review for class on the train. University life is busy but fun.`,

      `Classes start at 9 AM. Today I have Japanese literature class.

The professor's explanations are interesting, and the time passes quickly. I take notes carefully so I don't forget important points.

After class, I eat lunch with friends in the cafeteria. We talk about today's class and club activities.`,

      `I have club activities in the afternoon. I'm in the tennis club. I practice for two hours three times a week.

Today we practiced serves. My senior taught me carefully. Thanks to that, I improved a little.

I feel refreshed after moving my body. Club activities are a good change of pace from studying.`,

      `After club activities, I go to the library. I do homework and prepare for the next class.

The library is quiet, making it easy to concentrate. I study for about two hours.

After studying, I go home. On the way home, I sometimes stop by the convenience store and buy something.`,

      `I get home around 7 PM. After taking a bath and eating dinner, I relax a little.

Before sleeping, I review what I learned today. Then I go to bed at 11 PM.

University life is busy, but it's very fulfilling. I treasure each day and want to study many things.`
    ]
  },

  // Story 5: 友達との旅行 (N4)
  '5': {
    title: 'Trip with Friends',
    chapters: [
      `Next month, I'm going on a trip to Kyoto with friends. I'm really looking forward to it. This is my first trip with friends.

We're discussing where to go. There are many famous places in Kyoto. Temples, shrines, and beautiful gardens.

We're making a list of places we want to visit. Kinkaku-ji, Kiyomizu-dera, Fushimi Inari Shrine. There are so many places we want to go.`,

      `We looked for accommodation. We found a nice ryokan. We can stay two nights for a reasonable price.

The ryokan is near the station, so it's convenient for sightseeing. We'll have Japanese breakfast and dinner.

Everyone is excited. We're counting down the days until the trip.`,

      `Finally, the day of the trip has come. We met at Tokyo Station in the morning.

We took the shinkansen to Kyoto. The scenery from the window was beautiful. We talked excitedly about what we would do in Kyoto.

We arrived in Kyoto in about two hours. We immediately started sightseeing.`,

      `We visited many places in Kyoto. Every temple and shrine was beautiful. We took lots of photos.

The food in Kyoto was also delicious. We ate yudofu and matcha parfait. Everything was tasty.

At night, we returned to the ryokan. The hot spring felt good and healed our fatigue.`,

      `The two-day trip ended. We made many memories.

Beautiful scenery, delicious food, fun time with friends. Everything was wonderful.

"Let's go on a trip again," we promised. This trip became a precious memory.`
    ]
  },

  // Story 6: 病院での診察 (N4)
  '6': {
    title: 'Medical Consultation at the Hospital',
    chapters: [
      `I've had a fever since yesterday. My head hurts and I feel sluggish. I decided to go to the hospital.

I called the hospital and made an appointment. The receptionist was kind and explained in detail.

I need to go to the hospital at 2 PM. I'm a little anxious about what the doctor will say.`,

      `I arrived at the hospital. I submitted my insurance card at reception and waited.

There were many patients in the waiting room. Some people were coughing, others reading magazines.

After waiting about 30 minutes, my name was called. I nervously entered the examination room.`,

      `The doctor asked in detail about my symptoms. "Since when have you had a fever? Does anything else hurt?"

I explained honestly. "Since yesterday. My head hurts and I have no appetite."

The doctor examined me carefully. They checked my throat and listened to my heartbeat with a stethoscope.`,

      `The doctor said, "It's a cold. You need to rest for about three days."

I was relieved that it wasn't a serious illness. The doctor prescribed medicine and gave me advice.

"Drink plenty of water and rest well. If the fever doesn't go down, please come again."`,

      `I picked up the medicine at the pharmacy. The pharmacist explained how to take it.

"Take one tablet three times a day after meals. If you have any questions, please call."

I thanked them and went home. Following the doctor's instructions, I'll rest well and get better soon.`
    ]
  },

  // Story 7: レストランでの注文 (N4)
  '7': {
    title: 'Ordering at a Restaurant',
    chapters: [
      `Today, I went to a new Italian restaurant with friends. I heard it's a famous restaurant with delicious food.

The restaurant had a stylish atmosphere. Many customers were enjoying their meals.

We were guided to our seats and looked at the menu. There were so many dishes, it was hard to decide.`,

      `The waiter came and explained the recommended dishes. "Today's recommendation is seafood pasta. It uses fresh fish."

It sounded delicious. I decided to order that. My friend ordered pizza.

We also ordered drinks. I ordered iced tea, and my friend ordered cola.`,

      `The food arrived. The seafood pasta looked delicious.

When I took a bite, it was really tasty. The flavor of the fish was rich, and the sauce was perfect.

My friend's pizza also looked delicious. "Would you like to try some?" they offered, so we shared.`,

      `After finishing the meal, we ordered dessert. I ordered tiramisu, and my friend ordered panna cotta.

The desserts were also delicious. Not too sweet, just right.

We had coffee after dessert. We enjoyed conversation in the relaxed atmosphere.`,

      `It was time to pay. We asked the waiter for the bill.

The total was a bit expensive, but we were very satisfied. Delicious food and good time with friends.

"Let's come here again," we said as we left the restaurant. It became a favorite restaurant.`
    ]
  },

  // Story 8: スーパーでの買い物 (N5)
  '8': {
    title: 'Shopping at the Supermarket',
    chapters: [
      `Today, I'm going shopping at the supermarket. I need various things.

The supermarket is near my house. It takes 5 minutes on foot.

I took my shopping bag. Let's go shopping.`,

      `I arrived at the supermarket. First, I'm buying vegetables.

Tomatoes, cucumbers, carrots. All fresh. The lettuce is also good.

I put the vegetables in my basket. Next is fruit.`,

      `There are apples and oranges. Bananas too. All delicious-looking.

I bought apples and bananas. Then I went to the meat section.

I bought chicken and pork. These will be for tonight's dinner.`,

      `I went to the dairy section. I bought milk, eggs, and yogurt.

I eat yogurt every day. It's good for the body.

Lastly, I bought bread. Japanese bread is delicious.`,

      `Shopping is finished. I went to the checkout.

The clerk was kind. They bagged everything nicely.

I'm going home. I'll make delicious food with what I bought today.`
    ]
  },

  // Story 9: 図書館で勉強 (N5)
  '9': {
    title: 'Studying at the Library',
    chapters: [
      `Today, I'm studying at the library. I have a test next week.

The library is near the station. It's a large library.

I brought my textbooks and notebook. Let's study hard.`,

      `The library is quiet. Many people are studying.

I sat at a desk. I opened my textbook and started studying.

Mathematics is difficult. But I'll try my best.`,

      `I studied for two hours. I'm getting a little tired.

I took a break. I drank water and rested.

After the break, I'll study again. I need to work harder.`,

      `I studied various subjects. Mathematics, English, Japanese.

I don't understand some parts. I'll ask the teacher tomorrow.

But I understand a lot. I'm glad I studied.`,

      `Studying at the library ended. I'm going home.

The library is quiet and easy to study in. I'll come again tomorrow.

I want to do well on the test. I'll continue studying hard.`
    ]
  },

  // Story 10: 電車での通勤 (N4)
  '10': {
    title: 'Commuting by Train',
    chapters: [
      `I commute to work by train every day. My house is far from the office, so it takes an hour.

I leave home at 7:30 AM. The morning train is very crowded. Many people are heading to work.

I always use the same train car. I can usually get a seat if I get on early.`,

      `I read books or check my smartphone on the train. Sometimes I listen to music.

Today I'm reading a novel. It's interesting and makes the time pass quickly.

But the train is often delayed. When I'm late for work, it troubles me.`,

      `The train arrived at the station. Many people got off.

I get off at the next station. The office is a 5-minute walk from the station.

After getting off the train, I buy coffee at a convenience store. I drink it at the office.`,

      `The evening train is even more crowded than the morning one. Everyone is tired.

I'm tired too. But I'm looking forward to going home.

I think about what to have for dinner on the train. Today I'll make curry.`,

      `I commute by train every day. Sometimes it's tough, but I'm used to it.

I can read books and rest on the train. It's also important time for me.

Commuting is part of my daily routine. I want to cherish this time tomorrow too.`
    ]
  },

  // Story 11: 公園での散歩 (N5)
  '11': {
    title: 'Walk in the Park',
    chapters: [
      `Today the weather is nice. I'm taking a walk in the park.

The park is large and has many flowers. Trees are also tall.

Many people are in the park. Everyone looks happy.`,

      `Children are playing. Playing ball and running around.

They look fun. Dogs are walking too.

The dogs are cute. I like dogs.`,

      `There's a pond in the park. There are fish and ducks.

I throw bread to the ducks. The ducks swim happily.

The pond is beautiful. The water is clear.`,

      `There's a bench in the park. I sit on the bench and rest.

The wind feels good. Birds are singing.

It's very quiet. The park is a wonderful place.`,

      `The walk is over. I'm going home.

The park is near my house. I can come anytime.

I'll come again tomorrow. I like the park.`
    ]
  },

  // Story 12: 日本の伝統文化 (N3)
  '12': {
    title: 'Japanese Traditional Culture',
    chapters: [
      `I'm interested in Japanese traditional culture. Recently, I started learning tea ceremony.

The tea ceremony class is held once a week at a local community center. The teacher is a kind elderly woman who teaches carefully.

On the first day, I learned how to sit properly. Sitting in seiza for a long time was difficult, but the teacher said I'll get used to it gradually.`,

      `Today I learned how to make tea. The proper way to hold the tea whisk and the angle of whisking are important.

At first I couldn't do it well, but the teacher demonstrated many times. Gradually I was able to make foamy tea.

Drinking the tea I made myself had a special taste. It was a little bitter, but I felt a deep flavor.`,

      `Through the tea ceremony, I'm learning not just the procedure but also the spirit. The teacher says, "Tea ceremony has the spirit of 'ichi-go ichi-e' - treasuring each encounter."

Every meeting is once in a lifetime, so we must face it with all our heart. This way of thinking moved me greatly.

I want to incorporate this spirit into my daily life too.`,

      `Today a tea ceremony event was held at the community center. I participated in hosting guests for the first time.

I was very nervous, but I tried to treat each guest sincerely. The guests enjoyed the tea, which made me happy.

After the tea ceremony, a guest said to me, "Your tea was delicious. Your sincerity came through." Those words gave me confidence.`,

      `I've been learning tea ceremony for six months. I've learned many things through this practice.

Not just tea-making techniques, but also Japanese aesthetic sense, manner of being, and way of thinking. These will surely be useful in my life from now on.

I want to continue learning tea ceremony. And someday, I want to pass on this wonderful culture to others.`
    ]
  },

  // Story 13: アパートを探す (N4)
  '13': {
    title: 'Looking for an Apartment',
    chapters: [
      `I'm looking for a new apartment. The current one is far from work and inconvenient.

I went to a real estate agency. The staff greeted me kindly and asked about my desired conditions.

"Close to the station, rent around 80,000 yen, with bath and toilet separate." When I told them, they introduced several properties.`,

      `The next day, I went to view properties. The first one was close to the station but the room was small.

The second one had a large room but was far from the station. Each had advantages and disadvantages, making it hard to decide.

The real estate staff said, "There's another property I'd like to show you. Shall we go?" So I went to view one more place.`,

      `The third property was perfect. Close to the station, spacious room, and the rent was within budget.

The building was new and clean. The room got good sunlight and was bright. "This is it!" I thought immediately.

I applied the same day. The screening took about a week.`,

      `A week later, I got the approval. I could move into the new apartment.

I signed the contract at the real estate agency. I paid the deposit and key money. It was quite expensive, but I was satisfied with this apartment.

The move-in date was set for next month. I need to prepare for moving.`,

      `Today I moved. Friends helped me. We carried furniture and cardboard boxes together.

The new apartment is comfortable. Close to work, in a quiet environment. I think I can live well here.

I'm glad I searched carefully. From tomorrow, my new life begins.`
    ]
  },

  // Story 14: コンビニでのバイト (N4)
  '14': {
    title: 'Part-time Job at a Convenience Store',
    chapters: [
      `I started a part-time job at a convenience store. This is my first job at a convenience store.

On the first day, the manager taught me various things. How to use the register, how to arrange products, customer service.

There was a lot to learn, but the manager was kind. I'll remember everything gradually.`,

      `A week has passed. I've gotten used to the work. Operating the register is no longer scary.

Today I learned how to heat up bento boxes. It's important to heat them to the proper temperature.

I also learned how to make coffee. Many customers order coffee.`,

      `It's been a month since I started. Now I can do most of the work.

Today a customer said "Thank you" when I bagged their items nicely. I was very happy.

I learned the importance of customer service. Small considerations can make customers happy.`,

      `Night shifts have started. Night shifts are from 10 PM to 6 AM.

There are fewer customers at night, but the work is different. Arranging products and cleaning.

Sometimes drunk customers come. That's a little scary.`,

      `I've been working at the convenience store for three months. I've made good friends.

My coworkers are kind and help each other. The manager trusts me.

I learned a lot through this job. I want to continue working hard. The convenience store has become an important place for me.`
    ]
  },

  // Story 15: 会社での会議 (N3)
  '15': {
    title: 'Meeting at the Company',
    chapters: [
      `Today there's an important meeting at the company. We're discussing a new project.

I prepared materials from the morning. I made documents and organized data. It's my first time presenting at a meeting, so I'm nervous.

The manager said, "Don't worry, you'll be fine." Those words encouraged me a little.`,

      `The meeting started. Department heads and many staff members attended.

My boss started the explanation first. Proposing a plan for the new project and showing numerical targets.

Then it was my turn to present. My heart was pounding, but I explained carefully based on the materials I prepared.`,

      `After my presentation, there were questions. "How did you research these numbers?" "Is this schedule realistic?"

I answered based on what I investigated beforehand. Some things I couldn't answer immediately, but my boss helped me.

Various opinions were exchanged in the meeting. It was a good opportunity to hear different perspectives.`,

      `The meeting lasted about two hours. It was decided to proceed with the new project.

Everyone's opinions were incorporated, creating a better plan. Teamwork is important.

After the meeting, my boss said, "You did well." I was very happy.`,

      `I learned a lot through this meeting. Presentation skills, how to answer questions, and the importance of preparation.

Next time I can do better. I want to contribute more to the company.

This experience became my confidence. I want to continue taking on challenges without fear of new things.`
    ]
  },

  // Story 16: 日本の祭り (N3)
  '16': {
    title: 'Japanese Festivals',
    chapters: [
      `Summer in Japan means festivals. Today I'm going to a local summer festival.

I put on a yukata that I bought recently. It's my first time wearing one, and it's a bit difficult. My friend helped me put it on.

We left the house in the evening. We could hear drums and flutes from afar. I'm excited.`,

      `The festival venue was crowded with many people. Everyone was wearing yukatas and having fun.

There were many food stalls. Takoyaki, yakisoba, shaved ice. Everything looked delicious.

We bought takoyaki first. It was hot and tasty. We ate while walking around.`,

      `We watched the bon dance. People were dancing in a circle. The movements looked fun.

"Want to try dancing?" my friend asked. I hesitated at first, but decided to give it a try.

We joined the circle and danced. We didn't know the steps, but gradually got the hang of it. It was very fun.`,

      `Fireworks went up. Large fireworks bloomed in the night sky. Very beautiful.

Everyone stopped and looked up at the sky. "Wow!" voices of admiration rose.

I watched the fireworks with my friend. A summer memory was created.`,

      `The festival ended. We walked home still wearing yukatas.

We talked about today's memories. The delicious food, the fun bon dance, the beautiful fireworks.

Japanese festivals are wonderful. I want to go to many more festivals. I'll go again next year.`
    ]
  },

  // Story 17: 新しい趣味 (N4)
  '17': {
    title: 'New Hobby',
    chapters: [
      `I started a new hobby recently. I joined a photography club.

I've always been interested in photography. I bought a camera and am learning how to take photos.

The club meets once a week. Members go to various places and take photos together.`,

      `Today the club went to a park. We took photos of flowers and birds.

Senior members taught me various things. Camera settings, composition, light usage.

I learned a lot. But taking good photos is difficult.`,

      `I practiced taking photos every day. I took photos of scenery and people around me.

Gradually I got better. I could take photos as I imagined.

Club members praised my photos. I was very happy.`,

      `Next month there will be a photo exhibition by club members. I'll exhibit my photos too.

I'm selecting which photos to display. I'll choose the best ones from what I've taken so far.

I'm nervous but looking forward to it. I want many people to see my photos.`,

      `Through photography, I discovered new things. The beauty of ordinary scenery and the importance of observation.

Photography became an important hobby for me. I want to continue taking photos from now on.

And I want to express what I feel through my photos. I'll keep working hard at my new hobby.`
    ]
  },

  // Story 18: 料理教室 (N4)
  '18': {
    title: 'Cooking Class',
    chapters: [
      `I started attending a cooking class. I want to improve my cooking skills.

Classes are held twice a week in the evening. The teacher is a professional chef.

On the first day, I learned how to cut vegetables. Proper knife handling is important.`,

      `Today I made Japanese food. I made miso soup, grilled fish, and rice.

The teacher explained carefully. "Add miso after turning off the heat." I learned many tips.

The food I made was delicious. My family was pleased too.`,

      `In the third week, I learned to make Western food. Today's menu was pasta and salad.

Making pasta sauce is difficult. Balancing the flavors is important.

Thanks to the teacher's advice, I made it delicious. I want to make this at home too.`,

      `This week I learned Chinese food. Fried rice and mapo tofu.

Cooking with high heat is a feature of Chinese cuisine. Cooking quickly is important.

The mapo tofu was spicy and delicious. Gradually I can make various dishes.`,

      `I've been attending the cooking class for three months. My cooking skills have really improved.

Now I can make various dishes. My family and friends are happy.

I learned a lot through cooking. Creativity and the joy of making someone happy. I want to continue learning cooking from now on.`
    ]
  },

  // Story 19: 就職活動 (N3)
  '19': {
    title: 'Job Hunting',
    chapters: [
      `I'm a fourth-year university student. I started job hunting.

First, I'm researching companies. I'm looking for a company that matches what I want to do.

There are many companies. IT, manufacturing, service industry. Each has different characteristics.`,

      `I'm attending company information sessions. I can learn details about the company.

Company employees talk about their work. I can ask questions too.

Through information sessions, I'm gradually understanding what kind of work I want to do.`,

      `I submitted my entry sheet. I wrote about my strengths and motivation for applying.

Writing the entry sheet is difficult. I need to express myself in limited space.

I had my university career center check it. I got a lot of advice.`,

      `I had an interview. I was very nervous. The interviewer asked various questions.

"Why do you want to join our company?" "What are your strengths?" I answered what I had prepared.

But there were unexpected questions too. I answered honestly what I thought at the time.`,

      `I received a job offer. I was contacted by a company I really wanted to join.

I was so happy. My hard work in job hunting paid off.

I learned a lot through job hunting. Self-analysis, communication skills, and perseverance. From April, I'll work hard at the new company.`
    ]
  },

  // Story 20: 環境問題について (N2)
  '20': {
    title: 'About Environmental Issues',
    chapters: [
      `Environmental issues are a serious problem facing modern society. Global warming, marine pollution, deforestation - these problems affect all of us.

I've recently become interested in environmental issues. I attended an environmental seminar held in my town.

At the seminar, experts explained the current state of environmental issues. The reality was more serious than I imagined.`,

      `We learned about concrete actions we can take at the seminar. Reducing plastic, saving energy, recycling.

These are things we can start in our daily lives. Even small actions can make a big difference if many people do them.

I decided to start with what I can do. First, I'll bring my own shopping bag and refuse plastic bags.`,

      `I started using an eco-bag. At first it was inconvenient to carry it around, but I got used to it.

Store clerks praise me saying, "Thank you for being environmentally conscious." It motivates me.

I also started reducing food waste. I buy only necessary amounts and use ingredients without waste.`,

      `I'm participating in environmental activities in my town. Volunteer cleaning, recycling events, tree planting.

Working with many people for the environment is fun. I also make new friends.

Through these activities, I'm learning more about environmental issues.`,

      `Individual efforts alone cannot solve environmental issues. Society as a whole needs to work together.

But everyone's small actions can change the future. I'll continue activities for the environment.

For a better planet Earth. For the next generation. I want to continue doing what I can.`
    ]
  },

  // Story 21: オンライン授業 (N3)
  '21': {
    title: 'Online Classes',
    chapters: [
      `Due to the pandemic, university classes became online. At first, I was confused by this new style of learning.

I take classes on my computer at home. It's convenient that I don't have to commute, but there are also difficulties.

Internet connection problems and difficulty concentrating. I'm facing new challenges.`,

      `I'm getting used to online classes gradually. I'm learning tips for studying efficiently.

For example, preparing the study environment. I study in a quiet place with my desk organized.

I also participate actively in classes. Asking questions in the chat and speaking in discussions.`,

      `Group work in online classes is difficult. Sharing opinions while looking at each other's faces on the screen is awkward.

But we're using online tools well. Video conferences, shared documents, chat.

We're communicating better than before. We can contact each other anytime.`,

      `Tests are also conducted online. It's different from paper tests.

Time limits are set, and we submit answers online. We need to be careful about operation mistakes.

But there's less test anxiety. We can take tests in a relaxed state at home.`,

      `Online classes have both merits and demerits. But I learned a lot through this experience.

New ways of learning and the importance of self-management. These will surely be useful in the future.

The world is changing. I want to adapt flexibly to change and continue growing.`
    ]
  },

  // Story 22: ボランティア活動 (N3)
  '22': {
    title: 'Volunteer Activities',
    chapters: [
      `I started volunteer activities. I'm supporting children's learning at a local community center.

I teach elementary and junior high school students homework and exam preparation. It's rewarding when children say, "I understand now!"

At first I was anxious about whether I could teach well, but the children are earnest and I'm learning a lot too.`,

      `A boy who was struggling with math is now able to solve problems. He looks happy when he solves a problem.

"Thank you, teacher!" When he says this with a smile, I feel that volunteering is worthwhile.

I'm learning the importance of teaching and the joy of helping someone through this activity.`,

      `I'm participating in various volunteer activities. Park cleaning, visiting nursing homes, disaster relief fundraising.

Each activity has different significance. But they all have the common point of being useful to someone.

Through volunteer work, I'm reconsidering the meaning of my own existence.`,

      `I made new friends through volunteer activities. People of various ages and occupations.

Everyone has a warm heart and the spirit to help others. Learning from them, I too want to become such a person.

Volunteers are not just "giving." I'm receiving a lot too.`,

      `I've been doing volunteer work for a year. It's become a natural part of my life.

I learned a lot through this activity. Compassion, sense of contribution, and connections with people.

I want to continue volunteer work from now on. For society and for myself. To make the world a little better.`
    ]
  },

  // Story 23: 日本の温泉 (N3)
  '23': {
    title: 'Japanese Hot Springs',
    chapters: [
      `I went to a hot spring for the first time. I've been interested in Japanese hot spring culture.

We went to a hot spring town in the mountains. The inn was in a quiet place surrounded by nature.

As soon as we arrived, we headed to the hot spring. I was excited about my first hot spring experience.`,

      `The hot spring water was hot. But once I got used to it, it felt very good.

Looking at the mountains while soaking in the outdoor bath was the best. My daily fatigue melted away.

"Japanese hot springs are wonderful," I thought sincerely.`,

      `The food at the hot spring inn was also delicious. We had local vegetables and fresh fish.

Everything was elaborately prepared. I could feel the Japanese spirit of hospitality.

After the meal, we soaked in the hot spring again. We could use it many times, which was nice.`,

      `The next morning, we took a walk around the hot spring town. Many other inns were there too.

We found public hot springs for townspeople and tourists. The fee was cheap and the atmosphere was good.

We enjoyed the different hot springs. Each hot spring had different water quality and effects.`,

      `The hot spring trip ended. It was a very good refresh.

I learned about Japanese hot spring culture. The custom of healing mind and body in hot springs has a long history.

I want to go to various hot springs from now on. And I want to enjoy Japan's nature and culture.`
    ]
  },

  // Story 24: キャリアの選択 (N2)
  '24': {
    title: 'Career Choice',
    chapters: [
      `I'm at a crossroads in my career. I'm thinking about whether to continue at my current company or change jobs.

I've been working at this company for five years. I have trusted colleagues and the work is going well.

But I have a dream I want to challenge. I'm wondering if I should spend my youth on safer choices.`,

      `I consulted with a senior I respect. They said, "You should do what you want to do. You can't turn back time."

Those words struck my heart. That's right. If I don't challenge myself now, I'll surely regret it later.

I decided to seriously consider changing jobs. I started researching companies where I can realize my dream.`,

      `I attended information sessions at several companies. Each company had different culture and values.

I thought carefully about which environment I could grow in. Not just working conditions, but what I can achieve there.

I found a company I really wanted to join. It's a venture company where I can challenge new businesses.`,

      `I told my current company about changing jobs. My boss and colleagues were surprised.

But they understood my feelings. "Do your best at the new place," they encouraged me.

I was grateful for their warm words. I resolved to cherish the connections with people I met at this company.`,

      `I decided to join the new company. I'm anxious about the new environment, but my expectations are greater.

I'm grateful for what I learned at my current company. That experience will surely be useful at the new company.

A new challenge begins. I'll work hard without fearing failure. I believe this choice will open up my future.`
    ]
  },

  // Story 25: 伝統文化の継承 (N1)
  '25': {
    title: 'Succession of Traditional Culture',
    chapters: [
      `The succession of traditional culture is a serious issue in modern Japanese society. With the declining birthrate and aging population, there are fewer successors, and many traditional crafts are in danger of disappearing.

I'm learning lacquerware from a master craftsman. This is a traditional craft passed down in this region for over 300 years.

The master is 75 years old. "I want to pass on this technique to the next generation," he says, teaching me passionately every day.`,

      `Learning traditional crafts is extremely difficult. It's not just mastering techniques, but also inheriting the spirit behind the work.

The master says, "Shortcuts don't exist in craftsmanship. Only daily effort accumulates as skill."

I practice the same work repeatedly every day. It's地味 work, but I'm gradually understanding its depth.`,

      `The master's works are wonderful. Simple beauty and solid craftsmanship. They exude dignity that modern mass-produced items don't have.

"Why is traditional culture important?" When I asked, the master answered this way.

"It's the identity of Japanese people. Losing tradition means losing ourselves. We must absolutely pass it on to the next generation."`,

      `I think about how to convey the appeal of traditional culture to young people. Traditional methods alone may not reach the younger generation.

I'm trying to disseminate information using SNS. Posting work processes and the master's words.

The response is better than expected. Many people are showing interest.`,

      `The succession of traditional culture is not just preserving the past. It's about how to apply tradition to the modern age and pass it on to the future.

I want to bridge tradition and innovation. To create new value while respecting tradition.

This is my mission. For Japanese culture and for the next generation. I'm resolved to continue this path.`
    ]
  }
};

async function addEnglishTranslations() {
  console.log('=== Starting English Translation Addition ===\n');

  let totalUpdated = 0;
  let errors = 0;

  // Get all stories
  const stories = await prisma.story.findMany({
    orderBy: { story_id: 'asc' },
    include: {
      chapters: {
        orderBy: { chapter_number: 'asc' }
      }
    }
  });

  for (const story of stories) {
    console.log(`\nProcessing Story ${story.story_id}: ${story.title}`);

    const translations = storyTranslations[story.story_id];

    if (!translations) {
      console.log(`  ⚠️  No translations found for story ${story.story_id}`);
      errors++;
      continue;
    }

    if (story.chapters.length !== translations.chapters.length) {
      console.log(`  ⚠️  Chapter count mismatch: DB has ${story.chapters.length}, translations have ${translations.chapters.length}`);
      errors++;
      continue;
    }

    // Update each chapter
    for (let i = 0; i < story.chapters.length; i++) {
      const chapter = story.chapters[i];
      const englishContent = translations.chapters[i];

      try {
        await prisma.chapter.update({
          where: { chapter_id: chapter.chapter_id },
          data: { content_en: englishContent }
        });

        console.log(`  ✅ Updated Chapter ${chapter.chapter_number}`);
        totalUpdated++;
      } catch (error) {
        console.log(`  ❌ Failed to update Chapter ${chapter.chapter_number}: ${error}`);
        errors++;
      }
    }
  }

  console.log('\n=== Translation Addition Complete ===');
  console.log(`Total chapters updated: ${totalUpdated}`);
  console.log(`Errors: ${errors}`);

  // Verify the updates
  console.log('\n=== Verification ===');
  const totalChapters = await prisma.chapter.count();
  const withEnglish = await prisma.chapter.count({
    where: { content_en: { not: null } }
  });

  console.log(`Total chapters: ${totalChapters}`);
  console.log(`Chapters with English: ${withEnglish}`);
  console.log(`Success rate: ${((withEnglish / totalChapters) * 100).toFixed(1)}%`);

  await prisma.$disconnect();
}

addEnglishTranslations().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
