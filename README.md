# Modernity Test

A Next.js application that allows users to take a questionnaire to determine how modern they are. The app includes an admin panel for managing questions.

## Features

- **Question Types**: Supports three types of questions:
  - Single choice (radio buttons) - Each option has a modernity level
  - Multiple choice (checkboxes) - Each option has a modernity level
  - One-word answer (text input) - Analyzed using AI (LLM) for modernity
- **Admin Panel**: Full CRUD operations for managing questions with modernity levels
- **AI-Powered Scoring**: Uses free LLM APIs (Groq or Hugging Face) to analyze word answers and determine modernity
- **Modernity-Based Scoring**: No right/wrong answers - each answer contributes to a modernity score
- **Results Display**: Beautiful results page showing modernity level and percentage

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Free API key for LLM (optional but recommended for word answers):
  - **Groq** (Recommended - Fast & Free): Get from [Groq Console](https://console.groq.com/keys)
  - **Hugging Face** (Alternative - Free): Get from [Hugging Face Settings](https://huggingface.co/settings/tokens)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```bash
# MongoDB Configuration (Required)
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password
DB_CLUSTER=your_cluster_name
DB_NAME=your_database_name

# TOTP Secret for Admin Authentication (Required)
# Generate using: node scripts/generate-totp-secret.js
TOTP_SECRET=your_generated_totp_secret_here

# Site URL for SEO (Required for production)
# Replace with your actual domain, e.g., https://modernity-test.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# LLM API Keys (Optional - for word answer analysis)
# Use Groq (recommended - faster)
GROQ_API_KEY=your_groq_api_key_here

# OR use Hugging Face (alternative)
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

3. **Set up Google Authenticator for Admin Panel**:
```bash
# Generate TOTP secret and QR code
node scripts/generate-totp-secret.js
```
This will:
- Generate a TOTP secret (add to `.env.local` as `TOTP_SECRET`)
- Provide a QR code URL to scan with Google Authenticator
- After scanning, you can use the 6-digit codes from the app to access the admin panel

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note**: 
- If no API key is configured, word answer questions will default to moderate modernity (50%).
- Groq is recommended as it's faster and more reliable. Both services offer free tiers.

## Usage

### Admin Panel

1. Navigate to `/admin/login` to access the admin panel
2. Enter the 6-digit code from your Google Authenticator app
3. Once authenticated, you'll have access to the admin panel
2. Click "Add Question" to create a new question
3. Fill in the question details:
   - **Question text**: The question to ask
   - **Question type**: 
     - Single choice: User selects one option
     - Multiple choice: User can select multiple options
     - One word answer: User types an answer (analyzed by AI)
   - **Options with Modernity Levels** (for single/multiple choice):
     - Add each option with its modernity level:
       - Ultra Modern (100 points)
       - Modern (75 points)
       - Moderately Modern (50 points)
       - Traditional (25 points)
       - Very Traditional (0 points)
   - **Question Weight**: How much this question contributes to the total score
4. Edit or delete existing questions as needed

**Example**: For a question "Which bucket is used in your home?"
- Steel bucket → Ultra Modern (100)
- Plastic bucket → Modern (75)
- Empty paint bucket → Traditional (25)

### Taking the Quiz

1. Navigate to `/quiz` or click "Start Quiz" on the home page
2. Answer all questions
3. Navigate between questions using Previous/Next buttons
4. Submit the quiz when finished
5. View your modernity score and level on the results page

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── questions/          # Question CRUD API
│   │   ├── calculate-score/    # Score calculation API
│   │   └── analyze-modernity/  # LLM-based modernity analysis API
│   ├── admin/                  # Admin panel page
│   ├── quiz/                   # Quiz page
│   ├── results/                # Results page
│   └── page.tsx                # Home page
├── lib/
│   ├── db.ts                   # MongoDB database operations
│   └── llm.ts                  # Free LLM integration (Groq/Hugging Face) for modernity analysis
├── types/
│   └── question.ts             # TypeScript types
└── data/
    └── questions.json          # Sample questions (for reference)
```

## Data Storage

Questions are stored in **MongoDB**. You need to configure MongoDB connection in your environment variables:

- `DB_USERNAME` - Your MongoDB username
- `DB_PASSWORD` - Your MongoDB password
- `DB_CLUSTER` - Your MongoDB cluster name
- `DB_NAME` - Your database name

The connection string format is:
```
mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}.s7w4ras.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=${DB_CLUSTER}
```

**Note**: Make sure your MongoDB cluster allows connections from your IP address (or 0.0.0.0/0 for Vercel deployments).

## How Scoring Works

The scoring system is based on modernity levels, not right/wrong answers:

1. **Single Choice Questions**: The modernity score of the selected option is used
2. **Multiple Choice Questions**: The average modernity score of all selected options is used
3. **Word Answer Questions**: The answer is sent to a free LLM API (Groq or Hugging Face) which analyzes the modernity level and returns a score (0-100)

The final percentage determines the modernity level:
- 80-100%: Ultra Modern
- 60-79%: Modern
- 40-59%: Moderately Modern
- 20-39%: Somewhat Traditional
- 0-19%: Traditional

## Technologies Used

- Next.js 14 (App Router)
- TypeScript
- CSS Modules
- React
- uiplex (UI component library)
- MongoDB (for data storage)
- Groq API or Hugging Face API (free LLM-based analysis)

## License

MIT
