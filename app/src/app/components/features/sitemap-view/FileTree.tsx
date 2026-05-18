import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, ChevronDown, ExternalLink } from 'lucide-react';
import type { TreeNode, TreeMode } from '@/data/features/sitemapView';
import { getInitialOpen, getIcon } from '@/data/features/sitemapView';
import { availableDocPaths } from '@/app/components/diagrams/MarkdownViewer';
import { useClientPath } from '@/hooks/useClientPath';

interface FlatTreeItem {
  node: TreeNode;
  depth: number;
  path: string;
  isOpen: boolean;
  hasChildren: boolean;
  isCompleted: boolean;
}

interface TreeItemProps {
  item: FlatTreeItem;
  toggleNode: (path: string) => void;
  navigate: (path: string) => void;
}

interface FileTreeProps {
  tree: TreeNode[];
  mode: TreeMode;
  onModeChange?: (mode: TreeMode) => void;
}

// Flatten tree structure for virtualization
function flattenTree(
  nodes: TreeNode[],
  openNodes: Set<string>,
  depth = 0,
  parentPath = ''
): FlatTreeItem[] {
  const items: FlatTreeItem[] = [];

  nodes.forEach((node) => {
    const path = parentPath ? `${parentPath}/${node.name}` : node.name;
    const hasChildren = Boolean(
      node.type === 'folder' && node.children && node.children.length > 0
    );
    const isOpen = openNodes.has(path);
    const isCompleted = Boolean(
      (node.docPath && availableDocPaths.has(node.docPath)) || node.linkTo
    );

    items.push({
      node,
      depth,
      path,
      isOpen,
      hasChildren,
      isCompleted,
    });

    // If folder is open and has children, add them
    if (isOpen && hasChildren && node.children) {
      items.push(...flattenTree(node.children, openNodes, depth + 1, path));
    }
  });

  return items;
}

// Tree item component
function TreeItem({ item, toggleNode, navigate }: TreeItemProps) {
  const { node, depth, path, isOpen, hasChildren, isCompleted } = item;

  const handleClick = useCallback(() => {
    if (hasChildren) {
      toggleNode(path);
    } else if (node.docPath && availableDocPaths.has(node.docPath)) {
      navigate(`/doc/${encodeURIComponent(node.docPath)}`);
    } else if (node.linkTo) {
      navigate(node.linkTo);
    }
  }, [hasChildren, toggleNode, path, node.docPath, node.linkTo, navigate]);

  const paddingLeft = depth * 16 + 8; // 16px per level + 8px base
  const isClickable = hasChildren || isCompleted;

  return (
    <div
      className={`flex items-start gap-2 py-1 px-2 rounded transition-colors ${
        isClickable ? 'cursor-pointer hover:bg-slate-100' : 'cursor-default'
      }`}
      style={{ paddingLeft }}
      onClick={handleClick}
      role={isClickable ? 'button' : 'none'}
      tabIndex={isClickable ? 0 : -1}
    >
      {/* Expand/collapse icon */}
      <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center mt-0.5">
        {hasChildren ? (
          isOpen ? (
            <ChevronDown size={12} className="text-slate-500" />
          ) : (
            <ChevronRight size={12} className="text-slate-500" />
          )
        ) : null}
      </div>

      {/* File/folder icon */}
      <div className="flex-shrink-0 mt-0.5">{node.iconName && getIcon(node.iconName)}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <code
            className={`text-xs font-mono ${isCompleted ? 'text-slate-900' : 'text-slate-500'}`}
          >
            {node.name}
          </code>

          {/* Badge */}
          {node.badge && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${node.badge.color}`}
            >
              {node.badge.label}
            </span>
          )}

          {/* Completion indicator */}
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              isCompleted ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          />

          {/* External link indicator */}
          {isCompleted && <ExternalLink size={10} className="text-slate-400 flex-shrink-0" />}
        </div>

        {/* Description */}
        {node.desc && (
          <div className="text-xs text-slate-600 mt-1 leading-relaxed">{node.desc}</div>
        )}
      </div>
    </div>
  );
}

export function FileTree({ tree, mode }: FileTreeProps) {
  const navigate = useNavigate();
  const { path } = useClientPath();

  // Initialize open nodes based on mode
  const initialOpenNodes = useMemo(() => {
    const openNodes = new Set<string>();

    function addOpenNodes(nodes: TreeNode[], parentPath = '') {
      nodes.forEach((node) => {
        const path = parentPath ? `${parentPath}/${node.name}` : node.name;

        if (getInitialOpen(node, mode)) {
          openNodes.add(path);
        }

        if (node.children) {
          addOpenNodes(node.children, path);
        }
      });
    }

    addOpenNodes(tree);
    return openNodes;
  }, [tree, mode]);

  const [openNodes, setOpenNodes] = useState<Set<string>>(initialOpenNodes);

  // Update open nodes when mode changes
  useState(() => {
    setOpenNodes(initialOpenNodes);
  });

  const toggleNode = useCallback((path: string) => {
    setOpenNodes((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const handleNavigate = useCallback(
    (target: string) => {
      navigate(path(target));
    },
    [navigate, path]
  );

  // Flatten tree for rendering
  const flatItems = useMemo(() => {
    return flattenTree(tree, openNodes);
  }, [tree, openNodes]);

  // Simple viewport optimization for large lists
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [viewportRange, setViewportRange] = useState({
    start: 0,
    end: Math.min(flatItems.length, 100),
  });

  useEffect(() => {
    if (!containerRef) {
      return;
    }

    const handleScroll = () => {
      const { scrollTop, clientHeight } = containerRef;
      const itemHeight = 50; // Approximate item height
      const visibleStart = Math.floor(scrollTop / itemHeight);
      const visibleEnd = Math.ceil((scrollTop + clientHeight) / itemHeight);
      const buffer = 10; // Render extra items for smooth scrolling

      setViewportRange({
        start: Math.max(0, visibleStart - buffer),
        end: Math.min(flatItems.length, visibleEnd + buffer),
      });
    };

    containerRef.addEventListener('scroll', handleScroll);
    return () => containerRef.removeEventListener('scroll', handleScroll);
  }, [containerRef, flatItems.length]);

  const visibleItems = flatItems.slice(viewportRange.start, viewportRange.end);

  if (flatItems.length === 0) {
    return <div className="text-slate-500 text-sm py-4 text-center">No items to display</div>;
  }

  return (
    <div
      ref={setContainerRef}
      className="bg-slate-50 rounded-lg border border-slate-200 p-2 max-h-[600px] overflow-y-auto"
    >
      {/* Spacer for virtualization offset */}
      {viewportRange.start > 0 && <div style={{ height: viewportRange.start * 50 }} />}

      {/* Render visible items */}
      {visibleItems.map((item, index) => (
        <TreeItem
          key={`${item.path}-${viewportRange.start + index}`}
          item={item}
          toggleNode={toggleNode}
          navigate={handleNavigate}
        />
      ))}

      {/* Spacer for remaining items */}
      {viewportRange.end < flatItems.length && (
        <div style={{ height: (flatItems.length - viewportRange.end) * 50 }} />
      )}
    </div>
  );
}
