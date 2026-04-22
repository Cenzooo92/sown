import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'
import Habits from './Habits'
import Insights from './Insights'
import Upgrade from './Upgrade'
import History from './History'
import Goals from './Goals'
import Garden from './Garden'
import Profile from './Profile'

const quotes = [
  { text: "Gratitude turns what we have into enough.", author: "Melody Beattie" },
  { text: "Start each day with a grateful heart.", author: "Unknown" },
  { text: "Joy is the simplest form of gratitude.", author: "Karl Barth" },
  { text: "When you are grateful, fear disappears.", author: "Anthony Robbins" },
  { text: "Enough is a feast.", author: "Buddhist proverb" },
  { text: "What you appreciate, appreciates.", author: "Lynne Twist" },
  { text: "Gratitude is the fairest blossom from the soul.", author: "Henry Ward Beecher" },
  { text: "The root of joy is gratefulness.", author: "David Steindl-Rast" },
  { text: "Gratitude is the sign of noble souls.", author: "Aesop" },
  { text: "Wear gratitude like a cloak and it will feed every corner of your life.", author: "Rumi" },
  { text: "Gratitude makes sense of our past, brings peace for today, and creates a vision for tomorrow.", author: "Melody Beattie" },
  { text: "When we give cheerfully and accept gratefully, everyone is blessed.", author: "Maya Angelou" },
  { text: "Gratitude is not only the greatest of virtues but the parent of all others.", author: "Cicero" },
  { text: "Be thankful for what you have; you'll end up having more.", author: "Oprah Winfrey" },
  { text: "Gratitude can transform common days into thanksgivings.", author: "William Arthur Ward" },
  { text: "Feeling gratitude and not expressing it is like wrapping a present and not giving it.", author: "William Arthur Ward" },
  { text: "Acknowledging the good that you already have in your life is the foundation for all abundance.", author: "Eckhart Tolle" },
  { text: "Let us be grateful to the people who make us happy.", author: "Marcel Proust" },
  { text: "There is always something to be grateful for.", author: "Rhonda Byrne" },
  { text: "Enjoy the little things, for one day you may look back and realize they were the big things.", author: "Robert Brault" },
  { text: "A grateful heart is a magnet for miracles.", author: "Unknown" },
  { text: "The more grateful I am, the more beauty I see.", author: "Mary Davis" },
  { text: "Silent gratitude isn't much use to anyone.", author: "Gladys Stern" },
  { text: "If you want to find happiness, find gratitude.", author: "Steve Maraboli" },
  { text: "Happiness is itself a kind of gratitude.", author: "Joseph Wood Krutch" },
  { text: "Gratitude is the memory of the heart.", author: "Jean Baptiste Massieu" },
  { text: "When you arise in the morning, think of what a precious privilege it is to be alive.", author: "Marcus Aurelius" },
  { text: "Gratitude is a powerful catalyst for happiness.", author: "Amy Collette" },
  { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
  { text: "Every day may not be good, but there is something good in every day.", author: "Alice Morse Earle" },
  { text: "When I started counting my blessings, my whole life turned around.", author: "Willie Nelson" },
  { text: "Gratitude is the healthiest of all human emotions.", author: "Zig Ziglar" },
  { text: "Appreciate what you have before it becomes what you had.", author: "Unknown" },
  { text: "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.", author: "Epictetus" },
  { text: "Cultivate the habit of being grateful for every good thing that comes to you.", author: "Ralph Waldo Emerson" },
  { text: "Do not spoil what you have by desiring what you have not.", author: "Epicurus" },
  { text: "The deepest craving of human nature is the need to be appreciated.", author: "William James" },
  { text: "Let gratitude be the pillow upon which you kneel to say your nightly prayer.", author: "Maya Angelou" },
  { text: "Be present in all things and thankful for all things.", author: "Maya Angelou" },
  { text: "There is a calmness to a life lived in gratitude, a quiet joy.", author: "Ralph H. Blum" },
  { text: "We often take for granted the very things that most deserve our gratitude.", author: "Cynthia Ozick" },
  { text: "Reflect upon your present blessings, of which every man has many.", author: "Charles Dickens" },
  { text: "What separates privilege from entitlement is gratitude.", author: "Brené Brown" },
  { text: "Gratitude is the wine for the soul. Go on. Get drunk.", author: "Rumi" },
  { text: "The more you praise and celebrate your life, the more there is in life to celebrate.", author: "Oprah Winfrey" },
  { text: "Yesterday is history, tomorrow is a mystery, today is a gift.", author: "Eleanor Roosevelt" },
  { text: "Walk as if you are kissing the Earth with your feet.", author: "Thich Nhat Hanh" },
  { text: "We can only be said to be alive in those moments when our hearts are conscious of our treasures.", author: "Thornton Wilder" },
  { text: "Enough is abundance to the wise.", author: "Euripides" },
  { text: "Grace and gratitude belong together like heaven and earth.", author: "Karl Barth" },
  { text: "Gratitude is the most exquisite form of courtesy.", author: "Jacques Maritain" },
  { text: "When eating fruit, remember the one who planted the tree.", author: "Vietnamese Proverb" },
  { text: "Gratitude is when memory is stored in the heart and not in the mind.", author: "Lionel Hampton" },
  { text: "I awoke this morning with devout thanksgiving for my friends.", author: "Ralph Waldo Emerson" },
  { text: "In everything give thanks.", author: "1 Thessalonians 5:18" },
  { text: "No act of kindness, no matter how small, is ever wasted.", author: "Aesop" },
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act but a habit.", author: "Aristotle" },
  { text: "Happiness depends upon ourselves.", author: "Aristotle" },
  { text: "Know thyself.", author: "Socrates" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "Spread love everywhere you go.", author: "Mother Teresa" },
  { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
  { text: "Always remember that you are absolutely unique.", author: "Margaret Mead" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
  { text: "You will face many defeats in life, but never let yourself be defeated.", author: "Maya Angelou" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Tell me, what is it you plan to do with your one wild and precious life?", author: "Mary Oliver" },
  { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" },
  { text: "To love and be loved is to feel the sun from both sides.", author: "David Viscott" },
  { text: "Darkness cannot drive out darkness; only light can do that.", author: "Martin Luther King Jr." },
  { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Our greatest weakness lies in giving up.", author: "Thomas Edison" },
  { text: "You have brains in your head. You have feet in your shoes.", author: "Dr. Seuss" },
  { text: "If life were predictable it would cease to be life.", author: "Eleanor Roosevelt" },
  { text: "If you look at what you have in life, you'll always have more.", author: "Oprah Winfrey" },
  { text: "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.", author: "James Cameron" },
  { text: "Life is not measured by the number of breaths we take, but by the moments that take our breath away.", author: "Maya Angelou" },
  { text: "If you want to live a happy life, tie it to a goal, not to people or things.", author: "Albert Einstein" },
  { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth" },
  { text: "Money and success don't change people; they merely amplify what is already there.", author: "Will Smith" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Not how long, but how well you have lived is the main thing.", author: "Seneca" },
  { text: "If you judge people, you have no time to love them.", author: "Mother Teresa" },
  { text: "I have learned that people will forget what you said, but people will never forget how you made them feel.", author: "Maya Angelou" },
  { text: "The best and most beautiful things in the world cannot be seen or even touched — they must be felt with the heart.", author: "Helen Keller" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Whoever is happy will make others happy too.", author: "Anne Frank" },
  { text: "Do not let making a living prevent you from making a life.", author: "John Wooden" },
  { text: "To handle yourself, use your head; to handle others, use your heart.", author: "Eleanor Roosevelt" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Too many of us are not living our dreams because we are living our fears.", author: "Les Brown" },
  { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't judge each day by the harvest you reap but by the seeds that you plant.", author: "Robert Louis Stevenson" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
  { text: "Change your thoughts and you change your world.", author: "Norman Vincent Peale" },
  { text: "Either write something worth reading or do something worth writing.", author: "Benjamin Franklin" },
  { text: "Nothing is impossible. The word itself says I'm possible.", author: "Audrey Hepburn" },
  { text: "The best preparation for tomorrow is doing your best today.", author: "H. Jackson Brown Jr." },
  { text: "You can't use up creativity. The more you use, the more you have.", author: "Maya Angelou" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
  { text: "I am not a product of my circumstances. I am a product of my decisions.", author: "Stephen Covey" },
  { text: "Every child is an artist. The problem is how to remain an artist once we grow up.", author: "Pablo Picasso" },
  { text: "You can never cross the ocean until you have the courage to lose sight of the shore.", author: "Christopher Columbus" },
  { text: "I've learned that I still have a lot to learn.", author: "Maya Angelou" },
  { text: "It is never too late to be what you might have been.", author: "George Eliot" },
  { text: "You become what you believe.", author: "Oprah Winfrey" },
  { text: "The most common form of despair is not being who you are.", author: "Søren Kierkegaard" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "Go confidently in the direction of your dreams. Live the life you have imagined.", author: "Henry David Thoreau" },
  { text: "When one door of happiness closes, another opens.", author: "Helen Keller" },
  { text: "Life is 10% what happens to me and 90% of how I react to it.", author: "Charles Swindoll" },
  { text: "The most wasted of days is one without laughter.", author: "E. E. Cummings" },
  { text: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "If you're offered a seat on a rocket ship, don't ask what seat. Just get on.", author: "Sheryl Sandberg" },
  { text: "First, have a definite, clear practical ideal — a goal, an objective.", author: "Aristotle" },
  { text: "Life shrinks or expands in proportion to one's courage.", author: "Anaïs Nin" },
  { text: "If you hear a voice within you say you cannot paint, then by all means paint and that voice will be silenced.", author: "Vincent Van Gogh" },
  { text: "There is only one way to avoid criticism: do nothing, say nothing, and be nothing.", author: "Aristotle" },
  { text: "Ask and it will be given to you; search, and you will find.", author: "Jesus of Nazareth" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Happiness is not the absence of problems; it's the ability to deal with them.", author: "Steve Maraboli" },
  { text: "Love the life you live. Live the life you love.", author: "Bob Marley" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
  { text: "Get busy living or get busy dying.", author: "Stephen King" },
  { text: "You have power over your mind, not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "Too many of us are not living our dreams because we are living our fears.", author: "Les Brown" },
  { text: "Definiteness of purpose is the starting point of all achievement.", author: "W. Clement Stone" },
  { text: "We must embrace pain and burn it as fuel for our journey.", author: "Kenji Miyazawa" },
  { text: "Limitations live only in our minds. But if we use our imaginations, our possibilities become limitless.", author: "Jamie Paolinetti" },
  { text: "Challenges are what make life interesting and overcoming them is what makes life meaningful.", author: "Joshua J. Marine" },
  { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
  { text: "I would rather die of passion than of boredom.", author: "Vincent Van Gogh" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { text: "The secret of health for both mind and body is not to mourn for the past, not to worry about the future, but to live the present moment wisely.", author: "Buddha" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
  { text: "The best revenge is massive success.", author: "Frank Sinatra" },
  { text: "People often say that motivation doesn't last. Well, neither does bathing — that's why we recommend it daily.", author: "Zig Ziglar" },
  { text: "Life is short, and it is here to be lived.", author: "Kate Winslet" },
  { text: "Whatever the mind of man can conceive and believe, it can achieve.", author: "Napoleon Hill" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "Two roads diverged in a wood, and I — I took the one less traveled by.", author: "Robert Frost" },
  { text: "I attribute my success to this: I never gave or took any excuse.", author: "Florence Nightingale" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "An unexamined life is not worth living.", author: "Socrates" },
  { text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa" },
  { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
  { text: "Perfection is not attainable, but if we chase perfection we can catch excellence.", author: "Vince Lombardi" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "We become what we think about.", author: "Earl Nightingale" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "The two most important days in your life are the day you are born and the day you find out why.", author: "Mark Twain" },
  { text: "Whatever you can do, or dream you can, begin it. Boldness has genius, power and magic in it.", author: "Johann Wolfgang von Goethe" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "An unexamined life is not worth living.", author: "Socrates" },
  { text: "Eighty percent of success is showing up.", author: "Woody Allen" },
  { text: "I am not a product of my circumstances. I am a product of my decisions.", author: "Stephen Covey" },
  { text: "Every strike brings me closer to the next home run.", author: "Babe Ruth" },
  { text: "Definiteness of purpose is the starting point of all achievement.", author: "W. Clement Stone" },
  { text: "Life isn't about getting and having, it's about giving and being.", author: "Kevin Kruse" },
  { text: "Life is what we make it, always has been, always will be.", author: "Grandma Moses" },
  { text: "The most difficult thing is the decision to act, the rest is merely tenacity.", author: "Amelia Earhart" },
  { text: "How wonderful it is that nobody need wait a single moment before starting to improve the world.", author: "Anne Frank" },
  { text: "Few things in the world are more powerful than a positive push.", author: "Richard M. DeVos" },
  { text: "Build your own dreams, or someone else will hire you to build theirs.", author: "Farrah Gray" },
  { text: "Remember that not getting what you want is sometimes a wonderful stroke of luck.", author: "Dalai Lama" },
  { text: "You can't connect the dots looking forward; you can only connect them looking backwards.", author: "Steve Jobs" },
  { text: "We must balance conspicuous consumption with conscious capitalism.", author: "Kevin Kruse" },
  { text: "The heart that gives, gathers.", author: "Tao Te Ching" },
  { text: "Real generosity toward the future lies in giving all to the present.", author: "Albert Camus" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "It is not length of life, but depth of life.", author: "Ralph Waldo Emerson" },
  { text: "No medicine cures what happiness cannot.", author: "Gabriel García Márquez" },
  { text: "One must always be careful of blessings and gratitude — they too often become weapons.", author: "Cassandra Clare" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson" },
  { text: "The good life is one inspired by love and guided by knowledge.", author: "Bertrand Russell" },
  { text: "The secret of success is learning how to use pain and pleasure instead of having pain and pleasure use you.", author: "Tony Robbins" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "A hero is somebody who voluntarily walks into the unknown.", author: "Tom Hanks" },
  { text: "Nothing will work unless you do.", author: "Maya Angelou" },
  { text: "I alone cannot change the world, but I can cast a stone across the water to create many ripples.", author: "Mother Teresa" },
  { text: "It's not what you look at that matters, it's what you see.", author: "Henry David Thoreau" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Blessed are those who give without remembering and take without forgetting.", author: "Elizabeth Bibesco" },
  { text: "A kind word is like a spring day.", author: "Russian Proverb" },
  { text: "There is more hunger for love and appreciation in this world than for bread.", author: "Mother Teresa" },
  { text: "Happiness is a warm puppy.", author: "Charles M. Schulz" },
  { text: "Even the darkest night will end and the sun will rise.", author: "Victor Hugo" },
  { text: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "We accept the love we think we deserve.", author: "Stephen Chbosky" },
  { text: "One day or day one. You decide.", author: "Unknown" },
  { text: "Begin anywhere.", author: "John Cage" },
  { text: "Small things done with great love will change the world.", author: "Mother Teresa" },
  { text: "The quieter you become, the more you can hear.", author: "Ram Dass" },
  { text: "Wherever you are, be all there.", author: "Jim Elliot" },
  { text: "Choose a job you love, and you will never have to work a day in your life.", author: "Confucius" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
  { text: "A bird doesn't sing because it has an answer; it sings because it has a song.", author: "Maya Angelou" },
  { text: "What we think, we become.", author: "Buddha" },
  { text: "Real change, enduring change, happens one step at a time.", author: "Ruth Bader Ginsburg" },
  { text: "Never doubt that a small group of thoughtful, committed citizens can change the world.", author: "Margaret Mead" },
  { text: "We do not need magic to transform our world. We carry all the power we need inside ourselves already.", author: "J.K. Rowling" },
  { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { text: "Limitations live only in our minds.", author: "Jamie Paolinetti" },
  { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "You can't go back and change the beginning, but you can start where you are and change the ending.", author: "C.S. Lewis" },
  { text: "Try to be a rainbow in someone's cloud.", author: "Maya Angelou" },
  { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
  { text: "Light tomorrow with today.", author: "Elizabeth Barrett Browning" },
  { text: "We know what we are, but know not what we may be.", author: "William Shakespeare" },
  { text: "Our life is what our thoughts make it.", author: "Marcus Aurelius" },
  { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius" },
  { text: "Nothing in life is to be feared, it is only to be understood.", author: "Marie Curie" },
  { text: "I am thankful for all of those who said no to me. It's because of them I'm doing it myself.", author: "Albert Einstein" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "If you look at what you have in life, you'll always have more.", author: "Oprah Winfrey" },
  { text: "Many people will walk in and out of your life, but only true friends will leave footprints in your heart.", author: "Eleanor Roosevelt" },
  { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
  { text: "Well-behaved women seldom make history.", author: "Laurel Thatcher Ulrich" },
  { text: "The best preparation for tomorrow is doing your best today.", author: "H. Jackson Brown Jr." },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Rivers know this: there is no hurry. We shall get there some day.", author: "A.A. Milne" },
  { text: "A day without sunshine is like, you know, night.", author: "Steve Martin" },
  { text: "If you tell the truth, you don't have to remember anything.", author: "Mark Twain" },
  { text: "A friend is someone who knows all about you and still loves you.", author: "Elbert Hubbard" },
  { text: "Always forgive your enemies; nothing annoys them so much.", author: "Oscar Wilde" },
  { text: "I am so clever that sometimes I don't understand a single word of what I am saying.", author: "Oscar Wilde" },
  { text: "The true secret of happiness lies in taking a genuine interest in all the details of daily life.", author: "William Morris" },
  { text: "The best way out is always through.", author: "Robert Frost" },
  { text: "We may encounter many defeats but we must not be defeated.", author: "Maya Angelou" },
  { text: "Become the change you want to see — those are words I live by.", author: "Oprah Winfrey" },
  { text: "It's not what you look at that matters; it's what you see.", author: "Henry David Thoreau" },
  { text: "Dwell on the beauty of life.", author: "Marcus Aurelius" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
  { text: "It is in your moments of decision that your destiny is shaped.", author: "Tony Robbins" },
  { text: "Once you choose hope, anything is possible.", author: "Christopher Reeve" },
  { text: "Try to be a rainbow in someone else's cloud.", author: "Maya Angelou" },
  { text: "This too shall pass.", author: "Persian Proverb" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { text: "After every storm the sun will smile.", author: "William R. Alger" },
  { text: "Change your thoughts and you change your world.", author: "Norman Vincent Peale" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "It takes courage to grow up and become who you really are.", author: "E.E. Cummings" },
  { text: "We delight in the beauty of the butterfly, but rarely admit the changes it has gone through.", author: "Maya Angelou" },
  { text: "Nothing is worth more than this day.", author: "Johann Wolfgang von Goethe" },
  { text: "Beauty is not in the face; beauty is a light in the heart.", author: "Kahlil Gibran" },
  { text: "The earth laughs in flowers.", author: "Ralph Waldo Emerson" },
  { text: "Keep your face always toward the sunshine, and shadows will fall behind you.", author: "Walt Whitman" },
  { text: "Everything has beauty, but not everyone sees it.", author: "Confucius" },
  { text: "To see a world in a grain of sand and heaven in a wild flower.", author: "William Blake" },
  { text: "There is no substitute for hard work.", author: "Thomas Edison" },
  { text: "If you don't design your own life plan, chances are you'll fall into someone else's plan.", author: "Jim Rohn" },
  { text: "If you're going through hell, keep going.", author: "Winston Churchill" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
  { text: "We must accept finite disappointment, but never lose infinite hope.", author: "Martin Luther King Jr." },
  { text: "A man is not old until regrets take the place of dreams.", author: "John Barrymore" },
  { text: "Without continual growth and progress, such words as improvement, achievement, and success have no meaning.", author: "Benjamin Franklin" },
  { text: "I can't change the direction of the wind, but I can adjust my sails to always reach my destination.", author: "Jimmy Dean" },
  { text: "You can't fall if you don't climb. But there's no joy in living your whole life on the ground.", author: "Unknown" },
  { text: "Remember no one can make you feel inferior without your consent.", author: "Eleanor Roosevelt" },
  { text: "It is never too late to be what you might have been.", author: "George Eliot" },
  { text: "Life is like riding a bicycle. To keep your balance, you must keep moving.", author: "Albert Einstein" },
  { text: "I have learned over the years that when one's mind is made up, this diminishes fear.", author: "Rosa Parks" },
  { text: "I know for certain that we never lose the people we love.", author: "Leo Buscaglia" },
  { text: "Courage is not the absence of fear, but rather the judgement that something else is more important than fear.", author: "Ambrose Redmoon" },
  { text: "You take your life in your own hands, and what happens? A terrible thing: no one to blame.", author: "Erica Jong" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { text: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon" },
  { text: "To be the best, you must be able to handle the worst.", author: "Wilson Kanadi" },
  { text: "The whole secret of a successful life is to find out what is one's destiny to do, and then do it.", author: "Henry Ford" },
  { text: "If you want to make a permanent change, stop focusing on the size of your problems and start focusing on the size of you!", author: "T. Harv Eker" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
  { text: "Try not to become a man of success. Rather become a man of value.", author: "Albert Einstein" },
  { text: "Great minds discuss ideas; average minds discuss events; small minds discuss people.", author: "Eleanor Roosevelt" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "If you don't value your time, neither will others.", author: "Kim Garst" },
  { text: "A successful man is one who can lay a firm foundation with the bricks others have thrown at him.", author: "David Brinkley" },
  { text: "No one can make you feel inferior without your consent.", author: "Eleanor Roosevelt" },
  { text: "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack of will.", author: "Vince Lombardi" },
]

const themes = {
  terra: { primary: '#C4673A', light: '#FAECE7' },
  sage:  { primary: '#7A8C6E', light: '#EAF0E5' },
  gold:  { primary: '#BA7517', light: '#FFF8EE' },
}

export default function Journal({ session }) {
  const [profile, setProfile] = useState(null)
  const [tab, setTab] = useState('grateful')
  const [entry, setEntry] = useState({
    grateful: '', accomplish: ['', '', ''], affirmations: ['', ''],
    great: '', letgo: ''
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState({ grateful: [], great: [] })
  const [uploading, setUploading] = useState(false)
  const [showGarden, setShowGarden] = useState(false)
  const [showProfile, setShowProfile] = useState(() => {
    const seen = sessionStorage.getItem('sown_home_seen')
    return !seen
  })

  const enterApp = () => {
    sessionStorage.setItem('sown_home_seen', 'true')
    setShowProfile(false)
  }
  const today = new Date().toDateString()
  const quote = quotes[new Date().getDate() % quotes.length]

  useEffect(() => {
    fetchProfile()
    setTimeout(() => subscribeToPush(), 5000)
  }, [])

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    if (data) setProfile(data)

    const { data: existingEntry } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('date', today)
      .single()
    if (existingEntry) {
      setEntry({
        grateful: existingEntry.grateful || '',
        accomplish: existingEntry.accomplish || ['', '', ''],
        affirmations: existingEntry.affirmations || ['', ''],
        great: existingEntry.great || '',
        letgo: existingEntry.letgo || '',
      })
      setPhotos({
        grateful: existingEntry.photos_grateful || [],
        great: existingEntry.photos_great || [],
      })
    }
  }

  const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    if (Notification.permission === 'denied') return

    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return

      const reg = await navigator.serviceWorker.ready
      const rawKey = 'BNgx9IlN5_2wGGOGpNoWvwmvPISjVe1QEJVGZ1QdFv59_-aZkMxnEpYLK1m_8r5roI3ZNfSJ9iWG3KKTzA-FucE'

      const padding = '='.repeat((4 - rawKey.length % 4) % 4)
      const base64 = (rawKey + padding).replace(/-/g, '+').replace(/_/g, '/')
      const rawData = window.atob(base64)
      const outputArray = new Uint8Array(rawData.length)
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: outputArray
      })

      await supabase.from('push_subscriptions').insert({
        user_id: session.user.id,
        subscription: sub.toJSON()
      })
    } catch (e) {
      console.log('Push subscription failed:', e)
    }
  }

  const saveEntry = async () => {
    setLoading(true)
    const { data: existing } = await supabase
      .from('entries')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('date', today)
      .single()

    if (existing) {
      await supabase.from('entries').update({
        grateful: entry.grateful,
        accomplish: entry.accomplish,
        affirmations: entry.affirmations,
        great: entry.great,
        letgo: entry.letgo,
        photos_grateful: photos.grateful,
        photos_great: photos.great,
      }).eq('id', existing.id)
    } else {
      await supabase.from('entries').insert({
        user_id: session.user.id,
        date: today,
        grateful: entry.grateful,
        accomplish: entry.accomplish,
        affirmations: entry.affirmations,
        great: entry.great,
        letgo: entry.letgo,
        photos_grateful: photos.grateful,
        photos_great: photos.great,
      })
      const lastDate = profile?.last_entry_date
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()

      let newStreak
      if (lastDate === yesterdayStr) {
        newStreak = (profile?.streak || 0) + 1
      } else if (lastDate === today) {
        newStreak = profile?.streak || 1
      } else {
        newStreak = 1
      }

      await supabase.from('profiles').update({
        streak: newStreak,
        last_entry_date: today
      }).eq('id', session.user.id)
      setProfile(p => ({ ...p, streak: newStreak }))
    }
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const signOut = async () => { await supabase.auth.signOut() }

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const maxSize = 800
          let width = img.width
          let height = img.height
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          } else if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  const uploadPhoto = async (file, section) => {
    setUploading(true)
    const compressed = await compressImage(file)
    const fileName = `${session.user.id}/${section}/${Date.now()}.jpg`
    const { error } = await supabase.storage
      .from('photos')
      .upload(fileName, compressed)
    if (error) {
      alert('Upload failed: ' + error.message)
    } else {
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName)
      setPhotos(prev => ({
        ...prev,
        [section]: [...prev[section], urlData.publicUrl]
      }))
    }
    setUploading(false)
  }

  const handleFileChange = async (e, section) => {
    const files = Array.from(e.target.files)
    for (const file of files) {
      await uploadPhoto(file, section)
    }
  }

  const removePhoto = (section, index) => {
    setPhotos(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }))
  }

  const theme = themes[profile?.theme || 'terra']
  const days = ['S','M','T','W','T','F','S']
  const todayIdx = new Date().getDay()

  const setAccomplish = (i, val) => {
    const arr = [...entry.accomplish]
    arr[i] = val
    setEntry({ ...entry, accomplish: arr })
  }

  const setAffirmation = (i, val) => {
    const arr = [...entry.affirmations]
    arr[i] = val
    setEntry({ ...entry, affirmations: arr })
  }

  const setTheme = async (t) => {
    setProfile(p => ({ ...p, theme: t }))
    await supabase.from('profiles').update({ theme: t }).eq('id', session.user.id)
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

if (!profile) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#FAF6F0',
      fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#C4673A'
    }}>
      Sown...
    </div>
  )

  if (showProfile) return (
    <Profile
      session={session}
      profile={profile}
      setProfile={setProfile}
      onEnter={enterApp}
      theme={theme}
    />
  )
  

  return (
    <div style={{ background: '#FAF6F0', minHeight: '100vh', fontFamily: 'Nunito, sans-serif' }}>
      {showGarden && profile && (
        <Garden
          theme={theme}
          streak={profile.streak || 0}
          isPremium={profile?.is_premium}
          onClose={() => setShowGarden(false)}
        />
      )}
      <div style={{ maxWidth: '420px', margin: '0 auto' }}>

        <div style={{ background: theme.primary, color: 'white', padding: '1.25rem 1.25rem 1rem', borderRadius: '0 0 24px 24px', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px' }}>
                {greeting()}, {profile.name}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>
                {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div onClick={() => setShowProfile(true)} style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer' }}>
                🏠
              </div>
              <div onClick={() => setShowGarden(true)} style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer' }}>
                🔥 {profile.streak} days
              </div>
              <div onClick={signOut} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px', fontFamily: 'Playfair Display, serif' }}>
                {profile.name?.[0]?.toUpperCase()}
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '14px', padding: '10px 14px' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', fontStyle: 'italic', lineHeight: 1.5 }}>"{quote.text}"</div>
            <div style={{ fontSize: '11px', opacity: 0.75, marginTop: '4px' }}>— {quote.author}</div>
          </div>

          <div style={{ display: 'flex', gap: '5px', marginTop: '0.75rem' }}>
            {days.map((d, i) => (
              <div key={i} style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: i === todayIdx ? 'rgba(255,255,255,0.9)' : i < todayIdx && profile.streak > todayIdx - i ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: '600',
                color: i === todayIdx ? theme.primary : 'white'
              }}>{d}</div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '0.75rem', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '11px', opacity: 0.7 }}>theme</span>
            {Object.entries(themes).map(([key, val]) => (
              <div key={key} onClick={() => setTheme(key)} style={{
                width: '20px', height: '20px', borderRadius: '50%', background: val.primary,
                border: profile.theme === key ? '2px solid white' : '2px solid rgba(255,255,255,0.4)',
                cursor: 'pointer'
              }} />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', padding: '0 1.25rem', marginBottom: '1rem', overflowX: 'auto' }}>
          {[
            { id: 'grateful', label: 'Grateful' },
            { id: 'accomplish', label: "Today's goals" },
            { id: 'affirmations', label: 'I am...' },
            { id: 'great', label: 'Great moments' },
            { id: 'letgo', label: 'Let go' },
            { id: 'habits', label: '🌱 Habits' },
            { id: 'insights', label: '✦ Insights' },
            { id: 'goals', label: '🎯 Goals' },
            { id: 'history', label: '📖 History' },
            { id: 'upgrade', label: '⭐ Premium' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flexShrink: 0, padding: '7px 14px', borderRadius: '20px', fontSize: '12px',
              cursor: 'pointer', border: tab === t.id ? `1px solid ${theme.primary}` : '1px solid #E8DDD5',
              background: tab === t.id ? theme.light : 'white',
              color: tab === t.id ? theme.primary : '#7A6558', fontWeight: '600',
              fontFamily: 'Nunito, sans-serif'
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ padding: '0 1.25rem' }}>

          {tab === 'grateful' && (
            <div style={cardStyle}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🌿</div>
              <div style={{ ...sectionTitle, color: theme.primary }}>What I'm grateful for</div>
              <textarea value={entry.grateful} onChange={e => setEntry({ ...entry, grateful: e.target.value })}
                placeholder="Today I'm grateful for..." rows={6} style={textareaStyle} />
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Add to your story</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  {photos.grateful.map((url, i) => (
                    <div key={i} style={{ position: 'relative', width: '72px', height: '72px' }}>
                      <img src={url} style={{ width: '72px', height: '72px', borderRadius: '12px', objectFit: 'cover' }} />
                      <button onClick={() => removePhoto('grateful', i)} style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: theme.primary, color: 'white', border: 'none', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                  ))}
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', border: '1.5px dashed #D8CFC8', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', color: '#7A6558', fontFamily: 'Nunito, sans-serif', fontWeight: '600' }}>
                  📷 {uploading ? 'Uploading...' : 'Add a photo'}
                  <input type="file" accept="image/*" multiple onChange={e => handleFileChange(e, 'grateful')} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          )}

          {tab === 'accomplish' && (
            <div style={cardStyle}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>✦</div>
              <div style={{ ...sectionTitle, color: theme.primary }}>3 things I will accomplish today</div>
              {entry.accomplish.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #D8CFC8', flexShrink: 0 }} />
                  <input value={item} onChange={e => setAccomplish(i, e.target.value)}
                    placeholder={`${i === 0 ? 'First' : i === 1 ? 'Second' : 'Third'} thing...`}
                    style={{ flex: 1, border: 'none', borderBottom: '1px solid #F0E8E0', outline: 'none', fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: '#3D2B1F', background: 'transparent', padding: '4px 0' }} />
                </div>
              ))}
            </div>
          )}

          {tab === 'affirmations' && (
            <div style={cardStyle}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>💛</div>
              <div style={{ ...sectionTitle, color: theme.primary }}>Daily affirmations</div>
              {entry.affirmations.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: theme.primary, flexShrink: 0 }}>I am</span>
                  <input value={item} onChange={e => setAffirmation(i, e.target.value)}
                    placeholder="grateful and present"
                    style={{ flex: 1, border: 'none', borderBottom: `1.5px solid #E8DDD5`, outline: 'none', fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: '#3D2B1F', background: 'transparent', padding: '4px 0' }} />
                </div>
              ))}
              <span onClick={() => setEntry({ ...entry, affirmations: [...entry.affirmations, ''] })}
                style={{ fontSize: '13px', color: theme.primary, cursor: 'pointer', fontWeight: '600' }}>
                + add another
              </span>
            </div>
          )}

          {tab === 'great' && (
            <div style={cardStyle}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🌅</div>
              <div style={{ ...sectionTitle, color: theme.primary }}>Great things that happened today</div>
              <textarea value={entry.great} onChange={e => setEntry({ ...entry, great: e.target.value })}
                placeholder="Something wonderful..." rows={6} style={textareaStyle} />
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Capture the moment</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  {photos.great.map((url, i) => (
                    <div key={i} style={{ position: 'relative', width: '72px', height: '72px' }}>
                      <img src={url} style={{ width: '72px', height: '72px', borderRadius: '12px', objectFit: 'cover' }} />
                      <button onClick={() => removePhoto('great', i)} style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: theme.primary, color: 'white', border: 'none', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                  ))}
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', border: '1.5px dashed #D8CFC8', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', color: '#7A6558', fontFamily: 'Nunito, sans-serif', fontWeight: '600' }}>
                  📷 {uploading ? 'Uploading...' : 'Add a photo'}
                  <input type="file" accept="image/*" multiple onChange={e => handleFileChange(e, 'great')} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          )}

          {tab === 'letgo' && (
            <div style={cardStyle}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🍂</div>
              <div style={{ ...sectionTitle, color: theme.primary }}>Biggest challenges & things I want to let go</div>
              <textarea value={entry.letgo} onChange={e => setEntry({ ...entry, letgo: e.target.value })}
                placeholder="I release..." rows={6} style={textareaStyle} />
            </div>
          )}

          {tab === 'habits' && (
            <Habits session={session} theme={theme} isPremium={profile?.is_premium} />
          )}

          {tab === 'insights' && (
            <Insights session={session} theme={theme} isPremium={profile?.is_premium} onUpgrade={() => setTab('upgrade')} />
          )}

          {tab === 'goals' && (
            <Goals session={session} theme={theme} isPremium={profile?.is_premium} />
          )}

          {tab === 'history' && (
            <History session={session} theme={theme} />
          )}

          {tab === 'upgrade' && (
            <Upgrade session={session} theme={theme} />
          )}

          {tab !== 'habits' && tab !== 'insights' && tab !== 'history' && tab !== 'upgrade' && tab !== 'goals' && (
            <button onClick={saveEntry} disabled={loading} style={{
              width: '100%', padding: '14px', background: theme.primary, color: 'white',
              border: 'none', borderRadius: '16px', fontFamily: 'Playfair Display, serif',
              fontSize: '20px', cursor: 'pointer', marginBottom: '2rem',
              opacity: loading ? 0.7 : 1
            }}>
              {loading ? 'Saving...' : saved ? '✓ Saved!' : 'Save today\'s entry ✦'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const cardStyle = {
  background: 'white', border: '1px solid #EDE4DC',
  borderRadius: '18px', padding: '1rem 1.25rem', marginBottom: '1rem'
}

const sectionTitle = {
  fontFamily: 'Playfair Display, serif', fontSize: '19px', marginBottom: '10px'
}

const textareaStyle = {
  width: '100%', border: 'none', outline: 'none', resize: 'none',
  fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: '#3D2B1F',
  background: 'transparent', lineHeight: 1.8
}