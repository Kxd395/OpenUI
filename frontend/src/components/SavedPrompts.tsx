import React from 'react';
import { Button } from 'components/ui/button';
import { 
	Dialog, 
	DialogContent, 
	DialogHeader, 
	DialogTitle, 
	DialogTrigger 
} from 'components/ui/dialog';
import { 
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator
} from 'components/ui/dropdown-menu';
import { ScrollArea } from 'components/ui/scroll-area';
import { Badge } from 'components/ui/badge';
import { 
	BookmarkIcon, 
	DotsVerticalIcon, 
	TrashIcon, 
	CopyIcon,
	Cross1Icon
} from '@radix-ui/react-icons';
import { useAtom } from 'jotai';
import { savedPromptsActionsAtom, SavedPrompt } from 'stores/prompts';
import { cn } from 'lib/utils';

interface SavedPromptsProps {
	onSelectPrompt?: (prompt: string) => void;
	trigger?: React.ReactNode;
}

export default function SavedPrompts({ onSelectPrompt, trigger }: SavedPromptsProps) {
	const [savedPrompts, dispatch] = useAtom(savedPromptsActionsAtom);

	const handleRemovePrompt = (id: string) => {
		dispatch({ type: 'remove', payload: id });
	};

	const handleClearAll = () => {
		dispatch({ type: 'clear' });
	};

	const handleCopyPrompt = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	const handleSelectPrompt = (prompt: SavedPrompt) => {
		if (onSelectPrompt) {
			onSelectPrompt(prompt.text);
		}
	};

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				{trigger || (
					<Button variant="outline" size="sm" className="gap-2">
						<BookmarkIcon className="h-4 w-4" />
						Saved Prompts
						{savedPrompts.length > 0 && (
							<Badge variant="secondary" className="ml-1">
								{savedPrompts.length}
							</Badge>
						)}
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-w-2xl max-h-[600px]">
				<DialogHeader>
					<div className="flex items-center justify-between">
						<DialogTitle className="flex items-center gap-2">
							<BookmarkIcon className="h-5 w-5" />
							Saved Prompts
						</DialogTitle>
						{savedPrompts.length > 0 && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleClearAll}
								className="text-destructive hover:text-destructive"
							>
								<TrashIcon className="h-4 w-4 mr-1" />
								Clear All
							</Button>
						)}
					</div>
				</DialogHeader>

				<ScrollArea className="h-[400px] pr-4">
					{savedPrompts.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							<BookmarkIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
							<p>No saved prompts yet</p>
							<p className="text-sm mt-1">Save prompts while chatting for quick access</p>
						</div>
					) : (
						<div className="space-y-3">
							{savedPrompts.map((prompt) => (
								<div
									key={prompt.id}
									className="group relative p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
									onClick={() => handleSelectPrompt(prompt)}
								>
									<div className="flex items-start justify-between gap-3">
										<div className="flex-1 min-w-0">
											<p className="text-sm text-foreground line-clamp-3 mb-2">
												{prompt.text}
											</p>
											<div className="flex items-center gap-2 text-xs text-muted-foreground">
												<span>{formatDate(prompt.createdAt)}</span>
												{prompt.category && (
													<>
														<span>•</span>
														<Badge variant="outline" className="text-xs">
															{prompt.category}
														</Badge>
													</>
												)}
											</div>
											{prompt.tags && prompt.tags.length > 0 && (
												<div className="flex flex-wrap gap-1 mt-2">
													{prompt.tags.map((tag, index) => (
														<Badge 
															key={index} 
															variant="secondary" 
															className="text-xs"
														>
															{tag}
														</Badge>
													))}
												</div>
											)}
										</div>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0"
													onClick={(e) => e.stopPropagation()}
												>
													<DotsVerticalIcon className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={(e) => {
														e.stopPropagation();
														handleSelectPrompt(prompt);
													}}
												>
													<CopyIcon className="h-4 w-4 mr-2" />
													Use Prompt
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={(e) => {
														e.stopPropagation();
														handleCopyPrompt(prompt.text);
													}}
												>
													<CopyIcon className="h-4 w-4 mr-2" />
													Copy Text
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={(e) => {
														e.stopPropagation();
														handleRemovePrompt(prompt.id);
													}}
													className="text-destructive"
												>
													<TrashIcon className="h-4 w-4 mr-2" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
							))}
						</div>
					)}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
