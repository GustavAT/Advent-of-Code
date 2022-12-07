import { readAllLinesFilterEmpty } from '../io.util';

type Node = {
  name: string;         // Directory- or file-name | unused, only for debugging purposes
  children: Node[];     // Child nodes (either directory or file)
  size: number;         // Size of current directory (= sum of child nodes)
}

const parseDirectoryTree = (lines: string[]): Node => {
  const directories: Record<string, Node> = {                           // Node-map, used to access directories (e.g. parent) directly via path
    '/': {name: '/', children: [], size: 0},                            // Root node
  };
  const currentRoot = [];                                               // Current path

  for (const line of lines) {
    if (line.startsWith('$')) {                                         // Command start: cd, ls
      const [_, command, parameter] = line.split(' ');
      if (command === 'cd') {
        if (parameter === '..') {
          currentRoot.pop();                                            // Go up one directory
        } else {
          currentRoot.push(parameter);                                  // Go down one directory
        }
      }
    } else {
      const rootPath = currentRoot.join(' ');
      if (line.startsWith('dir')) {                                     // Create directory node
        const [_, directory] = line.split(' ');
        const directoryNode = {name: directory, children: [], size: 0};
        directories[rootPath].children.push(directoryNode);             // Push directory as child of parent node
        directories[rootPath + ' ' + directory] = directoryNode;        // Add directory node
      } else {                                                          // Add file node to node-map
        const [size, file] = line.split(' ');
        const fileNode = {name: file, children: [], size: +size};
        directories[rootPath].children.push(fileNode);                  // Add file as child of parent node
        directories[rootPath + ' ' + file] = fileNode;                  // Add file node to node-map
      }
    }
  }

  return directories['/'];
};

const calculateDirectorySize = (root: Node): number => {
  if (root.children.length === 0) {                       // File node, return size
    return root.size;
  }

  let size = 0;
  for (const child of root.children) {                    // Directory node, calculate size for each child
    size += calculateDirectorySize(child);
  }

  root.size = size;                                       // Set size of current directory

  return size;
};

const countDirectorySizeBelowThreshold = (root: Node, threshold: number): number => {
  if (root.children.length === 0) {                             // Ignore file nodes
    return 0;
  }

  let size = root.size < threshold ? root.size : 0;             // Start with current directory size, skip if bigger than threshold
  for (const child of root.children) {
    size += countDirectorySizeBelowThreshold(child, threshold); // Sum children
  }

  return size;
};

const getSmallestDirectorySize = (root: Node, current: number, threshold: number): number => {
  if (root.size < threshold || root.children.length === 0) {              // Skip files and directories smaller than threshold
    return current;
  }

  let smallest = root.size < current ? root.size : current;               // Start with current directory if smaller than current
  for (const child of root.children) {
    const target = getSmallestDirectorySize(child, smallest, threshold);  // Get the smallest directory size from children
    if (target < smallest) {                                              // Found a smaller directory
      smallest = target;
    }
  }

  return smallest;
};

const part1 = (root: Node): number => countDirectorySizeBelowThreshold(root, 100_000);

const part2 = (root: Node): number => {
  const totalSpace = 70_000_000;
  const requiredFreeSpace = 30_000_000;

  const unusedSpace = totalSpace - root.size;
  const requiredSpace = requiredFreeSpace - unusedSpace;            // Calculate required free space

  return getSmallestDirectorySize(root, root.size, requiredSpace);
};

const input = readAllLinesFilterEmpty('./res/2022/day07.txt');
const root = parseDirectoryTree(input);
calculateDirectorySize(root);
console.log('part1:', part1(root));
console.log('part2:', part2(root));
