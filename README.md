# Interview Flashcards (React Native / Expo) — Scaffold Pack

## 1) Generate the Expo project (TypeScript)
```bash
npx create-expo-app interview-flashcards --template expo-template-blank-typescript
cd interview-flashcards
```

## 2) Install deps
```bash
# SQLite (local data store)
npx expo install expo-sqlite

# Navigation
npm i @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated
```

## 3) Copy this scaffold in
Unzip this archive, then copy its contents into your Expo project root.

You should end up with:
- `src/` folder
- a minimal `App.tsx` that delegates to `src/AppRoot.tsx`

## 4) Run
```bash
npx expo start
```

On first launch, the app will:
- create a SQLite DB
- run migrations
- seed a sample job + decks + cards
- let you test the UX end-to-end (Practice + Interview mode)

## Notes
- All LLM calls are stubbed: `src/llm/llmClient.ts`
- Deck generation is stubbed: `src/features/decks/services/deckBuilder.ts`
- Evaluation is stubbed: `src/features/sessions/services/evaluator.ts`
