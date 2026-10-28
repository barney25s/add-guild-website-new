// ============================================================
//  ADD GUILD WEBSITE: EDIT YOUR CONTENT HERE
//  Everything on the site that you will want to change lives
//  in this one file. Save it and the site updates.
// ============================================================

// 1) Paste your real Discord invite link between the quotes.
//    Every Discord button and link on the site uses this value.
export const DISCORD_INVITE_URL = "https://discord.gg/rvUxtx8p8";

// 2) Guild basics
export const GUILD_NAME = "ADD";
export const GUILD_WORLD = "AddHome";
export const GAME = "Growtopia";

// 3) Mascot image. Replace the file:  mascot.png
//    (flat version: the file sits next to config.js and is named mascot.png)
import mascotUrl from "./mascot.png";
export const MASCOT_IMAGE = mascotUrl;
export const MASCOT_NAME = "Water Asteroid";

// 4) Main text
export const TEXT = {
  heroHeadline: "A little rain never hurt anyone.",
  heroIntro:
    "ADD is a Growtopia guild with its home in the world AddHome. Read the rules, check the rewards and come say hi on Discord.",
  aboutTitle: "About the guild",
  aboutBody:
    "ADD is a Growtopia guild that gathers in AddHome. Our mascot, the Water Asteroid, keeps watch over the world while we build, trade and play together.",
  aboutExtra: "What makes ADD special is its friendly community, good vibes and the fun we have together.",
  rulesTitle: "Guild rules",
  rulesIntro: "Provisional rules. The admins may update them at any time.",
  rewardsTitle: "Rewards",
  rewardsIntro: "The guild's current prize distribution.",
  joinTitle: "Join our Discord",
  joinBody:
    "Our Discord is where announcements, updates and the community live. Jump in and meet the guild.",
  joinPending: "The invite link is coming soon. Check back shortly.",
  footerLine: "Born in the water, built in AddHome.",
};

// 5) Rules: add, remove or reword lines freely.
export const RULES = [
  "Respect all guild members.",
  "Follow the guild's instructions and announcements.",
  "No scamming, stealing, or exploiting other members.",
  "Keep interactions respectful and avoid unnecessary drama.",
  "Follow the official guild rules and any additional requirements announced by the admins.",
];

// 6) Rewards: change amounts or descriptions here.
//    Keep the order: first place, second place, third place.
export const REWARDS = [
  { place: "TOP 1", amount: 50, unit: "DL", description: "First place prize" },
  { place: "TOP 2", amount: 30, unit: "DL", description: "Second place prize" },
  { place: "TOP 3", amount: 20, unit: "DL", description: "Third place prize" },
];

// 7) Facts shown in the About section
export const ABOUT_FACTS = [
  { label: "Guild name", value: "Add" },
  { label: "Guild world", value: GUILD_WORLD },
  { label: "Game", value: GAME },
];

// 8) Navigation (id must match a section id on the page)
export const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "rules", label: "Rules" },
  { id: "rewards", label: "Rewards" },
  { id: "join", label: "Join Us" },
];
