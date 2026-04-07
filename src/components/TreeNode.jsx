import React from 'react';

const TreeNode = React.memo(({ 
  node, 
  depth, 
  expanded, 
  selected, 
  onToggle, 
  onSelect, 
  onAdd, 
  onDelete,
  searchTerm
}) => {
  console.log(`Rendering TreeNode: ${node.name}`);

  const isFolder = node.type === 'folder';
  const isExpanded = expanded.has(node.id);
  const isSelected = selected === node.id;
  const isMatching = searchTerm && node.name.toLowerCase().includes(searchTerm.toLowerCase());

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isFolder) onToggle(node.id);
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    if (!isFolder) onSelect(node.id);
  };

  return (
    <div className="tree-node-wrapper">
      <div 
        className={`tree-node ${isSelected ? 'selected' : ''} ${isMatching ? 'matching' : ''}`}
        style={{ paddingLeft: `${depth * 20}px` }}
        onClick={isFolder ? handleToggle : handleSelect}
      >
        <span className="node-icon">
          {isFolder ? (isExpanded ? '▼' : '■') : '📄'}
        </span>
        <span className="node-name">{node.name}</span>
        
        <div className="node-actions">
          {isFolder && (
            <>
              <button onClick={(e) => { e.stopPropagation(); onAdd(node.id, 'file'); }} title="Add File">📄+</button>
              <button onClick={(e) => { e.stopPropagation(); onAdd(node.id, 'folder'); }} title="Add Folder">📁+</button>
            </>
          )}
          <button onClick={(e) => { e.stopPropagation(); onDelete(node.id); }} title="Delete" className="delete-btn">🗑️</button>
        </div>
      </div>
      
      {isFolder && isExpanded && node.children && (
        <div className="node-children">
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              selected={selected}
              onToggle={onToggle}
              onSelect={onSelect}
              onAdd={onAdd}
              onDelete={onDelete}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default TreeNode;
