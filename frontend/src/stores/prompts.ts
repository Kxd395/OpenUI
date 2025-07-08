import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export interface SavedPrompt {
	id: string;
	text: string;
	createdAt: Date;
	category?: string;
	tags?: string[];
}

// Store saved prompts in localStorage
export const savedPromptsAtom = atomWithStorage<SavedPrompt[]>('saved-prompts', []);

// Atom for managing saved prompts
export const savedPromptsActionsAtom = atom(
	(get) => get(savedPromptsAtom),
	(get, set, action: { type: 'add' | 'remove' | 'clear'; payload?: any }) => {
		const current = get(savedPromptsAtom);
		
		switch (action.type) {
			case 'add': {
				const newPrompt: SavedPrompt = {
					id: Date.now().toString(),
					text: action.payload.text,
					createdAt: new Date(),
					category: action.payload.category,
					tags: action.payload.tags
				};
				set(savedPromptsAtom, [newPrompt, ...current]);
				break;
			}
			case 'remove': {
				set(savedPromptsAtom, current.filter(p => p.id !== action.payload));
				break;
			}
			case 'clear': {
				set(savedPromptsAtom, []);
				break;
			}
		}
	}
);
