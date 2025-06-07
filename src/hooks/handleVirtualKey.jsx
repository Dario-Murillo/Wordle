import handleKeyup from './helpers/handleKeyup';

export default function handleVirtualKey(key, gameState, handlers) {
  // Create a fake event to pass to the original handler
  const event = { key };

  handleKeyup({
    key: event.key,
    ...gameState,
    ...handlers,
  });
}
