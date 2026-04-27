# Happy Easter Greeting App 

A personalized, animated Easter greeting web app. Share a custom link with anyone's name and they get a unique, interactive Easter experience — complete with animations, music, and one-tap WhatsApp/Instagram sharing.

🔗 **Live Site:** [happyeaster-theta.vercel.app](https://happyeaster-theta.vercel.app)  
**Example:** [happyeaster-theta.vercel.app/?n=Emilio](https://happyeaster-theta.vercel.app/?n=Emilio)
---
## Features

- **Personalized Greetings** — Name passed via `?n=` URL query parameter renders dynamically on the page
- 🐰 **Animated Hero** — Falling Easter emojis (flowers, eggs, bunnies) with CSS animations
- 🎵 **Web Audio API** — Background Easter music that plays on user interaction
-**WhatsApp Sharing** — One-tap share button generates a personalized link for any contact
- **Instagram Sharing** — Quick share shortcut to Instagram
- 🔗 **Custom Link Generator** — Enter a name, hit Go, get a shareable personalized URL
- 📱 **Mobile-First Design** — Optimized for phone screens
---
## How It Works

1. Visit the site with a name in the URL: `/?n=YourName`
2. The page renders a personalized animated Easter greeting
3. Hit **Go** to generate your own shareable link for someone else
4. Share via **WhatsApp** or **Instagram** with one tap

---

## Tech Stack
- **Runtime:** Node.js + Express
- **Database:** MongoDB
- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Audio:** Web Audio API
- **Deployment:** Vercel

---

## Getting Started
```bash
git clone https://github.com/yourusername/happyeaster.git
cd happyeaster
npm install
npm start
```
Then visit `http://localhost:3000/?n=YourName`

---
## Developer

Built by **Emilio Kipchirchir Cheruiyot**  
BSc Software Engineering — Multimedia University of Kenya
