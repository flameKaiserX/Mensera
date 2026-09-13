import type { EducationalArticle } from '../types';

export const EDUCATIONAL_ARTICLES: EducationalArticle[] = [
  {
    id: 'what-is-menstrual-cycle',
    title: 'What Is a Menstrual Cycle?',
    readTime: '3 min read',
    category: 'Biology',
    preview:
      'The menstrual cycle is a monthly biological dance coordinated between your brain, ovaries, and uterus — far more than just your period.',
    iconName: 'Sparkles',
    sections: [
      {
        heading: 'More Than Just Bleeding',
        body: 'The menstrual cycle is a continuous, beautiful hormonal rhythm governed by the hypothalamic-pituitary-ovarian (HPO) axis. While many think of it only as "that week of bleeding," menstruation is merely day one of a 24 to 35-day internal journey.',
        highlights: [
          'Average healthy cycle duration is between 24 and 35 days.',
          'Day 1 is always the first day of full menstrual bleeding (not light spotting).',
          'It prepares your body for potential reproduction, but also maintains bone density, heart health, and mental vitality.',
        ],
      },
      {
        heading: 'The Natural Rhythm',
        body: 'Just like the circadian rhythm governs your 24-hour sleep-wake cycle, your infradian rhythm governs your ~28-day hormonal shifts. Understanding this clock allows you to work with your natural physiology instead of constantly pushing against it.',
      },
    ],
    keyTakeaway:
      'Your cycle is a vital health indicator — often called the "fifth vital sign" by physicians.',
  },
  {
    id: 'four-phases-explained',
    title: 'The 4 Phases Explained',
    readTime: '5 min read',
    category: 'Biology',
    preview:
      'Discover the four distinct hormonal landscapes: Menstrual, Follicular, Ovulation, and Luteal.',
    iconName: 'Activity',
    sections: [
      {
        heading: 'Phase 1: Menstrual (Days 1–5)',
        body: 'Both estrogen and progesterone drop to their lowest levels, prompting the uterine lining (endometrium) to shed. Energy can be lower, and your body focuses on renewal and cellular recovery.',
      },
      {
        heading: 'Phase 2: Follicular (Days 6–12)',
        body: 'Follicle-Stimulating Hormone (FSH) prompts several follicles in your ovaries to mature, which produce increasing amounts of estrogen. Estrogen boosts serotonin, tissue repair, insulin sensitivity, and mood.',
      },
      {
        heading: 'Phase 3: Ovulation (Days 13–15)',
        body: 'A sharp surge in Luteinizing Hormone (LH) triggers the release of a mature egg from the dominant follicle into the fallopian tube. Estrogen peaks, often conferring high energy, confidence, and strength.',
      },
      {
        heading: 'Phase 4: Luteal (Days 16–28)',
        body: 'The empty follicle becomes the corpus luteum, pumping out progesterone. In the early luteal phase, workouts remain strong. In the late luteal phase (PMS), declining hormones may cause bloating, fatigue, or mood sensitivity.',
      },
    ],
    keyTakeaway:
      'Each phase provides unique biological strengths — from restorative renewal to peak physical power.',
  },
  {
    id: 'hormones-guide',
    title: 'What Do Your Hormones Actually Do?',
    readTime: '4 min read',
    category: 'Biology',
    preview:
      'Meet the key players: Estrogen, Progesterone, LH, and FSH, and how they dictate energy and recovery.',
    iconName: 'Flame',
    sections: [
      {
        heading: 'Estrogen: The Anabolic Energizer',
        body: 'Estrogen promotes muscle protein synthesis, enhances carbohydrate uptake into muscles, supports tendon stiffness and power transfer, and enhances dopamine and serotonin in the brain.',
        highlights: [
          'High in late follicular and ovulation.',
          'Supports faster muscle recovery between sets.',
          'Enhances mood and cognitive focus.',
        ],
      },
      {
        heading: 'Progesterone: The Calming Incubator',
        body: 'Dominant after ovulation, progesterone elevates basal body temperature by ~0.5°F, increases resting metabolic rate, and promotes deep relaxation via GABA receptors. However, it can also increase protein breakdown and fluid retention.',
        highlights: [
          'Slightly elevates calorie expenditure by 100–300 kcal/day.',
          'Can cause slight joint laxity and higher perceived exertion.',
        ],
      },
      {
        heading: 'FSH & LH: The Master Regulators',
        body: 'Released by the anterior pituitary gland in the brain, FSH recruits follicles early in the cycle, while the LH surge triggers the ovulation event itself.',
      },
    ],
    keyTakeaway:
      'Hormones are chemical messengers designed to optimize your physiology, not sabotage your fitness.',
  },
  {
    id: 'why-periods-happen',
    title: 'Why Periods Happen: The Uterine Cycle',
    readTime: '3 min read',
    category: 'Biology',
    preview:
      'Understanding the endometrium, shedding, prostaglandins, and what normal menstrual flow looks like.',
    iconName: 'Droplets',
    sections: [
      {
        heading: 'The Endometrium & Cleansing',
        body: 'Each month, the inner lining of the uterus builds up a thick, blood-vessel-rich bed ready to nurture a fertilized egg. When fertilization does not occur, the corpus luteum dissolves, estrogen and progesterone drop, and this lining releases naturally.',
      },
      {
        heading: 'What Causes Cramps?',
        body: 'Prostaglandins are hormone-like lipid compounds produced by the uterine lining. They trigger muscular contractions to help shed the tissue. Higher levels of prostaglandins lead to more intense cramping.',
        highlights: [
          'Mild cramping is common; disabling, debilitating pain is NOT normal.',
          'Hydration, magnesium, warmth, and light movement help reduce prostaglandin-induced spasms.',
        ],
      },
    ],
    keyTakeaway:
      'Menstruation is a natural biological reset that clears the slate for a brand new cycle.',
  },
  {
    id: 'what-is-ovulation',
    title: 'What Is Ovulation? The Centerpiece',
    readTime: '4 min read',
    category: 'Biology',
    preview:
      'Why ovulation is the true physiological event of the cycle, and why cycle timing can vary month to month.',
    iconName: 'Sun',
    sections: [
      {
        heading: 'The Main Event',
        body: 'Biologically speaking, ovulation is the main event of the menstrual cycle — menstruation is merely the biological consequence of an unfertilized ovum. Ovulation is essential for producing natural progesterone, which protects bones, breasts, and brain health.',
      },
      {
        heading: 'Why Cycle Timing Varies',
        body: 'While the luteal phase (post-ovulation) is relatively fixed at 12–14 days, the follicular phase (pre-ovulation) is flexible. Travel, psychological stress, intense training, or illness can easily delay ovulation, which is why cycle lengths naturally fluctuate.',
      },
    ],
    keyTakeaway:
      'Ovulation is not just about fertility — it is the master switch that regulates your monthly hormonal balance.',
  },
  {
    id: 'understanding-pms',
    title: 'Understanding PMS: Compassion & Science',
    readTime: '4 min read',
    category: 'Wellness',
    preview:
      'Why premenstrual symptoms happen, how to manage water retention, cravings, and mood changes gently.',
    iconName: 'Moon',
    sections: [
      {
        heading: 'The Late Luteal Shift',
        body: 'In the 5 to 7 days before your period, both estrogen and progesterone experience a steep decline if pregnancy does not occur. This hormonal withdrawal impacts neurotransmitters like serotonin, which can influence mood, cravings, and sleep.',
      },
      {
        heading: 'Why You Crave Carbohydrates',
        body: 'Your resting metabolic rate rises slightly during the luteal phase, burning an extra 100 to 300 calories per day! Furthermore, your brain seeks carbohydrates to stimulate serotonin production. Honoring this hunger with complex carbohydrates (oats, sweet potatoes, fruits) satisfies cravings without energy crashes.',
      },
    ],
    keyTakeaway:
      'Premenstrual cravings and mood dips are physiological responses to hormone shifts — treat yourself with grace.',
  },
  {
    id: 'exercise-during-period',
    title: 'Can You Exercise During Your Period?',
    readTime: '4 min read',
    category: 'Fitness',
    preview:
      'Yes! But how you train should depend on how you personally feel — never rigid rules.',
    iconName: 'Dumbbell',
    sections: [
      {
        heading: 'The Freedom to Choose',
        body: 'A widespread myth suggests women should never lift or do intense exercise during their period. In reality, hormones are low and steady, which for many women creates an excellent metabolic environment for exercise. However, uterine cramping and low energy are real physical sensations.',
        highlights: [
          'If you feel energetic: Lifting, sprinting, and regular workouts are completely safe.',
          'If you feel cramping or fatigue: Gentle walking, mobility, or total rest is the best choice.',
          'Movement releases endorphins, which can naturally reduce menstrual cramping pain.',
        ],
      },
      {
        heading: 'Adjust, Don’t Quit',
        body: 'Modifying a workout from a 90-minute heavy session to a 25-minute mobility flow is not a failure — it is athletic intelligence. You are building lifelong consistency.',
      },
    ],
    keyTakeaway:
      'You are never required to suffer through a workout, nor are you banned from lifting heavy. Listen to your body today.',
  },
  {
    id: 'gym-performance-changes',
    title: 'Why Might Gym Performance Change?',
    readTime: '5 min read',
    category: 'Fitness',
    preview:
      'Explaining why a 135 lb squat feels effortless on Day 12 but heavy on Day 26.',
    iconName: 'TrendingUp',
    sections: [
      {
        heading: 'Body Temperature & Perceived Exertion',
        body: 'In the luteal phase, elevated progesterone increases your core body temperature by 0.3°C–0.5°C and increases ventilation rates. This means the exact same weight or running pace will feel harder (higher RPE) even though your muscles haven’t gotten weaker!',
      },
      {
        heading: 'Fluid Dynamics & Glycogen',
        body: 'Estrogen enhances muscle glycogen storage, making workouts in the follicular phase feel springy. In contrast, late luteal fluid shifts can cause bloating and make joints feel slightly stiffer.',
        highlights: [
          'Your strength has not disappeared — your nervous system is dealing with extra regulatory work.',
          'Adjust weights by 5–10% or reduce total sets on high-symptom days.',
        ],
      },
    ],
    keyTakeaway:
      'Temporary performance dips are biological fluctuations, not lost progress.',
  },
  {
    id: 'myths-vs-facts',
    title: 'Period & Fitness Myths vs Facts',
    readTime: '4 min read',
    category: 'Myths',
    preview:
      'Debunking 8 common misconceptions about women’s cycles, training, and nutrition.',
    iconName: 'CheckCircle2',
    sections: [
      {
        heading: 'Myth 1: Every cycle is 28 days',
        body: 'Fact: Only about 13% of women have exact 28-day cycles. Anything between 24 and 35 days is clinically normal.',
      },
      {
        heading: 'Myth 2: Women are physically weak during their period',
        body: 'Fact: Many Olympic and world-record athletic performances happen during menstruation. It depends entirely on individual symptoms and energy.',
      },
      {
        heading: 'Myth 3: Severe, debilitating pain is just part of being a woman',
        body: 'Fact: Disabling cramps that prevent school, work, or daily life are a medical red flag and should be evaluated by a healthcare professional.',
      },
      {
        heading: 'Myth 4: You must do high intensity during ovulation',
        body: 'Fact: Ovulation creates high physiological potential, but some women experience pelvic twinges (mittelschmerz) or fatigue. Personal experience always trumps generic averages.',
      },
    ],
    keyTakeaway:
      'Knowing the facts frees you from guilt and outdated stereotypes.',
  },
  {
    id: 'when-to-seek-advice',
    title: 'When Should I Speak to a Healthcare Professional?',
    readTime: '4 min read',
    category: 'Medical',
    preview:
      'Important red flags, conditions like PCOS and endometriosis, and how to advocate for yourself.',
    iconName: 'ShieldAlert',
    sections: [
      {
        heading: 'Red Flags That Warrant Evaluation',
        body: 'While cycles naturally have variability, certain symptoms require professional medical assessment from an OB/GYN or general practitioner.',
        highlights: [
          'Soaking through one or more pads or tampons every hour for several consecutive hours.',
          'Severe pelvic pain that does not respond to standard OTC medication or prevents normal activity.',
          'Bleeding between periods or bleeding after sexual intercourse.',
          'Cycles consistently shorter than 21 days or longer than 38 days.',
          'Periods that suddenly stop for 3+ months (secondary amenorrhea).',
          'Fainting, extreme dizziness, or signs of severe anemia.',
        ],
      },
      {
        heading: 'Conditions Worth Discussing',
        body: 'Conditions such as Endometriosis, Polycystic Ovary Syndrome (PCOS), Adenomyosis, or Fibroids affect millions of women and have effective medical management plans.',
      },
    ],
    keyTakeaway:
      'This app is for educational wellness. Always seek qualified medical guidance for diagnosis or severe symptoms.',
  },
];
