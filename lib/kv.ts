import { kv } from '@vercel/kv';

const KV_REST_API_URL = process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;

if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
  throw new Error('KV_REST_API_URL and KV_REST_API_TOKEN must be set in .env.local');
}

export async function getConversationHistory(userId: string): Promise<string[]> {
  try {
    return await kv.lrange(`user:${userId}:history`, 0, -1);
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    return [];
  }
}

export async function addToConversationHistory(userId: string, message: string): Promise<void> {
  try {
    await kv.rpush(`user:${userId}:history`, message);
    await kv.ltrim(`user:${userId}:history`, -50, -1);
  } catch (error) {
    console.error('Error adding to conversation history:', error);
  }
}

export async function clearConversationHistory(userId: string): Promise<void> {
  try {
    await kv.del(`user:${userId}:history`);
  } catch (error) {
    console.error('Error clearing conversation history:', error);
  }
}