# Frontstage AI

Turn any AI workflow into a branded, standalone app. No chat UI — just input in, result out.

Most AI products stop at the chat box. Frontstage AI is a different approach: you define a single flow (what input it takes, what the model does, what the output looks like), and the service handles everything else — image capture UX, calling the model, structuring the output, and rendering it as a clean result page.

## How It Works

1. Edit `flow.yaml` to define your app
2. Set your API key in `.env`
3. Run `npm start`

That's it. You get a polished, mobile-first app.

## Quick Start

```bash
git clone https://github.com/yourusername/frontstageai.git
cd frontstageai
npm install
cp .env.example .env
# Add your OpenAI/Anthropic/Google API key to .env
npm run dev
```

Open `http://localhost:5173` — your app is running.

## The Config File

Everything is defined in `flow.yaml`:

```yaml
app:
  name: "Palm Reader"
  description: "Discover your destiny through the lines of your palm"
  template: "mystic"
  brand:
    primaryColor: "#8B5CF6"
    secondaryColor: "#1E1B4B"

input:
  type: "camera"                    # camera | upload | text
  label: "Show Me Your Palm"
  instructions: "Hold your hand up, palm facing the camera"

ai:
  provider: "openai"                # openai | anthropic | google
  model: "gpt-4o"
  prompt: "Analyze this palm image..."
  output:
    type: "sections"                # sections | markdown | raw
    sections:
      - key: "lifeLine"
        title: "The Life Line"
        icon: "heart"
      - key: "destiny"
        title: "Your Destiny"
        icon: "star"

output:
  style: "card"
  shareEnabled: true
```

## Examples

Check the `examples/` directory for ready-to-use flows:

- **Palm Reader** — Camera capture, GPT-4o vision, structured mystical reading
- **Product Analyzer** — Upload a product photo, get instant insights
- **Writing Assistant** — Paste text, get a professional rewrite

To try an example, copy it over the main config:

```bash
cp examples/palm-reader.yaml flow.yaml
```

## Supported Providers

| Provider | Models | Input Types |
|----------|--------|-------------|
| OpenAI | GPT-4o, GPT-4 Turbo | Vision + Text |
| Anthropic | Claude Sonnet, Claude Opus | Vision + Text |
| Google | Gemini Pro, Gemini Flash | Vision + Text |

Set the provider in `flow.yaml` and add the corresponding API key to `.env`.

## Templates

Templates control the visual theme. Built-in options:

- `default` — Clean, light, minimal
- `mystic` — Dark purple, mystical (perfect for the palm reader)

Set `app.template` in `flow.yaml`. Brand colors override the template defaults.

## Input Types

| Type | Description |
|------|-------------|
| `camera` | Live camera capture with preview/confirm |
| `upload` | Drag-and-drop or click to upload |
| `text` | Textarea input |
| `camera+text` | Camera capture with text field |
| `upload+text` | File upload with text field |

## Scripts

```bash
npm run dev        # Development (Vite + Express, hot reload)
npm run build      # Production build
npm start          # Production server
npm run typecheck  # Type-check frontend + server
```

## Deployment

The built app is a standard Node.js server. Deploy anywhere:

```bash
npm run build
npm start
```

Works on Railway, Render, Fly.io, any VPS, or any Node.js host.

## Architecture

```
flow.yaml (your config) + .env (API keys)
         ↓
  Express backend (port 3001)
    GET  /api/config  → sanitized config (no secrets)
    POST /api/run     → input → AI provider → result
         ↓
  React frontend
    Camera / Upload / Text → Loading → Results
```

The frontend never sees your prompts, model choice, or API keys.

## License

MIT
