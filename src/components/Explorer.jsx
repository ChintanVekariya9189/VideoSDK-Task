import { useState, useCallback, useEffect } from 'react';
import TreeNode from './TreeNode';
import Modal from './Modal';
import { initialFileSystem } from '../data/fileSystemData';

const Explorer = () => {
  const [data, setData] = useState(initialFileSystem);
  const [expanded, setExpanded] = useState(new Set(['root', '2'])); // root and src (id: 2) expanded by default
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'file', parentId: null });
  const [previousExpanded, setPreviousExpanded] = useState(null);

  const handleToggle = useCallback((id) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelect = useCallback((id) => {
    setSelected(id);
  }, []);

  const openModal = useCallback((parentId, type) => {
    setModalConfig({ isOpen: true, type, parentId });
  }, []);

  const closeModal = useCallback(() => {
    setModalConfig({ isOpen: false, type: 'file', parentId: null });
  }, []);

  const findAndExpandParents = useCallback((node, target, parents = []) => {
    if (node.name.toLowerCase().includes(target.toLowerCase())) return parents;
    if (node.children) {
      for (const child of node.children) {
        const result = findAndExpandParents(child, target, [...parents, node.id]);
        if (result) return result;
      }
    }
    return null;
  }, []);

  useEffect(() => {
    if (searchTerm) {
      if (!previousExpanded) setPreviousExpanded(new Set(expanded));
      
      const newExpanded = new Set(expanded);
      const searchRecursive = (node) => {
        if (node.children) {
          let hasMatch = false;
          for (const child of node.children) {
            if (searchRecursive(child)) hasMatch = true;
          }
          if (hasMatch || (node.name.toLowerCase().includes(searchTerm.toLowerCase()))) {
            if (node.id !== 'root' && hasMatch) newExpanded.add(node.id);
            return true;
          }
        }
        return node.name.toLowerCase().includes(searchTerm.toLowerCase());
      };
      
      searchRecursive(data);
      setExpanded(newExpanded);
    } else if (previousExpanded) {
      setExpanded(previousExpanded);
      setPreviousExpanded(null);
    }
  }, [searchTerm, data]);

  const updateTreeRecursive = (node, parentId, newNode) => {
    if (node.id === parentId) {
      return { ...node, children: [...(node.children || []), newNode] };
    }
    if (node.children) {
      return { ...node, children: node.children.map(child => updateTreeRecursive(child, parentId, newNode)) };
    }
    return node;
  };

  const deleteNodeRecursive = (node, targetId) => {
    if (node.children) {
      const filtered = node.children.filter(child => child.id !== targetId);
      if (filtered.length !== node.children.length) {
        return { ...node, children: filtered };
      }
      return { ...node, children: node.children.map(child => deleteNodeRecursive(child, targetId)) };
    }
    return node;
  };

  const handleAddConfirm = (name) => {
    const newNode = {
      id: Date.now().toString(),
      name,
      type: modalConfig.type,
      children: modalConfig.type === 'folder' ? [] : undefined
    };
    setData(prev => updateTreeRecursive(prev, modalConfig.parentId, newNode));
  };

  const handleDelete = useCallback((id) => {
    if (id === 'root') return;
    setData(prev => deleteNodeRecursive(prev, id));
  }, []);

  return (
    <div className="explorer-root">
      <div className="search-header">
        <input 
          type="text" 
          placeholder="Search files..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="tree-container">
        <TreeNode
          node={data}
          depth={0}
          expanded={expanded}
          selected={selected}
          onToggle={handleToggle}
          onSelect={handleSelect}
          onAdd={openModal}
          onDelete={handleDelete}
          searchTerm={searchTerm}
        />
      </div>

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={handleAddConfirm}
        type={modalConfig.type}
      />
    </div>
  );
};

export default Explorer;
