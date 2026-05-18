/**
 * Icon utilities for content blocks
 *
 * This module provides utilities for resolving icon names to Lucide icon components
 * with fallback handling for unknown icons.
 *
 * Part of the JSON-driven content system infrastructure.
 */

import React from 'react';
import {
  Bot,
  AlertTriangle,
  ListChecks,
  FileText,
  Code,
  Grid3x3,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  Settings,
  Database,
  Server,
  Cloud,
  Monitor,
  Shield,
  Lock,
  User,
  Users,
  Mail,
  Phone,
  Calendar,
  Clock,
  Home,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Menu,
  MoreHorizontal,
  MoreVertical,
  Eye,
  EyeOff,
  Heart,
  Star,
  Bookmark,
  Share,
  Copy,
  Link,
  ExternalLink,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Icon Mapping
// ---------------------------------------------------------------------------

/** Map of icon names to Lucide icon components */
const iconMap: Record<string, React.ComponentType<any>> = {
  // Status and alerts
  Bot,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,

  // Actions and lists
  ListChecks,
  FileText,
  Code,
  Grid3x3,

  // System and infrastructure
  Settings,
  Database,
  Server,
  Cloud,
  Monitor,
  Shield,
  Lock,

  // Users and communication
  User,
  Users,
  Mail,
  Phone,

  // Time and organization
  Calendar,
  Clock,
  Home,

  // Search and navigation
  Search,
  Filter,
  Download,
  Upload,

  // Editing
  Edit,
  Trash2,
  Plus,
  Minus,

  // Arrows
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,

  // Interface
  Menu,
  MoreHorizontal,
  MoreVertical,
  Eye,
  EyeOff,

  // Social
  Heart,
  Star,
  Bookmark,
  Share,
  Copy,
  Link,
  ExternalLink,
};

// ---------------------------------------------------------------------------
// Icon Resolution
// ---------------------------------------------------------------------------

/**
 * Get icon component by name with fallback
 *
 * @param iconName The name of the icon to resolve
 * @returns The icon component or undefined if no icon is specified
 *
 * @example
 * ```tsx
 * const IconComponent = getIconComponent('Bot');
 * return IconComponent ? <IconComponent size={20} /> : null;
 * ```
 */
export function getIconComponent(iconName?: string): React.ComponentType<any> | undefined {
  if (!iconName) {
    return undefined;
  }

  return iconMap[iconName] || AlertCircle; // Fallback to AlertCircle for unknown icons
}

/**
 * Check if an icon name is valid
 *
 * @param iconName The icon name to validate
 * @returns true if the icon exists in the mapping
 */
export function isValidIcon(iconName: string): boolean {
  return iconName in iconMap;
}

/**
 * Get all available icon names
 *
 * @returns Array of all available icon names
 */
export function getAvailableIcons(): readonly string[] {
  return Object.keys(iconMap);
}

/**
 * Get icon component with error handling
 *
 * @param iconName The icon name
 * @param fallback Custom fallback icon name (defaults to AlertCircle)
 * @returns Icon component with guaranteed fallback
 */
export function getIconComponentSafe(
  iconName?: string,
  fallback: string = 'AlertCircle'
): React.ComponentType<any> {
  if (!iconName) {
    return iconMap[fallback] || AlertCircle;
  }

  return iconMap[iconName] || iconMap[fallback] || AlertCircle;
}
