export default function ThemePreview() {
  return (
    <div className="flex flex-wrap gap-6 p-8">
      <div className="bg-primary text-white rounded-lg p-6 shadow">Primary</div>
      <div className="bg-accent text-white rounded-lg p-6 shadow">Accent</div>
      <div className="bg-card text-foreground rounded-lg p-6 shadow">Card</div>
      <div className="bg-muted text-foreground rounded-lg p-6 shadow">Muted</div>
      <div className="bg-background text-foreground rounded-lg p-6 shadow">Background</div>
    </div>
  );
}
