// Generate 40+ days of realistic journal entries for lanxinlu1239@gmail.com
import { addLocalJournalEntry } from '../services/offlineService.js'

const journalTemplates = [
  {
    moods: [1, 2], // Great, Good
    contents: [
      'What an absolutely wonderful day! The weather was perfect with clear blue skies and a gentle breeze. I spent the morning hiking in the mountains with my closest friends, and the views were breathtaking. We laughed so much during our picnic lunch, sharing stories and making new memories. In the evening, I had a heartwarming video call with my family who live across the country. Their support and love always remind me of what truly matters in life. I feel incredibly grateful for these meaningful connections and the simple joys that make life beautiful.',

      "Today was incredibly productive and fulfilling! I finally completed the major project I've been working on for weeks. The presentation went better than expected, and my team's positive feedback made all the hard work worthwhile. After work, I treated myself to a delicious dinner at my favorite restaurant and even tried a new dessert. The sense of accomplishment combined with self-care felt amazing. I'm learning to celebrate these victories, both big and small, as they contribute to my overall well-being and confidence.",

      'Spent the entire morning in nature, and it was exactly what my soul needed. I went for a long walk through the botanical gardens, taking time to appreciate the intricate details of different flowers and the peaceful sounds of birds chirping. The meditation session I did by the lake was deeply calming. In the afternoon, I visited the local farmers market and discovered some amazing organic produce. Cooking dinner with these fresh ingredients felt like a form of self-love. Nature has this incredible way of grounding me and reminding me to slow down and appreciate the present moment.',

      "Had the most meaningful conversation with my family today that lasted for hours. We talked about everything from childhood memories to future dreams, and I felt so connected and understood. My sister shared some exciting news about her career, and I felt genuinely happy for her success. We also discussed some challenges we're all facing and how we can support each other better. These deep, authentic conversations remind me why family bonds are so precious. I went to bed feeling loved, supported, and grateful for these relationships that have shaped who I am.",

      "Culinary adventures today! I decided to challenge myself by trying a completely new cuisine - Ethiopian food. The flavors were incredible, and I loved how the experience brought together different spices and textures I'd never encountered before. I even attempted to recreate one of the dishes at home, and while it wasn't perfect, the process was so enjoyable. Cooking has become my creative outlet and stress reliever. There's something therapeutic about chopping vegetables, experimenting with flavors, and creating something nourishing from scratch. Food truly is a universal language that brings people together.",

      "Finished reading an absolutely transformative book today that completely shifted my perspective on personal growth and resilience. The author's insights about embracing change and finding strength in vulnerability really resonated with me. I spent hours reflecting on how these concepts apply to my own life and relationships. The book also introduced me to some mindfulness techniques that I'm excited to incorporate into my daily routine. Reading has always been my escape and source of inspiration, and this particular book reminded me why I love learning and growing through literature.",

      "Had one of those perfectly productive days where everything just flowed naturally. I tackled my to-do list with focus and determination, completing tasks that had been lingering for weeks. The sense of accomplishment was incredibly satisfying. I also made time for a proper lunch break, which I often skip, and it made such a difference in my energy levels. In the evening, I organized my workspace and planned out the next week's priorities. There's something so satisfying about being organized and prepared. These productive days remind me that I'm capable of achieving my goals when I stay focused and take care of myself.",

      'Witnessed the most spectacular sunset tonight that took my breath away. I was walking along the beach when the sky transformed into a canvas of oranges, pinks, and purples. The way the light reflected off the water was absolutely magical. I sat there for nearly an hour, just watching the colors change and feeling completely present in the moment. These quiet, beautiful moments remind me to slow down and appreciate the natural wonders around us. Sometimes the most profound experiences come from simply being still and observant.',

      "Reconnected with an old friend today whom I hadn't seen in over two years. We met for coffee, and it was amazing how easily we fell back into our rhythm of conversation. We talked about everything that had happened in our lives, shared our struggles and triumphs, and laughed about old memories. It's incredible how some friendships can pick up exactly where they left off, as if no time had passed. This reunion reminded me of the importance of maintaining connections and how meaningful relationships can withstand distance and time. I left feeling grateful for this friendship and motivated to reach out to other people I care about.",

      "Had an incredible workout session today that left me feeling strong and energized! I tried a new fitness class that combined yoga and strength training, and it was exactly the challenge I needed. The instructor was amazing and really pushed us to our limits while maintaining a supportive environment. After the class, I felt this incredible endorphin rush and sense of accomplishment. Exercise has become such an important part of my mental health routine - it's not just about physical fitness, but about feeling capable, strong, and confident. I'm already looking forward to the next class and continuing this journey of self-improvement.",
    ],
  },
  {
    moods: [3], // Okay
    contents: [
      "Today was one of those perfectly average days where nothing particularly exciting happened, but nothing went wrong either. I went through my usual routine - work, lunch, some errands, and an evening walk. Sometimes I think we put too much pressure on ourselves to have extraordinary experiences every day. There's something peaceful about a day that just flows smoothly without any major ups or downs. I'm learning to appreciate these neutral days as much as the exciting ones, because they provide stability and balance in life.",

      "Had a pretty standard day at work today. I made progress on several projects, attended some meetings, and completed my usual tasks. Some things went smoothly, others required a bit more effort, but overall it was manageable. I'm realizing that not every workday needs to be groundbreaking or highly productive. Sometimes steady progress is exactly what's needed. I'm trying to be more patient with myself and accept that some days are just about maintaining momentum rather than achieving breakthroughs.",

      "Feeling a bit more tired than usual today, which might be due to the busy week I've had. I still managed to get through my responsibilities, but I definitely moved at a slower pace. I made sure to take more breaks and not push myself too hard. Sometimes our bodies need rest, and it's important to listen to those signals. I'm planning to get to bed early tonight and maybe do some light stretching to help my body relax. Self-care isn't just about the good days - it's especially important when we're feeling low on energy.",

      "Had some mixed emotions today that I'm still processing. There were moments when I felt content and other moments when I felt a bit restless. I think this is just part of being human - we don't always feel one way or another. I spent some time journaling about these feelings and trying to understand what might be causing the emotional fluctuations. Sometimes it's okay to not have everything figured out and to just sit with our feelings as they come and go.",

      "Today was uneventful but peaceful, which was actually exactly what I needed after a hectic few days. I spent most of the day at home, catching up on some reading, doing light housework, and just enjoying the quiet. I made a simple but delicious meal and watched a movie I'd been wanting to see. Sometimes the most restorative days are the ones where we don't do much at all. I'm learning to value these quiet, restful moments as much as the active, exciting ones.",

      "Had a bit of a lazy day today, and I'm trying not to feel guilty about it. I slept in, had a leisurely breakfast, and spent the afternoon doing things I enjoy without any particular agenda. I read, listened to music, and just relaxed. In our productivity-focused culture, it can feel wrong to have days where we don't accomplish much, but I think these rest days are essential for our mental health. Sometimes the most productive thing we can do is nothing at all.",

      "Work was busy but manageable today. I had several deadlines to meet, but I was able to stay focused and get everything done without feeling overwhelmed. I took short breaks throughout the day to stretch and clear my mind, which really helped maintain my energy levels. I'm learning that sustainable productivity comes from balance - working hard but also taking care of myself. It's about finding that sweet spot where I can be effective without burning out.",

      "Encountered some minor frustrations today, but nothing that I couldn't handle. There were a few small setbacks with a project I'm working on, and I had to adjust my approach. While it was a bit annoying, I reminded myself that these kinds of challenges are normal and part of the learning process. I took a step back, reassessed the situation, and came up with a new plan. Sometimes the best response to frustration is patience and flexibility.",

      "Feeling a bit indecisive about some choices I need to make, which is causing some internal tension. I have several options for how to proceed with a personal project, and I'm finding it difficult to commit to one direction. I think this indecision might be coming from a fear of making the wrong choice. I'm trying to remind myself that most decisions aren't permanent and that I can always adjust my course if needed. Sometimes the best approach is to make a decision and see how it feels.",

      "Today was just another ordinary day in the grand scheme of things. I went through my usual routines, had some conversations, completed some tasks, and generally kept moving forward. While it might not have been particularly memorable, there's something comforting about the predictability and stability of ordinary days. They provide the foundation that allows the extraordinary moments to stand out. I'm learning to find contentment in the simple, everyday experiences that make up most of our lives.",
    ],
  },
  {
    moods: [4, 5], // Not Good, Terrible
    contents: [
      "Had a really challenging day at work today that left me feeling overwhelmed and stressed. Multiple deadlines converged, and I felt like I was constantly putting out fires rather than making meaningful progress. The pressure was intense, and I found myself questioning my abilities and decisions. I'm trying to remember that difficult days are temporary and that this feeling of being overwhelmed will pass. I'm planning to take some time this evening to decompress and maybe talk to a friend about what I'm experiencing. Sometimes just acknowledging the struggle helps.",

      "Feeling quite anxious about some upcoming changes in my life, and it's affecting my sleep and overall mood. Change has always been difficult for me, even when it might ultimately be positive. I find myself worrying about all the things that could go wrong and feeling uncertain about the future. I'm trying to practice some breathing exercises and remind myself that anxiety is often about things that haven't happened yet. I know I need to take this one day at a time and be patient with myself as I navigate these transitions.",

      "Had a significant disagreement with someone important to me today, and it left me feeling upset and frustrated. We have very different perspectives on the issue, and the conversation became quite heated. I'm feeling hurt by some of the things that were said, and I'm also disappointed that we couldn't find common ground. I know that conflicts are a normal part of relationships, but they still feel terrible when they happen. I'm trying to process my feelings and think about how to move forward constructively.",

      "Feeling quite lonely today, which is strange because I was around people for most of the day. There's a difference between being alone and feeling lonely, and today I felt the latter. I had conversations with colleagues and acquaintances, but I didn't feel truly connected to anyone. It's times like these that I realize how important deep, meaningful relationships are for my well-being. I'm planning to reach out to a close friend or family member tomorrow to have a more substantial conversation.",

      "Struggled with a lot of negative thoughts today that seemed to spiral out of control. I found myself catastrophizing about various situations and feeling pessimistic about the future. These thought patterns are exhausting and make everything feel more difficult than it needs to be. I'm trying to challenge these thoughts and remind myself that my mind can be my own worst enemy sometimes. I'm planning to do some mindfulness exercises and maybe talk to someone about these persistent negative patterns.",

      "Feeling completely exhausted today, both physically and emotionally. It feels like I've been running on empty for days, and I'm starting to feel the effects. My body aches, my mind feels foggy, and I'm having trouble concentrating on even simple tasks. I think I've been pushing myself too hard and not taking adequate care of my basic needs. I need to prioritize rest, proper nutrition, and maybe some gentle movement. Sometimes the most important thing we can do is slow down and take care of ourselves.",

      "Experienced some significant setbacks today that left me feeling discouraged and questioning my direction. Things that I thought were going well suddenly took a turn for the worse, and I'm feeling like I'm back to square one. It's hard to maintain motivation when you feel like you're not making progress or when your efforts don't seem to be paying off. I'm trying to remind myself that setbacks are part of any journey and that they don't define my worth or potential. I need to be patient with myself as I work through this disappointment.",

      "Feeling completely overwhelmed by all the responsibilities and expectations I'm facing right now. It seems like every area of my life is demanding attention simultaneously, and I don't know where to start or how to manage it all. The to-do list feels endless, and I'm feeling paralyzed by the sheer volume of things that need to be done. I think I need to step back, prioritize what's most important, and maybe ask for help with some of these responsibilities. Sometimes the best thing we can do is admit when we're overwhelmed and seek support.",

      "Had one of those days where absolutely nothing seemed to go right. I woke up late, spilled coffee on my clothes, got stuck in traffic, and had technical difficulties with an important presentation. By the end of the day, I felt like the universe was conspiring against me. These kinds of days are incredibly frustrating and can make you feel like giving up. I'm trying to remember that bad days are temporary and that tomorrow is a fresh start. Sometimes we just have to ride out the storm and trust that better days are ahead.",

      "Feeling deeply sad today for reasons I can't quite pinpoint. There's no specific event that triggered this feeling, but I've been carrying this heavy sadness with me all day. It's one of those emotional states where everything feels a bit gray and muted. I know that emotions come and go, and that this sadness will eventually lift, but right now it feels quite overwhelming. I'm trying to be gentle with myself and allow myself to feel this emotion without judgment. Sometimes the best thing we can do is simply acknowledge our feelings and wait for them to pass.",
    ],
  },
]

// const moodLabels = {
//   1: 'Great',
//   2: 'Good',
//   3: 'Okay',
//   4: 'Not Good',
//   5: 'Terrible',
// }

export async function generateJournalEntries() {
  const entries = []
  const now = Date.now()
  const usedDates = new Set() // Track used dates to prevent duplicates

  // Generate exactly 40 days of entries - one per day
  for (let i = 0; i < 40; i++) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000)

    // Create date key for the day (YYYY-MM-DD format)
    const dateKey = date.toISOString().split('T')[0]

    // Skip if we already have an entry for this date
    if (usedDates.has(dateKey)) {
      continue
    }

    // Choose a mood category based on realistic patterns
    let moodCategory
    const rand = Math.random()
    if (rand < 0.4) {
      moodCategory = journalTemplates[0] // Good moods
    } else if (rand < 0.7) {
      moodCategory = journalTemplates[1] // Okay moods
    } else {
      moodCategory = journalTemplates[2] // Not good moods
    }

    // Select random mood and content - always include mood for daily entries
    const mood = moodCategory.moods[Math.floor(Math.random() * moodCategory.moods.length)]
    const content = moodCategory.contents[Math.floor(Math.random() * moodCategory.contents.length)]

    const entry = {
      mood: mood, // Always include mood for daily entries
      content: content, // Always include content for daily entries
      timestamp: date.getTime(),
      dateKey: dateKey, // Add date key for daily uniqueness
      id: `generated_${dateKey}_${date.getTime()}`,
    }

    entries.push(entry)
    usedDates.add(dateKey) // Mark this date as used

    // Add to local storage
    try {
      addLocalJournalEntry(entry)
    } catch (e) {
      console.warn('Failed to add journal entry to local storage:', e)
    }
  }

  console.log(`Generated ${entries.length} journal entries for the past 40 days`)
  return entries
}

// Auto-generate entries when this module is imported (for development)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  generateJournalEntries()
}
