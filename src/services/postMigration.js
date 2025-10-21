import { getFirestore, collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore'
import { firebaseConfig } from './firebaseService'
import { initializeApp, getApps, getApp } from 'firebase/app'

// Use existing Firebase app or initialize new one
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)

// Original posts data from blogService.js
const originalPosts = [
  {
    id: 1,
    title: "Understanding Anxiety in Young People: A Parent's Guide",
    author: 'Dr. Sarah Johnson',
    date: '15/12/2024',
    tags: ['Anxiety', 'Teenagers', 'Mental Health'],
    excerpt:
      'Anxiety is one of the most common mental health challenges facing young people today. In this comprehensive guide, we explore the signs and symptoms of anxiety in children and teenagers, common triggers, and evidence-based strategies for support. Learn how to recognize when your child might be struggling and discover practical ways to help them build resilience and coping skills.',
    reviews: 127,
    averageRating: 4.7,
    ratingCount: 127,
    userRating: 0,
    image: '57.jpg',
  },
  {
    id: 2,
    title: "Building Resilience: How to Bounce Back from Life's Challenges",
    author: 'Prof. Michael Chen',
    date: '12/12/2024',
    tags: ['Resilience', 'Coping Skills', 'Self-Care'],
    excerpt:
      "Resilience isn't about avoiding difficulties—it's about developing the skills to navigate them effectively. This article explores the science behind resilience and provides practical techniques for building mental strength. From developing a growth mindset to practicing self-compassion, discover how to cultivate resilience in yourself and support others in their journey.",
    reviews: 89,
    averageRating: 4.5,
    ratingCount: 89,
    userRating: 0,
    image: '102.jpg',
  },
  {
    id: 3,
    title: 'Digital Wellbeing: Finding Balance in a Connected World',
    author: 'Dr. Emily Rodriguez',
    date: '10/12/2024',
    tags: ['Digital Health', 'Work-Life Balance', 'Technology'],
    excerpt:
      'Technology has transformed how we live, work, and connect, but it also presents new challenges for our mental health. Learn about the impact of digital devices on our wellbeing and discover strategies for creating healthy boundaries with technology. From digital detox techniques to mindful social media use, find practical ways to maintain balance in our increasingly connected world.',
    reviews: 203,
    averageRating: 4.8,
    ratingCount: 203,
    userRating: 0,
    image: '108.jpg',
  },
  {
    id: 4,
    title: 'Supporting Your Child Through Mental Health Challenges',
    author: 'Dr. Lisa Thompson',
    date: '08/12/2024',
    tags: ['Parenting', 'Children', 'Support'],
    excerpt:
      "When your child is struggling with mental health challenges, it can feel overwhelming and isolating. This guide provides parents with practical advice on how to support their child's mental health journey. Learn about effective communication strategies, when to seek professional help, and how to take care of your own mental health while supporting your child.",
    reviews: 156,
    averageRating: 4.6,
    ratingCount: 156,
    userRating: 0,
    image: '112.jpg',
  },
  {
    id: 5,
    title: 'Mindfulness in Daily Life: Simple Practices for Better Mental Health',
    author: 'Sarah Williams',
    date: '05/12/2024',
    tags: ['Mindfulness', 'Self-Care', 'Techniques'],
    excerpt:
      "Mindfulness isn't just about meditation—it's a way of living that can transform your relationship with stress and anxiety. Discover simple mindfulness practices you can integrate into your daily routine, from mindful breathing exercises to present-moment awareness techniques. Learn how these practices can help reduce stress, improve focus, and enhance overall wellbeing.",
    reviews: 94,
    averageRating: 4.4,
    ratingCount: 94,
    userRating: 0,
    image: '125.jpg',
  },
  {
    id: 6,
    title: 'Breaking the Stigma: How to Talk About Mental Health',
    author: 'Dr. James Wilson',
    date: '03/12/2024',
    tags: ['Stigma', 'Awareness', 'Mental Health'],
    excerpt:
      'Mental health stigma remains one of the biggest barriers to people seeking help. This article explores how stigma affects individuals and communities, and provides practical strategies for challenging misconceptions about mental health. Learn how to have open, supportive conversations about mental health and contribute to creating a more understanding and compassionate society.',
    reviews: 178,
    averageRating: 4.9,
    ratingCount: 178,
    userRating: 0,
    image: '126.jpg',
  },
]

// Story content mapping
const storyContent = {
  1: {
    title: "My Personal Journey with Young People's Anxiety",
    content: `
      <h2>My Personal Journey</h2>
      <p>When I first started working with young people struggling with anxiety, I remember feeling overwhelmed by the complexity of their experiences. Each child was unique, each family had their own story, and I quickly realized that there was no one-size-fits-all approach to supporting them.</p>

      <p>I'll never forget Sarah, a bright 14-year-old who came to me after her parents noticed she was avoiding school. At first, she could barely speak about her feelings, but as we built trust, she began to share the racing thoughts that kept her up at night. "What if I fail my test? What if my friends think I'm weird? What if something bad happens to my family?" These worries consumed her, making even simple daily tasks feel impossible.</p>

      <h3>The Turning Point</h3>
      <p>What changed everything was when I started working with Sarah's parents, not just Sarah herself. I realized that anxiety doesn't exist in isolation—it affects the entire family system. Her parents were understandably worried and wanted to help, but their attempts to reassure her ("Don't worry, everything will be fine") were actually making things worse.</p>

      <p>Together, we developed a new approach. Instead of trying to eliminate anxiety entirely, we focused on helping Sarah understand that anxiety is a normal part of being human. We taught her practical techniques like deep breathing and mindfulness, but more importantly, we helped her parents learn how to support her without accidentally reinforcing her fears.</p>

      <h3>What I Learned</h3>
      <p>Through working with hundreds of families like Sarah's, I've discovered that the most effective approach combines professional knowledge with genuine empathy. Parents often feel guilty or helpless when their child is struggling, but the truth is that anxiety is incredibly common and treatable.</p>

      <p>The key is early intervention and creating a supportive environment where young people feel safe to express their fears. When we normalize anxiety and provide practical tools for managing it, we give young people the confidence they need to face their challenges head-on.</p>
    `,
  },
  2: {
    title: 'Building Resilience: My Own Story of Recovery',
    content: `
      <h2>My Personal Journey</h2>
      <p>I never thought I'd be the one writing about resilience. Five years ago, I was at my lowest point—I had lost my job, my relationship was falling apart, and I felt like I was drowning in failure. Every setback felt like a personal indictment, and I began to believe that I simply wasn't strong enough to handle life's challenges.</p>

      <p>It was during this dark period that I discovered the science of resilience. As a researcher, I had studied resilience in others, but I had never applied those principles to my own life. That realization changed everything.</p>

      <h3>The Science of Bouncing Back</h3>
      <p>What I learned through my research and personal experience is that resilience isn't about being immune to difficulties—it's about developing the skills to navigate them effectively. The most resilient people aren't those who never face challenges; they're the ones who have learned to adapt and grow through adversity.</p>

      <p>I began practicing what I preached. I developed a growth mindset, learning to see setbacks as opportunities for learning rather than evidence of failure. I practiced self-compassion, treating myself with the same kindness I would offer a friend in distress. And most importantly, I built a support network of people who could help me through difficult times.</p>

      <h3>Practical Techniques That Worked</h3>
      <p>Through my journey, I discovered several techniques that genuinely helped me build resilience:</p>

      <ul>
        <li><strong>Mindful self-reflection:</strong> Taking time each day to process my experiences without judgment</li>
        <li><strong>Gratitude practice:</strong> Focusing on what I had rather than what I had lost</li>
        <li><strong>Physical activity:</strong> Exercise became my anchor during difficult times</li>
        <li><strong>Creative expression:</strong> Writing and art helped me process my emotions</li>
      </ul>

      <p>Today, I'm not only surviving—I'm thriving. The challenges I faced became the foundation for my current success, and I'm passionate about helping others discover their own resilience.</p>
    `,
  },
  3: {
    title: 'Digital Wellbeing: My Struggle with Technology Addiction',
    content: `
      <h2>My Personal Journey</h2>
      <p>I'll never forget the moment I realized I had a problem with technology. It was 2 AM, and I was scrolling through social media for the third hour straight, even though I had an important presentation the next morning. My eyes were burning, my neck was stiff, and I felt completely disconnected from the real world around me.</p>

      <p>As a mental health professional, I was acutely aware of the irony. Here I was, helping others with their digital wellbeing while completely neglecting my own. That night was my wake-up call.</p>

      <h3>The Reality of Digital Addiction</h3>
      <p>What I discovered through my own experience is that digital addiction is incredibly subtle. It doesn't happen overnight—it's a gradual process where technology slowly becomes the center of your life. You start checking your phone first thing in the morning, spend hours on social media, and find yourself unable to focus on real-world interactions.</p>

      <p>I began tracking my screen time and was shocked to discover I was spending over 6 hours a day on my devices. That's when I decided to take action.</p>

      <h3>My Digital Detox Journey</h3>
      <p>I started with small changes: no phone in the bedroom, designated tech-free hours, and mindful social media use. The first few days were incredibly difficult—I felt anxious and disconnected. But gradually, I began to notice positive changes.</p>

      <p>I was sleeping better, my relationships improved, and I found myself more present in everyday moments. I rediscovered hobbies I had forgotten about and spent more quality time with friends and family.</p>

      <h3>Finding Balance</h3>
      <p>Today, I've found a healthy balance with technology. I still use digital tools for work and connection, but I'm much more intentional about how and when I use them. I've learned that technology is a tool, not a lifestyle.</p>

      <p>The key insight from my journey is that digital wellbeing isn't about completely eliminating technology—it's about using it mindfully and ensuring it serves your life rather than controlling it.</p>
    `,
  },
  4: {
    title: "Supporting My Child: A Parent's Perspective",
    content: `
      <h2>My Personal Journey</h2>
      <p>When my daughter Emma was diagnosed with anxiety at age 12, I felt completely unprepared. As a mental health professional, I had helped countless families navigate similar challenges, but nothing could have prepared me for the reality of supporting my own child through mental health struggles.</p>

      <p>Emma had always been a sensitive child, but her anxiety seemed to explode overnight. She began having panic attacks, refused to go to school, and became withdrawn from her friends. I felt helpless, guilty, and terrified that I was somehow failing as a parent.</p>

      <h3>The Reality of Parenting a Child with Mental Health Challenges</h3>
      <p>What I quickly learned is that supporting a child with mental health challenges is one of the most difficult and rewarding experiences a parent can have. It requires patience, education, and a willingness to acknowledge that you don't have all the answers.</p>

      <p>I had to learn to separate my professional knowledge from my parental instincts. While my training helped me understand what was happening, I had to develop new skills for supporting Emma as her mother, not just as a therapist.</p>

      <h3>Building a Support Network</h3>
      <p>One of the most important lessons I learned was the importance of building a support network. I couldn't do this alone, and I shouldn't have to. We found an excellent child therapist, connected with other parents facing similar challenges, and worked closely with Emma's school to ensure she had the support she needed.</p>

      <p>I also had to learn to take care of myself. Supporting a child with mental health challenges can be emotionally exhausting, and I realized that I needed to prioritize my own wellbeing to be the best parent I could be.</p>

      <h3>Celebrating Progress</h3>
      <p>Today, Emma is thriving. She still experiences anxiety, but she has developed the tools and confidence to manage it effectively. She's back in school, has reconnected with her friends, and is pursuing her interests with renewed enthusiasm.</p>

      <p>What I've learned through this journey is that mental health challenges don't define a child—they're just one part of who they are. With the right support, understanding, and love, children can learn to manage their challenges and lead fulfilling lives.</p>
    `,
  },
  5: {
    title: 'Mindfulness: How I Found Peace in a Chaotic World',
    content: `
      <h2>My Personal Journey</h2>
      <p>I used to think mindfulness was just another wellness trend—something that sounded good in theory but didn't really work in practice. I was a classic Type A personality: always rushing, always planning, always worrying about what was next. My mind was constantly racing, and I felt like I was living my life on autopilot.</p>

      <p>That all changed when I hit a breaking point. I was working 60-hour weeks, barely sleeping, and feeling completely disconnected from myself and the people around me. I knew something had to change, but I didn't know where to start.</p>

      <h3>My First Steps into Mindfulness</h3>
      <p>I started with just five minutes a day. Five minutes of sitting quietly, focusing on my breath, and trying to quiet my racing thoughts. Those first few weeks were incredibly difficult—my mind would wander constantly, and I often felt like I was wasting my time.</p>

      <p>But gradually, something shifted. I began to notice moments of calm throughout my day. I became more aware of my thoughts and emotions, and I started to respond to situations rather than react to them. It was like I was waking up to my own life.</p>

      <h3>Integrating Mindfulness into Daily Life</h3>
      <p>As my practice deepened, I began to explore different mindfulness techniques. I learned mindful walking, mindful eating, and even mindful communication. I discovered that mindfulness isn't just about meditation—it's a way of being present in every moment of your life.</p>

      <p>One of the most transformative practices for me was mindful breathing. Whenever I felt stressed or overwhelmed, I would take a few deep breaths and focus on the sensation of air moving in and out of my body. This simple practice helped me find calm in the midst of chaos.</p>

      <h3>The Ripple Effect</h3>
      <p>As I became more mindful, I noticed positive changes in all areas of my life. My relationships improved because I was more present and attentive. My work became more focused and productive. I slept better and felt more energized throughout the day.</p>

      <p>Most importantly, I developed a deeper sense of peace and contentment. I learned to appreciate the simple moments in life—a cup of tea, a walk in nature, a conversation with a friend. I realized that happiness isn't about achieving some future goal—it's about being fully present in the here and now.</p>

      <p>Today, mindfulness is an integral part of my life. It's not always easy, and I still have days when my mind feels scattered and chaotic. But I know that I have the tools to find my center again, no matter what life throws my way.</p>
    `,
  },
  6: {
    title: 'Breaking the Stigma: My Mission to Change the Conversation',
    content: `
      <h2>My Personal Journey</h2>
      <p>I never planned to become an advocate for mental health awareness. In fact, for most of my career, I kept my own struggles with depression private, fearing that sharing my story would damage my professional reputation or make people see me differently.</p>

      <p>That changed when I lost a close friend to suicide. In the aftermath of his death, I realized that our silence around mental health was literally killing people. I decided that I could no longer stay quiet about something that affects so many of us.</p>

      <h3>The Power of Personal Stories</h3>
      <p>When I first started sharing my own experiences with depression, I was terrified. I worried that people would judge me, that my colleagues would question my competence, or that my patients would lose trust in me. But what actually happened was the opposite.</p>

      <p>People began opening up to me about their own struggles. Colleagues shared their experiences with anxiety and burnout. Patients felt more comfortable discussing their mental health challenges. I realized that by being vulnerable, I was giving others permission to be vulnerable too.</p>

      <h3>Changing the Conversation</h3>
      <p>I began to see that stigma isn't just about discrimination—it's about the internalized shame that prevents people from seeking help. When we treat mental health challenges as something to be hidden or ashamed of, we create barriers to treatment and recovery.</p>

      <p>I started speaking at conferences, writing articles, and working with organizations to promote mental health awareness. I learned that the most effective way to combat stigma is through education, empathy, and personal connection.</p>

      <h3>The Impact of Open Dialogue</h3>
      <p>Over the years, I've seen incredible changes in how we talk about mental health. More people are seeking help, more organizations are prioritizing mental health support, and more individuals are feeling comfortable sharing their stories.</p>

      <p>But there's still so much work to be done. Mental health stigma persists in many communities, and access to care remains a significant challenge for many people. That's why I continue to speak out and share my story.</p>

      <p>My hope is that by normalizing conversations about mental health, we can create a world where seeking help is seen as a sign of strength, not weakness. Where people feel supported and understood, rather than isolated and ashamed.</p>

      <p>Every time someone shares their story, every time we have an open conversation about mental health, we're taking a step toward a more compassionate and understanding world. And that's a mission worth fighting for.</p>
    `,
  },
}

// Migration function
export const migratePostsToFirestore = async () => {
  try {
    console.log('🚀 Starting posts migration to Firestore...')

    // Check if posts already exist in Firestore
    const existingPosts = await getDocs(collection(db, 'posts'))
    if (!existingPosts.empty) {
      console.log('📝 Posts already exist in Firestore, skipping migration')
      return { success: true, message: 'Posts already migrated' }
    }

    // Migrate each post
    for (const post of originalPosts) {
      const postData = {
        title: post.title,
        author: post.author,
        authorId: 'admin', // Default author ID for migrated posts
        excerpt: post.excerpt,
        content: storyContent[post.id]?.content || '',
        tags: post.tags,
        image: post.image,
        reviews: post.reviews,
        averageRating: post.averageRating,
        ratingCount: post.ratingCount,
        status: 'published',
        featured: false,
        createdAt: new Date(post.date.split('/').reverse().join('-')), // Convert DD/MM/YYYY to Date
        updatedAt: new Date(),
        publishedAt: new Date(post.date.split('/').reverse().join('-')),
      }

      // Add post to Firestore
      await addDoc(collection(db, 'posts'), postData)
      console.log(`✅ Migrated post: ${post.title}`)
    }

    console.log('🎉 Posts migration completed successfully!')
    return { success: true, message: 'Posts migrated successfully' }
  } catch (error) {
    console.error('❌ Error migrating posts:', error)
    return { success: false, message: error.message }
  }
}

// Function to check if migration is needed
export const checkMigrationStatus = async () => {
  try {
    const existingPosts = await getDocs(collection(db, 'posts'))
    return {
      needsMigration: existingPosts.empty,
      postCount: existingPosts.size,
    }
  } catch (error) {
    console.error('Error checking migration status:', error)
    return { needsMigration: true, postCount: 0 }
  }
}
