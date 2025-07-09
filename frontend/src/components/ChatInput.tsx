import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'components/ui/button';
import { Textarea } from 'components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';
import { 
	ArrowRight, 
	Check, 
	X, 
	Bookmark,
	Trash2,
	Image as LucideImage 
} from 'lucide-react';
import { cn } from 'lib/utils';

import Copilot from './Copilot/Copilot';

interface ChatInputProps {
	onSubmit: (query: string) => void;
	placeholder?: string;
	disabled?: boolean;
	editing?: boolean;
	onImageUpload?: (file: File) => void;
	onSavePrompt?: (prompt: string) => void;
	hasScreenshot?: boolean;
	onRemoveScreenshot?: () => void;
	onCopilotAction?: (action: string, query: string) => void;
}

export default function ChatInput({
	onSubmit,
	placeholder = 'Type your message...',
	disabled = false,
	editing = false,
	onImageUpload,
	onSavePrompt,
	hasScreenshot = false,
	onRemoveScreenshot,
	onCopilotAction
}: ChatInputProps) {
	const [query, setQuery] = useState('');
	const [rows, setRows] = useState(1);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const imageUploadRef = useRef<HTMLInputElement>(null);

	// Auto-resize textarea
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			const scrollHeight = textareaRef.current.scrollHeight;
			const maxRows = 6;
			const lineHeight = 24;
			const maxHeight = maxRows * lineHeight;
			
			if (scrollHeight > maxHeight) {
				textareaRef.current.style.height = `${maxHeight}px`;
				textareaRef.current.style.overflowY = 'auto';
			} else {
				textareaRef.current.style.height = `${scrollHeight}px`;
				textareaRef.current.style.overflowY = 'hidden';
			}
			
			setRows(Math.min(Math.ceil(scrollHeight / lineHeight), maxRows));
		}
	}, [query]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmedQuery = query.trim();
		if (trimmedQuery || hasScreenshot) {
			onSubmit(trimmedQuery);
			setQuery('');
			if (textareaRef.current) {
				textareaRef.current.style.height = 'auto';
			}
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	const handleClear = () => {
		setQuery('');
		if (textareaRef.current) {
			textareaRef.current.focus();
			textareaRef.current.style.height = 'auto';
		}
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && onImageUpload) {
			onImageUpload(file);
		}
		// Reset the input
		if (imageUploadRef.current) {
			imageUploadRef.current.value = '';
		}
	};

	const handleSavePrompt = () => {
		const trimmedQuery = query.trim();
		if (trimmedQuery && onSavePrompt) {
			onSavePrompt(trimmedQuery);
		}
	};

	const canSubmit = query.trim() || hasScreenshot;

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
			{/* Background blur */}
			<div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/0 backdrop-blur-sm" />
			
			<div className="relative pointer-events-auto">
				<div className="max-w-4xl mx-auto px-4 pb-4">
					{/* Screenshot indicator */}
					{hasScreenshot && (
						<div className="mb-2 flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
							<LucideImage className="h-4 w-4 text-blue-600 dark:text-blue-400" />
							<span className="text-sm text-blue-700 dark:text-blue-300">Screenshot attached</span>
							{onRemoveScreenshot && (
								<Button
									variant="ghost"
									size="sm"
									onClick={onRemoveScreenshot}
									className="ml-auto h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-800/50"
								>
									<X className="h-3 w-3" />
								</Button>
							)}
						</div>
					)}

					{/* Input container */}
					<div className="relative bg-background/95 backdrop-blur-xl border border-input rounded-2xl shadow-lg">
						<form onSubmit={handleSubmit} className="flex items-end gap-2 p-4">
							{/* Textarea */}
							<div className="flex-1 min-w-0">
								<Textarea
									ref={textareaRef}
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									onKeyDown={handleKeyDown}
									placeholder={placeholder}
									disabled={disabled}
									rows={1}
									className="min-h-[44px] resize-none border-none bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
									style={{
										maxHeight: '144px' // 6 lines max
									}}
								/>
							</div>

							{onCopilotAction && (
								<Copilot onAction={(action) => onCopilotAction(action, query)} />
							)}

							{/* Action buttons */}
							<div className="flex items-center gap-1 flex-shrink-0">
								{/* Image upload */}
								{onImageUpload && (
									<>
										<input
											ref={imageUploadRef}
											type="file"
											accept="image/*"
											onChange={handleImageUpload}
											className="hidden"
										/>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => imageUploadRef.current?.click()}
													className="h-8 w-8 p-0 hover:bg-muted"
												>
													<LucideImage className="h-4 w-4" />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Upload image</p>
											</TooltipContent>
										</Tooltip>
									</>
								)}

								{/* Save prompt */}
								{onSavePrompt && query.trim() && (
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={handleSavePrompt}
												className="h-8 w-8 p-0 hover:bg-muted"
											>
												<Bookmark className="h-4 w-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Save prompt</p>
										</TooltipContent>
									</Tooltip>
								)}

								{/* Clear */}
								{query.trim() && (
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={handleClear}
												className="h-8 w-8 p-0 hover:bg-muted"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Clear input</p>
										</TooltipContent>
									</Tooltip>
								)}

								{/* Submit */}
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											type="submit"
											variant="default"
											size="sm"
											disabled={!canSubmit || disabled}
											className="h-8 w-8 p-0 rounded-full"
										>
											{disabled ? (
												<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
											) : editing ? (
												<Check className="h-4 w-4" />
											) : (
												<ArrowRight className="h-4 w-4" />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>{editing ? 'Apply changes' : 'Send message'}</p>
									</TooltipContent>
								</Tooltip>
							</div>
						</form>
					</div>

					{/* Keyboard shortcut hint */}
					<div className="mt-2 text-xs text-muted-foreground text-center">
						Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Shift + Enter</kbd> for new line
					</div>
				</div>
			</div>
		</div>
	);
}
