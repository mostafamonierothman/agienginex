// routeChatMessage.ts
export async function routeChatMessage({ input }: { input: { message: string } }) {
  const res = await fetch('https://agienginex.mostafamonier13.workers.dev/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: input.message })
  });

  const data = await res.json();

  return {
    role: data.role || 'assistant',
    content: data.content || '⚠️ No response received from AGIengineX.'
  };
}
