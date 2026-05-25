import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { optimizeImage } from '../../utils/ImageOptimizer';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  onDelete?: () => Promise<void>;
  currentImageUrl?: string | null;
  title?: string;
  isPending?: boolean;
}

export function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
  onDelete,
  currentImageUrl,
  title = 'Upload Image',
  isPending = false,
}: ImageUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    setIsOptimizing(true);
    try {
      const optimized = await optimizeImage(file);
      setSelectedFile(optimized);
      setPreviewUrl(URL.createObjectURL(optimized));
    } catch (err) {
      console.error('Failed to optimize, using original', err);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } finally {
      setIsOptimizing(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleConfirmUpload = async () => {
    if (selectedFile) {
      await onUpload(selectedFile);
      clearSelection();
      onClose();
    }
  };

  const handleConfirmDelete = async () => {
    if (onDelete) {
      await onDelete();
      clearSelection();
      onClose();
    }
  };

  const closeAndClear = () => {
    clearSelection();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--color-border)]">
              <h3 className="font-mono font-bold text-lg text-[var(--color-text)] flex items-center gap-2">
                <ImageIcon size={18} className="text-[var(--color-primary)]" />
                {title}
              </h3>
              <button
                type="button"
                onClick={closeAndClear}
                disabled={isPending || isOptimizing}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Display Current or Preview Image */}
              {(previewUrl || currentImageUrl) && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg)] flex items-center justify-center group">
                  <img
                    src={previewUrl || currentImageUrl || ''}
                    alt="Preview"
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      onClick={previewUrl ? clearSelection : handleConfirmDelete}
                      className="bg-black/60 text-white p-1.5 rounded-full hover:bg-red-500 shadow-sm cursor-pointer transition-colors backdrop-blur-sm"
                      title={previewUrl ? "Clear selection" : "Delete photo"}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Drag and Drop Zone */}
              {!previewUrl && (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    dragActive
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                      : 'border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-primary)]/50'
                  }`}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                    id="image-upload-input"
                  />
                  <label
                    htmlFor="image-upload-input"
                    className="flex flex-col items-center justify-center cursor-pointer gap-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-[var(--color-bg-subtle)] flex items-center justify-center text-[var(--color-text-muted)]">
                      <UploadCloud size={24} />
                    </div>
                    <div>
                      <p className="font-mono text-sm text-[var(--color-text)]">
                        <span className="text-[var(--color-primary)] font-bold">Click to upload</span> or drag and drop
                      </p>
                      <p className="font-mono text-xs text-[var(--color-text-muted)] mt-1">
                        SVG, PNG, JPG or GIF (max. 5MB)
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Actions */}
              {selectedFile && (
                <div className="flex flex-col gap-3 pt-4 border-t border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={handleConfirmUpload}
                    disabled={isPending || isOptimizing}
                    className="w-full py-2.5 bg-[var(--color-primary)] text-white rounded-lg font-mono text-sm hover:bg-[var(--color-primary-dim)] transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex justify-center items-center gap-2"
                  >
                    {isOptimizing ? 'Optimizing...' : isPending ? 'Uploading...' : 'Confirm Upload'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
