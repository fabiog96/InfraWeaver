import { useState, memo } from 'react';

import { TbFolder, TbFolderOpen, TbFile, TbChevronRight, TbChevronDown } from 'react-icons/tb';

import type { FolderNode } from '../generators/folder-structure-generator';

interface FileTreeProps {
  tree: FolderNode;
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
}

interface TreeNodeProps {
  node: FolderNode;
  depth: number;
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
}

const TreeNode = ({ node, depth, selectedPath, onSelectFile }: TreeNodeProps) => {
  const [expanded, setExpanded] = useState(depth < 2);
  const isSelected = selectedPath === node.path;
  const isFolder = node.type === 'folder';
  const paddingLeft = depth * 12 + 6;

  const handleClick = () => {
    if (isFolder) {
      setExpanded(!expanded);
    } else {
      onSelectFile(node.path);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex w-full items-center gap-1 rounded-md px-1 py-0.5 text-left text-[11px] transition-colors duration-100 hover:bg-secondary/60 ${
          isSelected ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
        }`}
        style={{ paddingLeft }}
      >
        {isFolder ? (
          <>
            {expanded ? (
              <TbChevronDown className="h-3 w-3 shrink-0" />
            ) : (
              <TbChevronRight className="h-3 w-3 shrink-0" />
            )}
            {expanded ? (
              <TbFolderOpen className="h-3 w-3 shrink-0 text-primary/70" />
            ) : (
              <TbFolder className="h-3 w-3 shrink-0 text-primary/70" />
            )}
          </>
        ) : (
          <>
            <span className="w-3 shrink-0" />
            <TbFile className="h-3 w-3 shrink-0 text-muted-foreground/50" />
          </>
        )}
        <span className="truncate">{node.name}</span>
      </button>

      {isFolder && expanded && node.children && (
        <>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelectFile={onSelectFile}
            />
          ))}
        </>
      )}
    </>
  );
};

const RawFileTree = ({ tree, selectedPath, onSelectFile }: FileTreeProps) => {
  return (
    <div className="flex flex-col py-1 px-1">
      <TreeNode
        node={tree}
        depth={0}
        selectedPath={selectedPath}
        onSelectFile={onSelectFile}
      />
    </div>
  );
};

export const FileTree = memo(RawFileTree);
