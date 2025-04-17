import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label as UILabel } from '../components/ui/label';

interface CreateLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateLabel: (label: { name: string; color: string }) => Promise<void>;
}

export function CreateLabelModal({ isOpen, onClose, onCreateLabel }: CreateLabelModalProps) {
  const [labelName, setLabelName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#4ade80'); // Default to green
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorOptions = [
    { name: 'Red', value: '#f87171' }, // red-400
    { name: 'Blue', value: '#3b82f6' }, // blue-500
    { name: 'Green', value: '#4ade80' }, // green-400
    { name: 'Yellow', value: '#facc15' }, // yellow-400
    { name: 'Purple', value: '#a855f7' }, // purple-500
    { name: 'Pink', value: '#ec4899' }, // pink-500
    { name: 'Gray', value: '#71717a' }, // gray-500
    { name: 'Indigo', value: '#6366f1' }, // indigo-500
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!labelName.trim()) return;
    
    try {
      setIsSubmitting(true);
      await onCreateLabel({
        name: labelName.trim(),
        color: selectedColor,
      });
      
      // Reset form
      setLabelName('');
      setSelectedColor('#4ade80');
    } catch (error) {
      console.error('Failed to create label:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Label</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <UILabel htmlFor="labelName">Label Name</UILabel>
              <Input
                id="labelName"
                placeholder="Enter label name"
                value={labelName}
                onChange={(e) => setLabelName(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="grid gap-2">
              <UILabel>Color</UILabel>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-6 h-6 rounded-full cursor-pointer ring-2 ${
                      selectedColor === color.value ? 'ring-gray-400' : 'ring-transparent hover:ring-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSelectedColor(color.value)}
                    aria-label={`Select ${color.name} color`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!labelName.trim() || isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
