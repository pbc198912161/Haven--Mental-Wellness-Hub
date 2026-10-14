import React from 'react';
import { Bell, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ReminderControlProps {
  reminderOn: boolean;
  reminderTime: string;
  onToggleReminder: (checked: boolean) => void;
  onChangeTime: (time: string) => void;
}

export const ReminderControl: React.FC<ReminderControlProps> = ({
  reminderOn,
  reminderTime,
  onToggleReminder,
  onChangeTime,
}) => {
  const handleToggle = async (checked: boolean) => {
    onToggleReminder(checked);
    if (checked && 'Notification' in window && Notification.permission !== 'granted') {
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          toast.success('Tab notifications enabled for your reminder time');
        } else {
          toast('Gentle in-app reminders will show when you have the tab open.');
        }
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-[28px] bg-white/80 dark:bg-card/85 backdrop-blur-md border border-border shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-seafoam-dark dark:text-seafoam" />
          <span className="font-serif text-lg font-semibold text-tide dark:text-white">
            Daily Check-in Reminder
          </span>
        </div>
        <Switch
          checked={reminderOn}
          onCheckedChange={handleToggle}
          aria-label="Toggle daily reminder"
        />
      </div>

      <p className="text-xs text-tide-muted dark:text-gray-400">
        Receive a gentle visual prompt when the site is open in the evening if you haven't checked in yet.
      </p>

      {reminderOn && (
        <div className="pt-2 flex items-center justify-between gap-4">
          <label htmlFor="reminder-time-input" className="text-xs font-medium text-tide dark:text-gray-200">
            Reminder time
          </label>
          <Input
            id="reminder-time-input"
            type="time"
            value={reminderTime}
            onChange={(e) => onChangeTime(e.target.value)}
            className="w-36 rounded-xl text-xs"
          />
        </div>
      )}

      <div className="flex items-start gap-2 p-3 rounded-2xl bg-mist/60 dark:bg-deep-tide/50 text-[11px] text-tide-muted dark:text-gray-400 border border-border/60">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>
          Note: Since Haven runs purely on your device without servers or tracking, reminders appear while the browser tab is open.
        </span>
      </div>
    </div>
  );
};
