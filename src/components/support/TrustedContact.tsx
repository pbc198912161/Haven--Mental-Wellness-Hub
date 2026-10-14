import React, { useState } from 'react';
import { TrustedContact as ITrustedContact } from '@/types';
import { validateTrustedContact } from '@/lib/helplines';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, UserPlus, Edit2, Trash2, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface TrustedContactProps {
  contact: ITrustedContact | null;
  onSaveContact: (contact: ITrustedContact | null) => void;
}

export const TrustedContact: React.FC<TrustedContactProps> = ({ contact, onSaveContact }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(contact?.name ?? '');
  const [phone, setPhone] = useState(contact?.phone ?? '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateTrustedContact(name, phone);
    if (!result.valid) {
      setErrorMsg(result.error ?? 'Invalid input');
      return;
    }

    const newContact: ITrustedContact = {
      name: name.trim(),
      phone: phone.trim(),
    };

    onSaveContact(newContact);
    setIsEditing(false);
    setErrorMsg(null);
    toast.success('Trusted contact saved');
  };

  const handleRemove = () => {
    onSaveContact(null);
    setName('');
    setPhone('');
    setIsEditing(false);
    toast.success('Trusted contact removed');
  };

  if (!contact && !isEditing) {
    return (
      <div className="p-6 rounded-[28px] bg-white/80 dark:bg-card/85 backdrop-blur-md border border-dashed border-border flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <h3 className="font-serif text-lg font-semibold text-tide dark:text-white">
              My Trusted Contact
            </h3>
          </div>
          <p className="text-xs text-tide-muted dark:text-gray-300">
            Add a counsellor, friend or family member you'd call. Having one person saved ahead of time makes reaching out easier on a hard day.
          </p>
        </div>

        <Button
          onClick={() => setIsEditing(true)}
          variant="outline"
          className="rounded-full border-tide/30 text-tide dark:text-white hover:bg-mist text-xs font-semibold h-10 w-fit"
        >
          <UserPlus className="w-3.5 h-3.5 mr-2" />
          Add trusted contact
        </Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <form
        onSubmit={handleSave}
        className="p-6 rounded-[28px] bg-white/80 dark:bg-card/85 backdrop-blur-md border border-border shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-tide dark:text-white">
            {contact ? 'Edit Trusted Contact' : 'Add Trusted Contact'}
          </h3>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setErrorMsg(null);
            }}
            className="text-xs text-tide-muted hover:text-tide underline"
          >
            Cancel
          </button>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="contact-name" className="text-xs text-tide-muted dark:text-gray-300">
              Name or role (e.g. Campus Counsellor, Maya)
            </Label>
            <Input
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Maya (Roommate)"
              className="rounded-xl text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="contact-phone" className="text-xs text-tide-muted dark:text-gray-300">
              Phone number
            </Label>
            <Input
              id="contact-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="rounded-xl text-sm"
              required
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium" role="alert">
              {errorMsg}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          {contact && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleRemove}
              className="rounded-full text-xs text-rose-600 hover:text-rose-700 h-9"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Remove
            </Button>
          )}
          <Button
            type="submit"
            className="rounded-full bg-tide text-white hover:bg-tide/90 dark:bg-white dark:text-tide text-xs font-semibold px-5 h-9"
          >
            Save contact
          </Button>
        </div>
      </form>
    );
  }

  // Saved contact display with big Call button
  const cleanTel = contact?.phone.replace(/[^0-9+]/g, '');

  return (
    <div className="p-6 rounded-[28px] bg-white/80 dark:bg-card/85 backdrop-blur-md border border-border shadow-xs flex flex-col justify-between space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-seafoam-dark dark:text-seafoam">
            <Heart className="w-3.5 h-3.5" fill="currentColor" />
            <span>My Trusted Contact</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-tide dark:text-white">
            {contact?.name}
          </h3>
          <p className="text-xs text-tide-muted dark:text-gray-400 font-mono">{contact?.phone}</p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setName(contact?.name ?? '');
            setPhone(contact?.phone ?? '');
            setIsEditing(true);
          }}
          className="rounded-full text-tide-muted hover:text-tide w-8 h-8"
          title="Edit contact"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      <a
        href={`tel:${cleanTel}`}
        className="inline-flex items-center justify-center rounded-full bg-seafoam text-tide hover:bg-seafoam/90 font-bold h-11 text-sm shadow-sm w-full transition-colors"
      >
        <Phone className="w-4 h-4 mr-2" />
        Call {contact?.name}
      </a>
    </div>
  );
};
