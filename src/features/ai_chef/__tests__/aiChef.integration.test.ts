import { describe, expect, it } from 'bun:test';
import { ChatMessageSchema } from '../models/aiChef.model';
import { SYSTEM_INSTRUCTION } from '../repositories/aiChef.repository';

describe('AI Chef Module Integration', () => {
  it('should validate chat messages against Zod schema', () => {
    const userMsg = { role: 'user', text: 'How many slices in an 8" cake?' };
    const modelMsg = { role: 'model', text: 'An 8" cake feeds 8-10 people! 🍰' };

    expect(ChatMessageSchema.safeParse(userMsg).success).toBe(true);
    expect(ChatMessageSchema.safeParse(modelMsg).success).toBe(true);
  });

  it('should contain accurate brand specs in system prompt', () => {
    expect(SYSTEM_INSTRUCTION).toContain('Chef Rosette');
    expect(SYSTEM_INSTRUCTION).toContain('CakeBox Bakery');
    expect(SYSTEM_INSTRUCTION).toContain('Red Velvet Ganache');
  });
});
