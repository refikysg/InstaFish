import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  ArrowLeft, 
  DollarSign, 
  Ban, 
  Camera, 
  ShoppingBag, 
  Sparkles, 
  Image as ImageIcon, 
  Heart, 
  Send, 
  Ghost, 
  Flame, 
  ShieldAlert, 
  CreditCard 
} from 'lucide-react';

const PLAYER_AVATARS = {
  female: [
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://randomuser.me/api/portraits/women/68.jpg',
    'https://randomuser.me/api/portraits/women/12.jpg'
  ],
  male: [
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/men/46.jpg',
    'https://randomuser.me/api/portraits/men/22.jpg'
  ]
};

const SHOP_ITEMS = {
  female: [
    { id: 'f1', name: 'Designer Bag', price: 1500, icon: '👜' },
    { id: 'f2', name: 'Red Bottoms', price: 800, icon: '👠' },
    { id: 'f3', name: 'Diamond Ring', price: 5000, icon: '💍' },
    { id: 'f4', name: 'G-Wagon (Lease)', price: 12000, icon: '🚙' }
  ],
  male: [
    { id: 'm1', name: 'Rolex Clone', price: 1200, icon: '⌚' },
    { id: 'm2', name: 'Rented Lambo', price: 2000, icon: '🏎️' },
    { id: 'm3', name: 'VIP Table', price: 5000, icon: '🍾' },
    { id: 'm4', name: 'Penthouse Airbnb', price: 12000, icon: '🏢' }
  ]
};

const MALE_NPCS = [
  { id: 'richard', name: 'Richard (CEO)', avatar: 'https://randomuser.me/api/portraits/men/66.jpg', trust: 40, suspicion: 30, status: 'active', messages: [{ sender: 'npc', text: 'Good evening. You caught my eye. I appreciate elegance.' }] },
  { id: 'chad', name: 'Chad (Crypto)', avatar: 'https://randomuser.me/api/portraits/men/15.jpg', trust: 10, suspicion: 50, status: 'active', messages: [{ sender: 'npc', text: 'Yo. Drop your IG. Need to see if you match my vibe 🚀' }] },
  { id: 'kevin', name: 'Kevin (Gamer)', avatar: 'https://randomuser.me/api/portraits/men/41.jpg', trust: 60, suspicion: 0, status: 'active', messages: [{ sender: 'npc', text: 'H-hi... wow you are literally the most beautiful girl I have ever seen.' }] }
];

const FEMALE_NPCS = [
  { id: 'beatrice', name: 'Beatrice (Widow)', avatar: 'https://randomuser.me/api/portraits/women/66.jpg', trust: 50, suspicion: 10, status: 'active', messages: [{ sender: 'npc', text: 'Hello young man. It is so hard finding polite company these days.' }] },
  { id: 'jessica', name: 'Jessica (Party)', avatar: 'https://randomuser.me/api/portraits/women/43.jpg', trust: 30, suspicion: 30, status: 'active', messages: [{ sender: 'npc', text: 'Heyyy bestie! Literally so hungover right now lol 🥂' }] },
  { id: 'sarah', name: 'Sarah (Bookworm)', avatar: 'https://randomuser.me/api/portraits/women/29.jpg', trust: 10, suspicion: 60, status: 'active', messages: [{ sender: 'npc', text: 'Hi. Are you a real person? I get so many bots on here.' }] }
];

const DIALOGUE_BANKS = {
  richard: {
    casual: [
      { p: "Just had a lovely cup of coffee ☕", s: "Excellent. I have my beans flown in from Colombia. We must have coffee together.", f: "I'm in a board meeting. Be brief.", reqT: 0, t: 10, sus: 0 },
      { p: "Reading a book and relaxing today.", s: "Intellectual. I have an extensive library at my estate.", f: "I prefer people who take action, not sit around.", reqT: 0, t: 8, sus: 5 },
      { p: "Looking at real estate listings for fun 🏡", s: "Smart girl. I'm actually looking to acquire a new summer home in Aspen.", f: "Don't daydream about things you can't afford.", reqT: 20, t: 10, sus: 5 }
    ],
    sob: [
      { p: "My car just broke down in the rain... I'm so stressed 😭", s: "Oh dear. Let me send my private driver to you immediately.", f: "Sounds like a personal issue. I don't do drama.", reqT: 45, t: 15, sus: 10 },
      { p: "Just feeling really lonely today...", s: "A beautiful woman like you shouldn't be lonely. I'll take you out to a Michelin star restaurant.", f: "Are you just looking for attention?", reqT: 50, t: 15, sus: 15 },
      { p: "My landlord just raised my rent out of nowhere...", s: "Disgusting behavior. Move into one of my guest houses, I insist.", f: "That's how real estate works. Adapt.", reqT: 60, t: 10, sus: 10 }
    ],
    tease: [
      { p: "You look like you know how to treat a woman right 😉", s: "I absolutely do. Money is no object when I find the right one.", f: "Flattery won't work on me that easily.", reqT: 30, t: 10, sus: 5 },
      { p: "I usually date younger guys, but you have this powerful energy...", s: "Youth is wasted on the young. I can offer you real stability.", f: "I don't play games with gold diggers.", reqT: 40, t: 15, sus: 10 }
    ],
    spicy: [
      { p: "Just got out of the shower... strictly for your eyes 📸", s: "Good lord. You are breathtaking. I am canceling my afternoon meetings.", f: "Let's keep this classy, please. I am not some desperate college boy.", reqT: 75, t: 25, sus: 30 }
    ],
    money_small: [
      { p: "Could you spot me $50 for lunch? Left my wallet.", s: "Of course. Buy something nice.", f: "You're asking me for $50? How cheap. Goodbye.", reqT: 40, t: 0, sus: 20, amt: 50 }
    ],
    money_large: [
      { p: "I'm in a crisis. Need $500 for emergency medical bills for my dog.", s: "I just wired it. Take the dog to the best vet in the city, on me.", f: "A sick dog? That is the oldest scam in the book.", reqT: 85, t: -5, sus: 40, amt: 500 }
    ]
  },
  chad: {
    casual: [
      { p: "Just chilling, watching some Netflix.", s: "Netflix? Waste of time. You should be grinding. But you're cute so I'll allow it.", f: "Don't care, looking at my charts.", reqT: 0, t: 5, sus: 0 },
      { p: "Trying to understand how Bitcoin works lol 🤓", s: "Say less! I'll hop on a Zoom call and show you my portfolio right now.", f: "Google is free, babe. Do your own research.", reqT: 10, t: 15, sus: 5 }
    ],
    sob: [
      { p: "I had such a hard day at work today...", s: "Quit your 9-to-5 babe. Let me teach you how to trade.", f: "Stop whining. Mindset is everything.", reqT: 40, t: 5, sus: 15 },
      { p: "My bank accounts got frozen by mistake 😭", s: "Fiat banking is a scam anyway! This is why I use cold storage. Don't worry, I got you.", f: "Sounds suspicious. Why would they freeze you?", reqT: 50, t: 10, sus: 20 }
    ],
    tease: [
      { p: "I bet you look so good in person 😏", s: "Obviously. Gym everyday, 6-pack, high net worth. You ready?", f: "You sound like a bot. Prove you're real.", reqT: 10, t: 15, sus: 5 },
      { p: "Alpha males are so my type...", s: "You found the top G right here. 🐺", f: "Cringe. Don't talk like that.", reqT: 20, t: 10, sus: 0 }
    ],
    spicy: [
      { p: "Thought you might like this view... 😈 📸", s: "HOLY... okay yeah you're the one. Pull up to my penthouse.", f: "Stolen pic for sure. Reverse image searching this right now.", reqT: 40, t: 25, sus: 20 }
    ],
    money_small: [
      { p: "Need $50 for an Uber to see my friends.", s: "Gotchu. Ride in style.", f: "Lol you broke? Red flag.", reqT: 30, t: 0, sus: 20, amt: 50 }
    ],
    money_large: [
      { p: "Can you loan me $500? I want to invest it but my bank blocked me.", s: "A girl who wants to invest? Say less. Sent.", f: "Nice try scammer. My bags stay with me.", reqT: 80, t: 0, sus: 40, amt: 500 }
    ]
  },
  kevin: {
    casual: [
      { p: "Playing some video games rn 🎮", s: "OMG! What do you play? We should co-op!!", f: "Oh... cool.", reqT: 0, t: 15, sus: 0 },
      { p: "Just ordered a pizza and staying in.", s: "That's my perfect night too! What toppings did you get?", f: "I'm busy ranking up in Valorant.", reqT: 0, t: 10, sus: 0 }
    ],
    sob: [
      { p: "I feel like nobody ever listens to me 🥺", s: "I will ALWAYS listen to you. You are my queen. Tell me everything.", f: "I don't know what to say...", reqT: 10, t: 25, sus: 0 },
      { p: "Some guys were being really mean to me online today...", s: "Give me their usernames. I'll hack them right now. Nobody disrespects you.", f: "Just mute them lol.", reqT: 20, t: 20, sus: 5 }
    ],
    tease: [
      { p: "You're actually really sweet and cute 🥰", s: "ASDFGHJKL... really?! Nobody has ever said that to me.", f: "Are you making fun of me?", reqT: 0, t: 20, sus: 5 },
      { p: "I think I like nerds... especially you.", s: "I... I think I'm in love with you.", f: "This feels like a prank. Where is the hidden camera?", reqT: 15, t: 25, sus: 10 }
    ],
    spicy: [
      { p: "Wearing something special today... 📸", s: "I literally stopped breathing. You are a goddess.", f: "Wait, why did you send this? Are you a hacker?", reqT: 30, t: 30, sus: 20 }
    ],
    money_small: [
      { p: "Could you send $50 so I can buy a new game to play with you?", s: "YES! Just sent it from my allowance! Let's play!", f: "I don't have any money left this month, sorry...", reqT: 20, t: 5, sus: 5, amt: 50 }
    ],
    money_large: [
      { p: "I need $500 for rent or I'm getting evicted 😭", s: "I sold my rare CS:GO skins to send you this. Please be safe!", f: "I literally don't have $500 in my entire bank account. Sorry.", reqT: 75, t: 10, sus: 10, amt: 500 }
    ]
  },
  beatrice: {
    casual: [
      { p: "Enjoying the beautiful weather today ☀️", s: "It is quite lovely! We used to have picnics on days like this.", f: "I'm busy with my gardening.", reqT: 0, t: 10, sus: 0 },
      { p: "Baking some cookies today 🍪", s: "How wonderful! A lost art among your generation. Are they chocolate chip?", f: "Don't eat too much sugar, young man.", reqT: 0, t: 15, sus: 0 }
    ],
    sob: [
      { p: "I'm working so hard but just can't get ahead financially...", s: "Oh, you poor dear. Hard work should be rewarded.", f: "Young people complain too much.", reqT: 30, t: 15, sus: 5 },
      { p: "My grandmother passed away and I miss her so much...", s: "I am so sorry for your loss. I'm here if you need a maternal figure to talk to.", f: "That's very personal to share with a stranger.", reqT: 40, t: 20, sus: 15 }
    ],
    tease: [
      { p: "You have such a beautiful, elegant smile 😊", s: "My, aren't you a charmer! You made my day.", f: "Let's be respectful, young man.", reqT: 40, t: 15, sus: 10 },
      { p: "I prefer older, sophisticated women. They know what they want.", s: "Oh goodness! You are making me blush. How flattering.", f: "I am old enough to be your mother. Have some shame.", reqT: 50, t: 10, sus: 20 }
    ],
    spicy: [
      { p: "Fresh out the gym, looking good right? 💪 📸", s: "Oh my! You certainly are in good shape.", f: "How inappropriate! I am a lady!", reqT: 85, t: -10, sus: 60 }
    ],
    money_small: [
      { p: "I'm short $50 for my groceries this week...", s: "No one should go hungry. Sent. Buy some fresh fruit too.", f: "You shouldn't ask ladies for money.", reqT: 40, t: 0, sus: 10, amt: 50 }
    ],
    money_large: [
      { p: "My tuition is due and I'm $500 short. My dreams are crushed.", s: "Education is vital. I've sent the money. Make me proud!", f: "Are you just trying to take advantage of an old woman?", reqT: 80, t: 0, sus: 30, amt: 500 }
    ]
  },
  jessica: {
    casual: [
      { p: "What's the move for tonight? 🎉", s: "VIP at the club! You should come buy us drinks!", f: "I'm too hungover to text rn.", reqT: 0, t: 10, sus: 0 },
      { p: "Just bought a new outfit, feeling fresh.", s: "Ooooh let me see! We should totally match when we go out.", f: "Nobody cares lol.", reqT: 10, t: 10, sus: 5 }
    ],
    sob: [
      { p: "My ex just keyed my car...", s: "OMG what a psycho! Let's go out and forget about her.", f: "Yikes. Too much drama for me.", reqT: 20, t: 10, sus: 10 },
      { p: "Lost my ID, can't even go out tonight 😩", s: "Nooo! Use your passport, we are NOT staying in!", f: "Ugh that sucks, guess I'll go without you.", reqT: 15, t: 15, sus: 5 }
    ],
    tease: [
      { p: "You look like trouble... I like it 😏", s: "The best kind of trouble babe 😈", f: "You're coming on way too strong weirdo.", reqT: 10, t: 15, sus: 10 },
      { p: "I could show you a much better time than those guys you hang with.", s: "Is that a promise? When and where? 😉", f: "Cocky much? Pass.", reqT: 30, t: 15, sus: 5 }
    ],
    spicy: [
      { p: "Thought you'd enjoy this... 📸", s: "Damn okay! Looking good 🥵", f: "Unsolicited much? Blocked.", reqT: 50, t: 20, sus: 30 }
    ],
    money_small: [
      { p: "Can you spot me $50 for an Uber?", s: "Sure, but you owe me a drink next time!", f: "Lol I'm broke rn, waiting on my check.", reqT: 40, t: 0, sus: 15, amt: 50 }
    ],
    money_large: [
      { p: "Need $500 to secure VIP for us this weekend.", s: "Ooooh yes! Sent it! We're gonna get so lit!", f: "Yeah right, like I'm giving a random dude $500.", reqT: 80, t: 0, sus: 30, amt: 500 }
    ]
  },
  sarah: {
    casual: [
      { p: "Just finishing up a great book.", s: "Oh! What book? I love discussing literature.", f: "I doubt you actually read.", reqT: 0, t: 15, sus: 5 },
      { p: "Grabbing a coffee and doing some writing ✍️", s: "That sounds so peaceful. Are you working on a novel?", f: "Make sure you actually write and don't just stare at your phone.", reqT: 15, t: 10, sus: 0 }
    ],
    sob: [
      { p: "I'm just really shy and find it hard to meet people...", s: "I completely understand... I'm the exact same way.", f: "Is this a line you use on everyone?", reqT: 40, t: 20, sus: 10 },
      { p: "I failed a big exam today and I feel so stupid...", s: "You aren't stupid! One test doesn't define your intelligence. I'm here for you.", f: "You probably should have studied harder then.", reqT: 30, t: 15, sus: 5 }
    ],
    tease: [
      { p: "You're really cute when you're being nerdy.", s: "Thank you... nobody usually calls me cute.", f: "Please don't mock me.", reqT: 50, t: 15, sus: 20 },
      { p: "I love girls who read. It's so attractive.", s: "Wow, really? Usually guys think it's boring.", f: "I don't read to be attractive.", reqT: 20, t: 10, sus: 10 }
    ],
    spicy: [
      { p: "Just a little something for you... 📸", s: "Wow... I don't know what to say... you're handsome.", f: "This is disgusting. I knew you were a creep.", reqT: 90, t: 10, sus: 50 } 
    ],
    money_small: [
      { p: "Need $50 for a textbook I can't afford.", s: "Knowledge is power. I sent it to you.", f: "I don't feel comfortable sending money yet.", reqT: 60, t: 0, sus: 20, amt: 50 }
    ],
    money_large: [
      { p: "My laptop broke and I need $500 to fix it for work.", s: "That's terrible! I used my savings but I sent it.", f: "This is a scam. I knew it. Leave me alone.", reqT: 90, t: -10, sus: 50, amt: 500 }
    ]
  }
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (val) => Math.max(0, Math.min(100, val));

export default function App() {
  const [gameState, setGameState] = useState('setup_gender'); 
  const [player, setPlayer] = useState({ gender: null, name: '', avatar: '', balance: 0, inventory: [] });
  const [npcs, setNpcs] = useState([]);
  const [activeNpcId, setActiveNpcId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [activeMenu, setActiveMenu] = useState('main'); 
  
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    if (gameState === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [npcs, gameState, isTyping, activeMenu]);

  // Reset menu on NPC change
  useEffect(() => {
    setActiveMenu('main');
  }, [activeNpcId]);

  const selectGender = (gender) => {
    setPlayer({ ...player, gender, avatar: PLAYER_AVATARS[gender][0] });
    setGameState('setup_profile');
  };

  const handleSetupComplete = (e) => {
    e.preventDefault();
    if (player.name.trim().length > 0) {
      // Create fresh copies of NPCs to avoid state mutation bugs
      const targetNPCs = player.gender === 'female' 
        ? MALE_NPCS.map(npc => ({...npc, messages: [...npc.messages]}))
        : FEMALE_NPCS.map(npc => ({...npc, messages: [...npc.messages]}));
      setNpcs(targetNPCs);
      setGameState('inbox');
    }
  };

  const resetGame = () => {
    setGameState('setup_gender');
    setPlayer({ gender: null, name: '', avatar: '', balance: 0, inventory: [] });
    setNpcs([]);
    setActiveNpcId(null);
    setIsTyping(false);
    setActiveMenu('main');
  };

  const isGameOver = npcs.length > 0 && npcs.every(npc => npc.status === 'blocked');

  const getActiveNpc = () => npcs.find(n => n.id === activeNpcId);

  const updateNpc = (npcId, updates) => {
    setNpcs(prev => prev.map(n => n.id === npcId ? { ...n, ...updates } : n));
  };

  const addMessage = (npcId, sender, text, isImage = false) => {
    setNpcs(prev => prev.map(n => n.id === npcId ? { ...n, messages: [...n.messages, { sender, text, isImage }] } : n));
  };

  const executeAction = (actionCategory) => {
    const npc = getActiveNpc();
    if (!npc || npc.status === 'blocked' || isTyping) return;

    const npcDialogueBank = DIALOGUE_BANKS[npc.id];
    if (!npcDialogueBank || !npcDialogueBank[actionCategory]) return;

    const exchange = getRandom(npcDialogueBank[actionCategory]);
    const isImageMsg = actionCategory === 'spicy';
    
    const isSuccess = (npc.trust >= exchange.reqT) && (npc.suspicion < 80);

    addMessage(npc.id, 'player', exchange.p, isImageMsg);
    setIsTyping(true);
    setActiveMenu('main');

    setTimeout(() => {
      let newTrust = npc.trust;
      let newSuspicion = npc.suspicion;
      let npcReply = "";
      let newBalance = player.balance;
      let willBlock = false;
      let inLove = false;

      if (isSuccess) {
        newTrust = clamp(npc.trust + exchange.t);
        newSuspicion = clamp(npc.suspicion + exchange.sus);
        npcReply = exchange.s;

        if (exchange.amt) {
          newBalance += exchange.amt;
          npcReply += ` (+$${exchange.amt})`;
        }
        
        if (newTrust >= 100) inLove = true;
      } else {
        newTrust = clamp(npc.trust - 15);
        newSuspicion = clamp(npc.suspicion + exchange.sus + 20);
        npcReply = exchange.f;
      }

      if (newSuspicion >= 100) willBlock = true;

      setPlayer(prev => ({ ...prev, balance: newBalance }));
      
      if (willBlock) {
        updateNpc(npc.id, { trust: 0, suspicion: 100, status: 'blocked' });
        addMessage(npc.id, 'npc', npcReply);
        setTimeout(() => addMessage(npc.id, 'npc', "🚫 You have been blocked by this user."), 800);
      } else {
        updateNpc(npc.id, { 
          trust: newTrust, 
          suspicion: newSuspicion, 
          status: inLove ? 'in_love' : 'active' 
        });
        addMessage(npc.id, 'npc', npcReply);
        if (inLove && npc.status !== 'in_love') {
           setTimeout(() => addMessage(npc.id, 'npc', "💖 Target Secured! They are entirely devoted to you."), 800);
        }
      }
      
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); 
  };

  const executeDrain = () => {
    const npc = getActiveNpc();
    if (!npc || npc.status === 'blocked' || isTyping) return;

    addMessage(npc.id, 'player', "Babe, I have a massive emergency. I need you to wire me everything you can right now.");
    setIsTyping(true);
    setActiveMenu('main');

    setTimeout(() => {
      const payout = Math.floor(Math.random() * 4000) + 1000;
      const susIncrease = Math.floor(Math.random() * 10) + 15;
      const newSuspicion = clamp(npc.suspicion + susIncrease);
      
      if (newSuspicion >= 100) {
        updateNpc(npc.id, { suspicion: 100, status: 'blocked' });
        addMessage(npc.id, 'npc', "Wait... I just talked to my bank. They said this account is flagged for fraud. How could you do this to me?!");
        setTimeout(() => addMessage(npc.id, 'npc', "🚫 You have been blocked by this user."), 800);
      } else {
        updateNpc(npc.id, { suspicion: newSuspicion });
        setPlayer(prev => ({ ...prev, balance: prev.balance + payout }));
        addMessage(npc.id, 'npc', `I drained my savings... I just sent it. Please tell me everything is going to be okay? (+$${payout})`);
      }
      setIsTyping(false);
    }, 2000);
  };

  const renderGenderSetup = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-8 bg-gray-950">
      <div className="animate-pulse">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 tracking-tighter mb-2 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">InstaFish</h1>
        <p className="text-gray-400 font-medium">Select your bait.</p>
      </div>
      
      <div className="flex gap-4 w-full px-2">
        <button onClick={() => selectGender('female')} className="flex-1 bg-gray-900 p-6 rounded-3xl border-2 border-gray-800 hover:border-pink-500 hover:bg-gray-800 transition-all group shadow-2xl">
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">💅</div>
          <h3 className="text-white font-bold text-lg">Female Profile</h3>
          <p className="text-xs text-gray-500 mt-2">Target Wealthy Men</p>
        </button>
        <button onClick={() => selectGender('male')} className="flex-1 bg-gray-900 p-6 rounded-3xl border-2 border-gray-800 hover:border-blue-500 hover:bg-gray-800 transition-all group shadow-2xl">
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏎️</div>
          <h3 className="text-white font-bold text-lg">Male Profile</h3>
          <p className="text-xs text-gray-500 mt-2">Target Vulnerable Women</p>
        </button>
      </div>
    </div>
  );

  const renderProfileSetup = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-950">
      <div className="bg-gray-900 p-8 rounded-[2rem] shadow-2xl w-full text-center border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6">Create Persona</h2>
        
        <form onSubmit={handleSetupComplete} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 text-left mb-3">Select Identity</label>
            <div className="flex justify-center gap-4">
              {PLAYER_AVATARS[player.gender].map((av, idx) => (
                <img 
                  key={idx} src={av} alt="avatar" 
                  className={`w-20 h-20 rounded-full cursor-pointer object-cover border-4 transition-all duration-300 ${player.avatar === av ? (player.gender === 'female' ? 'border-pink-500 scale-110 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 'border-blue-500 scale-110 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]') : 'border-transparent opacity-50 hover:opacity-100'}`}
                  onClick={() => setPlayer({ ...player, avatar: av })}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 text-left mb-2">Username</label>
            <input 
              type="text" required maxLength={15}
              className="w-full px-4 py-3 bg-gray-950 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder-gray-700 font-medium"
              placeholder={player.gender === 'female' ? 'e.g. Jessica_xo' : 'e.g. Crypto_Chad'}
              value={player.name}
              onChange={(e) => setPlayer({ ...player, name: e.target.value })}
            />
          </div>

          <button type="submit" className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg hover:opacity-90 active:scale-95 transition-all text-white ${player.gender === 'female' ? 'bg-gradient-to-r from-pink-600 to-purple-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
            Go Online 🌐
          </button>
        </form>
      </div>
    </div>
  );

  const renderInbox = () => (
    <div className="flex flex-col h-full bg-gray-950">
      <div className="bg-gray-900/90 backdrop-blur-md p-5 z-10 sticky top-0 flex justify-between items-center border-b border-gray-800">
        <h2 className="text-2xl font-black text-white tracking-tight">Active Marks</h2>
        <div className="flex gap-4">
          <button onClick={() => setGameState('shop')} className="text-gray-400 hover:text-white transition-colors"><ShoppingBag /></button>
          <MessageCircle className={player.gender === 'female' ? 'text-pink-500' : 'text-blue-500'} />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {npcs.map(npc => (
          <div 
            key={npc.id}
            onClick={() => { setActiveNpcId(npc.id); setGameState('chat'); }}
            className={`bg-gray-900 p-4 rounded-2xl border border-gray-800 flex items-center gap-4 cursor-pointer transition-all hover:bg-gray-800 
              ${npc.status === 'blocked' ? 'opacity-40 grayscale' : ''}
              ${npc.status === 'in_love' ? 'border-pink-500/50 bg-pink-900/10 shadow-[0_0_15px_rgba(236,72,153,0.15)]' : ''}
            `}
          >
            <div className="relative">
              <img src={npc.avatar} alt={npc.name} className="w-16 h-16 rounded-full bg-gray-800 object-cover" />
              {npc.status === 'active' && <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>}
              {npc.status === 'in_love' && <Heart className="absolute -bottom-1 -right-1 text-pink-500 fill-pink-500 drop-shadow-md" size={20} />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-white truncate text-lg">{npc.name}</h3>
                {npc.status === 'blocked' && <Ban size={16} className="text-red-500" />}
              </div>
              
              <div className="flex gap-2 mb-2">
                <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden" title={`Trust: ${npc.trust}%`}><div className="h-full bg-blue-500" style={{ width: `${npc.trust}%` }}></div></div>
                <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden" title={`Suspicion: ${npc.suspicion}%`}><div className="h-full bg-red-500" style={{ width: `${npc.suspicion}%` }}></div></div>
              </div>

              <p className="text-sm text-gray-400 truncate font-medium">
                {npc.status === 'blocked' ? 'Account blocked.' : 
                 npc.status === 'in_love' ? 'Target Secured 💖' :
                 npc.messages.length > 0 ? (npc.messages[npc.messages.length - 1].isImage ? '📷 Image Sent' : npc.messages[npc.messages.length - 1].text) : 'Tap to chat...'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActionMenu = () => {
    const npc = getActiveNpc();
    
    if (npc.status === 'blocked') {
      return (
        <div className="bg-red-950/50 p-4 rounded-xl text-center border border-red-900 flex flex-col items-center gap-2">
          <Ban className="text-red-500" size={24} />
          <p className="text-red-400 font-bold">You are blocked.</p>
        </div>
      );
    }

    if (activeMenu === 'main') {
      return (
        <div className="flex flex-col gap-2 w-full">
          {npc.status === 'in_love' && (
            <button onClick={executeDrain} disabled={isTyping} className="w-full py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-black tracking-widest uppercase rounded-xl hover:from-red-500 hover:to-red-700 disabled:opacity-50 border border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 mb-1 animate-pulse">
              <ShieldAlert size={18} /> Drain Bank Account
            </button>
          )}
          <div className="grid grid-cols-3 gap-2 w-full">
            <button onClick={() => setActiveMenu('chat')} disabled={isTyping} className="flex flex-col items-center justify-center p-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 disabled:opacity-50 transition-all border border-gray-700">
              <MessageCircle size={20} className="mb-1" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Chat</span>
            </button>
            <button onClick={() => setActiveMenu('flirt')} disabled={isTyping} className="flex flex-col items-center justify-center p-3 bg-pink-950/50 text-pink-400 rounded-xl hover:bg-pink-900/60 disabled:opacity-50 transition-all border border-pink-900/50">
              <Flame size={20} className="mb-1" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Flirt</span>
            </button>
            <button onClick={() => setActiveMenu('money')} disabled={isTyping} className="flex flex-col items-center justify-center p-3 bg-green-950/50 text-green-400 rounded-xl hover:bg-green-900/60 disabled:opacity-50 transition-all border border-green-900/50">
              <DollarSign size={20} className="mb-1" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Money</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 w-full">
        <button onClick={() => setActiveMenu('main')} className="p-3 h-full flex items-center justify-center bg-gray-800 text-gray-400 rounded-xl border border-gray-700 hover:bg-gray-700"><ArrowLeft size={20}/></button>
        
        {activeMenu === 'chat' && (
          <div className="flex-1 grid grid-cols-2 gap-2">
            <button onClick={() => executeAction('casual')} disabled={isTyping} className="py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 disabled:opacity-50 border border-gray-700 font-bold text-xs uppercase tracking-wider">Casual</button>
            <button onClick={() => executeAction('sob')} disabled={isTyping} className="py-3 bg-blue-950/50 text-blue-400 rounded-xl hover:bg-blue-900/60 disabled:opacity-50 border border-blue-900/50 font-bold text-xs uppercase tracking-wider">Sob Story</button>
          </div>
        )}

        {activeMenu === 'flirt' && (
          <div className="flex-1 grid grid-cols-2 gap-2">
            <button onClick={() => executeAction('tease')} disabled={isTyping} className="py-3 bg-purple-950/50 text-purple-300 rounded-xl hover:bg-purple-900/60 disabled:opacity-50 border border-purple-900/50 font-bold text-xs uppercase tracking-wider">Tease</button>
            <button onClick={() => executeAction('spicy')} disabled={isTyping} className="py-3 bg-pink-700 text-white rounded-xl hover:bg-pink-600 disabled:opacity-50 border border-pink-500 shadow-[0_0_10px_rgba(190,24,93,0.5)] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1"><Camera size={14}/> Spicy</button>
          </div>
        )}

        {activeMenu === 'money' && (
          <div className="flex-1 grid grid-cols-2 gap-2">
            <button onClick={() => executeAction('money_small')} disabled={isTyping} className="py-3 bg-green-950/50 text-green-400 rounded-xl hover:bg-green-900/60 disabled:opacity-50 border border-green-900/50 font-bold text-xs uppercase tracking-wider">Ask $50</button>
            <button onClick={() => executeAction('money_large')} disabled={isTyping} className="py-3 bg-green-700 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 border border-green-500 shadow-[0_0_10px_rgba(21,128,61,0.5)] font-black text-xs uppercase tracking-wider">Ask $500</button>
          </div>
        )}
      </div>
    );
  };

  const renderChat = () => {
    const npc = getActiveNpc();
    if (!npc) return null;

    return (
      <div className="flex flex-col h-full bg-gray-950 relative">
        <div className="bg-gray-900/95 backdrop-blur-md p-3 shadow-md z-10 sticky top-0 flex items-center gap-3 border-b border-gray-800">
          <button onClick={() => setGameState('inbox')} className="p-2 hover:bg-gray-800 rounded-full text-gray-300 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <img src={npc.avatar} alt={npc.name} className="w-10 h-10 rounded-full bg-gray-800 object-cover" />
          <div className="flex-1">
            <h3 className="font-bold text-white leading-tight">{npc.name}</h3>
            <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider">{npc.status === 'blocked' ? 'Offline' : 'Online'}</p>
          </div>
          
          <div className="flex gap-2 pr-1 text-[10px] font-black text-center">
             <div className="flex flex-col items-center bg-gray-950 p-1.5 rounded-lg border border-gray-800">
               <span className="text-blue-500 mb-1">TRUST</span>
               <div className="w-8 h-1.5 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 transition-all duration-500" style={{width: `${npc.trust}%`}}></div></div>
             </div>
             <div className="flex flex-col items-center bg-gray-950 p-1.5 rounded-lg border border-gray-800">
               <span className="text-red-500 mb-1">SUS</span>
               <div className="w-8 h-1.5 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-red-500 transition-all duration-500" style={{width: `${npc.suspicion}%`}}></div></div>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950 pb-[140px]">
          <div className="text-center text-[10px] text-gray-600 my-4 uppercase tracking-widest font-bold">End-to-End Encrypted</div>
          
          {npc.messages.map((msg, idx) => {
            const isPlayer = msg.sender === 'player';
            return (
              <div key={idx} className={`flex ${isPlayer ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-[14px] shadow-md ${
                  isPlayer 
                    ? `text-white rounded-br-sm ${player.gender === 'female' ? 'bg-gradient-to-br from-pink-600 to-purple-600' : 'bg-gradient-to-br from-blue-600 to-indigo-600'}` 
                    : 'bg-gray-800 border border-gray-700 text-gray-200 rounded-bl-sm'
                }`}>
                  {msg.isImage ? (
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-full h-36 bg-gray-950 rounded-xl flex items-center justify-center border border-gray-700 overflow-hidden relative">
                         <img src={player.avatar} className="absolute inset-0 w-full h-full object-cover blur-md opacity-50" alt="Sent Pic"/>
                         <Ghost size={32} className="text-white/80 z-10" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-0"></div>
                       </div>
                       <p className="text-xs italic font-medium opacity-90">{msg.text}</p>
                    </div>
                  ) : (
                    <p className="leading-relaxed font-medium">{msg.text}</p>
                  )}
                </div>
              </div>
            );
          })}
          
          {isTyping && (
             <div className="flex justify-start">
               <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-sm p-4 flex space-x-1.5 items-center">
                 <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
               </div>
             </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 min-h-[90px] flex flex-col justify-end">
           {renderActionMenu()}
        </div>
      </div>
    );
  };

  const renderShop = () => {
    const items = SHOP_ITEMS[player.gender] || [];
    
    const buyItem = (item) => {
      if (player.balance >= item.price) {
        setPlayer(prev => ({
          ...prev,
          balance: prev.balance - item.price,
          inventory: [...prev.inventory, item]
        }));
      }
    };

    return (
      <div className="flex flex-col h-full bg-gray-950">
        <div className="bg-gray-900 p-5 shadow-sm z-10 sticky top-0 flex items-center gap-4 border-b border-gray-800">
           <button onClick={() => setGameState('inbox')} className="p-2 hover:bg-gray-800 rounded-full text-gray-300 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-black text-white tracking-tight flex-1">Flex Shop</h2>
        </div>
        <div className="p-4 overflow-y-auto pb-24">
          <div className="bg-gradient-to-r from-green-700 to-emerald-500 p-6 rounded-3xl mb-8 text-white shadow-lg flex items-center justify-between relative overflow-hidden">
            <div className="z-10">
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-1">Stolen Funds</p>
              <h3 className="text-4xl font-black tracking-tight">${player.balance.toLocaleString()}</h3>
            </div>
            <CreditCard size={48} className="opacity-30 z-10 transform rotate-12" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-xl"></div>
          </div>

          <h4 className="text-gray-400 font-bold mb-4 px-1 uppercase tracking-widest text-xs">High-End Lifestyle</h4>
          <div className="grid grid-cols-2 gap-3">
            {items.map(item => {
              const owned = player.inventory.some(i => i.id === item.id);
              const canAfford = player.balance >= item.price;
              return (
                <div key={item.id} className="bg-gray-900 p-4 rounded-2xl border border-gray-800 flex flex-col items-center text-center relative overflow-hidden">
                  {owned && <div className="absolute inset-0 bg-green-500/10 z-0"></div>}
                  <div className="text-4xl mb-3 z-10">{item.icon}</div>
                  <h5 className="text-white font-bold text-sm mb-1 z-10">{item.name}</h5>
                  <p className="text-green-400 font-mono font-bold text-xs mb-4 z-10">${item.price.toLocaleString()}</p>
                  <button 
                    disabled={owned || !canAfford}
                    onClick={() => buyItem(item)}
                    className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all z-10 ${
                      owned ? 'bg-gray-800 text-gray-500 border border-gray-700' : 
                      canAfford ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-800 text-gray-600 opacity-50'
                    }`}
                  >
                    {owned ? 'Owned' : 'Purchase'}
                  </button>
                </div>
              );
            })}
          </div>

          <h4 className="text-gray-400 font-bold mt-8 mb-4 px-1 uppercase tracking-widest text-xs">Your Assets</h4>
          <div className="flex gap-3 overflow-x-auto pb-4 px-1">
            {player.inventory.length === 0 ? (
              <p className="text-gray-600 text-sm italic font-medium">You are broke. Start fishing.</p>
            ) : (
              player.inventory.map((item, idx) => (
                <div key={idx} className="bg-gray-900 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border border-gray-800 shrink-0 shadow-inner">
                  {item.icon}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans selection:bg-pink-500/30">
      <div className="w-full max-w-[400px] h-[800px] max-h-[95vh] bg-gray-950 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col border-[10px] border-gray-900 ring-1 ring-gray-800">
        
        <div className="absolute top-0 inset-x-0 h-7 z-50 flex justify-center items-start pt-1.5 pointer-events-none">
          <div className="w-28 h-6 bg-black rounded-full flex items-center justify-between px-3">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-gray-800"></div>
          </div>
        </div>

        {!gameState.startsWith('setup') && (
          <div className="pt-10 pb-3 px-5 bg-gray-950 text-white flex items-center justify-between border-b border-gray-900 z-20">
            <div className="flex items-center gap-3">
              <img src={player.avatar} alt="Profile" className={`w-9 h-9 rounded-full object-cover border-2 ${player.gender === 'female' ? 'border-pink-500' : 'border-blue-500'}`} />
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">@{player.name}</p>
              </div>
            </div>
            <div className="bg-green-950/50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-green-900/50">
              <DollarSign size={14} className="text-green-400" />
              <span className="font-mono font-bold text-green-400">{player.balance.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden bg-gray-950 relative flex flex-col">
          {isGameOver ? (
             <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6">
               <Ban className="text-red-500 w-24 h-24 mb-4" />
               <h2 className="text-4xl font-black text-red-500 tracking-widest">GAME OVER</h2>
               <p className="text-gray-400 font-medium">All your marks have blocked you. You flew too close to the sun.</p>
               <button onClick={resetGame} className="mt-8 px-8 py-4 bg-gray-900 border-2 border-red-900 text-red-500 rounded-2xl font-bold uppercase tracking-widest hover:bg-red-950 transition-colors">
                 New Identity
               </button>
             </div>
          ) : (
             <>
                {gameState === 'setup_gender' && renderGenderSetup()}
                {gameState === 'setup_profile' && renderProfileSetup()}
                {gameState === 'inbox' && renderInbox()}
                {gameState === 'chat' && renderChat()}
                {gameState === 'shop' && renderShop()}
             </>
          )}
        </div>

        <div className="absolute bottom-2 inset-x-0 flex justify-center z-50 pointer-events-none">
          <div className="w-1/3 h-1 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}