# Task List: SDK 54 Downgrade & AsyncStorage Migration

- [x] Swap out `react-native-mmkv` with `@react-native-async-storage/async-storage` in [mmkv.ts](file:///home/namnk/ws/github/kn-calculator/src/storage/mmkv.ts)
- [x] Downgrade SDK configuration in [package.json](file:///home/namnk/ws/github/kn-calculator/package.json)
- [x] Run `pnpm install` and `npx expo install --fix` to resolve matching dependencies for SDK 54
- [x] Verify using `npx expo-doctor`
- [x] Run `pnpm lint` and resolve any new lint issues
- [x] Run `npx tsc --noEmit` and resolve any new TypeScript compiler errors
- [x] Verify that the application starts cleanly
