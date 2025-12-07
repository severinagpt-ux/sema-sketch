import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface CharacterUploadFormProps {
  onCharacterCreated?: (character: {
    id: string;
    name: string;
    reference_url: string;
  }) => void;
  onCancel?: () => void;
}

export function CharacterUploadForm({ onCharacterCreated, onCancel }: CharacterUploadFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [styleTags, setStyleTags] = useState('');
  const [role, setRole] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const clearImage = () => {
    setUploadedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedFile || !name.trim()) {
      toast.error('Please provide a name and upload an image');
      return;
    }

    setIsUploading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to create a character');
        return;
      }

      // Upload image to storage
      const fileExt = uploadedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('character-images')
        .upload(fileName, uploadedFile);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('character-images')
        .getPublicUrl(fileName);

      // Create character record
      const { data: character, error: dbError } = await supabase
        .from('characters')
        .insert({
          name: name.trim(),
          role: role.trim() || null,
          style_tags: styleTags.trim() || null,
          reference_url: publicUrl,
          user_id: user.id
        })
        .select()
        .single();

      if (dbError) {
        throw new Error(`Failed to create character: ${dbError.message}`);
      }

      toast.success('Character created successfully!');
      
      if (onCharacterCreated) {
        onCharacterCreated({
          id: character.id,
          name: character.name,
          reference_url: publicUrl
        });
      }

      // Reset form
      setName('');
      setDescription('');
      setStyleTags('');
      setRole('');
      clearImage();

    } catch (error) {
      console.error('Error creating character:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create character');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer
          ${isDragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full max-h-48 object-contain rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <div className="p-3 rounded-full bg-muted">
              {isDragActive ? (
                <Upload className="h-6 w-6 text-primary" />
              ) : (
                <ImageIcon className="h-6 w-6" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                {isDragActive ? 'Drop your image here' : 'Drag & drop character image'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse (PNG, JPG, WebP up to 10MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Form fields */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="name">Character Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Marcus Steel"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="role">Role / Type</Label>
          <Input
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Protagonist, Villain, Supporting"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="styleTags">Style Tags</Label>
          <Input
            id="styleTags"
            value={styleTags}
            onChange={(e) => setStyleTags(e.target.value)}
            placeholder="e.g., cyberpunk, anime, photorealistic"
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated style descriptors for AI generation
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isUploading || !uploadedFile || !name.trim()}
          className="flex-1"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Character'
          )}
        </Button>
      </div>
    </form>
  );
}
